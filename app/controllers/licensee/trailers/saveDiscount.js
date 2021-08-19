const mongoose = require('mongoose');

const Discount = require('../../../models/discounts');

const objectMinusKeys = require('../../../helpers/objectMinusKeys');
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
 * @api {POST} /discount Save Discount for Trailers or Upsell Items
 * @apiName LA - Save Discount for Trailers or Upsell Items
 * @apiGroup Licensee App - Trailer Rental
 *  
 * 
 * @apiHeader {String} Content-Type application/json
 * 
 * 
 * @apiParam {String} itemType Type of item - "trailer" or "upsellitem"
 * @apiParam {String} itemId Id of the Trailer/UpsellItem for which is rated by the User
 * @apiParam {String} chargeType Type of a Discount - "flat" or "percentage"
 * @apiParam {Number} charge Discount Value flat or percentage
 * 
 * @apiDescription API Endpoint to be used to save Discount for Trailers or Upsell Items
 * 
 * 
 * @apiErrorExample {json} Error-Response:
 * HTTP/1.1 400
 *  {
 *      success: false,
 *      message: "Error occurred while saving Discount record",
 *      errorsList: []
 *  }
 * 
 * 
 * @apiSuccess {Boolean} success Success Status
 * @apiSuccess {String} message Success Message
 * @apiSuccess {Object} discountObj Discount details object
 * 
 * @apiSuccessExample {String} - Success-Response:
 * HTTP/1.1 200 OK
 * 
 * {
 *      success: true,
 *      message: "Successfully saved Discount record",
 *      discountObj: {
            _id: '5e4fa796c6091d40ee15aa91',
            itemId: '5e4fa796c6091d40ee15aa8f',
            itemType: 'trailer',
            chargeType: 'flat',
            charge: 10
 *      }
 * }
 * 
 */
async function saveDiscount(req, res, next) {
    let discount = req.body,
            existingDiscount;

        if (!discount.itemId || (discount.itemId && objectSize(discount.itemId) < 12)) {
            throw new BadRequestError("VALIDATION-Invalid Trailer or Upsell Item ID");
        }
        const itemId = mongoose.Types.ObjectId(discount.itemId);

        const isUpdating = discount._id ? true : false;
        if (isUpdating) {
            if (discount._id && objectSize(discount._id) < 12) {
                throw new BadRequestError("VALIDATION-Invalid Discount ID");
            }

            if (discount.chargeType && !(["flat", "percentage"].includes(discount.chargeType.trim().toLowerCase()))) {
                throw new BadRequestError("VALIDATION-Invalid Charge Type");
            }

            if (discount.charge && parseFloat(discount.charge) <= 0) {
                throw new BadRequestError("VALIDATION-Invalid Charge");
            }

            discount = objectMinusKeys(discount, ['_id', 'itemId', 'itemType', 'createdAt', 'updatedAt']);
            existingDiscount = await Discount.findOne({ _id: discountId });
        } else {
            if (!discount.itemType || !(["trailer", "upsellitem"].includes(discount.itemType.trim().toLowerCase()))) {
                throw new BadRequestError("VALIDATION-Invalid Trailer or Upsell Item ID");
            }

            if (!discount.chargeType || !(["flat", "percentage"].includes(discount.chargeType.trim().toLowerCase()))) {
                throw new BadRequestError("VALIDATION-Invalid Charge Type");
            }

            if (!discount.charge || parseFloat(discount.charge) <= 0) {
                throw new BadRequestError("VALIDATION-Invalid Charge");
            }
        }
        const discountId = discount._id ? mongoose.Types.ObjectId(discount._id) : undefined;

        if (isUpdating) {
            await Discount.updateOne({ _id: discountId }, discount);
            discount = await Discount.findOne({ _id: discountId });
        } else {
            discount = new Discount(discount);
            discount = await discount.save();
        }
        discount = discount._doc;

        res.status(200).send({
            success: true,
            message: "Successfully saved Discount record",
            discountObj: discount
        });
    
}

module.exports = saveDiscount;