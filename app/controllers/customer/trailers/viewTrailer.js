const mongoose = require('mongoose');
const validator = require('validator');
const moment = require('moment');

const Trailer = require('../../../models/trailers');
const UpsellItem = require('../../../models/upsellItems');
const TrailerRating = require('../../../models/trailerRatings');
const Invoice = require('../../../models/invoices');
const Licensee = require('../../../models/licensees');
const TrailerInsurance = require('../../../models/trailerInsurance');
const TrailerServicing = require('../../../models/trailerServicing');
const Employee = require('../../../models/employees');

const objectSize = require('../../../helpers/objectSize');
const asyncForEach = require('../../../helpers/asyncForEach');
const getDistance = require('../../../helpers/getDistance');
const constants = require('../../../helpers/constants');

const calculateRentalItemCharges = require('../../../helpers/calculateRentalItemCharges');
const { UnauthorizedError, BadRequestError } = require('../../../helpers/errors');
/**
 * 
 * @api {POST} /trailer/view Get Trailer View Details 
 * @apiName CA - Get Trailer View Details 
 * @apiGroup Customer App - Trailer
 * 
 * 
 * @apiHeader {String} authorization Authorization token sent as a response to signIn request
 * 
 * 
 * @apiParam {String} id Trailer Id
 * @apiParam {String} location Address of the location  [latitude, longitude]
 * @apiParam {Array} dates Range Array ["Start Date", "End Date"]
 * @apiParam {Array} times Range Array ["Start Time", "End Time"]
 * @apiParam {String} delivery Type of Delivery ( "door2door" || "pickup" ) ( default - "door2door" )
 * 
 * 
 * @apiDescription API Endpoint POST /trailer/view
 * 
 * 
 * @apiSuccess {Boolean} success Success Status
 * @apiSuccess {String} message Success Message
 * @apiSuccess {Object} trailerObj Trailer Object
 * @apiSuccess {Array} trailers List of Upsell Item Objects
 * @apiSuccess {Object} licenseeObj Licensee Object
 * 
 * 
 * @apiSuccessExample {String} - Success-Response:
 * HTTP/1.1 200 
 * 
    {
        success: true,
        message: "Success",
        trailerObj: {},
        upsellItemsList: [],
        licenseeObj: {}
    }
 * 
 * 
 * @apiErrorExample {json} Error-Response:
 * HTTP/1.1 400
    {
        success: false,
        message: "Could not fetch Trailer data",
        errorsList: []
    }
 * 
 * 
 */
