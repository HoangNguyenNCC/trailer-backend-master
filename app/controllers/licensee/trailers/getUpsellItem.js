const mongoose = require('mongoose');
const validator = require('validator');

const UpsellItem = require('../../../models/upsellItems');
const TrailerRating = require('../../../models/trailerRatings');
const UpsellItemType = require('../../../models/upsellItemTypes');

const aclSettings = require('../../../helpers/getAccessControlList');
const objectSize = require('../../../helpers/objectSize');
const rentalChargesConv = require('../../../helpers/rentalChargesConv');

const rentalChargesData = require('../../../../test/testData/rentalChargesData');
const {
    BadRequestError,
    ForbiddenError,
    NotFoundError,
    UnauthorizedError,
    ApiError
  } = require("./../../../helpers/errors");

/**
 * 
 * @api {GET} /licensee/upsellitem Get Upsell Item Details
 * @apiName LA - Get Upsell Item Details
 * @apiGroup Licensee App - Trailer
 * 
 * 
 * @apiHeader {String} authorization Authorization token sent as a response to signIn reque
 * 
 * 
 * @apiParam {String} id Upsell Item Id
 * 
 * @apiDescription API Endpoint GET /licensee/upsellItem
 * 
 * 
 * @apiSuccess {Boolean} success Success Status
 * @apiSuccess {String} message Success Message
 * @apiSuccess {Array} upsellItemObj Upsell Item details
 * 
 * 
 * @apiSuccessExample {String} - Success-Response:
 * HTTP/1.1 200 
 * 
    {
        success: true,
        message: "Successfully fetched Upsell Item data",
        upsellItemObj: {
            availability: true,
            _id: '5e4fd5f6286df95cfbea5b09',
            name: "Trailers 2000 6 x 4' Universal Tonneau Cover",
            description: 'Universal tonneau covers are tough and made to suit most standard size 6 x 4 box trailers.This easy to fit cover is ideal for protecting against dust and water, the kit contains the cover, bow and buttons for securing the cover to the trailer',
            rentalCharges: {
                "pickUp": [
                    {
                        "duration": 21600000,
                        "charges": 54
                    },
                    {
                        "duration": 1,
                        "charges": 5
                    }
                ],
                "door2Door": [
                    {
                        "duration": 21600000,
                        "charges": 65
                    },
                    {
                        "duration": 1,
                        "charges": 6
                    }
                ]
            }
            trailerId: '5e4fd5f6286df95cfbea5b07',
            photos: ["{HOST}/file/upsellItem/:trailerId/:photoIndex"],
            rating: '0/5'
        }
    }
 * 
 * 
 * @apiErrorExample {json} Error-Response:
 * HTTP/1.1 400
    {
        success: false,
        message: "Error occurred while fetching Upsell Item data",
        errorsList: []
    }
 * 
 * 
 */
async function getUpsellItemDetails(req, res, next) {
    if (!req.requestFrom || !aclSettings.validateACL(req.requestFrom.acl, "UPSELL", "VIEW") || !req.requestFrom.licenseeId) {
            throw new ForbiddenError('Unauthorised Access')
        }

        let upsellItemId = req.query ? req.query.id : undefined;
        if (!upsellItemId || validator.isEmpty(upsellItemId)) {
            throw new BadRequestError("VALIDATION-Upsell Item ID is undefined");
        } else if (objectSize(upsellItemId) < 12) {
            throw new BadRequestError("VALIDATION-Upsell Item ID is invalid");
        }
        upsellItemId = mongoose.Types.ObjectId(upsellItemId);
        const licenseeId = mongoose.Types.ObjectId(req.requestFrom.licenseeId);

        // let upsellItem = await UpsellItem.findOne({ _id: upsellItemId, licenseeId: licenseeId });

        // const upsellitems = await UpsellItem.aggregate([
        //     { $match: { _id: upsellItemId, licenseeId: licenseeId } },
        //     { $project: projectionObj }
        // ]).exec();
        // let upsellItem = (upsellitems && upsellitems.length > 0) ? upsellitems[0] : undefined;

        let upsellItem = await UpsellItem.findOne({_id: upsellItemId, licenseeId }).lean();
        if (upsellItem) {
            // upsellItem = upsellItem._doc;

            if(upsellItem.adminRentalItemId) {
                let rentalItemAdminObj = await UpsellItemType.findOne({ _id: upsellItem.adminRentalItemId }, { rentalCharges: 1 });
                upsellItem.rentalCharges = rentalItemAdminObj._doc.rentalCharges;
            } else if(!upsellItem.rentalCharges) {
                upsellItem.rentalCharges = JSON.parse(JSON.stringify(rentalChargesData));
            }

            if(upsellItem.rentalCharges) {
                if(upsellItem.rentalCharges.pickUp) {
                    upsellItem.rentalCharges.pickUp = upsellItem.rentalCharges.pickUp.map(charge => {
                        return {
                            duration: rentalChargesConv.getDurationForCalculation(charge.duration),
                            charges: charge.charges
                        };
                    });
                }

                if(upsellItem.rentalCharges.door2Door) {
                    upsellItem.rentalCharges.door2Door = upsellItem.rentalCharges.door2Door.map(charge => {
                        return {
                            duration: rentalChargesConv.getDurationForCalculation(charge.duration),
                            charges: charge.charges
                        };
                    });
                }
            }

            const averageRating = await TrailerRating.aggregate(
                [
                    { $match: { itemId: upsellItemId } },
                    { $group: { _id: "$itemId", avgRatingValue: { $avg: "$ratingValue" } } }
                ]
            ).exec();
            const ratingValue = (averageRating.length < 1) ? 0 : averageRating[0].avgRatingValue;
            upsellItem.rating = ratingValue;

            return res.status(200).send({
                success: true,
                message: "Successfully fetched Upsell Item data",
                upsellItemObj: upsellItem
            });
        } else {
            throw new NotFoundError("VALIDATION-Upsell Item is not found");
        }

}

module.exports = getUpsellItemDetails;