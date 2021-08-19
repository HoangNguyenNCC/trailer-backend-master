const mongoose = require('mongoose');
const validator = require('validator');

const TrailerType = require('../../../models/trailerTypes');

const objectSize = require('../../../helpers/objectSize');

const aclSettings = require('../../../helpers/getAccessControlList');
const { BadRequestError } = require('../../../helpers/errors');

/**
 * 
 * @api {GET} /admin/trailer Get Trailer Type Details
 * @apiName TAAT - Get Trailer Type Details
 * @apiGroup Admin App - Trailer
 * 
 * 
 * @apiHeader {String} authorization Authorization token sent as a response to signIn request
 * 
 * 
 * @apiParam {String} id Trailer Id
 * 
 * 
 * @apiDescription 
 * 
 * API Endpoint GET /admin/trailer
 * 
 * 
 * @apiSuccessExample {String} - Success-Response:
 * HTTP/1.1 200
    {
        success: true,
        message: "Success",
        trailerObj: []
    }
 * 
 * Sample API Call : http://localhost:5000/admin/trailer?id=
 * 
 * @apiErrorExample {json} Error-Response:
 * HTTP/1.1 400
    {
        success: false,
        message: "Error occurred while fetching Trailer Type data",
        errorsList: []
    }
 * 
 * 
 */
async function getTrailer(req, res, next) {
    if(!req.requestFrom || !req.requestFrom.employeeId || !req.requestFrom.acl || !aclSettings.validateACL(req.requestFrom.acl, "TRAILER", "VIEW")) {
        throw new BadRequestError('Unauthorised Access')
        }

        let trailerId = req.query ? req.query.id : undefined;
        if(!trailerId || validator.isEmpty(trailerId)) {
            throw new BadRequestError("VALIDATION-Trailer ID is undefined");
        } else if (objectSize(trailerId) < 12) {
            throw new BadRequestError("VALIDATION-Trailer ID is invalid");
        }
        trailerId = mongoose.Types.ObjectId(trailerId);

        const trailer = await TrailerType.findById(trailerId).lean();
        // let trailer = trailers && trailers.length > 0 ? trailers[0] : undefined;

        if(!trailer) {
            throw new BadRequestError("VALIDATION-Could not find Trailer");
        }

        return res.status(200).send({
            success: true,
            message: "Success",
            trailerObj: trailer
        });
}

module.exports = getTrailer;