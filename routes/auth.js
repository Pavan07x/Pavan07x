var express = require('express');
var router = express.Router();
const { userValidationRules, loginValidationRules } = require('../components/users/user.validation')
const { verifyUser } = require('../components/auth/auth.services')
const authController = require("../components/auth/auth.controller")

//auth user
router.get('/',verifyUser, authController.registerUser);

router.post('/',loginValidationRules(), authController.loginUser);


module.exports = router;