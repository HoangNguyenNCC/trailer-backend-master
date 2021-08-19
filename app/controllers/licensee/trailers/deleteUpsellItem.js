const mongoose = require('mongoose');
const validator = require('validator');

const UpsellItem = require('../../../models/upsellItems');

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
 * @api {DELETE} /upsellitem Delete an Upsell Item
 * @apiName LA - Delete an Upsell Item
 * @apiGroup Licensee App - Trailer
 *  
 * 
 * @apiHeader {String} Content-Type application/json
 * @apiHeader {String} authorization Authorization token sent as a response to signIn request
 * 
 * 
 * @apiParam {String} id Id of the Upsell Item
 * 
 * 
 * @apiErrorExample {json} Error-Response:
 * HTTP/1.1 400
 * 
    {
        success: false,
        message: "Could not delete Upsell Item",
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

async function deleteUpsellItem(req, res, next) {

        if (!req.requestFrom || !aclSettings.validateACL(req.requestFrom.acl, "UPSELL", ["DELETE"])) {
            throw new ForbiddenError('Unauthorised Error')
        }
        const upsellitemId = req.body.id ? mongoose.Types.ObjectId(req.body.id) : undefined;
        const upsellitem = await UpsellItem.findOne({ _id: upsellitemId }, { _id: 1 });
        if(upsellitem) {
            await UpsellItem.updateOne({ _id: upsellitemId }, { isDeleted: true });
        } else {
            throw new BadRequestError("VALIDATION-Upsell Item not found");
        }

        res.status(200).send({
            success: true,
            message: "Success"
        });
}

module.exports = deleteUpsellItem;