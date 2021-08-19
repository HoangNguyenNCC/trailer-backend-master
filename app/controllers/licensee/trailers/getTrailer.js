const mongoose = require('mongoose');
const validator = require('validator');
const moment = require('moment');

const Trailer = require('../../../models/trailers');
const UpsellItem = require('../../../models/upsellItems');
const TrailerRating = require('../../../models/trailerRatings');
const Invoice = require('../../../models/invoices');
const Licensee = require('../../../models/licensees');
const Employee = require('../../../models/employees');
const User = require('../../../models/users');
const TrailerInsurance = require('../../../models/trailerInsurance');
const TrailerServicing = require('../../../models/trailerServicing');
const TrailerType = require('../../../models/trailerTypes');
const UpsellItemType = require('../../../models/upsellItemTypes');

const aclSettings = require('../../../helpers/getAccessControlList');
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

const rentalChargesData = require('../../../../test/testData/rentalChargesData');

/**
 * 
 * @api {GET} /licensee/trailer Get Trailer Details
 * @apiName LA - Get Trailer Details
 * @apiGroup Licensee App - Trailer
 * 
 * 
 * @apiHeader {String} authorization Authorization token sent as a response to signIn reque
 * 
 * 
 * @apiParam {String} id Trailer Id
 * 
 * 
 * @apiDescription API Endpoint GET /licensee/trailer
 * 
 * 
 * @apiSuccess {Boolean} success Success Status
 * @apiSuccess {String} message Success Message
 * @apiSuccess {Array} trailerObj Object with Trailer details
 * 
 * 
 * @apiSuccessExample {String} - Success-Response:
 * HTTP/1.1 200 
 * 
    {
        success: true,
        message: "Successfully fetched Trailers data",
        trailerObj: {
            "features": [ "spacious" ],
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
            rentalCharges: {
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
            price: "86 AUD",
            rentalsList: [
                {
                    start: '2020-06-05T00:00:00.000+00:00',
                    end: '2020-06-07T00:00:00.000+00:00'
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
        message: "Error occurred while fetching Trailer data",
        errorsList: []
    }
 * 
 * 
 */
