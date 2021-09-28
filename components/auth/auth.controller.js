userDataLayer = require("../users/user.dal");
const { validationResult } = require('express-validator')
let bcrypt = require('bcryptjs');
const jwt = require('./auth.services');


exports.registerUser = async (req, res) => {
    try {

        const userId = req.userId;


        let userData = await userDataLayer.getUserById(userId);

        console.log("userData");
        res.send(userData);


      } catch (e) {
        console.error(e.message);
        res.status(500).json("server error");
      }

}

exports.loginUser = async (req, res) => {
    try {
      
        const errors = validationResult(req);
        
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const {email,password} = req.body;

        let userData = await userDataLayer.getUserByEmail(email);

        if (!userData) {
            return res.status(400).json({ errors: [{"msg": "Invalid credientials"}] });
        }

        const isMatch = await bcrypt.compare(password,userData.password);
        if (!isMatch) {
            return res.status(400).json({ errors: [{"msg": "Invalid credientials"}] });  
        }


        let jwtToken = await jwt.validateUser(userData)

        res.send(jwtToken.token)


      } catch (e) {
        console.error(e.message);
        res.status(500).json("server error");
      }

}