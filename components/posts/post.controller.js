const postDataLayer = require("./post.dal")
const { validationResult } = require('express-validator')
let bcrypt = require('bcryptjs');
const jwt = require('../auth/auth.services');
const Profile = require("../../models/Profile");
const request = require("request");
const config = require("config");
const { response } = require("express");
const { post } = require("request");



exports.createPost = async (req, res) => {
    try {

        console.log(req.body);

        const errors = validationResult(req);
        
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        };

        const userId = req.userId;
        

        let userData = await postDataLayer.getUserById(userId);

        //console.log("userData");
        if (!userData) {
            console.log("No user");
            return res.status(400).json({ errors: [{"msg": "There is no user"}] });
           }

           const newPost = {
               text:req.body.text,
               name:userData.name,
               avatar:userData.avatar,
               user:userId
           }

           let post = await postDataLayer.createPost(newPost);

        res.send(post);


      } catch (e) {
        console.error(e.message);
        res.status(500).json("server error");
      }

}

exports.getAllPost = async (req, res) => {
    try {
  
        let profileData = await postDataLayer.getAllPost();
  
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

exports.getPostById = async (req, res) => {
    try {
  
        let postId = req.params.id;
        console.log(postId);
        let postData = await postDataLayer.getPostById(postId);
        console.log(postData);
        if (!postData) {
            return res.status(404).json({ errors: [{"msg": "There is no post found"}] });
        };

        if (postData.false) {
            if (postData.false.error.kind == "ObjectId") {
              console.log("ObjectID");
              return res.status(400).json({ errors: [{"msg": "There is no post found"}] });
            
            }
          }
  
        res.send(postData);
  
  
      } catch (e) {
        console.error(e.message);
        res.status(500).json("server error");
      }
  
}

  exports.deletePostById = async (req, res) => {
    try {
  
        let postId = req.params.id;
        console.log(postId);
        let postData = await postDataLayer.getPostById(postId);
        console.log(postData);

        if (!postData) {
            return res.status(404).json({ errors: [{"msg": "There is no post found"}] });
        };

        if (postData.false) {
            if (postData.false.error.kind == "ObjectId") {
              console.log("ObjectID");
              return res.status(400).json({ errors: [{"msg": "There is no post found"}] });
            
            }
        }

        if (postData.user.toString() !== req.userId) {
            return res.status(401).json({ errors: [{"msg": "User not authorised"}] });
        }

        let results = await postDataLayer.deletePost(postData)
  
        res.send(results);
  
  
      } catch (e) {
        console.error(e.message);
        res.status(500).json("server error");
      }
  
}

exports.createLike = async (req, res) => {
  try {

      const postId = req.params.id;

      console.log("postID");
      console.log(postId);
      

      let postData = await postDataLayer.getPostById(postId);

      console.log("like Route");
      console.log(postData);

      if (!postData) {
          console.log("No post");
          return res.status(400).json({ errors: [{"msg": "There is no post"}] });
         }

      if (postData.likes.filter(like => like.user.toString() === req.userId).length > 0) {
        return res.status(400).json({ errors: [{msg: "Post is already liked"}] });
      }

      postData.likes.unshift({user:req.userId});

      console.log(postData);

      postData = await postDataLayer.updatePost(postData);

      res.send(postData.likes);


    } catch (e) {
      console.error(e.message);
      res.status(500).json("server error");
    }

}

exports.deleteLike = async (req, res) => {
  try {

      const postId = req.params.id;

      console.log("postID");
      console.log(postId);
      

      let postData = await postDataLayer.getPostById(postId);

      console.log("unlike Route");
      console.log(postData);

      if (!postData) {
          console.log("No post");
          return res.status(400).json({ errors: [{"msg": "There is no post"}] });
         }

      if (postData.likes.filter(like => like.user.toString() === req.userId).length === 0) {
        return res.status(400).json({ errors: [{msg: "Post has not been liked"}] });
      };

      const removeIndex = postData.likes.map(like => like.user.toString()).indexOf(req.userId);

      postData.likes.splice(removeIndex,1);

      console.log(postData);

      postData = await postDataLayer.updatePost(postData);

      res.send(postData.likes);


    } catch (e) {
      console.error(e.message);
      res.status(500).json("server error");
    }

}

exports.createComment = async (req, res) => {
  try {

    console.log(req.body);

    const errors = validationResult(req);
    
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    };

    const userId = req.userId;
    const postId = req.params.id;

    let userData = await postDataLayer.getUserById(userId);

    let postData = await postDataLayer.getPostById(postId);

    //console.log("userData");
    if (!userData) {
        console.log("No user");
        return res.status(400).json({ errors: [{"msg": "There is no user"}] });
       }

       const newComment = {
           text:req.body.text,
           name:userData.name,
           avatar:userData.avatar,
           user:userId
       }

       postData.comments.unshift(newComment);

       let post = await postDataLayer.createComment(postData);

    res.send(postData.comments);

    } catch (e) {
      console.error(e.message);
      res.status(500).json("server error");
    }

}

exports.deleteComment = async (req, res) => {
  try {

    const postId = req.params.id;
    const commentId = req.params.comment_id;
    const userId = req.userId

    console.log(postId);
    console.log(commentId);
    console.log(userId);
    console.log(req.params);


    let postData = await postDataLayer.getPostById(postId);

    //console.log("userData");
    if (!postData) {
        console.log("No postData");
        return res.status(400).json({ errors: [{"msg": "There is no posts"}] });
       }

    const comment = postData.comments.find(comment => comment.id === commentId);

    console.log("comment");
    console.log(comment);

    if (!comment) {
      return res.status(404).json({ errors: [{"msg": "There are no comments"}] });
    }

    if (comment.user.toString() !== userId) {
      return res.status(401).json({ errors: [{"msg": "User Not authoriser"}] });
    }


    const removeIndex = postData.comments.map(comment => comment.id.toString()).indexOf(commentId);
    


    console.log(removeIndex);

    postData.comments.splice(removeIndex,1);

    console.log(postData);


    postData = await postDataLayer.updatePost(postData);

    res.send(postData.comments);

    } catch (e) {
      console.error(e.message);
      res.status(500).json("server error");
    }

}