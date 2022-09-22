'use strict'
const mssql = require('mssql');
const  config  = require('./connection-config');

const genericQuery = (query) =>{
  return new Promise(( resolve, reject ) =>{
    const pool = new mssql.ConnectionPool(config);
    const request = pool.request();
    
    pool.connect((poolError) =>{
      if (poolError) { reject(poolError) }
      
      request.query( query, (queryError, result) =>{
        pool.close();
        if (queryError) {
          reject(queryError);
        }else{
            resolve(result);
        }
      })
    })
  })
}

module.exports = genericQuery;