async function getTrailerDetails(req, res, next) {
        if (!req.userId) throw new UnauthorizedError('UnAuthorized Access');

        const body = req.body;

        let trailerId = body ? body.id : undefined;
        if (!trailerId || validator.isEmpty(trailerId)) {
            throw new BadRequestError("Trailer ID is undefined");
        } else if (objectSize(trailerId) < 12) {
            throw new BadRequestError("Trailer ID is invalid");
        }
        trailerId = mongoose.Types.ObjectId(trailerId);

        // let trailer = await Trailer.findOne({ _id: trailerId });

        // const trailerProj = Trailer.getAllFieldsWithExistsFile();
        // const trailers = await Trailer.aggregate([
        //     { $match: { _id: trailerId } },
        //     { $project: trailerProj }
        // ]).exec();
        let trailer = await Trailer.findById(trailerId);
        // let trailer = (trailers && trailers.length > 0) ? trailers[0] : undefined;

        if(trailer) {
            trailer = trailer._doc;
        
            let location = body.location;
            if (!location) {
                throw new BadRequestError("Location is invalid");
            }

            const delivery = (body && body.delivery) ? body.delivery : constants.delivery;
            let dates = body.dates;
            if(!dates || dates.length !== 2) {
                throw new BadRequestError("Dates are invalid");
            }

            let times = body.times;
            if(!times || times.length !== 2) {
                throw new BadRequestError("Times are invalid");
            }

            const startDate = moment(new Date(`${dates[0]} ${times[0]}`));
            const endDate = moment(new Date(`${dates[1]} ${times[1]}`));

            if(!startDate.isValid()) {
                throw new BadRequestError("Start DateTime is invalid");
            }

            if(!endDate.isValid()) {
                throw new BadRequestError("End DateTime is invalid");
            }

            const currentDate = moment();
            const sixMonthsDate = moment().add(6, "months");

            if(startDate.isAfter(endDate)) {
                throw new BadRequestError("Start Date should be prior to End Date");
            }

            if(startDate.isBefore(currentDate)) {
                throw new BadRequestError("You can not book for past dates");
            }

            if(startDate.isAfter(sixMonthsDate)) {
                throw new BadRequestError("You can book upto six months in advance");
            }

            //-----------------------------------------------------------------
            const averageRating = await TrailerRating.aggregate(
                [
                    { $match: { itemId: trailerId } },
                    { $group: { _id: "$itemId", avgRatingValue: { $avg: "$ratingValue" } } }
                ]
            ).exec();

            const ratingValue = (averageRating.length < 1) ? 0 : averageRating[0].avgRatingValue;
            trailer.rating = ratingValue;

            // -------------------------------------------------------------------------

            /* const price = trailer.rentalCharges.door2Door.find((charges) => {
                return (charges.duration === constants.hirePeriod);
            });
            trailer.price = `${price.charges} AUD`; */

            trailer = await calculateRentalItemCharges("trailer", trailer, delivery, startDate, endDate);

            // -------------------------------------------------------------------------
        
            /* 
            let rentals = await Invoice.find({ "rentedItems.itemId": trailerId }, { _id: 0, rentalPeriod: 1 });

            trailer.rentalsList = rentals.map((rental) => {
                return {
                    start: rental.rentalPeriod.start,
                    end: rental.rentalPeriod.end
                }
            });
            */

            // -------------------------------------------------------------------------
        
            let isInsured = false;
            let trailerInsurance = await TrailerInsurance.find({ itemType: "trailer", itemId: trailerId, "document.accepted": true, expiryDate: { $gte: (moment().toISOString()) } }).sort({ expiryDate: -1 }).limit(1);
            if(trailerInsurance && trailerInsurance[0]) {
                isInsured = true;

                trailerInsurance = trailerInsurance[0]._doc;
                trailerInsurance.documentAccepted = trailerInsurance.document.accepted;
                trailerInsurance.documentVerified = trailerInsurance.document.verified;
                trailerInsurance.document = trailerInsurance.document.data;
                trailerInsurance.issueDate = moment(trailerInsurance.issueDate).format("YYYY-MM-DD");
                trailerInsurance.expiryDate = moment(trailerInsurance.expiryDate).format("YYYY-MM-DD");
                trailer.insurance = trailerInsurance;
            }
            trailer.insured = isInsured;

            let isServiced = false;
            let trailerServicing = await TrailerServicing.find({ itemType: "trailer", itemId: trailerId, "document.accepted": true, nextDueDate: { $gte: (moment().toISOString()) } }).sort({ nextDueDate: -1 }).limit(1);
            if(trailerServicing && trailerServicing[0]) {
                isServiced = true;

                trailerServicing = trailerServicing[0]._doc;
                trailerServicing.documentAccepted = trailerServicing.document.accepted;
                trailerServicing.documentVerified = trailerServicing.document.verified;
                trailerServicing.document = trailerServicing.document.data;
                trailerServicing.serviceDate = moment(trailerServicing.serviceDate).format("YYYY-MM-DD");
                trailerServicing.nextDueDate = moment(trailerServicing.nextDueDate).format("YYYY-MM-DD");
                trailer.servicing = trailerServicing;
            }
            trailer.serviced = isServiced;

            // -------------------------------------------------------------------------

            if(trailer.rentalCharges) {
                delete trailer.rentalCharges;
            }
        
            // -------------------------------------------------------------------------

            let licensee = await Licensee.findOne({ _id: trailer.licenseeId }, { name: 1, address: 1 });
            licensee = licensee ? licensee._doc : undefined;

            // -------------------------------------------------------------------------

            let employee = await Employee.findOne({ licenseeId: trailer.licenseeId, isOwner: true }, { name: 1 });
            employee = employee ? employee._doc : undefined;
            let employeeName = employee.name ? employee.name : "Employee";
            let employeePhoto = employee.photo;

            // trailer.employeeName = employeeName;
            // trailer.employeePhoto = employeePhoto;

            // licensee.owner = employee;

            const outputLicensee = {
                licenseeId: trailer.licenseeId,
                licenseeName: licensee ? licensee.name : "Licensee",
                licenseeLogo: licensee ? licensee.logo : "",
                ownerName: employeeName,
                ownerPhoto: employeePhoto,
            };

            const licenseeLat = (licensee.address && licensee.address.location && licensee.address.location.coordinates) ?  licensee.address.location.coordinates[1] : 0;
            const licenseeLon = (licensee.address && licensee.address.location && licensee.address.location.coordinates) ?  licensee.address.location.coordinates[0] : 0;

            let actualDistance = getDistance(location[0], location[1], licenseeLat, licenseeLon);
            actualDistance = Math.round((actualDistance + Number.EPSILON) * 100) / 100;
            
            trailer.distance = `${actualDistance} km`;

            // -------------------------------------------------------------------------

            const searchCondition = {
                trailerModel: trailer.trailerModel,
                licenseeId: trailer.licenseeId,
                availability: true,
                isDeleted: false
            };

            const upsellitems = await UpsellItem.find(searchCondition);
            const upsellitemIds = [], upsellItemIdsStr = [];
            upsellitems.forEach((upsellItem, index) => {
                upsellItem = upsellItem._doc;
                const upsellitemId = upsellItem._id;
                upsellitemIds.push(upsellitemId);
                upsellItemIdsStr.push(upsellitemId.toString());
                upsellitems[index] = upsellItem;
            });
            // -------------------------------------------------------------------------

            let bookedRentalItemSearchCond = {};
            if(upsellitemIds.length > 0) {
                bookedRentalItemSearchCond = {
                    $and: [
                        {
                            "rentedItems.itemId": { $in: upsellitemIds }
                        },
                        {
                            $and: [
                                {
                                    "rentalPeriod.start": { $lte: endDate.toISOString() }
                                },
                                {
                                    "rentalPeriod.end": { $gte: startDate.toISOString() }
                                }
                            ]
                        }
                    ]
                }
            } else {
                bookedRentalItemSearchCond = {
                    $and: [
                        {
                            "rentalPeriod.start": { $lte: endDate.toISOString() }
                        },
                        {
                            "rentalPeriod.end": { $gte: startDate.toISOString() }
                        }
                    ]
                };
            }

            const bookedRentalItems = await Invoice.find(bookedRentalItemSearchCond, { rentedItems: 1, rentalPeriod: 1 });
            const bookedRentalItemIds = [];
            bookedRentalItems.forEach((bookedRentalItem, bookedRentalItemIndex) => {
                bookedRentalItem = bookedRentalItem._doc;
                bookedRentalItem.rentedItems.forEach((rentedItem, rentedItemIndex) => {
                    rentedItem = rentedItem._doc;
                    bookedRentalItemIds.push(rentedItem.itemId.toString());
                });
            });

            const availableUpsellItemIdsStr = upsellItemIdsStr.filter((upsellItemId) => {
                return !bookedRentalItemIds.includes(upsellItemId);
            });
            const availableUpsellItemIds = availableUpsellItemIdsStr.map((upsellItemId) => {
                return mongoose.Types.ObjectId(upsellItemId);
            });

            const availableUpsellItems = upsellitems.filter((upsellItem) => {
                return (availableUpsellItemIdsStr.includes(upsellItem._id.toString()));
            });

            // -------------------------------------------------------------------------

            const upsellItemAverageRating = await TrailerRating.aggregate(
                [
                    { $match: { itemId: { $in: upsellitemIds } } },
                    { $group: { _id: "$itemId", avgRatingValue: { $avg: "$ratingValue" } } }
                ]
            ).exec();

            // -------------------------------------------------------------------------

            const outputUpsellItems = [];

            await asyncForEach(upsellitems, async (upsellItem, index) => {
                const upsellitemId = upsellItem._id.toString();

                const ratingIndex = upsellItemAverageRating.findIndex((rating) => {
                    return (rating._id.toString() === upsellitemId)
                });
                const ratingValue = (ratingIndex === -1) ? 0 : upsellItemAverageRating[ratingIndex].avgRatingValue;
                upsellitems[index].rating = ratingValue;

                //----------------------------------------------------------

                upsellItem = await calculateRentalItemCharges("upsellitem", upsellItem, delivery, startDate, endDate);

                //-----------------------------------------------------------

                isInsured = false;
                trailerInsurance = await TrailerInsurance.find({ itemType: "upsellitem", itemId: upsellItem._id, "document.accepted": true, expiryDate: { $gte: (moment().toISOString()) } }).sort({ expiryDate: -1 }).limit(1);
                if(trailerInsurance && trailerInsurance[0]) {
                    isInsured = true;

                    trailerInsurance = trailerInsurance._doc;
                    trailerInsurance.documentAccepted = trailerInsurance.document.accepted;
                    trailerInsurance.documentVerified = trailerInsurance.document.verified;
                    trailerInsurance.document = trailerInsurance.document.data;
                    trailerInsurance.issueDate = moment(trailerInsurance.issueDate).format("YYYY-MM-DD");
                    trailerInsurance.expiryDate = moment(trailerInsurance.expiryDate).format("YYYY-MM-DD");
                }

                isServiced = false;
                trailerServicing = await TrailerServicing.find({ itemType: "upsellitem", itemId: upsellItem._id, "document.accepted": true, nextDueDate: { $gte: (moment().toISOString()) } }).sort({ nextDueDate: -1 }).limit(1);
                if(trailerServicing && trailerServicing[0]) {
                    isServiced = true;

                    trailerServicing = trailerServicing._doc;
                    trailerServicing.documentAccepted = trailerServicing.document.accepted;
                    trailerServicing.documentVerified = trailerServicing.document.verified;
                    trailerServicing.document = trailerServicing.document.data;
                    trailerServicing.serviceDate = moment(trailerServicing.serviceDate).format("YYYY-MM-DD");
                    trailerServicing.nextDueDate = moment(trailerServicing.nextDueDate).format("YYYY-MM-DD");
                }

                //-----------------------------------------------------------
 
                const upsellitemObj = {
                    _id: upsellitemId,
                    name: upsellItem.name,
                    description: upsellItem.description,
                    type: upsellItem.type,
                    // availability: upsellItem.availability ? upsellItem.availability : false,
                    isAvailableForRent: (availableUpsellItemIdsStr.includes(upsellItem._id.toString())),
                    photo: upsellItem.photos ? upsellItem.photos : [],
                    rating: ratingValue,
                    insured: isInsured,
                    insurance: trailerInsurance,
                    serviced: isServiced,
                    servicing: trailerServicing,
                    totalCharges: upsellItem.totalCharges,
                    total: upsellItem.total,
                    distance: `${actualDistance} km`
                };
                if(upsellItem.trailerId) {
                    upsellitemObj.trailerId = upsellItem.trailerId;
                }
                outputUpsellItems.push(upsellitemObj);
            });

            // -------------------------------------------------------------------------

            return res.status(200).send({
                success: true,
                message: "Success",
                trailerObj: trailer,
                upsellItemsList: outputUpsellItems,
                licenseeObj: outputLicensee
            });
        } else {
            throw new BadRequestError("Trailer not found");
        }
}

module.exports = getTrailerDetails;