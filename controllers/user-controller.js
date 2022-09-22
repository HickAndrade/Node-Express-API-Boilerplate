'use strict'
const bcrypt = require('bcrypt');
const mssql = require('mssql');
const jwt = require('jsonwebtoken');
const connConfig = require('../databases/mssql/connection-config');
const genericQuery = require('../databases/mssql/generic-query');

exports.signupUser = (req,res,next) =>{
  const pool = new mssql.ConnectionPool(connConfig);
  const request = pool.request();
  
  const userEmail = req.body.email
  const userPwd = req.body.passwd

  try {
    pool.connect(() =>{
      request.query(`SELECT * FROM TB_USERS WHERE USER_EMAIL = '${userEmail}'`,
      (firstQryErr, userResult) =>{
        if(firstQryErr){
          return res.status(500).send ({ error: firstQryErr, message: 'Error to register user.' })
        }else if(userResult.recordset.length >=1){
          return res.status(401).send({ message: `user ${userEmail} already exists.` })
        }else{
          bcrypt.hash(userPwd,10, (bcrypterr, hash) =>{
            if (bcrypterr) { return res.status(500).send( { error: bcrypterr } )}
            
            request.query(
            `INSERT INTO TB_USERS(USER_EMAIL, USER_PASSWD)
             VALUES('${userEmail}','${hash}')
             SELECT SCOPE_IDENTITY() AS ID`, 
             (secondQryErr, registerResult) => {

              const id = registerResult.recordset[0].ID
              if (secondQryErr) {return res.status(500).send({ error: secondQryErr })}
               
                return res.status(201).send({
                 Mensagem: `User ${userEmail} successfully registered!`,
                 ID: id
                })
             })
          })
        }
      })
    })
  } catch (error) {
    return res.status(500).send({
        error: error.name,
        message: 'Catch error on signupUser Contoller.'
      }) 
  }
}

exports.signinUser = async(req,res,next) =>{ 
  const userEmail = req.body.email
  const userPwd = req.body.passwd

    try {
      const loginUser = await genericQuery(`SELECT * FROM TB_USERS WHERE USER_EMAIL = '${userEmail}'`)

      if(loginUser.recordset.length <= 0){
        return res.status(401).send({
            error: `User ${userEmail} not found`,
            message: 'Please, Verify credentials.' 
        })
      }else{
       bcrypt.compare(userPwd, loginUser.recordset[0].USER_PASSWD,
        (bCryptErr, response) =>{
          if(bCryptErr){
            return res.status(500).send({ error:bCryptErr, message: 'Invalid password.' })
          }else if(response){
            const token = jwt.sign({
                ID: loginUser.recordset[0].USER_ID,
                Email: loginUser.recordset[0].USER_EMAIL
            }, process.env.JWT_KEY, { expiresIn: "1h" })

            return res.status(202).send({
              message: `User ${userEmail} logged.`,
              token: token
            })
          }else{
            return res.status(404).send({
                error: `Authentication Error`,
                message: `Invalid password.`
            })
          }
        })
      }
    } catch (error) {
      
    }
  }