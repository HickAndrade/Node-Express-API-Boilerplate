'use strict'
const express = require('express')
const router = express.Router();
const userController = require('../controllers/user-controller')

router.post('/signup', userController.signupUser);
router.post('/signin', userController.signinUser);
