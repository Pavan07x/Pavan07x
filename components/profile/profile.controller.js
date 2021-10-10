const userDataLayer = require("../users/user.dal");
const profileDataLayer = require("./profile.dal")
const { validationResult, body } = require('express-validator')
let bcrypt = require('bcryptjs');
const jwt = require('../auth/auth.services');
const Profile = require("../../models/Profile");
const request = require("request");
const config = require("config");
const { response } = require("express");




exports.getProfileById = async (req, res) => {
    try {

        const userId = req.userId;

        let profileData = await profileDataLayer.getProfileById(userId);

        //console.log("userData");
        if (!profileData) {
            console.log("Noprofile");
            return res.status(400).json({ errors: [{"msg": "There is no profile"}] });
           }
        res.send(profileData);


      } catch (e) {
        console.error(e.message);
        res.status(500).json("server error");
      }

}

exports.createAndUpdateProfile = async (req, res) => {
    try {

        const errors = validationResult(req);
        
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        };

         // destructure the request
    const {
        company,
        website,
        location,
        bio,
        status,
        githubusername,
        skills,
        youtube,
        twitter,
        instagram,
        linkedin,
        facebook,
        // spread the rest of the fields we don't need to check
        
      } = req.body;



      const profileFields = {};

      profileFields.user = req.userId;

      if(company) profileFields.company = company;
      if(website) profileFields.website = website;
      if(location) profileFields.location = location;
      if(bio) profileFields.bio = bio;
      if(githubusername) profileFields.githubusername = githubusername;
      if(status) profileFields.status = status;
      if(skills) profileFields.skills = skills.split(',').map(skills => skills.trim());

      profileFields.social ={};

      if (youtube) profileFields.social.youtube = youtube;
      if (twitter) profileFields.social.twitter = twitter;
      if (facebook) profileFields.social.facebook = facebook;
      if (linkedin) profileFields.social.linkedin = linkedin;
      if (instagram) profileFields.social.instagram = instagram;

        try {
          let userId = req.userId

          let profile = await profileDataLayer.getProfileById(userId)

          console.log(profile);
          //Update
          if (profile) {
            console.log("update")
            profile = await profileDataLayer.updteProfileById(userId,profileFields)
            return res.status(200).json(profile);
          }

          //Create
          profile = await profileDataLayer.createProfile(profileFields)

          res.status(200).json(profile);


  
        } catch (e) {
          console.error(e.message);
          res.status(500).json("server error");
        }

      } catch (e) {
        console.error(e.message);
        res.status(500).json("server error");
      }

}

exports.getAllProfiles = async (req, res) => {
  try {

      let profileData = await profileDataLayer.getAllProfiles();

      //console.log("userData");
      if (!profileData) {
          console.log("Noprofile");
          return res.status(400).json({ errors: [{"msg": "There is no profile"}] });
         }
      res.send(profileData);


    } catch (e) {
      console.error(e.message);
      res.status(500).json("server error");
    }

}

exports.getProfileByUserId = async (req, res) => {
  try {

      let userId = req.params.user_id;

      let profileData = await profileDataLayer.getProfileById(userId);

      if (profileData.false) {
        if (profileData.false.error.kind == "ObjectId") {
          console.log("ObjectID");
          return res.status(400).json({ errors: [{"msg": "There is no profile"}] });
        
        }
      }

      //console.log("userData");
      if (!profileData) {
          console.log("Noprofile");
          return res.status(400).json({ errors: [{"msg": "There is no profile"}] });
         }
      res.send(profileData);


    } catch (e) {
      console.error(e.message);
      res.status(500).json("server error");
    }

}

exports.deleteProfileById = async (req, res) => {
  try {

      let userId = req.userId;

      let profileData = await profileDataLayer.deleteProfileById(userId);
      console.log(profileData);
      if (profileData.profile == null || profileData.user == null) {
          return res.status(400).json({ errors: [{"msg": "There is no profile or user"}] });
      }

      console.log("userData");
      if (!profileData) {
          console.log("Noprofile");
          return res.status(400).json({ errors: [{"msg": "There is no profile"}] });
         }
      res.send({"msg":"userdeleter"});


    } catch (e) {
      console.error(e.message);
      res.status(500).json("server error");
    }

}

