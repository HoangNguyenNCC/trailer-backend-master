const mongoose = require('mongoose');
const Invoice = require('../../../models/invoices');
const Trailer = require('../../../models/trailers');
const Employee = require('../../../models/employees');

const {
    BadRequestError
} = require('../../../helpers/errors');

/**
 * req.body
 * {
 *  invoiceId: ObjectId,
 *  trailers: [
 *      {
 *          itemId: ObjectId,
 *          rating: Number
 *      } 
 *  ]
 * }
 */
const setRentalRatings = async (req, res) => {
    const ratingBody = req.body;

    if (!ratingBody) throw new BadRequestError('Invalid request body');

    const { invoiceId, rating, review = '',licenseeRating } = ratingBody;

    if (!invoiceId || !mongoose.Types.ObjectId.isValid(invoiceId)) throw new BadRequestError('Invalid Invoice'); 

    const invoice = await Invoice.findByIdAndUpdate(invoiceId, { rating, isRatingsGiven: true, review }, { new: true }).lean();

    const employee = await Employee.findOne({licenseeId:invoice.licenseeId,isOwner:true}).lean()

    if(licenseeRating){
        if (licenseeRating < 0 ) throw new BadRequestError('Invalid Rating');
        const employeeRating  = employee.employeeRating;
        const ratingSum = employeeRating*employee.ratingCount
        let newRatingCount = employee.ratingCount + 1;
        const newRating =  (ratingSum + licenseeRating)/newRatingCount
        await Employee.findByIdAndUpdate({_id:employee._id},{employeeRating:newRating,ratingCount:newRatingCount});
    }

    if(rating){
        if (rating < 0 ) throw new BadRequestError('Invalid Rating');
        const trailerRentedItem = invoice.rentedItems.filter(item => item.itemType == 'trailer')[0];
        const trailer = await Trailer.findById(trailerRentedItem.itemId).lean();
        
        const trailerRating = trailer.rating ;
        const ratingSumTrailer = trailerRating*trailer.ratingCount
        let newRatingCountTrailer = trailer.ratingCount + 1;
        const newRatingTrailer =  (ratingSumTrailer + rating)/newRatingCountTrailer
        await Trailer.findByIdAndUpdate(trailer._id, { rating: newRatingTrailer , ratingCount:newRatingCountTrailer});
    }
    
    return res.status(200).send({message : 'Ratings updated'});

};

module.exports = setRentalRatings;