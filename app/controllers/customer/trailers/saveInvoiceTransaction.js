const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config();
const config = process.env;

const Invoice = require('../../../models/invoices');
const { UnauthorizedError } = require('../../../helpers/errors');

/** 
 * 
 * @api {PUT} /invoice/transaction Save Details of Transaction Authorisation for Rental Item
 * @apiName CA - Save Details of Transaction Authorisation for Rental Item
 * @apiGroup Customer App - Trailer Rental
 * 
 * 
 * @apiHeader {String} authorization Authorization token sent as a response to signIn request
 * @apiHeader {String} Content-Type application/json
 * 
 * 
 * @apiParam {String} invoiceId Invoice Id
 * @apiParam {String} transId Access Code/Transaction Id of the Transaction
 * 
 * 
 * @apiDescription API Endpoint to be used to save Invoice Transaction data
 * 
 * 
 * @apiErrorExample {json} Error-Response:
 * HTTP/1.1 400
    {
        success: false,
        message: "Could not save Transaction data",
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
        message: "Success"
    }
 * 
 */

async function saveInvoiceTrasaction(req, res, next) {

    if (!req.userId) throw new UnauthorizedError('UnAuthorized Access');

    let invoiceBody = req.body;
    const invoiceId = invoiceBody.invoiceId ? mongoose.Types.ObjectId(invoiceBody.invoiceId) : undefined;
    let savedInvoice = await Invoice.findOne({ _id: invoiceId }, { bookedByUserId: 1 });

    if(!invoiceId || !savedInvoice) throw new UnauthorizedError('UnAuthorized Access');
    savedInvoice = savedInvoice._doc;
    
    const rentalObj = {
        transactionIdAuth: invoiceBody.transId,
        transactionAuthDate: new Date()
    };

    if(savedInvoice.bookedByUserId.toString() === req.userId.toString()) {
        rentalObj.bookedByUserId = req.userId;
    } else throw new UnauthorizedError('UnAuthorized Access');

    await Invoice.updateOne({ _id: invoiceId }, rentalObj);
    // let invoice = await Invoice.findOne({ _id: invoiceId });

    res.status(200).send({
        success: true,
        message: "Success"
    });
}

module.exports = saveInvoiceTrasaction;