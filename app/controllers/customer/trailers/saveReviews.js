const mongoose = require('mongoose');

const Review = require('../../../models/trailerReviews');

const objectMinusKeys = require('../../../helpers/objectMinusKeys');

/** 
 * 
 * @api {POST} /review Save Reviews data
 * @apiName CA - Save Reviews data
 * @apiGroup Customer App - Trailer
 *  
 * 
 * @apiHeader {String} authorization Authorization token sent as a response to signIn request
 * @apiHeader {String} Content-Type application/json
 * 
 * 
 * @apiParam {String} trailerId Id of the Trailer for which is reviewed by the User
 * @apiParam {String} reviewedByUserId Id of the User who has reviewed the Trailer
 * @apiParam {Number} reviewText Review written by the User
 * 
 * @apiDescription API Endpoint to be used to save Trailer Reviews
 * 
 * 
 * @apiErrorExample {json} Error-Response:
 * HTTP/1.1 400
 *  {
 *      success: false,
 *      message: "Could not save Review record",
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
async function saveReviews(req, res, next) {

    try {
        if (!req.userId) {
            return res.status(403).send({
                success: false,
                message: "Unauthorized Access"
            });
        }

        let review = req.body;

        const reviewId = review._id ? mongoose.Types.ObjectId(review._id) : undefined;
        const isUpdating = review._id ? true : false;
        if (isUpdating) {
            review = objectMinusKeys(review, ['_id', 'createdAt', 'updatedAt']);

            const savedReview = await Review.findOne({ _id: reviewId });
            if(savedReview.reviewedByUserId.toString() !== req.userId.toString()) {
                return res.status(403).send({
                    success: false,
                    message: "Unauthorized Access"
                });
            }
        }
        review.reviewedByUserId = req.userId;

        if (review._id) {
            review._id = reviewId;
        }
        
        if (isUpdating) {
            await Review.updateOne({ _id: reviewId }, review);
            review = await Review.findOne({ _id: reviewId });
        } else {
            review = new Review(review);
            review = await review.save();
        }
        review = review._doc;

        res.status(200).send({
            success: true,
            message: "Success"
        });
    } catch (err) {

        let errorCode = 500;
        let errors = [];
        let errorMessage = "Could not save Review data";

        if (err && err.name && ["MongoError", "ValidationError"].includes(err.name) && err.message) {
            errorCode = 400;
            if(err.code && err.code === 11000 && err.keyValue) {
                const keys = Object.keys(err.keyValue);
                const values = Object.values(err.keyValue);
                errorMessage = `Duplicate Key Error on { ${keys[0]}: ${values[0]} }`;
                errors.push(errorMessage);
            } else {
                errorMessage = err.message;
                errors.push(errorMessage);
            }
        } else if (err && err.message) {
            errorCode = err.message.startsWith("VALIDATION-") ? 400 : 500;
            const errorComp = err.message.split("VALIDATION-");
            errorMessage = errorComp.length > 1 ? errorComp[1] : errorComp[0];
            errors.push(errorMessage);
        } else if (err && err.errors) {
            errorCode = 400;
            const fieldKeys = Object.keys(err.errors);
            fieldKeys.forEach((fieldKey) => {
                if (fieldKey.split(".").length === 1) {
                    errors.push(err.errors[fieldKey].message);
                    if(err.errors[fieldKey].message) {
                        errorMessage = err.errors[fieldKey].message;
                    }
                }
            });
        } else {
            if(err) {
                errorMessage = err;
            }
            errors.push(err);
        }

        return res.status(errorCode).send({
            success: false,
            message: errorMessage,
            errorsList: errors
        });
    }
}

module.exports = saveReviews;