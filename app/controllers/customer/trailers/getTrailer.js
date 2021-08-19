const mongoose = require('mongoose');
const validator = require('validator');
const moment = require('moment');

const Trailer = require('../../../models/trailers');
const UpsellItem = require('../../../models/upsellItems');
const TrailerType = require('../../../models/trailerTypes');
const UpsellItemType = require('../../../models/upsellItemTypes');
const TrailerRating = require('../../../models/trailerRatings');
const Invoice = require('../../../models/invoices');
const Licensee = require('../../../models/licensees');
const TrailerInsurance = require('../../../models/trailerInsurance');
const TrailerServicing = require('../../../models/trailerServicing');

const objectSize = require('../../../helpers/objectSize'); 
const asyncForEach = require('../../../helpers/asyncForEach');
const rentalChargesConv = require('../../../helpers/rentalChargesConv');
const constants = require('../../../helpers/constants');

const rentalChargesData = require('../../../../test/testData/rentalChargesData');
const { UnauthorizedError, NotFoundError, BadRequestError } = require('./../../../helpers/errors');

/**
 * 
 * @api {GET} /trailer Get Trailer Details
 * @apiName CA - Get Trailer Details
 * @apiGroup Customer App - Trailer
 * 
 * 
 * @apiHeader {String} authorization Authorization token sent as a response to signIn request
 * 
 * 
 * @apiParam {String} id Trailer Id
 * 
 * 
 * @apiDescription API Endpoint GET /trailer
 * 
 * 
 * @apiSuccess {Boolean} success Success Status
 * @apiSuccess {String} message Success Message
 * @apiSuccess {Object} trailerObj Object of Trailer
 * 
 * 
 * @apiSuccessExample {String} - Success-Response:
 * HTTP/1.1 200 
 * 
    {
        success: true,
        message: "Success",
        trailerObj: {
            "features": [
                "spacious"
            ],
            "photos": [],
            "availability": true,
            "_id": "5e3bea14d3389b3ec15be4f2",
            "name": "Shadow Trailer",
            "type": "cargo",
            "description": "-83 IN WIDE -TANDEM 5200# TORSION AXLES -ALL ALUMINUM -RUBBER BUMPER ",
            "size": "38′ floor x 8′ tall x 8’5 wide",
            "capacity": "6680",
            "age": 3,
            "tare": "5200",
            "licenseeId": "5e395d2f784ae3441c9486bc",
            "rating": "3",
            "rentalCharges": {
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
            },
            "price": "$86",
            "rentalsList": [
                {
                    "start": '2020-06-05T00:00:00.000+00:00',
                    "end": '2020-06-07T00:00:00.000+00:00'
                }
            ]
        }
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

    let trailerId = req.query ? req.query.id : undefined;
    if (!trailerId || validator.isEmpty(trailerId)) {
        throw new BadRequestError("Trailer ID is undefined");
    } else if (objectSize(trailerId) < 12) {
        throw new BadRequestError("Trailer ID is invalid");
    }
    trailerId = mongoose.Types.ObjectId(trailerId);

    let trailer = await Trailer.findById(trailerId).lean()

    if (!trailer) throw new NotFoundError('Trailer not found')

    const averageRating = await TrailerRating.aggregate(
        [
            { $match: { itemId: trailerId } },
            { $group: { _id: "$itemId", avgRatingValue: { $avg: "$ratingValue" } } }
        ]
    ).exec();

    const ratingValue = (averageRating.length < 1) ? 0 : averageRating[0].avgRatingValue;
    trailer.rating = ratingValue;

    let price = {
        charges: 0
    };
    
    if(trailer.adminRentalItemId) {
        let rentalItemAdminObj = await TrailerType.findOne({ _id: trailer.adminRentalItemId }, { rentalCharges: 1 });
        trailer.rentalCharges = rentalItemAdminObj._doc.rentalCharges;
    } else if(!trailer.rentalCharges || !trailer.rentalCharges.door2Door) {
        trailer.rentalCharges = JSON.parse(JSON.stringify(rentalChargesData));
    }

    if(trailer.rentalCharges && trailer.rentalCharges.door2Door) {
        price = trailer.rentalCharges.door2Door.find((charges) => {
            return (charges.duration === constants.hirePeriod);
        });
    }
    trailer.price = `${price.charges} AUD`;
    trailer.dlrCharges = price.charges * constants.dlrChargesPercentage;

    if(trailer.rentalCharges.pickUp) {
        trailer.rentalCharges.pickUp = trailer.rentalCharges.pickUp.map(charge => {
            return {
                duration: rentalChargesConv.getDurationForCalculation(charge.duration),
                charges: charge.charges
            };
        });
    }

    if(trailer.rentalCharges.door2Door) {
        trailer.rentalCharges.door2Door = trailer.rentalCharges.door2Door.map(charge => {
            return {
                duration: rentalChargesConv.getDurationForCalculation(charge.duration),
                charges: charge.charges
            };
        });
    }

    let rentals = await Invoice.find({ "rentedItems.itemId": trailerId }, { rentalPeriod: 1 });

    trailer.rentalsList = rentals.map((rental) => {
        rental = rental._doc;
        return {
            invoiceId: rental._id,
            start: moment(rental.rentalPeriod.start).format("YYYY-MM-DD HH:MM"),
            end: moment(rental.rentalPeriod.end).format("YYYY-MM-DD HH:MM")
        }
    });

    let isInsured = true;
    // const insuranceProj = TrailerInsurance.getAllFieldsExceptFile();
    let trailerInsurance = await TrailerInsurance.find({ itemType: "trailer", itemId: trailerId, "document.accepted": true, expiryDate: { $gte: (moment().toISOString()) } }).sort({ expiryDate: -1 }).limit(1);
    if(trailerInsurance && trailerInsurance[0]) {
        isInsured = true;

        trailerInsurance = trailerInsurance[0]._doc;
        trailerInsurance.documentAccepted = trailerInsurance.document.accepted;
        trailerInsurance.documentVerified = trailerInsurance.document.verified;
        trailerInsurance.issueDate = moment(trailerInsurance.issueDate).format("YYYY-MM-DD");
        trailerInsurance.expiryDate = moment(trailerInsurance.expiryDate).format("YYYY-MM-DD");
        trailer.insurance = trailerInsurance;
    }
    trailer.insured = isInsured;

    let isServiced = true;
    // const servicingProj = TrailerServicing.getAllFieldsExceptFile();
    let trailerServicing = await TrailerServicing.find({ itemType: "trailer", itemId: trailerId, "document.accepted": true, nextDueDate: { $gte: (moment().toISOString()) } }).sort({ nextDueDate: -1 }).limit(1);
    if(trailerServicing && trailerServicing[0]) {
        isServiced = true;

        trailerServicing = trailerServicing[0]._doc;
        trailerServicing.documentAccepted = trailerServicing.document.accepted;
        trailerServicing.documentVerified = trailerServicing.document.verified;
        trailerServicing.serviceDate = moment(trailerServicing.serviceDate).format("YYYY-MM-DD");
        trailerServicing.nextDueDate = moment(trailerServicing.nextDueDate).format("YYYY-MM-DD");
        trailer.servicing = trailerServicing;
    }
    trailer.serviced = isServiced;
    // -------------------------------------------------------------------------

    const searchCondition = { 
        trailerId: trailerId,
        isDeleted: false
    };

    const upsellItemProj = UpsellItem.getAllFieldsSpecified(["name", "licenseeId", "photos", "rentalCharges", "adminRentalItemId"]);
    const upsellitems = await UpsellItem.aggregate([
        { $match: searchCondition },
        { $project: upsellItemProj }
    ]).exec();

    const upsellitemIds = [], licenseeIds = [];

    upsellitems.forEach((upsellItem, index) => {
        // upsellItem = upsellItem._doc;
        const upsellitemId = upsellItem._id;
        upsellitemIds.push(upsellitemId);
    
        upsellitems[index] = upsellItem;

        if (!licenseeIds.includes(upsellItem.licenseeId)) {
            licenseeIds.push(upsellItem.licenseeId);
        }
    });

    const licensees = await Licensee.find({ _id: { $in: licenseeIds } }, { name: 1 });

    const upsellItemAverageRating = await TrailerRating.aggregate(
        [
            { $match: { itemId: { $in: upsellitemIds } } },
            { $group: { _id: "$itemId", avgRatingValue: { $avg: "$ratingValue" } } }
        ]
    ).exec();

    const outputUpsellItems = [];

    await asyncForEach(upsellitems, async (upsellItem, index) => {
        const upsellitemId = upsellItem._id.toString();
        const ratingIndex = upsellItemAverageRating.findIndex((rating) => {
            return (rating._id.toString() === upsellitemId)
        });
        const ratingValue = (ratingIndex === -1) ? 0 : upsellItemAverageRating[ratingIndex].avgRatingValue;
        upsellitems[index].rating = ratingValue;

        const licenseeObj = licensees.find((licensee) => {
            return (licensee._id.toString() === upsellItem.licenseeId.toString());
        });

        let price = {
            charges: 0
        };

        if(upsellItem.adminRentalItemId) {
            let rentalItemAdminObj = await UpsellItemType.findOne({ _id: upsellItem.adminRentalItemId }, { rentalCharges: 1 });
            upsellItem.rentalCharges = rentalItemAdminObj._doc.rentalCharges;
        } else if(!upsellItem.rentalCharges || !upsellItem.rentalCharges.door2Door) {
            upsellItem.rentalCharges = JSON.parse(JSON.stringify(rentalChargesData));
        }
        if(upsellItem.rentalCharges && upsellItem.rentalCharges.door2Door) {
            price = upsellItem.rentalCharges.door2Door.find((charges) => {
                return (charges.duration === constants.hirePeriod);
            });
        }

        isInsured = false;
        trailerInsurance = await TrailerInsurance.find({ itemType: "upsellitem", itemId: upsellItem._id, "document.accepted": true, expiryDate: { $gte: (moment().toISOString()) } }).sort({ expiryDate: -1 }).limit(1);
        if(trailerInsurance && trailerInsurance[0]) {
            isInsured = true;

            trailerInsurance = trailerInsurance._doc;
            trailerInsurance.documentAccepted = trailerInsurance.document.accepted;
            trailerInsurance.documentVerified = trailerInsurance.document.verified;
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
            trailerServicing.serviceDate = moment(trailerServicing.serviceDate).format("YYYY-MM-DD");
            trailerServicing.nextDueDate = moment(trailerServicing.nextDueDate).format("YYYY-MM-DD");
        }

        const upsellitemObj = {
            _id: upsellitemId,
            name: upsellItem.name,
            licensee: licenseeObj ? `${licenseeObj.name}` : "",
            photo: upsellItem.photos[0],
            rating: ratingValue,
            price: `${price.charges} AUD`,
            insured: isInsured,
            insurance: trailerInsurance,
            serviced: isServiced,
            servicing: trailerServicing
        };
        if(upsellItem.trailerId) {
            upsellitemObj.trailerId = upsellItem.trailerId;
        }
        outputUpsellItems.push(upsellitemObj);
    });

    return res.status(200).send({
        success: true,
        message: "Success",
        trailerObj: trailer,
    });
}

module.exports = getTrailerDetails;
