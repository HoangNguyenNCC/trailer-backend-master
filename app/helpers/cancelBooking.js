const axios = require('axios');
const BookingReq = require('../models/bookingReq');
const Financials = require('../models/financials');

async function cancelBooking(dataId){
    const cancelUrl = `${process.env.HOST}/rental/cancel`; // TODO enter the base URL here


    let request =  await BookingReq.findById(dataId);
    // console.log(request.body)
    const data = {
        rentalId: JSON.parse(request.body).rentalId,
        NOPAYMENT: true
    }
    console.log('hereeeee', data)
    try{
        await axios.post(cancelUrl, data, { headers: JSON.parse(request.headers)}); 
    } catch(e){
        console.log('herereee')
        console.error(e)
        throw new Error('Internal extend call error, this is probably a problem with the server');
    }


    // TODO: Need to find financial and update with cancellation,
    // Can only be done once cancelation charges are integrated 


  return
};

module.exports = cancelBooking;
