const mongoose = require('mongoose');
const moment = require('moment');
const dotenv = require('dotenv');

dotenv.config();
const config = process.env;

const stripe = require('stripe')(config.STRIPE_SECRET);

const Invoice = require('../../../models/invoices');
const objectSize = require('../../../helpers/objectSize');

const { BadRequestError, UnauthorizedError } = require('../../../helpers/errors');

/** 
 * 
 * @api {POST} /rental/cancel Save Cancellation for a Trailer or Upsell Item Rental
 * @apiName CA - Save Cancellation for a Trailer or Upsell Item Rental
 * @apiGroup Customer App - Trailer Rental Old
 *  
 * @apiHeader {String} authorization Authorization token sent as a response to signIn request
 * @apiHeader {String} Content-Type application/json
 * 
 * 
 * @apiParam {String} rentalId Rental/Invoice Id
 * @apiParam {String} revisionId Revision Id ( Required only for Update Request )
 * @apiParam {Boolean} NOPAYMENT Add this parameter when you want to skip payment ( value = true )
 * 
 * 
 * @apiDescription API Endpoint to be used to save Cancellation data for a Trailer or Upsell Item Rental data
 * 
 * 
 * @apiErrorExample {json} Error-Response:
 * HTTP/1.1 400
 *  {
 *      success: false,
 *      message: "Could not cancel the Rental",
 *      errorsList: []
 *  }
 * 
 * @apiSuccess {Boolean} success Success Status
 * @apiSuccess {String} message Success Message
 * @apiSuccess {String} rentalId Rental Id
 * @apiSuccess {Object} cancellationObj Cancellation object
 * @apiSuccess {Object} rentalObj Rental/Invoice object
 * 
 * 
 * @apiSuccessExample {String} - Success-Response:
 * HTTP/1.1 200 OK
 * 
    {
        success: true, 
        message: "Success", 
        rentalId: "", 
        cancellationObj: {}, 
        rentalObj: {} 
    }
 * 
 */
