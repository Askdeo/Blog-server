const express = require('express');


const router = express.Router();

const userController = require('../../controllers/user');

router.get('/',);

router.post('/register', userController.userSignup);

router.post('/login', userController.userLogin);

module.exports = router;