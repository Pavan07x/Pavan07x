const { body, validationResult } = require('express-validator')

const userValidationRules = () => {

  //Validation rules for user registration
  return [
    body('name', 'Name is required').notEmpty(),
    body('email', 'Please include a valid email').isEmail(),
    body(
      'password',
      'Please enter a password with 6 or more characters'
    ).isLength({ min: 6 })

  ]
  
}

const profileValidationRules = () => {

  //Validation rules for user registration
  return [
    body('status', 'Status is required').not().isEmpty(),
    body(
      'skills',
      'Skills is required'
    ).not().isEmpty()

  ]
  
};

const loginValidationRules = () => {

  //Validation rules for user registration
  return [
    body('email', 'Please include a valid email').isEmail(),
    body(
      'password',
      'Password is required'
    ).exists()

  ]
  
}

const updateProfileValidationRules = () => {

  //Validation rules for user registration
  return [
    body('title', 'Title is required').not().isEmpty(),
    body(
      'company',
      'company is required'
    ).not().isEmpty(),
    body('from', 'From date is required').not().isEmpty(),


  ]
  
}

const updateEducationValidationRules = () => {

  //Validation rules for user registration
  return [
    body('school', 'School is required').not().isEmpty(),
    body(
      'fieldofstudy',
      'Field of study is required'
    ).not().isEmpty(),
    body('from', 'From date is required').not().isEmpty(),
    body('degree', 'Degree is required').not().isEmpty()


  ]
  
}


module.exports = {
    userValidationRules,
    loginValidationRules,
    profileValidationRules,
    updateProfileValidationRules,
    updateEducationValidationRules
}