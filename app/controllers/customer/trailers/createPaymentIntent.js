const dotenv = require('dotenv');

dotenv.config();
const config = process.env;

const stripe = require('stripe')(config.STRIPE_SECRET);

const Invoice = require('../../../models/invoices');


/** 
 * 
 * @api {POST} /create-payment-intent Create Payment Intent
 * @apiName CA - Create Payment Intent
 * @apiGroup Customer App - Trailer Rental
 * 
 * 
 * @apiHeader {String} authorization Authorization token sent as a response to signIn request
 * @apiHeader {String} Content-Type application/json
 * 
 * 
 * @apiParam {Number} totalAmount Total Amount
 * @apiParam {Number} invoiceNumber Invoice Number
 * 
 * 
 * @apiDescription API Endpoint to be used to create Payment Intent
 * 
 * 
 * @apiErrorExample {json} Error-Response:
 * HTTP/1.1 400
 *  {
 *      success: false,
 *      message: "Could not create Payment Intent",
 *      errorsList: []
 *  }
 * 
 * 
 * @apiSuccess {Object} clientSecret Client Secret
 * 
 * 
 * @apiSuccessExample {String} - Success-Response:
 * HTTP/1.1 200 OK
 * 
    {
        clientSecret: "ABCD1234"
    }
 * 
 */
async function createPaymentIntent(req, res, next) {

    try {
        if (!req.userId) {
            return res.status(403).send({
                success: false,
                message: "Unauthorized Access"
            });
        }

        const purchase = req.body;

        const invoice = await Invoice({ invoiceNumber: purchase.invoiceNumber, bookedByUserId: req.userId });

        if(!invoice) {
            throw new Error("VALIDATION-Invoice not found");
        }

        // Replace this constant with a calculation of the order's amount
        // Calculate the order total on the server to prevent
        // people from directly manipulating the amount on the client

        // Create a PaymentIntent with the order amount and currency
        const paymentIntent = await stripe.paymentIntents.create({
            amount: purchase.totalAmount,
            currency: "aud"
        });

        res.status(200).send({
            clientSecret: paymentIntent.client_secret
        });

    } catch (err) {

        let errorCode = 500;
        let errors = [];
        let errorMessage = "Could not create Payment Intent";

        if (err && err.name && ["MongoError", "ValidationError"].includes(err.name) && err.message) {
            errorCode = 400;
            if(err.code && err.code === 11000 && err.keyValue) {
                const keys = Object.keys(err.keyValue);
                const values = Object.values(err.keyValue);
                errors.push(`Duplicate Key Error on { ${keys[0]}: ${values[0]} }`);
            } else {
                errors.push(err.message);
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
                }
            });
        } else {
            errors.push(err);
        }

        return res.status(errorCode).send({
            success: false,
            message: errorMessage,
            errorsList: errors
        });
    }
}

module.exports = createPaymentIntent;