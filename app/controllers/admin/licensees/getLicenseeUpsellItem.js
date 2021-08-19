const mongoose = require('mongoose');
const validator = require('validator');

const UpsellItem = require('../../../models/upsellItems');
const TrailerRating = require('../../../models/trailerRatings');
const UpsellItemType = require('../../../models/upsellItemTypes');

const objectSize = require('../../../helpers/objectSize');
const rentalChargesConv = require('../../../helpers/rentalChargesConv');

const rentalChargesData = require('../../../../test/testData/rentalChargesData');
const { BadRequestError } = require('../../../helpers/errors');


const getLicenseeUpsellItem = async function(req,res){
    if (!req.requestFrom || !req.requestFrom.employeeId) {
            throw new BadRequestError('Unauthorised Access');
        }

        let upsellItemId = req.query ? req.query.id : undefined;
        if (!upsellItemId || validator.isEmpty(upsellItemId)) {
            throw new BadRequestError("VALIDATION-Upsell Item ID is undefined");
        } else if (objectSize(upsellItemId) < 12) {
            throw new BadRequestError("VALIDATION-Upsell Item ID is invalid");
        }
        upsellItemId = mongoose.Types.ObjectId(upsellItemId);
        const licenseeId = mongoose.Types.ObjectId(req.query.licenseeId);

        // let upsellItem = await UpsellItem.findOne({ _id: upsellItemId, licenseeId: licenseeId });

        // const projectionObj = UpsellItem.getAllFieldsWithExistsFile();
        // const upsellitems = await UpsellItem.aggregate([
        //     { $match: { _id: upsellItemId, licenseeId: licenseeId } },
        // ]).exec();
        let upsellItem = await UpsellItem.findOne({_id: upsellItemId, licenseeId}).lean();
        // let upsellItem = (upsellitems && upsellitems.length > 0) ? upsellitems[0] : undefined;

        if (upsellItem) {
            // upsellItem = upsellItem._doc;

            if(upsellItem.adminRentalItemId) {
                let rentalItemAdminObj = await UpsellItemType.findOne({ _id: upsellItem.adminRentalItemId }, { rentalCharges: 1 });
                upsellItem.rentalCharges = rentalItemAdminObj._doc.rentalCharges;
            } else if(!upsellItem.rentalCharges) {
                upsellItem.rentalCharges = JSON.parse(JSON.stringify(rentalChargesData));
            }

            // if(upsellItem.rentalCharges) {
            //     if(upsellItem.rentalCharges.pickUp) {
            //         upsellItem.rentalCharges.pickUp = upsellItem.rentalCharges.pickUp.map(charge => {
            //             return {
            //                 duration: rentalChargesConv.getDurationForCalculation(charge.duration), 
            //                 charges: charge.charges
            //             };
            //         });
            //     }

            //     if(upsellItem.rentalCharges.door2Door) {
            //         upsellItem.rentalCharges.door2Door = upsellItem.rentalCharges.door2Door.map(charge => {
            //             return {
            //                 duration: rentalChargesConv.getDurationForCalculation(charge.duration),
            //                 charges: charge.charges
            //             };
            //         });
            //     }
            // }

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
            throw new BadRequestError("VALIDATION-Upsell Item is not found");
        }
    
}

module.exports = getLicenseeUpsellItem