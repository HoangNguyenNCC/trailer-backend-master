const mongoose = require('mongoose');
const admin = require('firebase-admin');
const fs = require('fs');

const User = require('../../../models/users');
const Invoice = require('../../../models/invoices');
const Notification = require('../../../models/notifications');
const Commission = require('../../../models/commissions');
const Discount = require('../../../models/discounts');

const Trailer = require('../../../models/trailers');
const UpsellItem = require('../../../models/upsellItems');
const TrailerType = require('../../../models/trailerTypes');
const UpsellItemType = require('../../../models/upsellItemTypes');

const objectSize = require('../../../helpers/objectSize');
const asyncForEach = require('../../../helpers/asyncForEach');
const constants = require('../../../helpers/constants');
const {
    BadRequestError,
    ForbiddenError,
    NotFoundError,
    UnauthorizedError,
    ApiError
  } = require("./../../../helpers/errors");

const rentalChargesData = require('../../../../test/testData/rentalChargesData');
const { customerNotification } = require('../../../helpers/fcmAdmin');

/** 
 * 
 * @api {POST} /rental/status Save Rental Status Update data
 * @apiName LA - Save Rental Status Update data
 * @apiGroup Licensee App - Trailer Rental
 * 
 * 
 * @apiHeader {String} Content-Type application/json
 * @apiHeader {String} authorization Authorization token sent as a response to signIn request
 * 
 * 
 * @apiParam {File} driverLicenseScan Scan of Driver License ( File ) [ for status="delivered" only ]
 * 
 * @apiParam {Object} reqBody Request JSON data
 * @apiParam {String} rentalId Rental Id
 * @apiParam {String} status Status of the dispatched items ( "dispatched", "returned", "return-started", "delivered" )
 * 
 * 
 * @apiParamExample {json} Request-Example:
 * 
 * Rental Status Update Body
 * 
    curl --location --request POST 'http://localhost:5000/rental/status' \
    --form '{
        "rentalId": "5ea82c7ec24cc540f8de07fa", 
        "status": "delivered"
    }' \
    --form 'driverLicenseScan=@/home/username/Downloads/driver_license_sample.jpeg'
 * 
 * 
 * 
 * @apiDescription API Endpoint to be used to save Rental Status Update
 * 
 * 
 * @apiErrorExample {json} Error-Response:
 * HTTP/1.1 400
 *  {
 *      success: false,
 *      message: "Error occurred while updating Rental Status",
 *      errorsList: []
 *  }
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
 * 
 */
