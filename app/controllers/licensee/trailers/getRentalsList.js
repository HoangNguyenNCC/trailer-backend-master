const mongoose = require('mongoose');
const moment = require('moment');

const Invoice = require('../../../models/invoices');
const Trailer = require('../../../models/trailers');
const UpsellItem = require('../../../models/upsellItems');
const User = require('../../../models/users');

const asyncForEach = require('../../../helpers/asyncForEach');
const rentalChargesConv = require('../../../helpers/rentalChargesConv');
const constants = require('../../../helpers/constants');
const {
    BadRequestError,
    ForbiddenError,
    NotFoundError,
    UnauthorizedError,
    ApiError
  } = require("./../../../helpers/errors");

/**
 * 
 * @api {GET} /rentals/list Get Trailer or Upsell Item Rental or Upsell Item Buy data
 * @apiName LA - Get Trailer or Upsell Item Rental or Upsell Item Buy data
 * @apiGroup Licensee App - Trailer Rental
 * 
 * 
 * @apiParam {String} count Count of Rentals data to fetch
 * @apiParam {String} skip Number of Rentals data to skip
 * @apiParam {Boolean} upcoming Do fetch Upcoming data or Past Data
 * @apiParam {String} itemId Trailer ID or Upsell Item ID
 * 
 * 
 * @apiDescription API Endpoint GET /rentals/list data
 * 
 * 
 * @apiSuccess {Boolean} success Success Status
 * @apiSuccess {String} message Success Message
 * @apiSuccess {Array} rentalsList List of Rentals
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
    if (!req.requestFrom || !req.requestFrom.licenseeId) {
            throw new ForbiddenError('Unauthorised Error');
        }
        
        const searchCondition = {};
        const pageCount = (req.query && req.query.count) ? parseInt(req.query.count) : constants.pageCount;
        const pageSkip = (req.query && req.query.skip) ? parseInt(req.query.skip) : constants.pageSkip;
        const isUpcoming = (req.query && req.query.upcoming) ? (req.query.upcoming === 'true') : true;
        const itemId = (req.query && req.query.itemId) ? mongoose.Types.ObjectId(req.query.itemId) : undefined;

        const currentDate = moment().toISOString();

        // searchCondition['transactionType'] = 'rent';
        const licenseeId = (typeof req.requestFrom.licenseeId === 'string') ? mongoose.Types.ObjectId(req.requestFrom.licenseeId) : req.requestFrom.licenseeId;
        searchCondition['licenseeId'] = licenseeId;
        if (isUpcoming) {
            searchCondition['rentalPeriod.start'] = { $gt: currentDate };
        } else {
            searchCondition['rentalPeriod.end'] = { $lte: currentDate };
        }

        if(itemId) {
            searchCondition['rentedItems.itemId'] = itemId;
        }

        let rentalProj = Invoice.getAllFieldsExceptFile();
        let trailerRentals = await Invoice.find(searchCondition, rentalProj).skip(pageSkip).limit(pageCount);

        await asyncForEach(trailerRentals, async(trailerRental, trailerRentalIndex) => {
            trailerRental = trailerRental._doc;

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

            const userProj = User.getAllFieldsSpecified(["name", "address", "mobile", "driverLicense.accepted", "driverLicense.verified", "driverLicense.expiry", "driverLicense.state"]);
            let customerObj = await User.findOne({ _id: trailerRental.bookedByUserId }, userProj);
            if(customerObj) {
                customerObj = customerObj._doc;
            
                trailerRental.bookedByUser = {
                    name: customerObj.name,
                    mobile: customerObj.mobile,
                    photo: customerObj.photo,
                    address: {
                        text: customerObj.address ? customerObj.address.text : "",
                        pincode: customerObj.address ? customerObj.address.pincode : "",
                        coordinates: (customerObj.address && customerObj.address.location) ? customerObj.address.location._doc.coordinates : undefined
                    },
                    driverLicense: customerObj.driverLicense._doc,
                };

                trailerRental.bookedByUser.address.coordinates = [trailerRental.bookedByUser.address.coordinates[1], trailerRental.bookedByUser.address.coordinates[0]];
            }

            if(trailerRental.rentedItems && trailerRental.rentedItems.length > 0) {
                await asyncForEach(trailerRental.rentedItems, async(rentedItem, rentedItemIndex) => {
                    rentedItem = rentedItem._doc;
                    
                    delete rentedItem.rentalCharges;
    
                    let rentedItemObj;
    
                    if(rentedItem.itemType === "trailer") {
                        rentedItemObj = await Trailer.findOne({ _id: rentedItem.itemId }, { name: 1, type: 1, licenseeId: 1, adminRentalItemId: 1 });
                    } else if(rentedItem.itemType === "upsellitem") {
                        rentedItemObj= await UpsellItem.findOne({ _id: rentedItem.itemId }, { name: 1, type: 1, licenseeId: 1, adminRentalItemId: 1 });
                    }

                    if(rentedItemObj) {
                        rentedItemObj = rentedItemObj._doc;

                        rentedItem = {
                            ...rentedItem,
                            rentedItemType: rentedItemObj.type,
                            adminRentalItemId: rentedItemObj.adminRentalItemId,
                            itemName: rentedItemObj.name,
                        };
                    }

                    trailerRental.rentedItems[rentedItemIndex] = rentedItem;
                });
            }

            trailerRentals[trailerRentalIndex] = trailerRental;
        });

        return res.status(200).send({
            success: true,
            message: "Success",
            rentalsList: trailerRentals
        });
}

module.exports = getCartItems;