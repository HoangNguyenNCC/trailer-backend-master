const mongoose = require('mongoose');
const moment = require('moment');
const validator = require('validator');

const User = require('../../../models/users');
const Trailer = require('../../../models/trailers');
const UpsellItem = require('../../../models/upsellItems');
const Licensee = require('../../../models/licensees');
const Invoice = require('../../../models/invoices');

const objectSize = require('../../../helpers/objectSize');
const objectMinusKeys = require('../../../helpers/objectMinusKeys');
const asyncForEach = require('../../../helpers/asyncForEach');
const constants = require('../../../helpers/constants');
const { ForbiddenError , BadRequestError } = require('../../../helpers/errors');

/**
 * 
 * @api {GET} /rental/requests Get Trailer or Upsell Item Rental or Upsell Item Buy Request data
 * @apiName LA - Get Trailer or Upsell Item Rental or Upsell Item Buy Request data
 * @apiGroup Licensee App - Trailer Rental
 * 
 * 
 * @apiHeader {String} authorization Authorization Token sent as a response to signIn request
 * 
 * 
 * @apiParam {String} count Count of Rentals data to fetch
 * @apiParam {String} skip Number of Rentals data to skip
 * @apiParam {Boolean} upcoming Do fetch Upcoming data or Past data
 * @apiParam {String} type Type of Rental Request - "rental", "extension", "reschedule"
 * @apiParam {Number} approved Fetch Results based on Aproval Status ( 0 : pending, 1: approved, 2: rejected )
 * @apiParam {String} itemId Trailer ID or Upsell Item ID
 * 
 * @apiDescription Get Trailer or Upsell Item Rental or Upsell Item Buy Requests
 * 
 * 
 * @apiSuccess {Boolean} success Success Status
 * @apiSuccess {String} message Success Message
 * @apiSuccess {Array} requestList List of Rental Requests
 * 
 * 
 * @apiSuccessExample {String} - Success-Response:
 * HTTP/1.1 200
    {
        success: true,
        message: "Success",
        requestList: []
 * 
 * Sample API Call : http://localhost:5000/rentals?count=5&skip=0
 * 
 * 
 * @apiErrorExample {json} Error-Response:
 * 
    HTTP/1.1 400
    {
        success: false,
        message: "Error occurred while fetching Rental Requests",
        errorsList: ["Error occurred while fetching Rental Requests"]
    }

    HTTP/1.1 400
    {
        success: false,
        message: "Missing Licensee ID"
    }
 * 
 * 
 */
