userDataLayer = require("./user.dal")
const { check, validationResult } = require('express-validator')
let gravatar = require('gravatar');
let bcrypt = require('bcryptjs');
const jwt = require('../auth/auth.services');
const { use } = require("../../routes/users");

exports.registerUser = async (req, res) => {
    try {
      
      const errors = validationResult(req);
      
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const {name,email,password} = req.body;


       let userData = await userDataLayer.getUserByEmail(email);

       if (userData) {
        console.log("user exist");
        console.log(userData);
        return res.status(400).json({ errors: [{"msg": "User already exist"}] });
       }



       const avatar = gravatar.url(email,{
         s:'200',
         r:'pg',
         d:'mm'
       })

       let user = {
         name,
         email,
         avatar,
         password
       }


       const salt = await bcrypt.genSalt(10);
       user.password = await bcrypt.hash(password,salt);

       let newUser = await userDataLayer.createNewUser(user);

       let jwtToken = await jwt.validateUser(newUser)
       console.log("user details");
       console.log(jwtToken);
        res.send(jwtToken.token)


      } catch (e) {
        console.error(e.message);
        res.status(500).json("server error");
      }

}

/*
exports.getSelectedQuotes = async (req, res, next) => {
    try {
        let searchData = {};
    
        if (req.query.author) {
          searchData.author = new RegExp(req.query.author)
        }
        if (req.query.quote) {
          searchData.quote = new RegExp(req.query.quote)
        }

        if (req.query.tags) {
          searchData.tags = new RegExp(req.query.tags.toLowerCase())
        }

        let quotesData = await quotesDataLayer.getSelectedQuotes(searchData);

        if (quotesData) {
            return res.json(quotesData); 
        }else{
            return res.status(500).json("Internal server error")
        }
        
      } catch (e) {
        res.status(400).json("Bad request")
      }

}


exports.getQuotesById = async (req, res, next) => {
    try {
        let quoteId = req.params.id;
        let quotesData = await quotesDataLayer.getQuotesById(quoteId);
        
        if (quotesData.id) {
            return res.json(quotesData); 
        }else{
            return res.status(400).json(quotesData.false)
        }
        
      } catch (e) {
        res.status(400).json("Bad request")
      }

}

exports.createNewQuote = async (req, res, next) => {
    try {
        let data = req.body;
        let quote={};
        quote.quote = req.body.quote;

        let quoteExist = await quotesDataLayer.getQuotesByQuote(quote);
        if (quoteExist) {
          return res.status(400).json({"message": "Quote already present!"});
        }
        let quotesData = await quotesDataLayer.createNewQuote(data);

        if (quotesData) {
            return res.json(quotesData); 
        }else{
            return res.status(500).json("Internal server error");
        }
        
      } catch (e) {
        res.status(400).json("Bad request");
      }

}


exports.updateQuote = async (req, res, next) => {
    try {

        let quoteId = req.params.id
        let data = {
          "likes":req.body.likes,
          "dislikes":req.body.dislikes,
          "quote":req.body.quote,
          "author":req.body.author,
          "tags":req.body.tags,
        }

        let quoteExist = await quotesDataLayer.getQuotesById(quoteId);
        if (!quoteExist) {
          return res.status(500).json({"message": "Invalid quote Id!"});
        }

        let quotesData = await quotesDataLayer.updateQuote(quoteId,data);
        

        if (quotesData) {
            return res.json({"message": "Quote updated successfully"}); 
        }else{
            return res.status(500).json("Internal server error")
        }
        
      } catch (e) {
        res.status(400).json("Bad request")
      }
}

exports.increaseLike = async (req, res, next) => {
  try {

      let quoteId = req.params.id

      let like = await quotesDataLayer.getQuotesById(quoteId);
      if (like === null || like.false) {
        return res.status(404).json({"message": "Quote not present!"});
      }

      let oldLikeCount = like.likes;
      let newLikeCount = oldLikeCount + 1;
      let data = {
        likes:newLikeCount
      }

      let quotesData = await quotesDataLayer.updateLikeAndDislike(quoteId,data);

      if (quotesData) {
        let likeCount = quotesData.likes;
        let dislikCount = quotesData.dislikes;
          return res.json({"message": "quotes like :" + likeCount + " dislike :" + dislikCount  }); 
      }else{
          return res.status(500).json("Internal server error")
      }
      
    } catch (e) {
      res.status(400).json("Bad request")
    }

}

exports.increaseDisLike = async (req, res, next) => {

  try {

      let quoteId = req.params.id

      let disLike = await quotesDataLayer.getQuotesById(quoteId);
      if (disLike === null || disLike.false) {
        return res.status(404).json({"message": "Quote not present!"});
      }
      let oldDislikeCount = disLike.dislikes;
      let newDislikeCount = oldDislikeCount + 1;
      let data = {
        dislikes:newDislikeCount
      }

      let quotesData = await quotesDataLayer.updateLikeAndDislike(quoteId,data);

      if (quotesData) {
        let likeCount = quotesData.likes;
        let dislikCount = quotesData.dislikes;
          return res.json({"message": "quotes like :" + likeCount + " dislike :" + dislikCount  });
      }else{
          return res.status(500).json("Internal server error")
      }
      
    } catch (e) {
      res.status(400).json("Bad request")
    }

}


exports.decreaseLike = async (req, res, next) => {

  try {

    let quoteId = req.params.id

    let like = await quotesDataLayer.getQuotesById(quoteId);

    if (like === null || like.false) {
      return res.status(404).json({"message": "Quote not present!"});
    }

    let oldLikeCount = like.likes;
    let newLikeCount = oldLikeCount - 1;
    let data = {
      likes:newLikeCount
    }

    let quotesData = await quotesDataLayer.updateLikeAndDislike(quoteId,data);

    if (quotesData) {
      let likeCount = quotesData.likes;
      let dislikCount = quotesData.dislikes;
        return res.json({"message": "quotes like :" + likeCount + " dislike :" + dislikCount  }); 
    }else{
        return res.status(500).json("Internal server error")
    }
    
  } catch (e) {
    res.status(400).json("Bad request")
  }

}

exports.decreaseDisLike = async (req, res, next) => {

  try {

      let quoteId = req.params.id

      let disLike = await quotesDataLayer.getQuotesById(quoteId);

      if (disLike === null || disLike.false) {
        return res.status(404).json({"message": "Quote not present!"});
      }

      let oldDislikeCount = disLike.dislikes;
      let newDislikeCount = oldDislikeCount - 1;
      let data = {
        dislikes:newDislikeCount
      }

      let quotesData = await quotesDataLayer.updateLikeAndDislike(quoteId,data);

      if (quotesData) {
        let likeCount = quotesData.likes;
        let dislikCount = quotesData.dislikes;
          return res.json({"message": "quotes like :" + likeCount + " dislike :" + dislikCount  }); 
      }else{
          return res.status(500).json("Internal server error")
      }
      
    } catch (e) {
      res.status(400).json("Bad request")
    }

}

exports.deleteQuote = async (req, res, next) => {

  try {
      let quoteId = req.params.id;

      let quote = await quotesDataLayer.getQuotesById(quoteId);

      let quoteData;
      console.log("daatatattaatta")
      console.log(quote)

      if (!quote) {
        return res.status(404).json({"message": "Quote not present!"});
      }else{
        quoteData = await quotesDataLayer.deleteQuote(quoteId);
      }

      if (quoteData) {
          return res.json({"message": "quote deleted"}); 
      }else{
          return res.status(500).json("Internal server error");
      }
      
    } catch (e) {
      res.status(400).json("Bad request");
    }

}
*/