'use strict'
const jwt = require('jsonwebtoken')

exports.obrigatory = (req,res,next) => {
  try {
    const token = req.headers.authorization.split(' ')[1]
    const decode = jwt.verify(token, process.env.JWT_KEY)
    req.usuario = decode
    next();
  } catch (error) {
    return res.status(500).send({
        error: error,
        mesage: 'Authentication Error - user or password invalid.'
    })
  }
}