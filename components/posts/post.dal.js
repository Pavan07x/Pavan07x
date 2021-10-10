const profileModel = require("../../models/Profile");
let userModel = require('../../models/Users');
let postModel = require('../../models/Post');


exports.getUserById = async (userId) => {
    try {
  
        let userData = await userModel.findById(userId).select('-password');
        return userData;
  
      } catch (e) {
        console.log(e.message);
        return {false:{"error":e.message}}
      }
  
  }


  exports.createPost = async (newPost) => {
    try {
        console.log(newPost);
        let userData = await postModel.create(newPost)
        return userData;
  
      } catch (e) {
        console.log(e.message);
        return {false:{"error":e.message}}
      }
  
  }

  exports.getAllPost = async () => {
    try {

        let userData = await postModel.find().sort({date:-1});
        return userData;
  
      } catch (e) {
        console.log(e.message);
        return {false:{"error":e.message}}
      }
  
  }

  exports.deletePost = async (postData) => {
    try {

        await postData.remove();
        return {msg:"post deleted"};
  
      } catch (e) {
        console.log(e.message);
        return {false:{"error":e.message}}
      }
  
  }

  exports.getPostById = async (postId) => {
    try {
  
        let userData = await postModel.findById(postId);
        return userData;
  
      } catch (e) {
        console.log(e.message);
        return {false:{"error":e}}
      }
  
  }

  exports.updatePost = async (postData) => {
    try {
        console.log(postData);
        await postData.save();
        return postData;
  
      } catch (e) {
        console.log(e.message);
        return {false:{"error":e.message}}
      }
  
  }

  exports.createComment = async (postData) => {
    try {
        console.log(postData);
        await postData.save()
        return postData;
  
      } catch (e) {
        console.log(e.message);
        return {false:{"error":e.message}}
      }
  
  }