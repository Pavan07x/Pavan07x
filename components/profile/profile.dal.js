const profileModel = require("../../models/Profile");
let userModel = require('../../models/Users');

exports.getProfileById = async (userId) => {
    try {
      console.log(userId);
  
        let userData = await profileModel.findOne({user:userId}).populate('user',['name','avatar']);
        return userData;
  
      } catch (e) {
        return {false:{"error":e}}
      }
  
  }

  exports.updteProfileById = async (userId,profileFields) => {
    try {
        console.log(userId);
  
        let userData = await profileModel.findOneAndUpdate(
          {user:userId},
          {$set:profileFields},
          {new:true});//Set new to true to return updated document

        return userData;
  
      } catch (e) {
        console.log(e.message);
        return {false:{"error":e.message}}
      }
  
  }

  exports.createProfile = async (profileFields) => {
    try {
        console.log(profileFields);
  
        let userData = await profileModel.create(profileFields);
          
        return userData;
  
      } catch (e) {
        console.log(e.message);
        return {false:{"error":e.message}}
      }
  
  }

  exports.getAllProfiles = async () => {
    try {

        let userData = await profileModel.find().populate('user',['name','avatar']);
        return userData;
  
      } catch (e) {
        console.log(e.message);
        return {false:{"error":e.message}}
      }
  
  }

  exports.deleteProfileById = async (userId) => {
    try {
        let userData ={}
        console.log(userId);
         userData.profile = await profileModel.findOneAndRemove({user:userId});
         userData.user = await userModel.findOneAndRemove({_id:userId});
         return userData;
        
      } catch (e) {
        console.log("delete error");
        return {false:{"error":e}}
      }
  
  }

  exports.updateProfileExperience = async (profileData) => {
    try {
      
        console.log(profileData);
        console.log("profileData");
        await profileData.save();
         return profileData;
        
      } catch (e) {
        console.log("delete error");
        return {false:{"error":e}}
      }
  
  }