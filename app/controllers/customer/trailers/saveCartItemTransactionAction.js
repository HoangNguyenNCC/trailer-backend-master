const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config();
const config = process.env;

const CartItem = require('../../../models/cartItems');


/** 
 * 
 * @api {PUT} /rental/transaction/action Save Details of Transaction Action for Rental Item
 * @apiName CA - Save Details of Transaction Action for Rental Item
 * @apiGroup Customer App - Trailer Rental Old
 * 
 * 
 * @apiHeader {String} authorization Authorization token sent as a response to signIn request
 * @apiHeader {String} Content-Type application/json
 * 
 * 
 * @apiParam {ObjectId} rentalId Cart/Rental Item Id
 * @apiParam {String} actionType Action Type = "capture" || "cancel"
 * @apiParam {String} transId Access Code/Transaction Id of the Transaction
 * @apiParam {String} amount Amount Captured
 * 
 * 
 * @apiDescription API Endpoint to be used to save Cart Item or Rental Transaction Action ( Capture or Cancel ) data
 * 
 * 
 * @apiErrorExample {json} Error-Response:
 * HTTP/1.1 400
    {
        success: false,
        message: "Error occurred while saving Cart Item or Rental Transaction Action ( Capture or Cancel ) data",
        errorsList: []
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
        message: "Successfully saved Cart Item or Rental Transaction Action ( Capture or Cancel ) data"
    }
 * 
 */

async function saveCartItemTrasactionAction(req, res, next) {

    try {
        if (!req.userId) {
            return res.status(403).send({
                success: false,
                message: "Unauthorized Access"
            });
        }

        let rentalBody = req.body;
        const rentalId = rentalBody.rentalId ? mongoose.Types.ObjectId(rentalBody.rentalId) : undefined;
        const savedRental = await CartItem.findOne({ _id: rentalId });

        if(!rentalId || !savedRental) {
            return res.status(403).send({
                success: false,
                message: "Unauthorized Access"
            });
        }

        if(!cartBody.actionType || !["capture", "cancel"].includes(cartBody.actionType)) {
            throw new Error("VALIDATION-Invalid Action Type");
        }
        
        const rentalObj = {
            authTransactionAction: cartBody.actionType,
            transactionIdAction: cartBody.transId,
            totalPaid: cartBody.amount,
            transactionActionDate: new Date()
        };

        if(savedRental.bookedByUserId === req.userId.toString()) {
            rentalObj.bookedByUserId = req.userId;
        } else {
            return res.status(403).send({
                success: false,
                message: "Unauthorized Access"
            });
        }

        await CartItem.updateOne({ _id: rentalId }, rentalObj);
        // let cartItem = await CartItem.findOne({ _id: rentalId });

        res.status(200).send({
            success: true,
            message: "Successfully saved Cart Item or Rental Transaction Action ( Capture or Cancel ) data"
        });
    } catch (err) {

        let errorCode = 500;
        let errors = [];
        let errorMessage = "Error while saving Cart Item or Rental Transaction Action ( Capture or Cancel ) data";

        if (err && err.name && ["MongoError", "ValidationError"].includes(err.name) && err.message) {
            errorCode = 400;
            if(err.code && err.code === 11000 && err.keyValue) {
                const keys = Object.keys(err.keyValue);
                const values = Object.values(err.keyValue);
                errorMessage = `Duplicate Key Error on { ${keys[0]}: ${values[0]} }`;
                errors.push(errorMessage);
            } else {
                errorMessage = err.message;
                errors.push(errorMessage);
            }
        } else if (err && err.message) {
            errorCode = err.message.startsWith("VALIDATION-") ? 400 : 500;
            const errorComp = err.message.split("VALIDATION-");
            errorMessage = errorComp.length > 1 ? errorComp[1] : errorComp[0];
            errors.push(errorMessage);
        } else if (err && err.errors) {
            errorCode = 400;
            const fieldKeys = Object.keys(err.errors);
            fieldKeys.forEach((fieldKey) => {
                if (fieldKey.split(".").length === 1) {
                    errors.push(err.errors[fieldKey].message);
                    if(err.errors[fieldKey].message) {
                        errorMessage = err.errors[fieldKey].message;
                    }
                }
            });
        } else {
            if(err) {
                errorMessage = err;
            }
            errors.push(err);
        }

        return res.status(errorCode).send({
            success: false,
            message: errorMessage,
            errorsList: errors
        });
    }
}

module.exports = saveCartItemTrasactionAction;