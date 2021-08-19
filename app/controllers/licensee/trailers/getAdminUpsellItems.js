const mongoose = require('mongoose');
const moment = require('moment');

const UpsellItem = require('../../../models/upsellItems');
const UpsellItemType = require('../../../models/upsellItemTypes');
const Invoice = require('../../../models/invoices');

const aclSettings = require('../../../helpers/getAccessControlList');
const asyncForEach = require('../../../helpers/asyncForEach');
const rentalChargesConv = require('../../../helpers/rentalChargesConv');
const {
    BadRequestError,
    ForbiddenError,
    NotFoundError,
    UnauthorizedError,
    ApiError
  } = require("./../../../helpers/errors");



/**
 * 
 * @api {GET} /licensee/upsellitems/admin Get Upsell Items List added by Admin
 * @apiName LA - Get Upsell Items List added by Admin
 * @apiGroup Licensee App - Trailer
 * 
 * 
 * @apiHeader {String} authorization Authorization token sent as a response to signIn request
 * 
 * 
 * @apiDescription API Endpoint GET /licensee/upsellitems/admin
 * 
 * 
 * @apiSuccess {Boolean} success Success Status
 * @apiSuccess {String} message Success Message
 * @apiSuccess {Array} upsellItemsList List of Upsell Items
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
async function getUpsellItems(req, res, next) {
        if (!req.requestFrom || !aclSettings.validateACL(req.requestFrom.acl, "UPSELL", ["ADD", "UPDATE"]) || !req.requestFrom.licenseeId) {
            throw new ForbiddenError('Unauthorised Error');
        }

        const licenseeId = (typeof req.requestFrom.licenseeId === 'string') ? mongoose.Types.ObjectId(req.requestFrom.licenseeId) : req.requestFrom.licenseeId;
        const currentDate = moment().toISOString();

        const licenseeUpsellItems = await UpsellItem.find({ licenseeId: licenseeId }, { adminRentalItemId: 1 });
        const upsellItemIds = {};

        // let upsellItems = await UpsellItemType.find({});

        // const upsellItemProj = UpsellItemType.getAllFieldsWithExistsFile();
        // let upsellItems = await UpsellItemType.aggregate([
        //     { $project: upsellItemProj }
        // ]).exec();
        let upsellItems = await UpsellItemType.find().exec();
        await asyncForEach(upsellItems, async (upsellItem, upsellItemIndex) => {
            // upsellItem = upsellItem._doc;

            const upsellItemId = upsellItem._id.toString();

            delete upsellItem.rentalCharges;

            const upsellItemAvailability = {
                availability: {},
                ongoing: [],
                upcoming: []
            };

            upsellItemIds[upsellItemId] = [];
            const upsellItemIdsStr = [];
            licenseeUpsellItems.forEach((licenseeUpsellItem) => {
                licenseeUpsellItem = licenseeUpsellItem._doc;
                if(licenseeUpsellItem.adminRentalItemId && (licenseeUpsellItem.adminRentalItemId.toString() === upsellItemId)) {
                    upsellItemIds[upsellItemId].push(licenseeUpsellItem._id);
                    upsellItemIdsStr.push(licenseeUpsellItem._id.toString());
                    upsellItemAvailability.availability[licenseeUpsellItem._id.toString()] = true;
                }
            });

            let ongoingInvoices = undefined;
            let upcomingInvoices = undefined;

            if(upsellItemIds[upsellItemId].length > 0) {

                ongoingInvoices = await Invoice.find({
                    "rentedItems.itemType": "upsellitem",
                    "rentedItems.itemId":  { $in: upsellItemIdsStr },
                    "rentalPeriod.start": { $lte: currentDate },
                    "rentalPeriod.end": { $gte: currentDate }
                }, { rentalPeriod: 1 }).sort({ "rentalPeriod.start": 1, "rentalPeriod.end": 1 });
        
                upcomingInvoices = await Invoice.find({
                    "rentedItems.itemType": "upsellitem",
                    "rentedItems.itemId":  { $in: upsellItemIdsStr },
                    "rentalPeriod.start": { $gt: currentDate }
                }, { rentalPeriod: 1 }).sort({ "rentalPeriod.start": 1, "rentalPeriod.end": 1 }).limit(1);
            }
        
            if(ongoingInvoices && ongoingInvoices.length > 0) {
                ongoingInvoices.forEach((ongoingInvoice) => {
                    ongoingInvoice = ongoingInvoice._doc;
                    if(ongoingInvoice.rentedItems) {
                        ongoingInvoice.rentedItems.forEach((rentedItem) => {
                            rentedItem = rentedItem._doc;
                            if(rentedItem.itemType === "upsellitem" && (upsellItemIdsStr.includes(rentedItem.itemId.toString()))) {
                                upsellItemAvailability.ongoing.push({
                                    rentalItemId: rentedItem.itemId,
                                    invoiceId: ongoingInvoice._id.toString(),
                                    startDate: moment(ongoingInvoice.rentalPeriod.start).format("YYYY-MM-DD HH:MM"),
                                    endDate: moment(ongoingInvoice.rentalPeriod.end).format("YYYY-MM-DD HH:MM")
                                });

                                upsellItemAvailability.availability[rentedItem.itemId.toString()] = false;
                            }
                        });
                    }
                });
            }

            if(upcomingInvoices && upcomingInvoices.length > 0) {
                upcomingInvoices.forEach((upcomingInvoice) => {
                    upcomingInvoice = upcomingInvoice._doc;
                    if(upcomingInvoice.rentedItems) {
                        upcomingInvoice.rentedItems.forEach((rentedItem) => {
                            rentedItem = rentedItem._doc;
                            if(rentedItem.itemType === "upsellitem" && (upsellItemIdsStr.includes(rentedItem.itemId.toString()))) {
                                upsellItemAvailability.upcoming.push({
                                    rentalItemId: rentedItem.itemId,
                                    invoiceId: upcomingInvoice._id.toString(),
                                    startDate: moment(upcomingInvoice.rentalPeriod.start).format("YYYY-MM-DD HH:MM"),
                                    endDate: moment(upcomingInvoice.rentalPeriod.end).format("YYYY-MM-DD HH:MM")
                                });
                            }
                        });
                    }
                });
            }

            upsellItem.upsellItemAvailability = upsellItemAvailability;

            upsellItems[upsellItemIndex] = upsellItem;
        });

        return res.status(200).send({
            success: true,
            message: "Success",
            upsellItemsList: upsellItems
        });
}

module.exports = getUpsellItems;