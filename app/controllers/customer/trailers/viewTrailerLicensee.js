const mongoose = require('mongoose');
const validator = require('validator');
const moment = require('moment');

const Trailer = require('../../../models/trailers');
const UpsellItem = require('../../../models/upsellItems');
const TrailerRating = require('../../../models/trailerRatings');
const Invoice = require('../../../models/invoices');
const Licensee = require('../../../models/licensees');
const Commission = require('../../../models/commissions');
const Discount = require('../../../models/discounts');
const Employee = require('../../../models/employees');
const TrailerType = require('../../../models/trailerTypes');
const UpsellItemType = require('../../../models/upsellItemTypes');

const objectSize = require('../../../helpers/objectSize');
const asyncForEach = require('../../../helpers/asyncForEach');
const constants = require('../../../helpers/constants');

const rentalChargesData = require('../../../../test/testData/rentalChargesData');
const { BadRequestError, UnauthorizedError } = require('../../../helpers/errors');

/**
 * 
 * @api {GET} /trailer/licensee Get Trailer Licensee Details
 * @apiName CA - Get Trailer Licensee Details
 * @apiGroup Customer App - Trailer
 * 
 * 
 * @apiHeader {String} authorization Authorization token sent as a response to signIn request
 * 
 * 
 * @apiParam {String} id Licensee Id
 * 
 * 
 * @apiDescription API Endpoint GET /trailer/licensee
 * 
 * 
 * @apiSuccess {Boolean} success Success Status
 * @apiSuccess {String} message Success Message
 * @apiSuccess {Object} licenseeObj Licensee Object
 * 
 * 
 * @apiSuccessExample {String} - Success-Response:
 * HTTP/1.1 200 
    {
        success: true,
        message: "Success",
        licenseeObj: {}
    }
 * 
 * 
 * @apiErrorExample {json} Error-Response:
 * HTTP/1.1 400
    {
        success: false,
        message: "Could not fetch Licensee data",
        errorsList: []
    }
 * 
 * 
 */
