const mongoose = require('mongoose');
const validator = require('validator');

const RentalItemType = require('../../../models/rentalItemTypes');

const aclSettings = require('../../../helpers/getAccessControlList');
const objectMinusKeys = require('../../../helpers/objectMinusKeys');
const { BadRequestError } = require('../../../helpers/errors');

/** 
 * 
 * @api {POST} /admin/rentalitemtype Save or Update Rental Item Type
 * @apiName TAAT - Save or Update Rental Item Type
 * @apiGroup Admin App - Trailer
 *  
 * 
 * @apiHeader {String} Content-Type application/json
 * @apiHeader {String} authorization Authorization token sent as a response to signIn request
 * 
 * 
 * @apiParam {String} id Id of the record ( for update request )
 * @apiParam {String} name Name of the Rental Item Type
 * @apiParam {String} code Unique Code of the Rental Item
 * @apiParam {String} itemtype Type of the Rental Item ( "trailer" || "upsellitem" )
 * 
 * 
 * @apiDescription API Endpoint that can used to save or update Rental Item Type
 * 
 * 
 * @apiErrorExample {json} Error-Response:
 * HTTP/1.1 400
    {
        success: false,
        message: "Token is invalid.""
    }
 * 
 * 
 * @apiSuccessExample {String} - Success-Response:
 * HTTP/1.1 200 OK
 * 
    {
        success: true,
        message: "Success"
    }
 * 
 * 
 */

async function saveRentalItemType(req, res, next) {
   if(!req.requestFrom || !req.requestFrom.employeeId || !req.requestFrom.acl || !aclSettings.validateACL(req.requestFrom.acl, "TRAILER", "ADD")) {
    throw new BadRequestError('Unauthorised Access')
    }

        let rentalItemType = req.body;

        const rentalItemTypeId = rentalItemType.id ? mongoose.Types.ObjectId(rentalItemType.id) : undefined;
        const isUpdating = rentalItemType.id ? true : false;
        const existingRentalItemType = await RentalItemType.findOne({ _id: rentalItemTypeId });
        if(isUpdating && !existingRentalItemType) {
            throw new BadRequestError('Unauthorised Access')
        }

        if (isUpdating) {
            rentalItemType = objectMinusKeys(rentalItemType, ['_id', 'createdAt', 'updatedAt']);
        }

        if (rentalItemType._id) {
            rentalItemType._id = rentalItemTypeId;
        }

        if (isUpdating) {
            await RentalItemType.updateOne({ _id: rentalItemTypeId }, rentalItemType);
            rentalItemType = await RentalItemType.findOne({ _id: rentalItemTypeId });
        } else {
            rentalItemType = new RentalItemType(rentalItemType);
            rentalItemType = await rentalItemType.save();
        }
        rentalItemType = rentalItemType._doc;

        res.status(200).send({
            success: true,
            message: "Success",
            rentalItemType: rentalItemType
        });


}

module.exports = saveRentalItemType;
