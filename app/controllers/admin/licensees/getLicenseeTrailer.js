const mongoose = require('mongoose');
const validator = require('validator');
const moment = require('moment');

const Trailer = require('../../../models/trailers');
const UpsellItem = require('../../../models/upsellItems');
const TrailerRating = require('../../../models/trailerRatings');
const Invoice = require('../../../models/invoices');
const Licensee = require('../../../models/licensees');
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

const rentalChargesData = require('../../../../test/testData/rentalChargesData');
const { BadRequestError } = require('../../../helpers/errors');


const getLicenseeTrailer = async function(req,res) {
   if (!req.requestFrom || !aclSettings.validateACL(req.requestFrom.acl, "TRAILER", "VIEW") || !req.query.licenseeId) {
            throw new BadRequestError('Unauthorised Access')
        }
        const today = moment();

        let trailerId = req.query ? req.query.id : undefined;
        if (!trailerId || validator.isEmpty(trailerId)) {
            throw new BadRequestError("VALIDATION-Trailer ID is undefined");
        } else if (objectSize(trailerId) < 12) {
            throw new BadRequestError("VALIDATION-Trailer ID is invalid");
        }
        trailerId = mongoose.Types.ObjectId(trailerId);
        const licenseeId = mongoose.Types.ObjectId(req.query.licenseeId);
        // const trailerProj = Trailer.getAllFieldsWithExistsFile();
    
        // const trailers = await Trailer.aggregate([
        //     { $match: { _id: trailerId, licenseeId: licenseeId  } },
        //     { $project: trailerProj }
        // ]).exec();
        const trailers = await Trailer.find({_id: trailerId, licenseeId }).exec();
        let trailer = (trailers && trailers.length > 0) ? trailers[0] : undefined;
        if(trailer) {
            // trailer = trailer._doc;

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

                let user = await User.findOne({ _id: rental.bookedByUserId }, { name: 1 });
                user = user ? user._doc : undefined;

                trailer.rentalsList.push({
                    invoiceId: rental._id.toString(),
                    start: moment(rental.rentalPeriod.start).format("YYYY-MM-DD HH:MM"),
                    end: moment(rental.rentalPeriod.end).format("YYYY-MM-DD HH:MM"),
                    bookedByUser: {
                        name: user ? user.name : "Not Available",
                        photo: user ? user.photo : "Not Available"
                    },
                    status: rentalStatus
                });
            });

            // -------------------------------------------------------------------------

            const searchCondition = { 
                trailerId: trailerId,
                isDeleted: false
            };
            const projectionObj = {
                name: 1,
                rentalCharges: 1,
                adminRentalItemId: 1
            };

            const upsellitems = await UpsellItem.find(searchCondition, projectionObj);

            const upsellitemIds = [];

            upsellitems.forEach((upsellitem, index) => {
                upsellitem = upsellitem._doc;

                const upsellitemId = upsellitem._id;
                upsellitemIds.push(upsellitemId);
                
                upsellitem.photo = (upsellitem.photos && upsellitems.photos[0]) ? upsellitem.photos[0] : null;

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
                    photo: upsellitem.photo,
                    rating: ratingValue,
                    price: `${price.charges} AUD`
                };
                if(upsellitem.trailerId) {
                    upsellitemObj.trailerId = upsellitem.trailerId;
                }
                outputUpsellItems.push(upsellitemObj);
            });

            // -------------------------------------------------------------------------

            const insuranceProj = TrailerInsurance.getAllFieldsExceptFile();
            const trailerInsurance = await TrailerInsurance.find({ itemId: trailerId }, insuranceProj);
            trailerInsurance.forEach((insurance, index) => {
                insurance = insurance._doc;

                insurance.documentAccepted = insurance.document.accepted;
                insurance.documentVerified = insurance.document.verified;
                insurance.document = insurance.document.data;
            
                trailerInsurance[index] = insurance;
            });
            trailer.insurance = trailerInsurance; 
        
            //----------------------------------------------------------------------------
            
            const servicingProj = TrailerServicing.getAllFieldsExceptFile();
            const trailerServicing = await TrailerServicing.find({ itemId: trailerId }, servicingProj);
            trailerServicing.forEach((servicing, index) => {
                servicing = servicing._doc;

                servicing.documentAccepted = servicing.document.accepted;
                servicing.documentVerified = servicing.document.verified;
                servicing.document = servicing.document.data;

                trailerServicing[index] = servicing;
            }); 
            trailer.servicing = trailerServicing;
            
            //----------------------------------------------------------------------------
            return res.status(200).send({
                success: true,
                message: "Successfully fetched Trailer data",
                trailerObj: trailer,
                upsellItemsList: outputUpsellItems
            });
        } else {
            throw new BadRequestError("VALIDATION-Trailer not found");
        }
    
}

module.exports = getLicenseeTrailer