async function manageRentalStatus(req, res, next) {

    const uploadedFiles = [];

        let rentalStatusUpdate = req.body;
        let response = {};
        if(!rentalStatusUpdate) {
            throw new BadRequestError("VALIDATION-Invalid Request Body");
        }

        if (!rentalStatusUpdate.rentalId || (rentalStatusUpdate.rentalId && objectSize(rentalStatusUpdate.rentalId) < 12)) {
            throw new BadRequestError("VALIDATION-Rental ID is invalid");
        }
        const cartItemId = mongoose.Types.ObjectId(rentalStatusUpdate.rentalId);
        let savedRental = await Invoice.findOne({ _id: cartItemId }, { bookedByUserId: 1, rentedItems: 1, isPickUp: 1, rentalPeriod: 1, doChargeDLR: 1 });

        if(!savedRental) {
            throw new BadRequestError("VALIDATION-Invoice not found");
        }
        savedRental = savedRental._doc;
        
        const customerObj = await User.findOne({ _id: savedRental.bookedByUserId }, { fcmDeviceToken: 1 });

        const status = rentalStatusUpdate.status ? rentalStatusUpdate.status.toLowerCase() : undefined;
        if (!status || !["dispatched", "delivered", "return-started", "returned"].includes(status)) {
            throw new BadRequestError("VALIDATION-Request Type is invalid");
        }

        let rentalUpdateObj = {};
        const statusUpdateDate = new Date();

        if (status === "dispatched") {
            rentalUpdateObj = {
                rentalStatus: status,
                dispatchDate: statusUpdateDate
            };
        } else if (status === "delivered") {
            rentalUpdateObj = {
                rentalStatus: status,
                deliveryDate: statusUpdateDate
            };

            if(req.files["driverLicenseScan"] && req.files["driverLicenseScan"].length > 0) {
                let doc = req.files["driverLicenseScan"][0];
                const data = doc.location;
                const contentType = doc.mimetype;

                rentalUpdateObj.driverLicenseScan = {
                    contentType: contentType,
                    data: data
                };
            }
        } else if (status === "return-started") {
            rentalUpdateObj = {
                rentalStatus: status,
                returnStartedDate: statusUpdateDate
            };
        } else if (status === "returned") {
            // let totalChargesObj = {
            //     total: 0,
            //     rentalCharges: 0,
            //     dlrCharges: 0,
            //     t2yCommission: 0,
            //     discount: 0,
            //     lateFees: 0,
            //     cancellationCharges: 0,
            //     taxes: 0
            // };
            
            // await asyncForEach(savedRental.rentedItems, async (rentedItemBody, rentedItemIndex) => {
            //     rentedItemBody = rentedItemBody._doc;
                
            //     const rentalItemId = mongoose.Types.ObjectId(rentedItemBody.itemId);
            //     let rentedItemObj, rentalItemAdminObj;
            //     if(rentedItemBody.itemType === "trailer") {
            //         rentedItemObj = await Trailer.findOne({ _id: rentalItemId }, { adminRentalItemId: 1, rentalCharges: 1 });
            //     } else if(rentedItemBody.itemType === "upsellitem") {
            //         rentedItemObj = await UpsellItem.findOne({ _id: rentalItemId }, { adminRentalItemId: 1, rentalCharges: 1 });
            //     }

            //     if(rentedItemObj) {
            //         rentedItemObj = rentedItemObj._doc;
                
            //         if(rentedItemObj.adminRentalItemId) {
            //             if(rentedItemBody.itemType === "trailer") {
            //                 rentalItemAdminObj = await TrailerType.findOne({ _id: rentedItemObj.adminRentalItemId }, { rentalCharges: 1 });
            //             } else if(rentedItemBody.itemType === "upsellitem") {
            //                 rentalItemAdminObj = await UpsellItemType.findOne({ _id: rentedItemObj.adminRentalItemId }, { rentalCharges: 1 });
            //             }
            //             rentedItemBody.rentalCharges = rentalItemAdminObj._doc.rentalCharges;
            //         } else if(rentedItemObj.rentalCharges) {
            //             rentedItemBody.rentalCharges = rentedItemObj.rentalCharges;
            //         } else {
            //             rentedItemBody.rentalCharges = JSON.parse(JSON.stringify(rentalChargesData));
            //         }

            //         savedRental.rentedItems[rentedItemIndex] = rentedItemBody;
                    
            //         const commission = await Commission.findOne({ itemId: rentedItemObj.adminRentalItemId });
            //         const discount = await Discount.findOne({ itemId: rentedItemObj.adminRentalItemId });

            //         const rentalItemObjForCalc = {
            //             isPickUp: savedRental.isPickUp,
            //             rentalPeriod: savedRental.rentalPeriod,
            //             doChargeDLR: savedRental.doChargeDLR,
            //             rentalCharges: JSON.parse(JSON.stringify(rentedItemBody.rentalCharges))
            //         };
                
            //         rentedItemBody.totalCharges = Invoice.calculateCharges(rentalItemObjForCalc, rentalItemObjForCalc.rentalPeriod.start, rentalItemObjForCalc.rentalPeriod.end, commission, discount);
                
            //         totalChargesObj = {
            //             total:  (Math.round(((totalChargesObj.total + parseFloat(rentedItemBody.totalCharges.total)) + Number.EPSILON) * 100) / 100),
            //             rentalCharges: (Math.round(((totalChargesObj.rentalCharges + parseFloat(rentedItemBody.totalCharges.rentalCharges)) + Number.EPSILON) * 100) / 100),
            //             dlrCharges: (Math.round(((totalChargesObj.dlrCharges + parseFloat(rentedItemBody.totalCharges.dlrCharges)) + Number.EPSILON) * 100) / 100),
            //             t2yCommission: (Math.round(((totalChargesObj.t2yCommission + parseFloat(rentedItemBody.totalCharges.t2yCommission)) + Number.EPSILON) * 100) / 100),
            //             discount: (Math.round(((totalChargesObj.discount + parseFloat(rentedItemBody.totalCharges.discount)) + Number.EPSILON) * 100) / 100),
            //             lateFees: (Math.round(((totalChargesObj.lateFees + parseFloat(rentedItemBody.totalCharges.lateFees)) + Number.EPSILON) * 100) / 100),
            //             cancellationCharges: (Math.round(((totalChargesObj.cancellationCharges + parseFloat(rentedItemBody.totalCharges.cancellationCharges)) + Number.EPSILON) * 100) / 100),
            //             taxes: (Math.round(((totalChargesObj.taxes + parseFloat(rentedItemBody.totalCharges.taxes)) + Number.EPSILON) * 100) / 100)
            //         };
                                
            //         savedRental.rentedItems[rentedItemIndex] = rentedItemBody;
            //     } else {
            //         throw new BadRequestError("VALIDATION-Invalid Rental Item");
            //     }
            // });

            rentalUpdateObj = {
                rentalStatus: status,
                returnDate: statusUpdateDate,
                // totalCharges: totalChargesObj
            };
            await customerNotification(
                "Feedback",
                "Rating for Recent Booking",
                "Rating",
                cartItemId,
                customerObj.fcmDeviceToken
            )
        }

        console.log({rentalUpdateObj, cartItemId});
        await Invoice.findByIdAndUpdate(cartItemId, rentalUpdateObj)

        res.status(200).send({
            success: true,
            message: "Success"
        });
}

module.exports = manageRentalStatus;