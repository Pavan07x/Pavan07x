let userModel = require('../../models/Users');


exports.getAllQuotes = async () => {
    try {
        let quotesData = await quotesModel.find()
        return quotesData;

      } catch (e) {
        console.log(e)
        return false
      }

}

exports.getUserByEmail = async (email) => {
  try {
      let userData = await userModel.findOne({email});
      return userData;

    } catch (e) {
      console.log(e.message);
      return {false:{"error":e.message}}
    }

}

exports.getUserById = async (userId) => {
  try {

      let userData = await userModel.findById(userId).select('-password');
      return userData;

    } catch (e) {
      console.log(e.message);
      return {false:{"error":e.message}}
    }

}

exports.createNewUser = async (user) => {
  try {
      console.log(user)
      let quotesData = await userModel.create(user);
      return quotesData;

    } catch (e) {
      console.log(e)
      return false
    }

}

/*
exports.getSelectedQuotes = async (searchData) => {
    try {
        let quotesData = await quotesModel.find(searchData);
        return quotesData;

      } catch (e) {
        console.log(e)
        return false
      }

}



exports.getQuotesByQuote = async (quote) => {
  try {
      let quotesData = await quotesModel.findOne(quote);
      return quotesData;

    } catch (e) {
      return {false:{"error":e.message}}
    }

}




exports.updateQuote = async (quoteId,data) => {
    try {
        let quotesData = await quotesModel.findOneAndUpdate({ _id: quoteId }, data, {useFindAndModify: false,
            returnOriginal: false
          })
        return quotesData;

      } catch (e) {
        console.log(e)
        return false
      }

}

exports.updateLikeAndDislike = async (quoteId,data) => {
  try {
    let quotesData = await quotesModel.findOneAndUpdate({ _id: quoteId }, data,{useFindAndModify: false,
      returnOriginal: false
    });
      return quotesData;

    } catch (e) {
      console.log(e)
      return false
    }

}

exports.deleteQuote = async (id) => {
  try {
    console.log(id);
    let quotesData = await quotesModel.deleteOne({"_id": id})
    console.log(quotesData);
      return quotesData;

    } catch (e) {
      console.log(e)
      return false
    }

}
*/