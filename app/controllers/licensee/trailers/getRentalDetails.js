const mongoose = require('mongoose');
const validator = require('validator');
const moment = require('moment');

const Invoice = require('../../../models/invoices');
const Trailer = require('../../../models/trailers');
const UpsellItem = require('../../../models/upsellItems');
const User = require('../../../models/users');

const objectSize = require('../../../helpers/objectSize');
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
 * @api {GET} /rental/details Get Trailer or Upsell Item Rental or Upsell Item Buy data
 * @apiName LA - Get Trailer or Upsell Item Rental or Upsell Item Buy data
 * @apiGroup Licensee App - Trailer Rental
 * 
 * 
 * @apiParam {String} id ID of the Rental Data to fetch
 * 
 * 
 * @apiDescription API Endpoint GET /rental/details data
 * 
 * 
 * @apiSuccess {Boolean} success Success Status
 * @apiSuccess {String} message Success Message
 * @apiSuccess {Array} rentalObj Rental Details object
 * 
 * 
 * @apiSuccessExample {String} - Success-Response:
 * HTTP/1.1 200
    {
        success: true,
        message: "Success",
        rentalObj: {}
    }
 * 
 * Sample API Call : http://localhost:5000/rentals?id=122hgd3232gdh
 * 
 * @apiErrorExample {json} Error-Response:
 * HTTP/1.1 400
    {
        success: false,
        message: "Could not fetch Invoice Details",
        errorsList: []
    }
 * 
 * 
 */
async function getInvoice(req, res, next) {
    if (!req.requestFrom || !req.requestFrom.licenseeId) {
            throw new ForbiddenError('Unauthorised Access')
        }

        let rentalId = req.query ? req.query.id : undefined;
        if (!rentalId || validator.isEmpty(rentalId)) {
            throw new BadRequestError("VALIDATION-Trailer Rental ID is undefined");
        } else if (objectSize(rentalId) < 12) {
            throw new BadRequestError("VALIDATION-Trailer Rental ID is invalid");
        }
        rentalId = mongoose.Types.ObjectId(rentalId);
        const licenseeId = (typeof req.requestFrom.licenseeId === 'string') ? mongoose.Types.ObjectId(req.requestFrom.licenseeId) : req.requestFrom.licenseeId;

        // let trailerRental = await Invoice.findOne({ _id: rentalId, licenseeId: licenseeId });
        // trailerRental = trailerRental._doc;

        const rentalProj = Invoice.getAllFieldsWithExistsFile();

        const query = [
            { $match: { _id: rentalId, licenseeId: licenseeId } },
            { $project: rentalProj }
        ];

        const trailerRentals = await Invoice.aggregate([
            { $match: { _id: rentalId, licenseeId: licenseeId } },
            { $project: rentalProj }
        ]).exec();
        let trailerRental = (trailerRentals && trailerRentals.length > 0) ? trailerRentals[0] : undefined;

        if(trailerRental) {
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

            // const userProj = User.getAllFieldsSpecified(["name", "address", "mobile", "driverLicense.accepted", "driverLicense.verified", "driverLicense.expiry", "driverLicense.state"]);
            let customerObj = await User.findOne({ _id: trailerRental.bookedByUserId });
        
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
                    userRating : customerObj.userRating,
                    driverLicense: customerObj.driverLicense._doc,
                };

                trailerRental.bookedByUser.address.coordinates = [trailerRental.bookedByUser.address.coordinates[1], trailerRental.bookedByUser.address.coordinates[0]];
            }

            if(trailerRental.rentedItems && trailerRental.rentedItems.length > 0) {
                await asyncForEach(trailerRental.rentedItems, async(rentedItem, rentedItemIndex) => {
                    delete rentedItem.rentalCharges;

                    let rentedItemObj;
                    if (rentedItem.itemType === "trailer") {
                        rentedItemObj = await Trailer.findOne({ _id: rentedItem.itemId }, { name: 1, type: 1, licenseeId: 1, adminRentalItemId: 1, photos: 1 });
                    } else if (rentedItem.itemType === "upsellitem") {
                        rentedItemObj= await UpsellItem.findOne({ _id: rentedItem.itemId }, { name: 1, type: 1, licenseeId: 1, adminRentalItemId: 1, photos: 1 });
                    }

                    rentedItem = {
                        ...rentedItem,
                        rentedItemType: rentedItemObj.type,
                        adminRentalItemId: rentedItemObj.adminRentalItemId,
                        itemName: rentedItemObj.name,
                        itemPhoto: rentedItemObj.photos[0]
                    };

                    trailerRental.rentedItems[rentedItemIndex] = rentedItem;
                });
            }

            if(trailerRental.revisions) {
                trailerRental.revisions.forEach((revision, revisionIndex) => {
                    revision.revisionId = revision._id;
                    revision.start = moment(revision.start).format("YYYY-MM-DD HH:mm");
                    revision.end = moment(revision.end).format("YYYY-MM-DD HH:mm");

                    delete revision._id;

                    trailerRental.revisions[revisionIndex] = revision;
                });
            }

            trailerRental.rentalPeriod.start = moment(trailerRental.rentalPeriod.start).format("YYYY-MM-DD HH:mm");
            trailerRental.rentalPeriod.end = moment(trailerRental.rentalPeriod.end).format("YYYY-MM-DD HH:mm");

            trailerRental.driverLicenseScan = trailerRental.driverLicenseScan || "";

            return res.status(200).send({
                success: true,
                message: "Successfully fetched Trailer Rental data",
                rentalObj: trailerRental
            });
        } else {
            return res.status(200).send({
                success: true,
                message: "Trailer Rental Data not found",
                rentalObj: null
            });
        }
}

module.exports = getInvoice;