exports.updateProfileExperience = async (req, res) => {
  try {

      const errors = validationResult(req);
        
      if (!errors.isEmpty()) {
          return res.status(400).json({ errors: errors.array() });
      };

      const {
            title,
            company,
            location,
            from,
            to,
            current,
            description } = req.body;


      const newExp = {
            title,
            company,
            location,
            from,
            to,
            current,
            description
      };

        const userId = req.userId;

        let profileData = await profileDataLayer.getProfileById(userId);

        console.log(profileData);

        profileData.experience.unshift(newExp);

        const profile = await profileDataLayer.updateProfileExperience(profileData) ;

        res.status(200).json(profile);

    } catch (e) {
      console.error(e.message);
      res.status(500).json("server error");
    }

}

exports.deleteProfileExperience = async (req, res) => {
  try {

      let userId = req.userId;
      let profileData = await profileDataLayer.getProfileById(userId);
      console.log(profileData);
      if (!profileData) {
          return res.status(400).json({ errors: [{"msg": "There is no profile or user"}] });
      };

      let removeIndex = profileData.experience.map(item => item.id).indexOf(req.params.exp_id);
      console.log("index");
      console.log(removeIndex);

      if (removeIndex == -1)  return res.status(400).json({ errors: [{"msg": "There is no matching Experience"}] })


      profileData.experience.splice(removeIndex,1);
      console.log("new experience");
      console.log(profileData);

      profileData = await profileDataLayer.updateProfileExperience(profileData);


      res.send(profileData);


    } catch (e) {
      console.error(e.message);
      res.status(500).json("server error");
    }

}

exports.updateProfileEducation = async (req, res) => {
  try {

      const errors = validationResult(req);
        
      if (!errors.isEmpty()) {
          return res.status(400).json({ errors: errors.array() });
      };

      const {
            school,
            degree,
            fieldofstudy,
            from,
            to,
            current,
            description } = req.body;


      const newEdu = {
            school,
            degree,
            fieldofstudy,
            from,
            to,
            current,
            description
      };

        const userId = req.userId;

        let profileData = await profileDataLayer.getProfileById(userId);

        console.log(profileData);

        profileData.education.unshift(newEdu);

        const profile = await profileDataLayer.updateProfileExperience(profileData) ;

        res.status(200).json(profile);

    } catch (e) {
      console.error(e.message);
      res.status(500).json("server error");
    }

}

exports.deleteProfileEducation = async (req, res) => {
  try {

      let userId = req.userId;
      let profileData = await profileDataLayer.getProfileById(userId);
      console.log(profileData);
      if (!profileData) {
          return res.status(400).json({ errors: [{"msg": "There is no profile or user"}] });
      };

      let removeIndex = profileData.education.map(item => item.id).indexOf(req.params.edu_id);
      console.log("index");
      console.log(removeIndex);

      if (removeIndex == -1)  return res.status(400).json({ errors: [{"msg": "There is Education mismatched"}] });
      profileData.education.splice(removeIndex,1);
      console.log("new experience");
      console.log(profileData);

      profileData = await profileDataLayer.updateProfileExperience(profileData);


      res.send(profileData);


    } catch (e) {
      console.error(e.message);
      res.status(500).json("server error");
    }

}


exports.getGithubProfiles = async (req, res) => {
  try {

     const options = {
       uri:`https://api.github.com/users/${req.params.username}/repos?per_page=5&sort=created:asc&clint_id=${config.get('githubClintId')}&clint_secter=${config.get('githubSecret')}`,
       method:'GET',
       headers:{'user-agent' : 'node.js'}
     };

     request(options,(error,response,body) => {
       if(error) console.log(error);

       console.log("here");

       if(response.statusCode !== 200) return res.status(404).json({msg:"Profile not found"});


       res.json(JSON.parse(body));
     })

    } catch (e) {
      console.error(e.message);
      res.status(500).json("server error");
    }

}