'use strict'
const express = require('express');
const router = express.Router();
const multer = require('multer');
const storageController = require('../controllers/storage-controller')

const mediaStorage = multer.diskStorage({
  destination: function(req, file, cb){ cb(null,'./uploads') },
  filename: function( req, file, cb){
    cb(null,
        new Date().toISOString().replace(/:/g, '-') + file.originalname)
    }
})

const fileFilter = (req, file, cb) => {
  if(file.mimetype == 'image/png' || file.mimetype == 'image/jpeg'){ /* Simple media Filter for demo */
    cb(null, true)
  }else{
    console.log(file)
    cb(null, false)
  }
}

const upload = multer({
    storage: mediaStorage,
    limits: { fileSize: 1024 * 1024 * 5 },
    fileFilter: fileFilter
})

router.get('/', storageController.getAllStoredProds);
router.post('/product', upload.single('prodIMG'), storageController.setStoredProd);
router.patch('/product/:prodID', storageController.storedProdUpdate);
router.get('/product/:prodID', storageController.getProdByID);

module.exports = router;