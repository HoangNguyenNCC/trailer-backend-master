const mongoose = require('mongoose');
const validator = require('validator');

const RentalItemType = require('../../../models/rentalItemTypes');

const objectSize = require('../../../helpers/objectSize');

const aclSettings = require('../../../helpers/getAccessControlList');
const { BadRequestError } = require('../../../helpers/errors');

/**
 * 
 * @api {GET} /rentalitemtype Get Rental Item Types List
 * @apiName TAAT - Get Rental Item Types List
 * @apiGroup Admin App - Trailer
 * 
 * 
 * @apiHeader {String} authorization Authorization token sent as a response to signIn request
 * 
 * @apiParam {String} id Id of the Rental Item
 * 
 * @apiDescription API Endpoint GET /rentalitemtype
 * 
 * 
 * @apiSuccessExample {String} - Success-Response:
 * HTTP/1.1 200
    {
        success: true,
        message: "Success",
        rentalItemType: {}
    }
 * 
 * 
 * @apiErrorExample {json} Error-Response:
 * HTTP/1.1 400
    {
        success: false,
        message: "Couldn't get Rental Item Type",
        errorsList: []
    }
 * 
 * 
 */
async function getRentalItemType(req, res, next) {
    if(!req.requestFrom || !req.requestFrom.employeeId || !req.requestFrom.acl || !aclSettings.validateACL(req.requestFrom.acl, "TRAILER", "VIEW")) {
        throw new BadRequestError('Unauthorised Access')
        }

        let rentalItemId = req.query ? req.query.id : undefined;
        if (!rentalItemId || validator.isEmpty(rentalItemId)) {
            throw new BadRequestError("VALIDATION-Trailer ID is undefined");
        } else if (objectSize(rentalItemId) < 12) {
            throw new BadRequestError("VALIDATION-Trailer ID is invalid");
        }
        rentalItemId = mongoose.Types.ObjectId(rentalItemId);

        let rentalItemType = await RentalItemType.findOne({ _id: rentalItemId });

        return res.status(200).send({
            success: true,
            message: "Success",
            rentalItemType: rentalItemType
        });
}

module.exports = getRentalItemType;