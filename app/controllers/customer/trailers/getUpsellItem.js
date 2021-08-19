const mongoose = require('mongoose');
const validator = require('validator');

const UpsellItem = require('../../../models/upsellItems');
const TrailerRating = require('../../../models/trailerRatings');
const UpsellItemType = require('../../../models/upsellItemTypes');

const objectSize = require('../../../helpers/objectSize');

const rentalChargesData = require('../../../../test/testData/rentalChargesData');
const { BadRequestError } = require('./../../../helpers/errors');

/**
 * 
 * @api {GET} /upsellitem Get Upsell Item Details
 * @apiName CA - Get Upsell Item Details
 * @apiGroup Customer App - Trailer
 * 
 * 
 * @apiHeader {String} authorization Authorization token sent as a response to signIn request
 * 
 * 
 * @apiParam {String} id Upsell Item Id
 * 
 * 
 * @apiDescription API Endpoint GET /upsellitem
 * 
 * 
 * @apiSuccess {Boolean} success Success Status
 * @apiSuccess {String} message Success Message
 * @apiSuccess {Object} upsellItemObj Upsell Item object
 * 
 * 
 * @apiSuccessExample {String} - Success-Response:
 * HTTP/1.1 200 
 * 
    {
        success: true,
        message: "Success",
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
            photos: ["{HOST}/file/upsellitem/:trailerId/:photoIndex"],
            rating: '0/5'
        }
    }
 * 
 * @apiErrorExample {json} Error-Response:
 * HTTP/1.1 400
    {
        success: false,
        message: "Could not fetch Upsell Item data",
        errorsList: []
    }
 * 
 * 
 */
async function getUpsellItemDetails(req, res, next) {
    let upsellItemId = req.query ? req.query.id : undefined;
    if(!upsellItemId || validator.isEmpty(upsellItemId)) {
        throw new BadRequestError("Upsell Item ID is undefined");
    } else if(objectSize(upsellItemId) < 12) {
        throw new BadRequestError("Upsell Item ID is invalid");
    }
    upsellItemId = mongoose.Types.ObjectId(upsellItemId);

    let upsellItem = await UpsellItem.findOne({ _id: upsellItemId }).lean();

    if(upsellItem) {
        // upsellItem = upsellItem._doc;

        if(upsellItem.adminRentalItemId) {
            let rentalItemAdminObj = await UpsellItemType.findOne({ _id: upsellItem.adminRentalItemId }, { rentalCharges: 1 });
            upsellItem.rentalCharges = rentalItemAdminObj._doc.rentalCharges;
        } else if(!upsellItem.rentalCharges) {
            upsellItem.rentalCharges = JSON.parse(JSON.stringify(rentalChargesData));
        }

        delete upsellItem.rentalCharges;
    
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
            message: "Success",
            upsellItemObj: upsellItem
        });
    } else {
        throw new BadRequestError("VALIDATION-Upsell Item is not found");
    }
}

module.exports = getUpsellItemDetails;