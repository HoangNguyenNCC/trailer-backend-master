const mongoose = require('mongoose');

const Invoice = require('../../../models/invoices');
const User = require('../../../models/users');

const {
    BadRequestError
} = require('../../../helpers/errors');

const setUserProfileRating = async function(req,res){ 

    const ratingBody = req.body;

    if (!ratingBody) throw new BadRequestError('Invalid request body');

    const { invoiceId, rating} = ratingBody;

    if (!invoiceId || !mongoose.Types.ObjectId.isValid(invoiceId)) throw new BadRequestError('Invalid Invoice'); 

    if (!rating || rating < 0 ) throw new BadRequestError('Invalid Rating');

    const userID  = await Invoice.findOne({_id:invoiceId,rentalStatus:"returned",isUserRated:false},{bookedByUserId:1}).lean()
    console.log(userID)
    if(!userID){
        return res.status(400).send('User Already Rated');
    }
    const user = await User.findById({_id:userID.bookedByUserId,isDeleted:false}).lean()
    const userRating = user.userRating;
    const ratingSum = userRating*user.ratingCount
    let newRatingCount = user.ratingCount + 1;
    const newRating =  (ratingSum + rating)/newRatingCount
    await User.findByIdAndUpdate({_id:userID.bookedByUserId,isDeleted:false},{userRating:newRating,ratingCount:newRatingCount})
    await Invoice.findByIdAndUpdate({_id:invoiceId,rentalStatus:"returned"},{isUserRated:true})

    return res.status(200).send('Ratings updated');

}

module.exports = setUserProfileRating