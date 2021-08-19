const TrailerType = require('../../../models/trailerTypes');
const UpsellItemType = require('../../../models/upsellItemTypes');

const { UnauthorizedError } = require('./../../../helpers/errors');

/**
 * 
 * @api {GET} /featured Get Featured Trailers and Upsell Items
 * @apiName CA - Get Featured Trailers and Upsell Items
 * @apiGroup Customer App - Trailer
 * 
 * 
 * @apiHeader {String} authorization Authorization token sent as a response to signIn request
 * 
 * 
 * @apiDescription API Endpoint GET /featured
 * 
 * 
 * @apiSuccess {Boolean} success Success Status
 * @apiSuccess {String} message Success Message
 * @apiSuccess {Array} trailers Array of Featured Trailers
 * 
 * 
 * @apiSuccessExample {String} - Success-Response:
 * HTTP/1.1 200
    {
        success: true,
        message: "Success",
        trailers: []
    }
 * 
 * 
 * @apiErrorExample {json} Error-Response:
 * HTTP/1.1 400
    {
        success: false,
        message: "Could not get trailers",
        errorsList: []
    }
 * 
 * 
 */
async function getFeatured(req, res) {
    if (!req.userId) throw new UnauthorizedError('UnAuthorized Access');
    const trailers = await TrailerType.find({isFeatured: true}).lean();
    const upsellItems = await UpsellItemType.find({isFeatured: true}).lean();

    const rentalItems = [
        ...trailers,
        ...upsellItems
    ];

    return res.status(200).send({
        success: true,
        message: "Success",
        trailers: rentalItems
    });
}

module.exports = getFeatured;