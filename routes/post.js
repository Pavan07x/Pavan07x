var express = require('express');
var router = express.Router();
const { profileValidationRules, createPostValidationRules } = require('../components/users/user.validation')
const { verifyUser } = require('../components/auth/auth.services')
const postController = require("../components/posts/post.controller")


router.post('/',[verifyUser,createPostValidationRules()], postController.createPost);

router.get('/',verifyUser, postController.getAllPost);

router.put('/like/:id',verifyUser, postController.createLike);

router.put('/dislike/:id',verifyUser, postController.deleteLike);

router.delete('/:id',verifyUser, postController.deletePostById);

router.get('/:id',verifyUser, postController.getPostById);

router.post('/comment/:id',[verifyUser,createPostValidationRules()], postController.createComment);

router.delete('/comment/:id/:comment_id',verifyUser, postController.deleteComment);








module.exports = router;