const mongoose = require('mongoose');
const moment = require('moment');
const admin = require('firebase-admin');
const dotenv = require('dotenv');

dotenv.config();
const config = process.env;

const stripe = require('stripe')(config.STRIPE_SECRET);

const User = require('../../../models/users');
const Invoice = require('../../../models/invoices');
const Notification = require('../../../models/notifications');

const objectSize = require('../../../helpers/objectSize');
const aclSettings = require('../../../helpers/getAccessControlList');
const { BadRequestError } = require('../../../helpers/errors');

/** 
 * 
 * @api {PUT} /admin/rental/approval Save Rental Request Approval data
 * @apiName TAAT - Save Rental Request Approval data
 * @apiGroup Admin App - Trailer Rental
 * 
 * 
 * @apiHeader {String} Content-Type application/json
 * @apiHeader {String} authorization Authorization token sent as a response to signIn request
 * 
 * 
 * @apiParam {String} rentalId Rental Id
 * @apiParam {String} revisionId Id of Rental Revision
 * @apiParam {String} approvalStatus Approval Status of the Rental Request
 * @apiParam {Boolean} NOPAYMENT Add this parameter when you want to skip payment ( value = true )
 * 
 * 
 * @apiDescription API Endpoint to be used to save Rental Request Approval
 * 
 * 
 * @apiErrorExample {json} Error-Response:
 * 
   HTTP/1.1 400
    {
        success: false,
        message: "Error occurred while approving/rejecting Rental Request",
        errorsList: []
    }
 
    HTTP/1.1 400 
    {
        success: false,
        message: "Error in Stripe Payments",
        error: "authentication_required",
        paymentMethod: err.raw.payment_method.id,
        clientSecret: err.raw.payment_intent.client_secret,
        amount: amountToCharge,
        card: {
            brand: err.raw.payment_method.card.brand,
            last4: err.raw.payment_method.card.last4
        }
    }

    HTTP/1.1 400
    {
        success: false,
        message: "Error in Stripe Payments",
        error: err.code,
        clientSecret: err.raw.payment_intent.client_secret
    }

    HTTP/1.1 400
    {
        success: false,
        message: "Error in Stripe Payments",
        error: err
    }

 * 
 * 
 * @apiSuccess {Boolean} success Success Status
 * @apiSuccess {String} message Success Message
 * 
 * 
 * @apiSuccessExample {String} - Success-Response:
 * HTTP/1.1 200 OK
 * 
    {
        success: true,
        message: "Success"
        // message: "Successfully approved/rejected Rental Extension Request"
        // message: "Successfully approved/rejected Rental Reschedule Request"
    }
 * 
 */
