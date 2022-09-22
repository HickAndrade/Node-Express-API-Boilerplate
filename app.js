'use strict'
const express = require('express');
const app = express();
const morgan = require('morgan');
const { obrigatory } = require('./middlewares/login');
const prodRoute = require('./routes/prod-store');

app.use(morgan('dev'))
app.use('/uploads', express.static('uploads'));
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

app.use((req,res,next) => {
    res.header('Access-Control-Allow-Origin', '*'); // Choose * from All or specify the URI to Access the Control.
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, content-type, Accept, Authorization'); // CORS Config
    
    if(req.method === 'OPTIONS'){ // Accept requests 
        res.header('Access-Control-Allow-Methods','GET, POST, PUT, DELETE, PATCH');
        return res.status(200).send({});
    }
    next();
})

app.use('/User', userRoute);
app.use('/Products/Storage',obrigatory, prodRoute);

app.use((req,res,next) =>{
    const customError = new Error('Request not Found.')
    customError.status = 404
    next(customError);
}) 

app.use((customError, req,res,next) =>{
    res.status(customError.status || 500);
    return res.send({ msgError: customError.message })
})

module.exports = app;