const { Schema, model } = require('mongoose');
const { json } = require('body-parser');

const bookingReqSchema = new Schema({
    body:{
        type:String,
        require:true
    },
    headers:{
        type: String,
        require:true
    }
});

bookingReqSchema.virtual('jsonHeaders').get(function() {
    return JSON.parse(this.headers);
})

bookingReqSchema.virtual('jsonBody').get(function() {
    return JSON.parse(this.body);
})

const BookingReq = model('bookingReq', bookingReqSchema);

module.exports = BookingReq;