async function getLicenseeDetails(req, res, next) {
        if (!req.userId) throw new UnauthorizedError('UnAuthorized Access');

        let licenseeId = req.query.id ? req.query.id : undefined;
        if (!licenseeId || validator.isEmpty(licenseeId)) {
            throw new BadRequestError("Licensee ID is undefined");
        } else if (objectSize(licenseeId) < 12) {
            throw new BadRequestError("Licensee ID is invalid");
        }
        licenseeId = mongoose.Types.ObjectId(licenseeId);

        let licensee = await Licensee.findById(licenseeId);

        if (licensee) {
            licensee = licensee._doc;
        
            if(licensee.address) {
                licensee.address = licensee.address._doc;
                licensee.address.coordinates = licensee.address.location._doc.coordinates;
                licensee.address.coordinates = [licensee.address.coordinates[1], licensee.address.coordinates[0]];
                delete licensee.address.location;
                delete licensee.address._id;
            }
    
            if(licensee.licenseeLocations && licensee.licenseeLocations[0] === null) {
                licensee.licenseeLocations = [ licensee.address ];
            } else {
                licensee.licenseeLocations.forEach((licenseeLocation, licenseeLocationIndex) => {
                    licenseeLocation = licenseeLocation._doc;
                    const coordinates = licenseeLocation.location._doc.coordinates;
                    licensee.licenseeLocations[licenseeLocationIndex] = {
                        ...licenseeLocation,
                        coordinates: [coordinates[1], coordinates[0]]
                    };
                    delete licensee.licenseeLocations[licenseeLocationIndex].location;
                    delete licensee.licenseeLocations[licenseeLocationIndex]._id;
                });
            }
        
            let rentalItems = [];
            let licenseeRating = [];

            const trailers = await Trailer.find({ licenseeId: licenseeId, isDeleted: false });

            const upsellItems = await UpsellItem.find({ licenseeId: licenseeId, isDeleted: false });

            //-----------------------------------------------------------------

            const trailerIds = trailers.map((trailer, trailerIndex) => {
                return trailer._doc._id;
            });

            const averageRatingTrailer = await TrailerRating.aggregate(
                [
                    { $match: { itemId: trailerIds } },
                    { $group: { _id: "$itemId", avgRatingValue: { $avg: "$ratingValue" } } }
                ]
            ).exec();

            await asyncForEach(trailers, async (trailer, trailerIndex) => {
                trailer = trailer._doc;
                
                const trailerId = trailer._id;

                const averageRating = averageRatingTrailer.find( rating => {
                    return (rating._id.toString() === trailerId.toString());
                });

                // const ratingValue = (averageRating.length < 1) ? 0 : averageRating[0].avgRatingValue;
                const ratingValue = averageRating ? averageRating.avgRatingValue : 0;
                licenseeRating.push(ratingValue);

                const price = {
                    pickUp: "0 AUD",
                    door2Door: "0 AUD"
                };

                if(trailer.adminRentalItemId) {
                    let rentalItemAdminObj = await TrailerType.findOne({ _id: trailer.adminRentalItemId }, { rentalCharges: 1 });
                    trailer.rentalCharges = rentalItemAdminObj._doc.rentalCharges;
                } else if(!trailer.rentalCharges) {
                    trailer.rentalCharges = JSON.parse(JSON.stringify(rentalChargesData));
                }

                if(trailer.rentalCharges) {
                    if(trailer.rentalCharges.pickUp) {
                        trailer.rentalCharges.pickUp.forEach((charge) => {
                            if(charge.duration === constants.hirePeriod) {
                                price.pickUp = `${charge.charges} AUD`;
                            }
                        });
                    }

                    if(trailer.rentalCharges.door2Door) {
                        trailer.rentalCharges.door2Door.forEach((charge) => {
                            if(charge.duration === constants.hirePeriod) {
                                price.door2Door = `${charge.charges} AUD`;
                            }
                        });
                    }
                }

                rentalItems.push({
                    id: trailer._id.toString(),
                    name: trailer.name,
                    type: trailer.type,
                    rentalItemType: "trailer",
                    photo: trailer.photos,
                    price: price
                });
            });

            // -------------------------------------------------------------------------

            const upsellItemIds = upsellItems.map((upsellItem, upsellItemIndex) => {
                return upsellItem._doc._id;
            });

            const averageRatingUpsell = await TrailerRating.aggregate(
                [
                    { $match: { itemId: upsellItemIds } },
                    { $group: { _id: "$itemId", avgRatingValue: { $avg: "$ratingValue" } } }
                ]
            ).exec();

            await asyncForEach(upsellItems, async (upsellItem, upsellItemIndex) => {
                upsellItem = upsellItem._doc;

                const upsellItemId = upsellItem._id;
            
                const averageRating = averageRatingUpsell.find( rating => {
                    return (rating._id.toString() === upsellItemId.toString());
                });

                // const ratingValue = (averageRatingUpsell.length < 1) ? 0 : averageRatingUpsell[0].avgRatingValue;
                const ratingValue = averageRating ? averageRating.avgRatingValue : 0;
                licenseeRating.push(ratingValue);


                const price = {
                    pickUp: "0 AUD",
                    door2Door: "0 AUD"
                };

                if(upsellItem.adminRentalItemId) {
                    let rentalItemAdminObj = await UpsellItemType.findOne({ _id: upsellItem.adminRentalItemId }, { rentalCharges: 1 });
                    upsellItem.rentalCharges = rentalItemAdminObj._doc.rentalCharges;
                } else if(!upsellItem.rentalCharges) {
                    upsellItem.rentalCharges = JSON.parse(JSON.stringify(rentalChargesData));
                }
            
                if(upsellItem.rentalCharges) {
                    if(upsellItem.rentalCharges.pickUp) {
                        upsellItem.rentalCharges.pickUp.forEach((charge) => {
                            if(charge.duration === constants.hirePeriod) {
                                price.pickUp = `${charge.charges} AUD`;
                            }
                        });
                    }

                    if(upsellItem.rentalCharges.door2Door) {
                        upsellItem.rentalCharges.door2Door.forEach((charge) => {
                            if(charge.duration === constants.hirePeriod) {
                                price.door2Door = `${charge.charges} AUD`;
                            }
                        });
                    }
                }


                rentalItems.push({
                    id: upsellItem._id.toString(),
                    name: upsellItem.name,
                    description: upsellItem.description,
                    type: upsellItem.type,
                    rentalItemType: "upsellitem",
                    photo: upsellItem.photos,
                    price: price,
                    trailerType: upsellItem.trailerType
                });
            });

            // -------------------------------------------------------------------------

            let rating = 0;
            licenseeRating.forEach((rentalItemRating) => {
                rating += rentalItemRating;
            });
            rating = rating / licenseeRating.length;

            const workingHoursComp = licensee.workingHours.split("-");
            const formattedStartTime = moment(workingHoursComp[0], "hmm").format("HH:mm");
            const formattedEndTime = moment(workingHoursComp[1], "hmm").format("HH:mm");
        

            let employee = await Employee.findOne({ licenseeId: licenseeId, isOwner: true });
            employee = employee ? employee._doc : undefined;
            let employeeName = employee.name ? employee.name : "Employee";
            let employeePhoto = employee.photo;

            licensee.workingDays = licensee.workingDays.map((day) => {
                return constants.daysMapping[day];
            });

            const licenseeObj = {
                id: licenseeId,
                name: licensee.name,
                email: licensee.email,
                mobile: licensee.mobile,
                address: licensee.address,
                locations: licensee.licenseeLocations,
                proofOfIncorporationVerified: (licensee.proofOfIncorporation && licensee.proofOfIncorporation.accepted) ? licensee.proofOfIncorporation.accepted : false,
                logo: licensee.logo,
                ownerName: employeeName,
                ownerPhoto: employeePhoto,
                rating: rating,
                workingDays: licensee.workingDays,
                workingHours: `${formattedStartTime}-${formattedEndTime}`,

                rentalItems: rentalItems
            };

            // -------------------------------------------------------------------------

            return res.status(200).send({
                success: true,
                message: "Success",
                licenseeObj: licenseeObj
            });
        } else {
            throw new BadRequestError("Licensee not found");
        }
}

module.exports = getLicenseeDetails;