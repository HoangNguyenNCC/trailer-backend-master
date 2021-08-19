const mongoose = require('mongoose');
const validator = require('validator');
const moment = require('moment');

const Invoice = require('../../../models/invoices');
const Trailer = require('../../../models/trailers');
const UpsellItem = require('../../../models/upsellItems');

const objectSize = require('../../../helpers/objectSize');
const asyncForEach = require('../../../helpers/asyncForEach');
const { UnauthorizedError, BadRequestError } = require('../../../helpers/errors');

/**
 * 
 * @api {GET} /rental Get Trailer or Upsell Item Rental or Upsell Item Buy data
 * @apiName CA - Get Trailer or Upsell Item Rental or Upsell Item Buy data
 * @apiGroup Customer App - Trailer Rental
 * 
 * 
 * @apiHeader {String} authorization Authorization Token sent as a response to signIn request
 * 
 * 
 * @apiParam {String} id ID of the Rental Data to fetch
 * 
 * 
 * @apiDescription API Endpoint GET /rental data
 * 
 * 
 * @apiSuccess {Boolean} success Success Status
 * @apiSuccess {String} message Success Message
 * @apiSuccess {Object} rentalObj Rental Object
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
 * Sample API Call : http://localhost:5000/rental?id=122hgd3232gdh
 * 
 * @apiErrorExample {json} Error-Response:
 * HTTP/1.1 400
    {
        success: false,
        message: "Could not fetch Invoice Detail",
        errorsList: []
    }
 * 
 * 
 */
async function getInvoice(req, res) {

    if (!req.userId) throw new UnauthorizedError('UnAuthorized Access');

    let rentalId = req.query ? req.query.id : undefined;
    if (!rentalId || validator.isEmpty(rentalId)) {
        throw new BadRequestError("Trailer Rental ID is undefined");
    } else if (objectSize(rentalId) < 12) {
        throw new BadRequestError("Trailer Rental ID is invalid");
    }
    rentalId = mongoose.Types.ObjectId(rentalId);

    let trailerRental = await Invoice.findOne({_id: rentalId, bookedByUserId: req.userId}).lean();

    if (!trailerRental) throw new UnauthorizedError('UnAuthorized Access');

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

            delete rentedItem.rentalCharges;

            let rentedItemObj;
            if (rentedItem.itemType === "trailer") {
                rentedItemObj = await Trailer.findOne({ _id: rentedItem.itemId });
            } else if (rentedItem.itemType === "upsellitem") {
                rentedItemObj= await UpsellItem.findOne({ _id: rentedItem.itemId });
            }

            rentedItem = {
                ...rentedItem,
                rentedItemType: rentedItemObj.type,
                adminRentalItemId: rentedItemObj.adminRentalItemId,
                itemName: rentedItemObj.name,
                itemPhoto: !!rentedItemObj.photos ? rentedItemObj.photos[0] : null
            };

            trailerRental.rentedItems[rentedItemIndex] = rentedItem;
        });
    }

    if (trailerRental.charges && trailerRental.charges.upsellCharges) {
        trailerRental.charges.upsellCharges = Object.values(trailerRental.charges.upsellCharges);
    }

    if(trailerRental.revisions) {
        trailerRental.revisions.forEach((revision, revisionIndex) => {
            revision.revisionId = revision._id;
            revision.start = moment(revision.start).format("YYYY-MM-DD hh:mm A");
            revision.end = moment(revision.end).format("YYYY-MM-DD hh:mm A");

            delete revision._id;
            if (revision.charges && revision.charges.upsellCharges) {
                revision.charges.upsellCharges = Object.values(revision.charges.upsellCharges);
            }

            trailerRental.revisions[revisionIndex] = revision;
        });
    }

    trailerRental.rentalPeriod.start = moment(trailerRental.rentalPeriod.start).format("YYYY-MM-DD hh:mm A");
    trailerRental.rentalPeriod.end = moment(trailerRental.rentalPeriod.end).format("YYYY-MM-DD hh:mm A");

    trailerRental.driverLicenseScan = trailerRental.driverLicenseScan ? trailerRental.driverLicenseScan.data: null;

    return res.status(200).send({
        success: true,
        message: "Success",
        rentalObj: trailerRental
    });

}

module.exports = getInvoice;