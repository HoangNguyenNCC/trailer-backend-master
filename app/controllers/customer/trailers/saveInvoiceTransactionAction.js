const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config();
const config = process.env;

const Invoice = require('../../../models/invoices');
const { UnauthorizedError } = require('../../../helpers/errors');

/** 
 * 
 * @api {PUT} /invoice/transaction/action Save Details of Transaction Action for Rental Item
 * @apiName CA - Save Details of Transaction Action for Rental Item
 * @apiGroup Customer App - Trailer Rental
 * 
 * 
 * @apiHeader {String} authorization Authorization token sent as a response to signIn request
 * @apiHeader {String} Content-Type application/json
 * 
 * 
 * @apiParam {String} invoiceId Invoice Id
 * @apiParam {String} actionType Action Type = "capture" || "cancel"
 * @apiParam {String} transId Access Code/Transaction Id of the Transaction
 * @apiParam {String} amount Amount Captured
 * 
 * 
 * @apiDescription API Endpoint to be used to save Invoice Transaction Action ( Capture or Cancel ) data
 * 
 * 
 * @apiErrorExample {json} Error-Response:
 * HTTP/1.1 400
    {
        success: false,
        message: "Could not save Transaction Action ( Capture or Cancel ) data",
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

async function saveInvoiceTrasactionAction(req, res, next) {

    if (!req.userId) throw new UnauthorizedError('UnAuthorized Access');

    let invoiceBody = req.body;
    const invoiceId = invoiceBody.invoiceId ? mongoose.Types.ObjectId(invoiceBody.invoiceId) : undefined;
    let savedInvoice = await Invoice.findOne({ _id: invoiceId }, { bookedByUserId: 1 });

    if(!invoiceId || !savedInvoice) throw new UnauthorizedError('UnAuthorized Access');
    savedInvoice = savedInvoice._doc;

    if(!invoiceBody.actionType || !["capture", "cancel"].includes(invoiceBody.actionType)) {
        throw new BadRequestError("Invalid Action Type");
    }
    
    const rentalObj = {
        authTransactionAction: invoiceBody.actionType,
        transactionIdAction: invoiceBody.transId,
        totalPaid: invoiceBody.amount,
        transactionActionDate: new Date()
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

module.exports = saveInvoiceTrasactionAction;