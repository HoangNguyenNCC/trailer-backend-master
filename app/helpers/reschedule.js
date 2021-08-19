const axios = require('axios');
const BookingReq = require('../models/bookingReq');
const Invoice = require('../models/invoices');
const moment = require('moment');
const Financials = require('../models/financials');

async function reschedule(dataId){
    console.log(process.env.HOST)
    const rescheduleUrl = `${process.env.HOST}/rental/reschedule`; // TODO enter the base URL here

    let request = await BookingReq.findById(dataId);

    const data = {
        rentalId: JSON.parse(request.body).rentalId,
        start: JSON.parse(request.body).newStartDate,
        end: JSON.parse(request.body).newEndDate
    }
console.log(rescheduleUrl)
    try{
        await axios.post(rescheduleUrl, data, { headers: JSON.parse(request.headers) });
    } catch(e){
        console.error(e)
        throw new Error('Internal reschedule call error, this is probably a problem with the server'+e);
    }
    return
  
};

const rescheduleBooking = async (invoiceId, startDate, endDate, charges, bookingId) => {

    const invoice = await Invoice.findById(invoiceId).lean();
    if (!invoice) throw new error(`Unable to find rental with ID ${invoiceId} to reschedule`);


    if (!Array.isArray(charges.upsellCharges)) {
        charges.upsellCharges = Object.values(charges.upsellCharges);
    }

    const newRevision = {
        revisionType: "reschedule",
        start: moment(startDate).toISOString(),
        end: moment(endDate).toISOString(),
        requestOn: moment().toISOString(),
        requestUpdatedOn: moment().toISOString(),
        charges
    }

    const updatedInvoice = await Invoice.findByIdAndUpdate (
        invoiceId,
        {
            $set: {
                bookingId,
                rentalStatus : 'booked',
                charges,
                rentalPeriod: {
                    start: moment(startDate).toDate(),
                    end: moment(endDate).toDate()
                },
            },
            $push: {
                revisions: newRevision
            }
        },
        {
            new: true
        }
    );

    console.log(`UPDATED INVOICEE revision: ${updatedInvoice.revisions.length - 2} invoice:  ${JSON.stringify(updatedInvoice)}`);
    
    let outgoing = {
        revisionType: 'reschedule',
        amount: updatedInvoice.revisions[updatedInvoice.revisions.length - 2].charges.totalPayableAmount,
        revisedAt: new Date()
    }

    let incoming = {
        revisionType: 'reschedule',
        amount: charges.totalPayableAmount,
        revisedAt: outgoing.revisedAt
    }

   const financial =  await Financials.findOneAndUpdate({rentalId: invoiceId}, {
        $set: {
            bookingId
        },
        $push: {
            incoming,
            outgoing
        }
    }, {new: true});

    console.log(`Financial ID after reschedule ${financial._id}, invoiceID: ${invoiceId}, bookingId: ${bookingId}`);

    return updatedInvoice;
}

module.exports = rescheduleBooking;