async function getTrailerDetails(req, res, next) {
    if (!req.requestFrom || !aclSettings.validateACL(req.requestFrom.acl, "TRAILER", "VIEW") || !req.requestFrom.licenseeId) {
            throw new ForbiddenError('Unauthorised Access')
        }

        const today = moment();

        let trailerId = req.query ? req.query.id : undefined;
        if (!trailerId || validator.isEmpty(trailerId)) {
            throw new BadRequestError("VALIDATION-Trailer ID is undefined");
        } else if (objectSize(trailerId) < 12) {
            throw new BadRequestError("VALIDATION-Trailer ID is invalid");
        }
        trailerId = mongoose.Types.ObjectId(trailerId);
        const licenseeId = mongoose.Types.ObjectId(req.requestFrom.licenseeId);

        const trailers = await Trailer.find({_id: trailerId, licenseeId}).exec();
        let trailer = (trailers && trailers.length > 0) ? trailers[0] : undefined;

        if(trailer) {
            trailer = trailer._doc;
            const averageRating = await TrailerRating.aggregate(
                [
                    { $match: { itemId: trailerId } },
                    { $group: { _id: "$itemId", avgRatingValue: { $avg: "$ratingValue" } } }
                ]
            ).exec();

            const ratingValue = (averageRating.length < 1) ? 0 : averageRating[0].avgRatingValue;
            trailer.rating = ratingValue;

            if(trailer.adminRentalItemId) {
                let rentalItemAdminObj = await TrailerType.findOne({ _id: trailer.adminRentalItemId }, { rentalCharges: 1 });
                trailer.rentalCharges = rentalItemAdminObj._doc.rentalCharges;
            } else if(!trailer.rentalCharges || !trailer.rentalCharges.door2Door) {
                trailer.rentalCharges = JSON.parse(JSON.stringify(rentalChargesData));
            }
            const price = trailer.rentalCharges.door2Door.find((charges) => {
                return (charges.duration === constants.hirePeriod);
            });
            trailer.price = `${price.charges} AUD`;
            if(trailer.rentalCharges) {
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
            }

            let rentals = await Invoice.find({ "rentedItems.itemId": trailerId }, { rentalPeriod: 1, licenseeId: 1, bookedByUserId: 1 });
            let licensee = await Licensee.findOne({ _id: licenseeId }, { name: 1 });
            licensee = licensee._doc;

            /* let employee = await Employee.findOne({ licenseeId: licenseeId }, { name: 1, photo: 1 });
            employee = employee._doc; */

            trailer.rentalsList = [];
            await asyncForEach(rentals, async (rental) => {
                rental = rental._doc;

                let rentalStatus = "upcoming";
                if(moment(rental.rentalPeriod.end).isBefore(today)) {
                    rentalStatus = "completed";
                } else if(moment(rental.rentalPeriod.start).isBefore(today) && moment(rental.rentalPeriod.end).isAfter(today)) {
                    rentalStatus = "ongoing";
                }

                let user = await User.findOne({ _id: rental.bookedByUserId }, { name: 1, photo: 1 });
                user = user ? user._doc : undefined;

                trailer.rentalsList.push({
                    invoiceId: rental._id.toString(),
                    start: moment(rental.rentalPeriod.start).format("YYYY-MM-DD HH:MM"),
                    end: moment(rental.rentalPeriod.end).format("YYYY-MM-DD HH:MM"),
                    bookedByUser: {
                        name: user ? user.name : "Not Available",
                        photo: user ? user.photo : {}
                    },
                    status: rentalStatus
                });
            });
            // -------------------------------------------------------------------------
            const upsellitems = await UpsellItem.find({trailerModel: trailer.trailerModel, licenseeId: licenseeId, isDeleted: false});

            const upsellitemIds = [];

            upsellitems.forEach((upsellitem, index) => {
                upsellitem = upsellitem._doc;

                const upsellitemId = upsellitem._id;
                upsellitemIds.push(upsellitemId);
                
                upsellitems[index] = upsellitem;
            });

            const upsellItemAverageRating = await TrailerRating.aggregate(
                [
                    { $match: { itemId: { $in: upsellitemIds } } },
                    { $group: { _id: "$itemId", avgRatingValue: { $avg: "$ratingValue" } } }
                ]
            ).exec();

            const outputUpsellItems = [];

            await asyncForEach(upsellitems, async(upsellitem, index) => {
                const upsellitemId = upsellitem._id.toString();
                const ratingIndex = upsellItemAverageRating.findIndex((rating) => {
                    return (rating._id.toString() === upsellitemId)
                });
                const ratingValue = (ratingIndex === -1) ? 0 : upsellItemAverageRating[ratingIndex].avgRatingValue;
                upsellitems[index].rating = ratingValue;

                if(upsellitem.adminRentalItemId) {
                    let rentalItemAdminObj = await UpsellItemType.findOne({ _id: upsellitem.adminRentalItemId }, { rentalCharges: 1 });
                    upsellitem.rentalCharges = rentalItemAdminObj._doc.rentalCharges;
                } else if(!upsellitem.rentalCharges || !upsellitem.rentalCharges.door2Door) {
                    upsellitem.rentalCharges = JSON.parse(JSON.stringify(rentalChargesData));
                }
                const price = upsellitem.rentalCharges.door2Door.find((charges) => {
                    return (charges.duration === constants.hirePeriod);
                });

                if(upsellitem.rentalCharges) {
                    if(upsellitem.rentalCharges.pickUp) {
                        upsellitem.rentalCharges.pickUp = upsellitem.rentalCharges.pickUp.map(charge => {
                            return {
                                duration: rentalChargesConv.getDurationForCalculation(charge.duration),
                                charges: charge.charges
                            };
                        });
                    }
    
                    if(upsellitem.rentalCharges.door2Door) {
                        upsellitem.rentalCharges.door2Door = upsellitem.rentalCharges.door2Door.map(charge => {
                            return {
                                duration: rentalChargesConv.getDurationForCalculation(charge.duration),
                                charges: charge.charges
                            };
                        });
                    }
                } 

                const upsellitemObj = {
                    _id: upsellitemId,
                    name: upsellitem.name,
                    licensee: licensee ? `${licensee.name}` : "",
                    photo: !!upsellitem.photos ? upsellitem.photos[0]: null,
                    rating: ratingValue,
                    price: `${price.charges} AUD`,
                };
                if(upsellitem.trailerId) {
                    upsellitemObj.trailerId = upsellitem.trailerId;
                }
                outputUpsellItems.push(upsellitemObj);
            });
            // -------------------------------------------------------------------------

            const trailerInsurance = await TrailerInsurance.find({ itemId: trailerId });
            trailerInsurance.forEach((insurance, index) => {
                insurance = insurance._doc;

                insurance.documentAccepted = insurance.document.accepted;
                insurance.documentVerified = insurance.document.verified;
            
                trailerInsurance[index] = insurance;
            });
            trailer.insurance = trailerInsurance; 
        
            //----------------------------------------------------------------------------
            
            const trailerServicing = await TrailerServicing.find({ itemId: trailerId });
            trailerServicing.forEach((servicing, index) => {
                servicing = servicing._doc;

                servicing.documentAccepted = servicing.document.accepted;
                servicing.documentVerified = servicing.document.verified;

                trailerServicing[index] = servicing;
            }); 
            trailer.servicing = trailerServicing;
            
            return res.status(200).send({
                success: true,
                message: "Successfully fetched Trailer data",
                trailerObj: trailer,
                upsellItemsList: outputUpsellItems
            });
        } else {
            throw new NotFoundError("VALIDATION-Trailer not found");
        }
}

module.exports = getTrailerDetails;