async function getRentalRequests(req, res, next) {
    if (!req.requestFrom || !req.requestFrom.licenseeId) {
            throw new ForbiddenError('Unauthorised Access')
        }

        const todayStartDate = moment().startOf("day");
        const todayEndDate = moment().endOf("day");

        const searchCondition = {};
        const pageCount = (req.query && req.query.count) ? parseInt(req.query.count) : constants.pageCount;
        const pageSkip = (req.query && req.query.skip) ? parseInt(req.query.skip) : constants.pageSkip;
        const isUpcoming = (req.query && req.query.upcoming) ? (req.query.upcoming === "true") : true;
        const queryType = (req.query && req.query.type) ? req.query.type : undefined;
        const isApproved = (req.query && req.query.approved) ? parseInt(req.query.approved) : undefined;
        const licenseeId = (typeof req.requestFrom.licenseeId === "string") ? mongoose.Types.ObjectId(req.requestFrom.licenseeId) : req.requestFrom.licenseeId;
        const itemId = (req.query && req.query.itemId) ? mongoose.Types.ObjectId(req.query.itemId) : undefined;

        if (!licenseeId) {
            throw new BadRequestError("VALIDATION-Missing Licensee ID");
        }

        const currentDate = moment().toISOString();

        searchCondition["licenseeId"] = licenseeId;
        // searchCondition["transactionType"] = "rent";
        // searchCondition["rentalPeriod.start"] = { $gt: currentDate };
        if (isUpcoming) {
            searchCondition["revisions.start"] = { $gt: currentDate };
        } else {
            searchCondition["revisions.end"] = { $lte: currentDate };
        }

        if(isApproved) {
            searchCondition["revisions.isApproved"] = isApproved;
        }

        /* if(itemId) {
            searchCondition['rentedItemId'] = itemId;
        } */

        // let rentalProj = Invoice.getAllFieldsExceptFile();
        let trailerRentals = await Invoice.find(searchCondition).sort({updatedAt: 'desc'}).skip(pageSkip).limit(pageCount);

        let requestList = [];
        let todaysDropOffsList = [];
        let todaysPickupsList = [];

        let licensee = await Licensee.findOne({ _id: licenseeId }, { name: 1, address: 1 });
        licensee = licensee._doc;

        const licenseeName = licensee.name;
        const licenseeAddress = {
            text: licensee.address ? licensee.address.text : "",
            pincode: licensee.address ? licensee.address.pincode : "",
            coordinates: (licensee.address && licensee.address.location) ? licensee.address.location._doc.coordinates : undefined
        };
        licenseeAddress.coordinates = [licenseeAddress.coordinates[1], licenseeAddress.coordinates[0]];

        await asyncForEach(trailerRentals, async(rental) => {
            rental = rental._doc;

            const rentalItemsList = {};
            const customersList = {};

            await asyncForEach(rental.rentedItems, async(rentedItem) => {
                rentedItem = rentedItem._doc;
                const rentedItemIdStr = rentedItem.itemId.toString();
                if (!Object.keys(rentalItemsList).includes(rentedItemIdStr)) {
                    let rentedItemObj;
                    if (rentedItem.itemType === "trailer") {
                        rentedItemObj = await Trailer.findOne({ _id: rentedItem.itemId }, { name: 1, photos: 1 });
                    } else if (rentedItem.itemType === "upsellitem") {
                        rentedItemObj = await UpsellItem.findOne({ _id: rentedItem.itemId }, { name: 1, photos: 1 });
                    }
                    console.log({photos: rentedItemObj.photos});
                    rentalItemsList[rentedItemIdStr] = {
                        ...rentedItem,
                        name: rentedItemObj.name,
                        itemId: rentedItem.itemId.toString(),
                        itemType: rentedItem.itemType,
                        photo: rentedItemObj.photos[0] || {}
                    };
                }
            });

            const customerIdStr = rental.bookedByUserId.toString();
            if (!Object.keys(customersList).includes(customerIdStr)) {
                customerObj = await User.findOne({ _id: rental.bookedByUserId }, { name: 1, address: 1 });
                customersList[customerIdStr] = {
                    ...customerObj,
                    name: customerObj.name,
                    address: {
                        text: customerObj.address ? customerObj.address.text : "",
                        pincode: customerObj.address ? customerObj.address.pincode : "",
                        coordinates: (customerObj.address && customerObj.address.location) ? customerObj.address.location.coordinates : undefined
                    }
                };

                customersList[customerIdStr].address.coordinates = [customersList[customerIdStr].address.coordinates[1], customersList[customerIdStr].address.coordinates[0]];
            }

            const rentalData = {
                rentalId: rental._id,
                invoiceNumber: rental.invoiceNumber,
                invoiceReference: rental.invoiceReference,

                deliveryType: rental.isPickUp ? "pickup" : "door2Door",

                total: rental.total,
                totalCharges: rental.totalCharges,
                
                rentalPeriodStart: rental.rentalPeriod.start,
                rentalPeriodEnd: rental.rentalPeriod.end,

                rentedItems: Object.values(rentalItemsList),

                licenseeId: licenseeId,
                licenseeName: licenseeName,
                licenseeAddress: licenseeAddress,

                customerId: customerIdStr,
                customerName: customersList[customerIdStr].name,
                customerPhoto: customersList[customerIdStr].photo,
                customerAddress: customersList[customerIdStr].address
            };

            if(!rental.revisions || rental.revisions.length === 0) {
                rental.revisions = [
                    {
                        revisionType: "rental",
    
                        start: rental.rentalPeriod.start,
                        end: rental.rentalPeriod.end,
        
                        requestOn: rental.createdAt,
                        requestUpdatedOn: rental.createdAt,
        
                        totalCharges: rental.totalCharges,

                        isApproved: rental.isApproved,
                        approvedOn: rental.updatedAt
                    }
                ];

                await Invoice.updateOne({ _id: rental._id }, { revisions: rental.revisions });
            }

            const latestRevision = 
                !!(rental.revisions && rental.revisions[rental.revisions.length - 1] && rental.revisions[rental.revisions.length - 1]._doc) ?
                    rental.revisions[rental.revisions.length - 1]._doc : null;

            if (latestRevision) {
                const rentalStart = moment(latestRevision.start);
                const rentalEnd = moment(latestRevision.end);

                const request = {
                    ...rentalData,
                    requestType: latestRevision.revisionType,
                    isApproved: latestRevision.isApproved,
                    approvedOn: latestRevision.approvedOn,
                    rentalPeriodStart: moment(rentalStart).format('YYYY-MM-DD HH:mm'),
                    rentalPeriodEnd: moment(rentalEnd).format('YYYY-MM-DD HH:mm'),
                    total: !!latestRevision.totalCharges ? latestRevision.totalCharges.total : 0,
                    totalCharges: latestRevision.totalCharges,
                    todayDropOff: false,
                    todayPickup: false,
                };
                console.log(request.rentedItems);
  
                if (rentalStart.isAfter(todayStartDate) && rentalStart.isBefore(todayEndDate)) {
                    if (latestRevision.isApproved) {
                        request.todayDropOff = true;
                    } else {
                        request.todayDropOff = true;
                    }
                } else if(rentalEnd.isAfter(todayStartDate) && rentalEnd.isBefore(todayEndDate) && latestRevision.isApproved === 1) {
                    request.todayPickup = true;
                }

                requestList.push(request);
            } 
        });

        return res.status(200).send({
            success: true,
            message: "Success",
            requestList: requestList
        });
}

module.exports = getRentalRequests;