async function manageRentalApproval(req, res, next) {
    if (!req.requestFrom || !req.requestFrom.employeeId || !req.requestFrom.acl || !aclSettings.validateACL(req.requestFrom.acl, "RENTALSTATUS", "UPDATE")) {
        throw new BadRequestError('Unauthorised Access')
        }

        let rentalRequestApproval = req.body;
        if (!rentalRequestApproval.rentalId || (rentalRequestApproval.rentalId && objectSize(rentalRequestApproval.rentalId) < 12)) {
            throw new BadRequestError("VALIDATION-Invalid Rental ID");
        }

        if (!rentalRequestApproval.revisionId || (rentalRequestApproval.revisionId && objectSize(rentalRequestApproval.revisionId) < 12)) {
            throw new BadRequestError("VALIDATION-Invalid Revision ID");
        }

        const approvalStatus = rentalRequestApproval.approvalStatus === "approved" ? 1 : 2;
        const approvalStatusStr = (approvalStatus === 1) ? "approved" : "rejected";
        const invoiceId = mongoose.Types.ObjectId(rentalRequestApproval.rentalId);
        const revisionId = mongoose.Types.ObjectId(rentalRequestApproval.revisionId);
        // const licenseeId = (typeof req.requestFrom.licenseeId === 'string') ? mongoose.Types.ObjectId(req.requestFrom.licenseeId) : req.requestFrom.licenseeId;
        
        // let savedRental = await Invoice.findOne({ _id: invoiceId, licenseeId: licenseeId }, { revisions: 1, bookedByUserId: 1, description: 1, rentalPeriod: 1 });
        let savedRental = await Invoice.findOne({ _id: invoiceId }, { revisions: 1, bookedByUserId: 1, description: 1, rentalPeriod: 1 });    
        if(!savedRental) {
            return res.status(403).send({
                success: false,
                message: "Rental Item not found"
            });
        }

        savedRental = savedRental._doc;

        let isValidRevision = false;
        let isValidRevisionStatus = false;
        let revisionIndexToUpdate;
        let requestType;
        savedRental.revisions.forEach((revision) => {
            if(revision) {
                revision = revision._doc;

                if(revision._id.toString() === revisionId.toString()) {
                    isValidRevision = true;
                    requestType = revision.revisionType;
                    isValidRevisionStatus = true;
                    // if(!revision.approvedOn) {
                    //     isValidRevisionStatus = true;
                    //     console.log('h2')
                    // }

                }
            }
        });

        if(!isValidRevision) {
            throw new BadRequestError("VALIDATION-Invalid Revision Id");
        }

        if(!isValidRevisionStatus) {
            throw new BadRequestError("VALIDATION-Can not change approval status of Approved/Rejected Request");
        }

        let customerObj = await User.findOne({ _id: savedRental.bookedByUserId }, { fcmDeviceToken: 1, stripeCustomerId: 1, name: 1, address: 1 });
        customerObj = customerObj._doc;

        // --------------------------------------------------------------------------

        let updatedRevision, amountToCharge = 0;
        let rentalPaymentIntentId;
        savedRental.revisions.forEach((revision, revisionIndex) => {
            if(revision) {
                revision = revision._doc;

                if(revision.revisionType === "rental") {
                    rentalPaymentIntentId = revision.paymentIntentId;
                }

                if(revision._id.toString() === rentalRequestApproval.revisionId) {
                    revision.isApproved = approvalStatus;
                    revision.approvedOn = moment().toISOString();
                    revision.approvedBy = "admin";
                    revision.approvedById = req.requestFrom.employeeId;

                    updatedRevision = revision;

                    if(revision.revisionType === "rental" || revision.revisionType === "extension") {
                        amountToCharge = revision.totalCharges ? revision.totalCharges.total : 0;
                    }

                    revisionIndexToUpdate = revisionIndex;

                    savedRental.revisions[revisionIndex] = revision;
                }
            }
        });


        // --------------------------------------------------------------------

        if(requestType === "reschedule") {
            amountToCharge = await calculateCharges(rentalRequestApproval.revisionId, requestType, savedRental);
        }

        if(approvalStatus === 1) {
            if(config.NODE_ENV === "test" || rentalRequestApproval.NOPAYMENT) {
            } else {
                let paymentIntentId, paymentIntentClientSecret, paidAmount = 0;
                if(customerObj.stripeCustomerId) {
                    const paymentMethods = await stripe.paymentMethods.list({
                        customer: customerObj.stripeCustomerId,
                        type: 'card',
                    });

                    try { 
                        if(amountToCharge > 0) {
                            if(paymentMethods && paymentMethods.data && paymentMethods.data.length > 0) {
                                amountToCharge = 2;

                                const paymentIntentObj = {
                                    amount: amountToCharge,
                                    currency: "aud",
                                    payment_method: paymentMethods.data[0].id,
                                    customer: customerObj.stripeCustomerId,
                                    off_session: true,
                                    confirm: true,
                                    description: savedRental.description,
                                    shipping: {
                                        name: customerObj.name,
                                        address: {

                                            /* line1: customerObj.address.text,
                                            postal_code: customerObj.address.pincode,
                                            city: customerObj.address.city ? customerObj.address.city : "NSW",
                                            state: customerObj.address.state ? customerObj.address.state : 'Sydney',
                                            country: customerObj.address.country ? customerObj.address.country : 'AU' */
                                            
                                            line1: '24 Woonona Road, Sydney, New South Wales',
                                            postal_code: '2063',
                                            city: 'NSW',
                                            state: 'Sydney',
                                            country: 'AU'
                                        }
                                    }
                                };

                                const paymentIntent = await stripe.paymentIntents.create(paymentIntentObj);

                                if(paymentIntent) {
                                    paymentIntentId = paymentIntent.id;
                                    paymentIntentClientSecret = paymentIntent.client_secret;
                                }
                                paidAmount = amountToCharge;
                            } else {
                                throw new BadRequestError("VALIDATION-Payment method is not defined for a customer");
                            }
                        } else if(amountToCharge < 0) {
                            amountToCharge = -2;

                            if(rentalPaymentIntentId) {
                                const refund = await stripe.refunds.create({
                                    amount: (- amountToCharge),
                                    payment_intent: rentalPaymentIntentId
                                });

                                paymentIntentId = refund ? refund.id : "";
                                paymentIntentClientSecret = "";
                                paidAmount = amountToCharge;
                            } else {
                                console.log("There should be a Payment Intent to Refund Amount");
                            }
                        }
                    } catch(err) {
                        if(err.code === "authentication_required") {
                            // Bring the customer back on-session to authenticate the purchase
                            // You can do this by sending an email or app notification to let them know
                            // the off-session purchase failed
                            // Use the PM ID and client_secret to authenticate the purchase
                            // without asking your customers to re-enter their details

                            return res.status(400).send({
                                success: false,
                                message: "Error in Stripe Payments",
                                error: "authentication_required",
                                paymentMethod: err.raw.payment_method ? err.raw.payment_method.id : "",
                                clientSecret: err.raw.payment_intent ? err.raw.payment_intent.client_secret : "",
                                amount: amountToCharge,
                                card: {
                                    brand: err.raw.payment_method.card.brand,
                                    last4: err.raw.payment_method.card.last4
                                }
                            });
                        } else if(err.code) {
                            // The card was declined for other reasons (e.g. insufficient funds)
                            // Bring the customer back on-session to ask them for a new payment method
                            return res.status(400).send({
                                success: false,
                                message: "Error in Stripe Payments",
                                error: err.code,
                                clientSecret: err.raw.payment_intent ? err.raw.payment_intent.client_secret : "",
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
                        }
                    }
                } else {
                    throw new BadRequestError("VALIDATION-Stripe Customer ID not found");
                }

                if(paidAmount !== 0) {
                    savedRental.revisions[revisionIndexToUpdate].paymentIntentId = paymentIntentId;
                    savedRental.revisions[revisionIndexToUpdate].paymentIntentClientSecret = paymentIntentClientSecret;
                    savedRental.revisions[revisionIndexToUpdate].paidAmount = paidAmount;
                    savedRental.revisions[revisionIndexToUpdate].paymentDate = moment().toISOString();
                }
            }
        }

        // --------------------------------------------------------------------

        const updateObject = {
            rentalPeriod: {
                start: updatedRevision.start,
                end: updatedRevision.end
            },
            totalCharges: updatedRevision.totalCharges,
            revisions: savedRental.revisions
        };
        if(requestType === "rental") {
            updateObject.rentalStatus = approvalStatusStr;
        } 
        if(requestType === "extension") {
            updateObject.rentalPeriod.start = savedRental.rentalPeriod.start;
        }

        await Invoice.updateOne({ _id: invoiceId }, updateObject);

        // Notification ---------------------------------------------------

        let notificationObj = await Notification.findOne({ rentalId: invoiceId, notificationType: "book-rental" });
        if(notificationObj) {
            // notificationObj = notificationObj._doc;

            delete notificationObj._id;
            delete notificationObj._v;
            notificationObj.notificationType = `approve-${requestType}`;
            notificationObj.message = `${notificationObj.licensee} has ${approvalStatusStr} a Rental Request for ${notificationObj.trailerName}`;
            notificationObj.status = `${notificationObj.licensee} has ${approvalStatusStr} a Rental Request for ${notificationObj.trailerName}`;
            notificationObj.title = approvalStatus ? `Congratulations! Your Rental Request for ${notificationObj.trailerName} is successfully approved` : `Sorry, Your Rental Request for ${notificationObj.trailerName} is rejected`;

            const notification = new Notification(notificationObj);
            await notification.save();

            if(customerObj.fcmDeviceToken) {
                const fcmNotificationObj = {
                    notificationType: notificationObj.notificationType,
                    message: notificationObj.message,
                    title: notificationObj.title,
                    rentalId: notificationObj.rentalId,
                    licenseeId: notificationObj.licenseeId,
                    customerId: notificationObj.customerId
                };

                admin.initializeApp({
                    credential: admin.credential.cert(serviceAccount),
                    databaseURL: "https://trailer2you-7a9da.firebaseio.com"
                });
            
                const message = {
                    data: fcmNotificationObj,
                    tokens: [ customerObj.fcmDeviceToken ]
                };
                const fcmNotification = await admin.messaging().sendMulticast(message);

            }
        }

        // --------------------------------------------------------------------------

        res.status(200).send({
            success: true,
            message: approvalStatus ? "Successfully approved Rental Request" : "Sorry! Rental Request is rejected",
            approvalStatus: approvalStatus
        });
}

module.exports = manageRentalApproval;