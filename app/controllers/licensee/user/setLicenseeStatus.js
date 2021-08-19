const mongoose = require('mongoose');

const Licensee = require('../../../models/licensees');

const objectSize = require('../../../helpers/objectSize');

const {
    BadRequestError,
    ForbiddenError,
    NotFoundError,
    UnauthorizedError,
    ApiError
  } = require("./../../../helpers/errors");


/** 
 * 
 * @api {PUT} /licensee/status Update Licensee Status
 * @apiName LA - Update Licensee Status
 * @apiGroup Licensee App - Licensee
 * 
 * 
 * @apiHeader {String} Content-Type application/json
 * 
 * 
 * @apiParam {Object} body
 * 
    {
        licenseeId: <String>, // required, id of the licensee
        status: <String> // "avaialble" or "away"
    }
 * 
 * @apiDescription API Endpoint to be used to update Licensee Status
 * 
 * 
 * @apiErrorExample {json} Error-Response:
 * HTTP/1.1 400
 *  {
 *      success: false,
 *      message: "Error occurred while saving Licensee Status",
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
    {
        success: true,
        message: "Successfully saved Licensee Status"
    }
 * 
 */
async function setLicenseeStatus(req, res, next) {
        const statusObj = req.body;
        const status = statusObj.status === "available" ? true : false;

        if (!statusObj.licenseeId || (statusObj.licenseeId && objectSize(statusObj.licenseeId) < 12)) {
            throw new BadRequestError("VALIDATION-Invalid Licensee ID");
        }

        const licenseeId = statusObj.licenseeId ? mongoose.Types.ObjectId(statusObj.licenseeId) : undefined;

        await Licensee.updateOne({ _id: licenseeId }, { availability: status });

        res.status(200).send({
            success: true,
            message: "Successfully saved Licensee Status"
        });
}

module.exports = setLicenseeStatus;