const mongoose = require('mongoose');
const validator = require('validator');

const Trailer = require('../../../models/trailers');

const aclSettings = require('../../../helpers/getAccessControlList');
const {
    BadRequestError,
    ForbiddenError,
    NotFoundError,
    UnauthorizedError,
    ApiError
  } = require("./../../../helpers/errors");


/** 
 * 
 * @api {DELETE} /trailer Delete a Trailer
 * @apiName LA - Delete a Trailer
 * @apiGroup Licensee App - Trailer
 *  
 * 
 * @apiHeader {String} Content-Type application/json
 * @apiHeader {String} authorization Authorization token sent as a response to signIn request
 * 
 * 
 * @apiParam {String} id Id of the Trailer
 * 
 * 
 * @apiErrorExample {json} Error-Response:
 * HTTP/1.1 400
 * 
    {
        success: false,
        message: "Could not delete Trailer",
        errorsList: []
    }
 * 
 * 
 * @apiSuccess {Boolean} success Success Status
 * @apiSuccess {String} message Success Message
 * 
 * 
 * @apiSuccessExample {String} - Success-Response:
 * HTTP/1.1 200 
 * 
    {
        success: true,
        message: "Success"
    }
 * 
 *
 */

async function deleteTrailer(req, res, next) {
        if (!req.requestFrom || !aclSettings.validateACL(req.requestFrom.acl, "TRAILER", ["DELETE"])) {
            throw new ForbiddenError('Unauthorised Access')
        }
        const trailerId = req.body.id ? mongoose.Types.ObjectId(req.body.id) : undefined;
        const trailer = await Trailer.findOne({ _id: trailerId }, { _id: 1 });
        if(trailer) {
            await Trailer.updateOne({ _id: trailerId }, { isDeleted: true });
        } else {
            throw new BadRequestError("VALIDATION-Trailer not found");
        }
        res.status(200).send({
            success: true,
            message: "Success"
        });
}

module.exports = deleteTrailer;