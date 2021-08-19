const mongoose = require('mongoose');
const moment = require('moment');

const Invoice = require('../../../models/invoices');

const Trailer = require('../../../models/trailers');
const UpsellItem = require('../../../models/upsellItems');

const objectSize = require('../../../helpers/objectSize');
const asyncForEach = require('../../../helpers/asyncForEach');
const calculateRentalItemCharges = require('../../../helpers/calculateRentalItemCharges');
const constants = require('../../../helpers/constants');

const { UnauthorizedError, BadRequestError } = require('../../../helpers/errors');

/** 
 * 
 * @api {POST} /rental/reschedule Save Reschedule Request for a Trailer or Upsell Item Rental
 * @apiName CA - Save Reschedule Request for a Trailer or Upsell Item Rental
 * @apiGroup Customer App - Trailer Rental Old
 * 
 *  
 * @apiHeader {String} authorization Authorization token sent as a response to signIn request
 * @apiHeader {String} Content-Type application/json
 * 
 * 
 * @apiParam {String} rentalId Rental/Invoice Id
 * @apiParam {String} revisionId Revision Id ( Required only for Update Request )
 * @apiParam {String} start Start Date ( "YYYY-MM-DD HH:mm" format )
 * @apiParam {String} end End Date ( "YYYY-MM-DD HH:mm" format )
 * 
 * 
 * @apiDescription API Endpoint to be used to save Rescheduling data for a Trailer or Upsell Item Rental 
 * 
 * 
 * @apiErrorExample {json} Error-Response:
 * HTTP/1.1 400
 *  {
 *      success: false,
 *      message: "Could not save Trailer Rental Reschedule data",
 *      errorsList: []
 *  }
 * 
 * 
 * @apiSuccess {Boolean} success Success Status
 * @apiSuccess {String} message Success Message
 * @apiSuccess {String} rentalId Rental/Invoice ID
 * @apiSuccess {Array} scheduleObject Schedule objects
 * @apiSuccess {Object} rentalObj Rental Object
 * 
 * 
 * @apiSuccessExample {String} - Success-Response:
 * HTTP/1.1 200 OK
 * 
    {
        success: true,
        message: "Success",
        rentalId: <String>,
        scheduleObject: {},
        rentalObj: {}
    }
 * 
 */