async function saveRentalCancellation(req, res, next) {

        let revisionRequest = req.body;

        if (!revisionRequest.rentalId || (revisionRequest.rentalId && objectSize(revisionRequest.rentalId) < 12)) {
            throw new BadRequestError("Invalid Rental ID");
        }
        const rentalId = mongoose.Types.ObjectId(revisionRequest.rentalId);

        let rentalProj = Invoice.getAllFieldsExceptFile();
        let savedRental = await Invoice.findOne({ _id: rentalId }, rentalProj);

        if(revisionRequest.revisionId && objectSize(revisionRequest.revisionId) < 12) {
            throw new BadRequestError("Invalid Revision ID");
        }

        const isUpdating = revisionRequest.revisionId ? true : false;
        let savedRevisionIndex;

        if(savedRental) {
            savedRental = savedRental._doc;
            let isApprovedRental = false;
            let rentalPaymentIntentId;

            let savedCancellation = isUpdating ? savedRental.cancellation : undefined;
            if(savedRental.revisions) {
                revisions = JSON.parse(JSON.stringify(savedRental.revisions));
                revisions.forEach((revision, revisionIndex) => {
                    if(revision) {
                        // revision = revision._doc;

                        if(revision.isApproved === 1 && revision.paidAmount && revision.paidAmount > 0) {
                            isApprovedRental = true;
                            rentalPaymentIntentId = revision.paymentIntentId;
                        }

                        if(revisionRequest.revisionId === revision._id.toString() && revision.revisionType === "cancel") {
                            savedRevisionIndex = revisionIndex;
                        }
                    }
                });
            } 

            if (!savedRevisionIndex) {
                const currentDate = moment();
                const nowTimeMS = currentDate.valueOf();

                const rentalPeriodStart = moment(savedRental.rentalPeriod.start);
                const rentalPeriodEnd = moment(savedRental.rentalPeriod.end);

                const savedRentalPeriodStartMS = savedRental ? rentalPeriodStart.valueOf() : 0;
                const savedRentalPeriodEndMS = savedRental ? rentalPeriodEnd.valueOf() : 0;

                if (savedRentalPeriodStartMS < nowTimeMS || savedRentalPeriodEndMS < nowTimeMS) {
                    throw new BadRequestError("Cannot cancel Current or Past Rental");
                }

                // ---------------------------------------------------------

                if(savedRental.bookedByUserId.toString() !== req.userId.toString()) throw new UnauthorizedError('UnAuthorized Access');

                // ---------------------------------------------------------
    
                const cancellationTimeDiff = nowTimeMS - savedRentalPeriodStartMS;
                const totalCharges = Invoice.calculateCancellationCharges(cancellationTimeDiff, savedRental);
                if(!isApprovedRental) {
                    totalCharges.cancellationCharges = 0;
                }

                // ---------------------------------------------------------

                let revisions = [];

                if(!savedRental.revisions || savedRental.revisions.length === 0 || !savedRental.revisions[0].revisionType) {
                    revisions.push({
                        revisionType: "rental",
        
                        start: savedRental.rentalPeriod.start,
                        end: savedRental.rentalPeriod.end,
        
                        requestOn: savedRental.createdAt,
                        requestUpdatedOn: savedRental.createdAt,
        
                        totalCharges: savedRental.totalCharges
                    });
                } else {
                    revisions = [...savedRental.revisions];
                }

                revisions.push({
                    revisionType: "cancellation",
    
                    start: savedRental.rentalPeriod.start,
                    end: savedRental.rentalPeriod.end,
    
                    requestOn: currentDate.toISOString(),
                    requestUpdatedOn: currentDate.toISOString(),
    
                    totalCharges: totalCharges,

                    isApproved: 2,
                    approvedOn: currentDate.toISOString()
                });

                savedRevisionIndex = (revisions.length - 1);
            
                // --------------------------------------------------------
            
                if(config.NODE_ENV === "test" || revisionRequest.NOPAYMENT) {
                    console.log("NOPAYMENT");
                } else if(!isApprovedRental) { 
                    console.log("Refund not needed as Rental was not approved");
                } else {
                    amountToCharge = -totalCharges.cancellationCharges;
                    amountToCharge = -2;

                    let paymentIntentId, paymentIntentClientSecret, paidAmount = 0;

                    if(isApprovedRental && rentalPaymentIntentId) {
                        try {
                            const refund = await stripe.refunds.create({
                                amount: (- amountToCharge),
                                payment_intent: rentalPaymentIntentId
                            });

                            paymentIntentId = refund ? refund.id : "";
                            paymentIntentClientSecret = "";
                            paidAmount = amountToCharge;
                        } catch(err) {
                            if(err.code) {
                                // The card was declined for other reasons (e.g. insufficient funds)
                                // Bring the customer back on-session to ask them for a new payment method
                                return res.status(400).send({
                                    success: false,
                                    message: "Error in Stripe Payments",
                                    error: err.code
                                });
                            } else {
                                let error = err;
        
                                if(err && err.message) {
                                    const errorComp = err.message.split("VALIDATION-");
                                    error = errorComp.length > 1 ? errorComp[1] : errorComp[0];
                                }
                                return res.status(400).send({
                                    success: false,
                                    message: "Error in Stripe Payments",
                                    error: error
                                });
                                toStrin              }
                        }
                    } else {
                        console.log("There should be a Payment Intent to Refund Amount");
                    }

                    if(paidAmount !== 0) {
                        revisions[savedRevisionIndex].paymentIntentId = paymentIntentId;
                        revisions[savedRevisionIndex].paymentIntentClientSecret = paymentIntentClientSecret;
                        revisions[savedRevisionIndex].paidAmount = paidAmount;
                        revisions[savedRevisionIndex].paymentDate = moment().toISOString();
                    }
                }

                // --------------------------------------------------------

                await Invoice.updateOne({ _id: rentalId }, { revisions: revisions, totalCharges: totalCharges });

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
        
                updatedInvoice.rentalPeriod.start = moment(updatedInvoice.rentalPeriod.start).format("YYYY-MM-DD HH:mm");
                updatedInvoice.rentalPeriod.end = moment(updatedInvoice.rentalPeriod.end).format("YYYY-MM-DD HH:mm");
        
                if(updatedInvoice.revisions) {
                    updatedInvoice.revisions.forEach((revision, revisionIndex) => {
                        if(revision) {
                            revision = revision._doc;
                            revision.revisionId = revision._id;
                            revision.start = moment(revision.start).format("YYYY-MM-DD HH:mm");
                            revision.end = moment(revision.end).format("YYYY-MM-DD HH:mm");
            
                            delete revision._id;
            
                            updatedInvoice.revisions[revisionIndex] = revision;
                        }
                    });
                }
        
                //------------------------------------------------------------------------------

                res.status(200).send({
                    success: true,
                    message: "Success",
                    rentalId: updatedInvoice._id.toString(),
                    cancellationObj: updatedInvoice.revisions[savedRevisionIndex],
                    rentalObj: updatedInvoice
                });

            } else {
                throw new BadRequestError("VALIDATION-Rental is already canceled");
            }
        } else {
            throw new BadRequestError("VALIDATION-Invalid Rental ID");
        }
}

module.exports = saveRentalCancellation;