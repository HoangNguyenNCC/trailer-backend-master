const mongoose = require('mongoose');
const moment = require('moment');

const Trailer = require('../../../models/trailers');
const TrailerType = require('../../../models/trailerTypes');
const Invoice = require('../../../models/invoices');

const aclSettings = require('../../../helpers/getAccessControlList');
const getFilePath = require('../../../helpers/getFilePath');
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
 * @api {GET} /licensee/trailers/admin Get Trailers List added by Admin
 * @apiName LA - Get Trailers List added by Admin
 * @apiGroup Licensee App - Trailer
 * 
 * 
 * @apiHeader {String} authorization Authorization token sent as a response to signIn request
 * 
 * 
 * @apiDescription API Endpoint GET /licensee/trailers/admin
 * 
 * 
 * @apiSuccess {Boolean} success Success Status
 * @apiSuccess {String} message Success Message
 * @apiSuccess {Array} trailersList List of Trailers
 * 
 * 
 * @apiSuccessExample {String} - Success-Response:
 * HTTP/1.1 200
    {
        success: true,
        message: "Success",
        trailersList: []
    }
 * 
 * @apiErrorExample {json} Error-Response:
 * HTTP/1.1 400
    {
        success: false,
        message: "Could not fetch Admin Trailer Type",
        errorsList: []
    }
 * 
 * 
 */
async function getTrailers(req, res, next) {
        if (!req.requestFrom || !aclSettings.validateACL(req.requestFrom.acl, "TRAILER", ["ADD", "UPDATE"]) || !req.requestFrom.licenseeId) {
           throw new ForbiddenError('Unauthorised Access')
        }

        const licenseeId = (typeof req.requestFrom.licenseeId === 'string') ? mongoose.Types.ObjectId(req.requestFrom.licenseeId) : req.requestFrom.licenseeId;
        const currentDate = moment().toISOString();

        const licenseeTrailers = await Trailer.find({ licenseeId: licenseeId }, { adminRentalItemId: 1,trailerModel:1 });

        const trailerIds = {};

        // let trailers = await TrailerType.find({});

        // const trailerProj = TrailerType.getAllFieldsWithExistsFile();
        // let trailers = await TrailerType.aggregate([
        //     { $project: trailerProj }
        // ]).exec();
        const trailers = await TrailerType.find().exec();
        await asyncForEach(trailers, async (trailer, trailerIndex) => {
            // trailer = trailer._doc;

            const trailerId = trailer._id.toString();

            delete trailer.rentalCharges;

            const trailersAvailability = {
                availability: {},
                ongoing: [],
                upcoming: []
            };
            
            trailerIds[trailerId] = [];
            const trailerIdsStr = [];
            licenseeTrailers.forEach((licenseeTrailer) => {
                licenseeTrailer = licenseeTrailer._doc;
                if(licenseeTrailer.adminRentalItemId && (licenseeTrailer.adminRentalItemId.toString() === trailerId)) {
                    trailerIds[trailerId].push(licenseeTrailer._id);
                    trailerIdsStr.push(licenseeTrailer._id.toString());
                    trailersAvailability.availability[licenseeTrailer._id.toString()] = true;
                }
            });
            
            let ongoingInvoices = undefined;
            let upcomingInvoices = undefined;

            if(trailerIds[trailerId].length > 0) {

                ongoingInvoices = await Invoice.find({
                    "rentedItems.itemType": "trailer",
                    "rentedItems.itemId":  { $in: trailerIdsStr },
                    // rentedItems: { itemType: "trailer", itemId: { $in: trailerIds[trailerId] } },
                    "rentalPeriod.start": { $lte: currentDate },
                    "rentalPeriod.end": { $gte: currentDate }
                }, { rentalPeriod: 1 }).sort({ "rentalPeriod.start": 1, "rentalPeriod.end": 1 });
        
                upcomingInvoices = await Invoice.find({
                    // rentedItems: { itemType: "trailer", itemId: { $in: trailerIds[trailerId] } },
                    "rentedItems.itemType": "trailer",
                    "rentedItems.itemId":  { $in: trailerIdsStr },
                    "rentalPeriod.start": { $gt: currentDate }
                }, { rentalPeriod: 1 }).sort({ "rentalPeriod.start": 1, "rentalPeriod.end": 1 }).limit(1);
            }
    
    
            if(ongoingInvoices && ongoingInvoices.length > 0) {
                ongoingInvoices.forEach((ongoingInvoice) => {
                    ongoingInvoice = ongoingInvoice._doc;
                    if(ongoingInvoice.rentedItems) {
                        ongoingInvoice.rentedItems.forEach((rentedItem) => {
                            rentedItem = rentedItem._doc;
                            if(rentedItem.itemType === "trailer" && (trailerIdsStr.includes(rentedItem.itemId.toString()))) {
                                trailersAvailability.ongoing.push({
                                    rentalItemId: rentedItem.itemId,
                                    invoiceId: ongoingInvoice._id.toString(),
                                    startDate: moment(ongoingInvoice.rentalPeriod.start).format("YYYY-MM-DD HH:MM"),
                                    endDate: moment(ongoingInvoice.rentalPeriod.end).format("YYYY-MM-DD HH:MM")
                                });

                                trailersAvailability.availability[rentedItem.itemId.toString()] = false;
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
                            if(rentedItem.itemType === "trailer" && (trailerIdsStr.includes(rentedItem.itemId.toString()))) {
                                trailersAvailability.upcoming.push({
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

            trailer.trailersAvailability = trailersAvailability;

            trailers[trailerIndex] = {
                ...trailer._doc,
                trailerModel:trailerId
            };
        });
        
        return res.status(200).send({
            success: true,
            message: "Success",
            trailersList: trailers
        });
}

module.exports = getTrailers;