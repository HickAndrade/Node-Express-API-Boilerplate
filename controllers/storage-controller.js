'use strict'
const mssql = require('mssql');
const genericQuery = require('../databases/mssql/generic-query');
const connConfig = require('../databases/mssql/connection-config');

exports.getAllStoredProds = async(req,res,next) =>{
  try {
    const recProd = await genericQuery(
    `SELECT PROD_COD, PROD_DESC, PROD_VALUE, PROD_IMGPATH FROM TB_PRODS`);

   const infoProd = recProd.recordset.map((dataFields) => ({
    code: dataFields.PROD_COD,
    description: dataFields.PROD_DESC,
    value: dataFields.PROD_VALUE,
    imagePath: dataFields.PROD_IMGPATH
   }))

   return res.status(200).send({ message: 'All prods', prods: infoProd })

  } catch(error) {
    return res.status(500).send({
        error: error.name,
        message: 'Catch error on getAllProds Contoller.'
    })
  }
}

exports.setStoredProd = (req,res,next) =>{
  const pool = new mssql.ConnectionPool(connConfig);
  const request = pool.request();

  const prodCod = req.body.code
  const prodDesc = req.body.description
  const prodValue = req.body.value
  const prodImg = req.file.path

  try {
    pool.connect(() => {
      request.query(`SELECT * FROM TB_PRODS WHERE PROD_COD = '${prodCod}'`,(firstQryErr, prodResp) => {
        let duplicateProd = prodResp.recordset.length;
         
        if(firstQryErr){ 
         return res.status(500).send({ message: 'Error to valitate product.' }) 
        }else if(duplicateProd >= 1){
         pool.close(); 
         return res.status(404).send({
           message: 'Duplicate Product Error', response: `Prod. code ${prodCod} already exists.`
         })
        }else{
          request.query(
          `INSERT INTO TB_PRODS(PROD_COD, PROD_DESC, PROD_VALUE, PROD_IMGPATH) 
          VALUES('${prodCod}','${prodDesc}','${prodValue}', '${prodImg}')`,
          (secondQryErr) => {

           if (secondQryErr){
             return res.status(500).send({ message: 'Error to Insert product.' })   
           }
   
          return res.status(202).send({
           message: `Product ${prodCod} created.`,
           prodInfo: {
           code: prodCod,
           description: prodDesc,
           value: prodValue,
           imgPath: prodImg
            }
          })
         })
       }}) 
    }); 
  } catch (error) {
  return res.status(500).send({
    error: error.name,
    message: 'Catch error on setStorageProd Contoller.'
  })    
}
}