//const userDataAccess = require('./auth.dal');
const jwt = require('jsonwebtoken');
const config = require('config');
const bcrypt = require('bcryptjs');

exports.validateUser = async (user) => {
 // const user = await userDataAccess.findUser({ email: data.email })

  //if (!user) return { error: true, error_msg: 'User not found' }
  try {
    //const hashedPassword = bcrypt.compareSync(data.password, user.password)
    //if (!hashedPassword) return { error: true, error_msg: 'Invalid Username & Password' }
    console.log("here");
    const token = await jwt.sign(
      { id: user._id },
      config.get('jwt'),
      // expires in 24 hours
      { expiresIn: 864000 });
      return { success: 'true', token: token }
    
  } catch (e) {
    console.log(e)
  }
}


exports.verifyUser = async (req, res, next) => {
  const token = req.headers['x-access-token']
  if (!token) { return res.status(403).send({ auth: false, message: 'No token provided.' }) }

  // verifies secret and checks exp
  jwt.verify(token,  config.get('jwt'), function (err, decoded) {
    if (err) { return res.status(500).send({ auth: false, message: 'Failed to authenticate token.' }) }

    // if everything is good, save to request for use in other routes
    req.userId = decoded.id
    console.log("verify");
    console.log(req.userId);
    next()
  })
}