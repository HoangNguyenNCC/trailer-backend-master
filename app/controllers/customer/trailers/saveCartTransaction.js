const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config();
const config = process.env;

const Cart = require('../../../models/carts');


/** 
 * 
 * @api {PUT} /cart/transaction Save Details of Transaction
 * @apiName CA - Save Details of Transaction
 * @apiGroup Customer App - Trailer Rental Old
 * 
 * 
 * @apiHeader {String} authorization Authorization token sent as a response to signIn request
 * @apiHeader {String} Content-Type application/json
 * 
 * 
 * @apiParam {ObjectId} cartId Cart Id 
 * @apiParam {String} transId Access Code/Transaction Id of the Transaction
 * 
 * 
 * @apiDescription API Endpoint to be used to save Cart Transaction data
 * 
 * 
 * @apiErrorExample {json} Error-Response:
 * HTTP/1.1 400
    {
        success: false,
        message: "Error occurred while saving Cart Transaction data",
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
        message: "Successfully saved Cart Transaction data"
    }
 * 
 */

async function saveCartTrasaction(req, res, next) {

    try {
        if (!req.userId) {
            return res.status(403).send({
                success: false,
                message: "Unauthorized Access"
            });
        }

        let cartBody = req.body;
        const cartId = cartBody.cartId ? mongoose.Types.ObjectId(cartBody.cartId) : undefined;
        const savedCart = await Cart.findOne({ _id: cartId });

        if(!cartId || !savedCart) {
            return res.status(403).send({
                success: false,
                message: "Unauthorized Access"
            });
        }
        
        const cartObj = {
            transactionIdAuth: cartBody.transId
        };

        if (savedCart.bookedByUserId) {
            if(savedCart.bookedByUserId === req.userId.toString()) {
                cartObj.bookedByUserId = req.userId;
            } else {
                return res.status(403).send({
                    success: false,
                    message: "Unauthorized Access"
                });
            }
        } else {
            cartObj.bookedByUserId = req.userId;
        }

        await Cart.updateOne({ _id: cartId }, cartObj);
        // let cart = await Cart.findOne({ _id: cartId }); // WHY IS THIS NEEDED??

        res.status(200).send({
            success: true,
            message: "Successfully saved Cart Transaction data"
        });
    } catch (err) {

        let errorCode = 500;
        let errors = [];
        let errorMessage = "Error while saving Cart Transaction data";

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

module.exports = saveCartTrasaction;