'use strict'
require("dotenv").config();

const config = {
    user: process.env.DB_USER,
    password: process.env.DB_PWD,
    server: process.env.DB_HOST,
    database: process.env.DB_NAME,
        options:{
            trustedConnection: true,
            trustServerCertificate: true,
            enableArithAbort: true,
        },
    port: parseInt(process.env.DB_PORT)
}

module.exports = config;


