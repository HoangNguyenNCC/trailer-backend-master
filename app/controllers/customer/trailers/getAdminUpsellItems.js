const UpsellItemType = require('../../../models/upsellItemTypes');

const { UnauthorizedError } = require('./../../../helpers/errors');

/**
 * 
 * @api {GET} /upsellitems/admin Get UpsellItems added by Admin
 * @apiName CA - Get UpsellItems added by Admin
 * @apiGroup Customer App - Trailer
 * 
 * 
 * @apiHeader {String} authorization Authorization token sent as a response to signIn request
 * 
 * 
 * @apiDescription API Endpoint GET /upsellitems/admin
 * 
 * 
 * @apiSuccess {Boolean} success Success Status
 * @apiSuccess {String} message Success Message 
 * @apiSuccess {Array} upsellItemsList List of Admin Upsell Item Objects
 * 
 * 
 * @apiSuccessExample {String} - Success-Response:
 * HTTP/1.1 200
    {
        success: true,
        message: "Success",
        upsellItemsList: []
    }
 * 
 * @apiErrorExample {json} Error-Response:
 * HTTP/1.1 400
    {
        success: false,
        message: "Could not fetch Admin Upsell Item Type",
        errorsList: []
    }
 * 
 * 
 */
async function getUpsellItems(req, res) {
    if (!req.userId) throw new UnauthorizedError('UnAuthorized Access');

    let upsellItems = await UpsellItemType.find({}).lean();
    
    upsellItems = upsellItems.map(upsellItem => {
        // upsellItem = upsellItem._doc;
        delete upsellItem.rentalCharges;
        return upsellItem;
    });

    return res.status(200).send({
        success: true,
        message: "Success",
        upsellItemsList: upsellItems
    });
}

module.exports = getUpsellItems;