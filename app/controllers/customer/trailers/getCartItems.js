const mongoose = require('mongoose');
const moment = require('moment');

const Invoice = require('../../../models/invoices');
const Trailer = require('../../../models/trailers');
const UpsellItem = require('../../../models/upsellItems');

const asyncForEach = require('../../../helpers/asyncForEach');
const constants = require('../../../helpers/constants');

const { UnauthorizedError } = require('./../../../helpers/errors');

/**
 * 
 * @api {GET} /rentals Get Trailer or Upsell Item Rental or Upsell Item Buy data
 * @apiName CA - Get Trailer or Upsell Item Rental or Upsell Item Buy data
 * @apiGroup Customer App - Trailer Rental
 * 
 * 
 * @apiHeader {String} authorization Authorization Token sent as a response to signIn request
 * 
 * 
 * @apiParam {String} count Count of Rentals data to fetch
 * @apiParam {String} skip Number of Rentals data to skip
 * @apiParam {Boolean} upcoming Do fetch Upcoming data or Past Data
 * @apiParam {String} itemId Trailer ID or Upsell Item ID
 * 
 * 
 * @apiDescription API Endpoint GET /rentals data
 * 
 * 
 * @apiSuccess {Boolean} success Success Status
 * @apiSuccess {String} message Success Message
 * @apiSuccess {Array} rentalsList Array of Rental Objects
 * 
 * 
 * @apiSuccessExample {String} - Success-Response:
 * HTTP/1.1 200
    {
        success: true,
        message: "Success",
        rentalsList: []
    }
 * 
 * Sample API Call : http://localhost:5000/rentals?count=5&skip=0
 * 
 * @apiErrorExample {json} Error-Response:
 * HTTP/1.1 400
    {
        success: false,
        message: "Could not fetch Invoices List",
        errorsList: []
    }
 * 
 * 
 */
async function getCartItems(req, res, next) {

    if (!req.userId) throw new UnauthorizedError('UnAuthorized Access');
    
    const searchCondition = {};
    const pageCount = (req.query && req.query.count) ? parseInt(req.query.count) : constants.pageCount;
    const pageSkip = (req.query && req.query.skip) ? parseInt(req.query.skip) : constants.pageSkip;
    const isUpcoming = (req.query && req.query.upcoming) ? (req.query.upcoming === 'true') : true;
    const itemId = (req.query && req.query.itemId) ? mongoose.Types.ObjectId(req.query.itemId) : undefined;

    const currentDate = moment().toISOString();

    // searchCondition['transactionType'] = 'rent';
    searchCondition['bookedByUserId'] = req.userId;
    if (isUpcoming) {
        searchCondition['rentalPeriod.start'] = { $gt: currentDate };
    } else {
        searchCondition['rentalPeriod.end'] = { $lte: currentDate };
    }

    if(itemId) {
        searchCondition['rentedItem.itemId'] = itemId;
    }

    let trailerRentals = await Invoice.find(searchCondition, rentalProj).skip(pageSkip).limit(pageCount).lean();

    await asyncForEach(trailerRentals, async(trailerRental, trailerRentalIndex) => {
        // trailerRental = trailerRental._doc;

        trailerRental.invoiceId = trailerRental._id;

        if(trailerRental.pickUpLocation) {
            trailerRental.pickUpLocation = {
                text: trailerRental.pickUpLocation ? trailerRental.pickUpLocation.text : "",
                pincode: trailerRental.pickUpLocation ? trailerRental.pickUpLocation.pincode : "",
                coordinates: (trailerRental.pickUpLocation && trailerRental.pickUpLocation.location) ? trailerRental.pickUpLocation.location.coordinates : undefined
            };

            trailerRental.pickUpLocation.coordinates = [trailerRental.pickUpLocation.coordinates[1], trailerRental.pickUpLocation.coordinates[0]];
        }

        if(trailerRental.dropOffLocation) {
            trailerRental.dropOffLocation = {
                text: trailerRental.dropOffLocation ? trailerRental.dropOffLocation.text : "",
                pincode: trailerRental.dropOffLocation ? trailerRental.dropOffLocation.pincode : "",
                coordinates: (trailerRental.dropOffLocation && trailerRental.dropOffLocation.location) ? trailerRental.dropOffLocation.location.coordinates : undefined
            };

            trailerRental.dropOffLocation.coordinates = [trailerRental.dropOffLocation.coordinates[1], trailerRental.dropOffLocation.coordinates[0]];
        }

        if(trailerRental.rentedItems && trailerRental.rentedItems.length > 0) {
            await asyncForEach(trailerRental.rentedItems, async(rentedItem, rentedItemIndex) => {
                // rentedItem = rentedItem._doc;

                delete rentedItem.rentalCharges;

                let rentedItemObj;

                if (rentedItem.itemType === "trailer") {
                    rentedItemObj = await Trailer.findOne({ _id: rentedItem.itemId }, { name: 1, type: 1, licenseeId: 1, adminRentalItemId: 1 });
                } else if (rentedItem.itemType === "upsellitem") {
                    rentedItemObj= await UpsellItem.findOne({ _id: rentedItem.itemId }, { name: 1, type: 1, licenseeId: 1, adminRentalItemId: 1 });
                }

                if(rentedItemObj) {
                    trailerRental.rentedItems[rentedItemIndex] = {
                        ...rentedItem,
                        rentedItemType: rentedItemObj.type,
                        adminRentalItemId: rentedItemObj.adminRentalItemId,
                        itemName: rentedItemObj.name,
                        itemPhoto: !!rentedItemObj.photos ? rentedItemObj.photos[0] : null
                    };
                }
            });
        }

        if(trailerRental.revisions) {
            trailerRental.revisions.forEach((revision, revisionIndex) => {
                // revision = revision._doc;

                revision.revisionId = revision._id;
                revision.start = moment(revision.start).format("YYYY-MM-DD hh:mm A");
                revision.end = moment(revision.end).format("YYYY-MM-DD hh:mm A");

                delete revision._id;

                trailerRental.revisions[revisionIndex] = revision;
            });
        }

        trailerRental.rentalPeriod.start = moment(trailerRental.rentalPeriod.start).format("YYYY-MM-DD hh:mm A");
        trailerRental.rentalPeriod.end = moment(trailerRental.rentalPeriod.end).format("YYYY-MM-DD hh:mm A");

        trailerRental.driverLicenseScan = trailerRental.driverLicenseScan ? trailerRental.driverLicenseScan.data : null;

        trailerRentals[trailerRentalIndex] = trailerRental;
    });

    return res.status(200).send({
        success: true,
        message: "Success",
        rentalsList: trailerRentals
    });
}

module.exports = getCartItems;