async function saveRentalReschedule(req, res, next) {
        if (!req.userId) throw new UnauthorizedError('UnAuthorized Access');

        let revisionRequest = req.body;

        if (!revisionRequest.rentalId || (revisionRequest.rentalId && objectSize(revisionRequest.rentalId) < 12)) {
            throw new BadRequestError("VALIDATION-Invalid Rental ID");
        }
        const rentalId = mongoose.Types.ObjectId(revisionRequest.rentalId);
        let rentalProj = Invoice.getAllFieldsExceptFile();
        let savedRental = await Invoice.findOne({ _id: rentalId }, rentalProj);
        let savedRevisionIndex;

        if (revisionRequest.revisionId && objectSize(revisionRequest.revisionId) < 12) {
            throw new BadRequestError("Invalid Revision ID");
        }

        if(!savedRental)  throw new UnauthorizedError('UnAuthorized Access');
        savedRental = savedRental._doc;

        const delivery = savedRental.isPickUp ? "pickup": "door2door";

        const currentDate = moment();
        const nowTimeMS = currentDate.valueOf();
        const rentalPeriodStart = moment(savedRental.rentalPeriod.start);

        if ((rentalPeriodStart.valueOf() - nowTimeMS) < (constants.minHours * constants.ms.hour)) {
            throw new BadRequestError(`Reschedule request should be sent minimum ${constants.minHours} hours before Rental Start Period`);
        }

        if (!revisionRequest.start || !revisionRequest.end) {
            throw new BadRequestError("Invalid Start or End Dates for Rescheduling");
        }

        const rescheduleRentalPeriodStart = moment(revisionRequest.start);
        const rescheduleRentalPeriodStartMS = rescheduleRentalPeriodStart.valueOf();
        const rescheduleRentalPeriodEnd = moment(revisionRequest.end);
        const rescheduleRentalPeriodEndMS = rescheduleRentalPeriodEnd.valueOf();
        if (rescheduleRentalPeriodStartMS < nowTimeMS || rescheduleRentalPeriodEndMS < nowTimeMS) {
            throw new BadRequestError("Can not reschedule current or past rentals");
        }

        if (savedRental) {
            if(savedRental.bookedByUserId.toString() !== req.userId.toString()) throw new UnauthorizedError('UnAuthorized Access');

            let totalCharges = {
                total: 0,
                rentalCharges: 0,
                dlrCharges: 0,
                t2yCommission: 0,
                discount: 0,
                lateFees: 0,
                cancellationCharges: 0,
                taxes: 0
            };
            
            let total = 0;
            // --------------------------------------------------------
            await asyncForEach(savedRental.rentedItems, async (rentedItem, index) => {
                rentedItem = rentedItem._doc;
                
                let rentedItemObj, rentedItemProj;
                if(rentedItem.itemType === "trailer") {
                    rentedItemProj = Trailer.getAllFieldsSpecified(["adminRentalItemId", "rentalCharges"]);
                    rentedItemObj = await Trailer.findOne({ _id: rentedItem.itemId }, rentedItemProj);
                } else if(rentedItem.itemType === "upsellitem") {
                    rentedItemProj = UpsellItem.getAllFieldsSpecified(["adminRentalItemId", "rentalCharges"]);
                    rentedItemObj = await UpsellItem.findOne({ _id: rentedItem.itemId }, rentedItemProj);
                }
                
                rentedItemObj = await calculateRentalItemCharges(rentedItem.itemType, rentedItemObj, delivery, rescheduleRentalPeriodStart, rescheduleRentalPeriodEnd);
            
                totalCharges = {
                    total:  (Math.round(((totalCharges.total + parseFloat(rentedItemObj.totalCharges.total)) + Number.EPSILON) * 100) / 100),
                    rentalCharges: (Math.round(((totalCharges.rentalCharges + parseFloat(rentedItemObj.totalCharges.rentalCharges)) + Number.EPSILON) * 100) / 100),
                    dlrCharges: (Math.round(((totalCharges.dlrCharges + parseFloat(rentedItemObj.totalCharges.dlrCharges)) + Number.EPSILON) * 100) / 100),
                    t2yCommission: (Math.round(((totalCharges.t2yCommission + parseFloat(rentedItemObj.totalCharges.t2yCommission)) + Number.EPSILON) * 100) / 100),
                    discount: (Math.round(((totalCharges.discount + parseFloat(rentedItemObj.totalCharges.discount)) + Number.EPSILON) * 100) / 100),
                    lateFees: (Math.round(((totalCharges.lateFees + parseFloat(rentedItemObj.totalCharges.lateFees)) + Number.EPSILON) * 100) / 100),
                    cancellationCharges: (Math.round(((totalCharges.cancellationCharges + parseFloat(rentedItemObj.totalCharges.cancellationCharges)) + Number.EPSILON) * 100) / 100),
                    taxes: (Math.round(((totalCharges.taxes + parseFloat(rentedItemObj.totalCharges.taxes)) + Number.EPSILON) * 100) / 100)
                };

                total = (Math.round(((total + totalCharges.total) + Number.EPSILON) * 100) / 100);
            });

            // ---------------------------------------------------------

            let revisions = [];

            if(savedRental.revisions && savedRental.revisions.length > 0 && savedRental.revisions[0].revisionType) {
                revisions = JSON.parse(JSON.stringify(savedRental.revisions));
                revisions.forEach((revision, revisionIndex) => {
                    /* if(revision.revisionType === "rental" && !revision.isApproved) {
                        throw new Error("VALIDATION-Can not reschedule unapproved rental");
                    } */
                    if(revisionRequest.revisionId === revision._id.toString()) {
                        savedRevisionIndex = revisionIndex;

                        if(revision.isApproved === 1) {
                            throw new BadRequestError("Can not reschedule approved request");
                        }
                    }
                
                    if(revision.revisionType === "cancellation") {
                        throw new BadRequestError("Can not reschedule canceled request");
                    }
                });
            } else {
                revisions.push({
                    revisionType: "rental",
    
                    start: savedRental.rentalPeriod.start,
                    end: savedRental.rentalPeriod.end,
    
                    requestOn: savedRental.createdAt,
                    requestUpdatedOn: savedRental.createdAt,
    
                    totalCharges: savedRental.totalCharges,

                    isApproved: 1,
                    approvedOn: currentDate.toISOString()
                });
            }
            if (savedRevisionIndex !== undefined) {
                revisions[savedRevisionIndex] = {
                    ...revisions[savedRevisionIndex],

                    start: moment(revisionRequest.start).toISOString(),
                    end: moment(revisionRequest.end).toISOString(),
    
                    requestUpdatedOn: currentDate.toISOString(),
                    totalCharges: totalCharges
                };
            } else {
                revisions.push({
                    revisionType: "reschedule",
    
                    start: moment(revisionRequest.start).toISOString(),
                    end: moment(revisionRequest.end).toISOString(),
    
                    requestOn: currentDate.toISOString(),
                    requestUpdatedOn: currentDate.toISOString(),
    
                    totalCharges: totalCharges
                });

                savedRevisionIndex = (revisions.length - 1);
            }

            // --------------------------------------------------------

            await Invoice.updateOne({ _id: rentalId }, { revisions: revisions, rentalStatus : 'booked' ,rentalPeriod: { start: rescheduleRentalPeriodStart.toDate(), end: rescheduleRentalPeriodEnd.toDate() } });
            let updatedInvoice = await Invoice.findOne({ _id: rentalId }, rentalProj);
            updatedInvoice = updatedInvoice._doc;

            // --------------------------------------------------------

            updatedInvoice.pickUpLocation = {
                text: updatedInvoice.pickUpLocation ? updatedInvoice.pickUpLocation.text : "",
                pincode: updatedInvoice.pickUpLocation ? updatedInvoice.pickUpLocation.pincode : "",
                coordinates: (updatedInvoice.pickUpLocation && updatedInvoice.pickUpLocation.location) ? updatedInvoice.pickUpLocation.location.coordinates : undefined
            };
            updatedInvoice.pickUpLocation.coordinates = [updatedInvoice.pickUpLocation.coordinates[1], updatedInvoice.pickUpLocation.coordinates[0]];
    
            updatedInvoice.dropOffLocation = {
                text: updatedInvoice.dropOffLocation ? updatedInvoice.dropOffLocation.text : "",
                pincode: updatedInvoice.dropOffLocation ? updatedInvoice.dropOffLocation.pincode : "",
                coordinates: (updatedInvoice.dropOffLocation && updatedInvoice.dropOffLocation.location) ? updatedInvoice.dropOffLocation.location.coordinates : undefined
            };
            updatedInvoice.dropOffLocation.coordinates = [updatedInvoice.dropOffLocation.coordinates[1], updatedInvoice.dropOffLocation.coordinates[0]];
    
            updatedInvoice.rentedItems = updatedInvoice.rentedItems.map(rentalItem => {
                rentalItem = rentalItem._doc;
    
                delete rentalItem.rentalCharges;
    
                return rentalItem;
            });
    
            updatedInvoice.rentalPeriod.start = moment(updatedInvoice.rentalPeriod.start).format("YYYY-MM-DD hh:mm A");
            updatedInvoice.rentalPeriod.end = moment(updatedInvoice.rentalPeriod.end).format("YYYY-MM-DD hh:mm A");
    
            if(updatedInvoice.revisions) {
                updatedInvoice.revisions.forEach((revision, revisionIndex) => {
                    revision.revisionId = revision._id;
                    revision.start = moment(revision.start).format("YYYY-MM-DD hh:mm A");
                    revision.end = moment(revision.end).format("YYYY-MM-DD hh:mm A");
    
                    delete revision._id;
    
                    updatedInvoice.revisions[revisionIndex] = revision;
                });
            }
    
            //------------------------------------------------------------------------------

            res.status(200).send({
                success: true,
                message: "Success",
                rentalObj: updatedInvoice,
                rentalId: updatedInvoice._id.toString(),
                scheduleObject: updatedInvoice.revisions[savedRevisionIndex]
            });
        } else {
            throw new BadRequestError("VALIDATION-Invalid Rental ID");
        }
}

module.exports = saveRentalReschedule;