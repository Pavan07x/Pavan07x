var express = require('express');
var router = express.Router();
const { profileValidationRules,updateProfileValidationRules, updateEducationValidationRules } = require('../components/users/user.validation')
const { verifyUser } = require('../components/auth/auth.services')
const profileController = require("../components/profile/profile.controller")

//Get selected profile
router.get('/me',verifyUser, profileController.getProfileById);

router.post('/',[verifyUser,profileValidationRules()], profileController.createAndUpdateProfile);

router.get('/', profileController.getAllProfiles);

router.get('/user/:user_id', profileController.getProfileByUserId);

router.delete('/',verifyUser, profileController.deleteProfileById);

router.put('/experience',[verifyUser,updateProfileValidationRules()], profileController.updateProfileExperience);

router.delete('/experience/:exp_id',verifyUser, profileController.deleteProfileExperience);

router.put('/education',[verifyUser,updateEducationValidationRules()], profileController.updateProfileEducation);

router.delete('/education/:edu_id',verifyUser, profileController.deleteProfileEducation);






module.exports = router;