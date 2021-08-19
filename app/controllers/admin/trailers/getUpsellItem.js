const mongoose = require('mongoose');
const validator = require('validator');

const UpsellItemType = require('../../../models/upsellItemTypes');

const objectSize = require('../../../helpers/objectSize');

const aclSettings = require('../../../helpers/getAccessControlList');
const { BadRequestError } = require('../../../helpers/errors');

/**
 * 
 * @api {GET} /admin/upsellitem Get Upsell Item Type Details
 * @apiName TAAT - Get Upsell Item Type Details
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
 * API Endpoint GET /admin/upsellitem
 * 
 * 
 * @apiSuccessExample {String} - Success-Response:
 * HTTP/1.1 200
    {
        success: true,
        message: "Success",
        upsellItemObj: []
    }
 * 
 * Sample API Call : http://localhost:5000/admin/upsellitem?id=
 * 
 * @apiErrorExample {json} Error-Response:
 * HTTP/1.1 400
    {
        success: false,
        message: "Error occurred while fetching Upsell Item Type data",
        errorsList: []
    }
 * 
 * 
 */
async function getUpsellItem(req, res, next) {
    if(!req.requestFrom || !req.requestFrom.employeeId || !req.requestFrom.acl || !aclSettings.validateACL(req.requestFrom.acl, "UPSELL", "VIEW")) {
        throw new BadRequestError('Unauthorised Access')
        }

        let upsellItemId = req.query ? req.query.id : undefined;
        if(!upsellItemId || validator.isEmpty(upsellItemId)) {
            throw new BadRequestError("VALIDATION-Trailer ID is undefined");
        } else if (objectSize(upsellItemId) < 12) {
            throw new BadRequestError("VALIDATION-Trailer ID is invalid");
        }
        upsellItemId = mongoose.Types.ObjectId(upsellItemId);

        const upsellItem = await UpsellItemType.findById(upsellItemId).lean();

        if(!upsellItem) {
            throw new BadRequestError("VALIDATION-Could not find Upsell Item Type");
        }

        return res.status(200).send({
            success: true,
            message: "Success",
            upsellItemObj: upsellItem
        });
}

module.exports = getUpsellItem;