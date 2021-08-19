const TrailerType = require('../../../models/trailerTypes');
const { UnauthorizedError } = require('./../../../helpers/errors');

/**
 * 
 * @api {GET} /trailers/admin Get Trailers added by Admin
 * @apiName CA - Get Trailers added by Admin
 * @apiGroup Customer App - Trailer
 * 
 * 
 * @apiHeader {String} authorization Authorization token sent as a response to signIn request
 * 
 * 
 * @apiDescription API Endpoint GET /trailers/admin
 * 
 * 
 * @apiSuccess {Boolean} success Success Status
 * @apiSuccess {String} message Success Message 
 * @apiSuccess {Array} trailersList List of Admin Trailer Objects
 * 
 * @apiSuccessExample {String} - Success-Response:
 * HTTP/1.1 200
    {
        success: true,
        message: "Success",
        trailersList: []
    }
 * 
 * @apiErrorExample {json} Error-Response:
 * HTTP/1.1 400
    {
        success: false,
        message: "Could not fetch Admin Trailer Type",
        errorsList: []
    }
 * 
 * 
 */
async function getTrailers(req, res, next) {
    if (!req.userId) throw new UnauthorizedError('UnAuthorized Access');

    let trailers = await TrailerType.find({}).lean();

    trailers = trailers.map((trailer, index) => {
        delete trailer.rentalCharges;
        return trailer;
    });

    return res.status(200).send({
        success: true,
        message: "Success",
        trailersList: trailers
    });
}

module.exports = getTrailers;