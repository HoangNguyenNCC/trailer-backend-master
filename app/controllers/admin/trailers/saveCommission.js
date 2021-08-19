const mongoose = require('mongoose');

const Commission = require('../../../models/commissions');

const objectMinusKeys = require('../../../helpers/objectMinusKeys');
const objectSize = require('../../../helpers/objectSize');
const { BadRequestError } = require('../../../helpers/errors');
/** 
 * 
 * @api {POST} /commission Save Commission for Trailers or Upsell Items
 * @apiName TAAT - Save Commission for Trailers or Upsell Items
 * @apiGroup Admin App - Trailer
 *  
 * 
 * @apiHeader {String} Content-Type application/json
 * 
 * 
 * @apiParam {String} itemType Type of item - "trailer" or "upsellitem"
 * @apiParam {String} itemId Id of the Trailer/UpsellItem for which is rated by the User
 * @apiParam {String} chargeType Type of Commission - "flat" or "percentage"
 * @apiParam {Number} charge Commission Value - flat or percentage
 * 
 * @apiDescription API Endpoint to be used to save Commission for Trailers or Upsell Items
 * 
 * 
 * @apiErrorExample {json} Error-Response:
 * HTTP/1.1 400
 *  {
 *      success: false,
 *      message: "Error occurred while saving Commission record",
 *      errorsList: []
 *  }
 * 
 * 
 * @apiSuccessExample {String} - Success-Response:
 * HTTP/1.1 200 OK
 * 
 * {
 *      success: true,
 *      message: "Successfully saved Commission record",
 *      commissionObj: {
            _id: '5e4fa796c6091d40ee15aa91',
            itemId: '5e4fa796c6091d40ee15aa8f',
            itemType: 'trailer',
            chargeType: 'flat',
            charge: 10
 *      }
 * }
 * 
 */
async function saveCommision(req, res, next) {
    let commission = req.body,
            existingCommission;

        if (!commission.itemId || (commission.itemId && objectSize(commission.itemId) < 12)) {
            throw new BadRequestError("VALIDATION-Invalid Trailer or Upsell Item ID");
        }
        const itemId = mongoose.Types.ObjectId(commission.itemId);

        const isUpdating = commission._id ? true : false;
        if (isUpdating) {
            if (commission._id && objectSize(commission._id) < 12) {
                throw new BadRequestError("VALIDATION-Invalid Commission ID");
            }

            if (commission.chargeType && !(["flat", "percentage"].includes(commission.chargeType.trim().toLowerCase()))) {
                throw new BadRequestError("VALIDATION-invalid Charge Type");
            }

            if (commission.charge && parseFloat(commission.charge) <= 0) {
                throw new BadRequestError("VALIDATION-Invalid Charge");
            }

            commission = objectMinusKeys(commission, ['_id', 'itemId', 'itemType', 'createdAt', 'updatedAt']);
            existingCommission = await Commission.findOne({ _id: commissionId });
        } else {
            if (!commission.itemType || !(["trailer", "upsellitem"].includes(commission.itemType.trim().toLowerCase()))) {
                throw new BadRequestError("VALIDATION-Invalid Trailer or Upsell Item ID");
            }

            if (!commission.chargeType || !(["flat", "percentage"].includes(commission.chargeType.trim().toLowerCase()))) {
                throw new BadRequestError("VALIDATION-Invalid Charge Type");
            }

            if (!commission.charge || parseFloat(commission.charge) <= 0) {
                throw new BadRequestError("VALIDATION-Invalid Charge");
            }
        }
        const commissionId = commission._id ? mongoose.Types.ObjectId(commission._id) : undefined;

        if (isUpdating) {
            await Commission.updateOne({ _id: commissionId }, commission);
            commission = await Commission.findOne({ _id: commissionId });
        } else {
            commission = new Commission(commission);
            commission = await commission.save();
        }
        commission = commission._doc;

        res.status(200).send({
            success: true,
            message: "Successfully saved Commission record",
            commissionObj: commission
        });
}

module.exports = saveCommision;