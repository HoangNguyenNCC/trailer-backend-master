const mongoose = require('mongoose');

const Rating = require('../../../models/trailerRatings');

const objectMinusKeys = require('../../../helpers/objectMinusKeys');
const { UnauthorizedError } = require('../../../helpers/errors');
/** 
 * 
 * @api {POST} /rating Save Ratings data
 * @apiName CA - Save Ratings data
 * @apiGroup Customer App - Trailer
 *  
 * 
 * @apiHeader {String} authorization Authorization token sent as a response to signIn request
 * @apiHeader {String} Content-Type application/json
 * 
 * 
 * @apiParam {String} itemType Type of Item for which Rating is saved - "trailer" or "upsellitem"
 * @apiParam {String} itemId Id of the Trailer for which is rated by the User
 * @apiParam {String} ratedByUserId Id of the User who has rated the Trailer
 * @apiParam {Number} ratingValue Value of the Rating
 * 
 * 
 * @apiDescription API Endpoint to be used to save Trailer Ratings
 * 
 * 
 * @apiErrorExample {json} Error-Response:
 * HTTP/1.1 400
 *  {
 *      success: false,
 *      message: "Could not save Ratings record",
 *      errorsList: []
 *  }
 * 
 * 
 * @apiSuccess {Boolean} success Success Status
 * @apiSuccess {String} message Success Message
 * 
 * 
 * @apiSuccessExample {String} - Success-Response:
 * HTTP/1.1 200 OK
 * 
 * {
 *      success: true,
 *      message: "Success"
 * }
 * 
 */
async function saveRatings(req, res, next) {
    if (!req.userId) throw new UnauthorizedError('UnAuthorized Access');

    let rating = req.body;

    const ratingId = rating._id ? mongoose.Types.ObjectId(rating._id) : undefined;
    const isUpdating = rating._id ? true : false;
    if (isUpdating) {
        rating = objectMinusKeys(rating, ['_id', 'createdAt', 'updatedAt']);

        const savedRating = await Rating.findOne({ _id: ratingId });
        if(savedRating.ratedByUserId.toString() !== req.userId.toString()) throw new UnauthorizedError('UnAuthorized Access');
    }

    rating.itemType = rating.itemType ? rating.itemType : "trailer";

    rating.ratingValue = parseInt(rating.ratingValue);

    if (isUpdating) {
        await Rating.updateOne({ _id: ratingId }, rating);
        rating = await Rating.findOne({ _id: ratingId });
    } else {
        rating = await new Rating(rating).save();
    }
    rating = rating._doc;

    res.status(200).send({
        success: true,
        message: "Success"
    });
}

module.exports = saveRatings;