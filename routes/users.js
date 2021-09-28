var express = require('express');
var router = express.Router();
const { userValidationRules, validate } = require('../components/users/user.validation')
//const { verifyUser } = require('../components/auth/auth.service')
//const { checkId,checkAllFilds } = require('../components/quotesValidationByJoi')
const usersController = require("../components/users/user..controller")

//Register user
router.post('/',userValidationRules(), usersController.registerUser);
/*
//Search quotes by author or quotes
router.get('/search', quotesController.getSelectedQuotes);

//Create new Quotes
router.post('/',quotesController.createNewQuote);


//Get quote by id
router.get('/:id', checkId , quotesController.getQuotesById);


//Update quote by id
router.patch('/:id', quotesController.updateQuote);

//Increase like count
router.post('/:id/likes/up', quotesController.increaseLike);

//Increase dislike count
router.post('/:id/dislike/up', quotesController.increaseDisLike);


//Reduce dislike count by 1
router.post('/:id/dislike/down', quotesController.decreaseDisLike);


//reduce like count by 1
router.post('/:id/likes/down', quotesController.decreaseLike);

//Delete quotes by Id
router.delete('/:id', quotesController.deleteQuote);
*/


module.exports = router;
