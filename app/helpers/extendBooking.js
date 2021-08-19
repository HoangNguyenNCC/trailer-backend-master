const axios = require('axios');
const BookingReq = require('../models/bookingReq');
const Invoice = require('./../models/invoices');
const moment = require('moment');
const Financials = require('../models/financials');

// async function extendBooking(dataId){
//     const extendUrl = `${process.env.HOST}/rental/extend`; // TODO enter the base URL here


//     let request =  await BookingReq.findById(dataId);

//     const data = {
//         rentalId: JSON.parse(request.body).rentalId,  
//         extendTill: JSON.parse(request.body).newEndDate
//     }

//     try{
//         await axios.post(extendUrl, data, { headers: JSON.parse(request.headers)});
//     } catch(e){
//         throw new Error('Internal extend call error, this is probably a problem with the server');
//     }
  
// };

const extendBooking = async (rentalId, endDate, charges, bookingId) => {

    const invoice = await Invoice.findById(rentalId).lean();

    if (!invoice) throw new Error(`Rental with ID ${rentalId} not found`);

    if (!Array.isArray(charges.upsellCharges)) {
        charges.upsellCharges = Object.values(charges.upsellCharges);
    }

    const now = moment();

    const newRevision = {
        revisionType: "extension",
        start: invoice.rentalPeriod.startDate,
        end: moment(endDate).toISOString(),
        requestOn: now.toISOString(),
        requestUpdatedOn: now.toISOString(),
        charges
    };

    const updatedInvoice = await Invoice.findByIdAndUpdate(rentalId, {
        $set: {
            bookingId,
            rentalStatus : 'booked',
            charges
        },
        $push: {
            revisions: newRevision
        }
    },
    {
        new: true
    }).lean();
    
    // extension will require only additional payments, i.e. customer will pay
    let incoming = {
        revisionType: 'extension',
        amount: updatedInvoice.revisions[-1].totalCharges.total,
        revisedAt: outgoing.revisedAt
    }

    // let financials = await Financials.findByIdAndUpdate({
    //     invoiceId,
    //     $push: {
    //         incoming: incoming
    //     }
    // });
    const financial = await Financials.findByIdAndUpdate({invoiceId}, {
        $set: {
            bookingId
        },
        $push: {
            incoming
        }
    }, {new: true});

    console.log(`Financial ID after extension ${financial._id}, invoiceID: ${invoiceId}, bookingId: ${bookingId}`);


    return updatedInvoice;

}

module.exports = extendBooking;
