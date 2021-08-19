const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const validator = require('validator');
const dotenv = require('dotenv');

dotenv.config();
const config = process.env;

const reversalsSchema = new Schema({
    object: String,
    data: [String],
    has_more: Boolean,
    total_count: Number,
    url: String
});

const stripeTransfersSchema = new Schema({
    id: String,
    object: String, // transfer
    amount: Number,
    amount_reversed: Number,
    balance_transaction: String,
    created: Number,
    currency: String, // aud
    description: String,
    destination: String,
    destination_payment: String,
    livemode: Boolean,
    reversals: reversalsSchema,
    reversed: Boolean,
    source_transaction: String,
    source_type: String, // card or online
    transfer_group: String
});

//GET FINANCIALS MIGH BREAK
let licenseePayoutsSchema = new Schema({
    stripePayoutId: {
        type:String,
        unique: true,
        trim:true,
        required: true
    },
    licenseeId: {
        type:String,
        trim:true,
        required: true
    },
    rentalId: {
        type : String,
        trim : true,
        required : true
    },
    amount: {
        type:Number,
        trim:true,
        required: true
    },
    remarks : {
        type : String,
        trim : true,
        required :true,
    },
    destination: {
        type:String,
        trim:true,
        required:true
    },
    completed:{
        type:Boolean,
        default:false
    },
    sentBy:{
        type:Schema.Types.ObjectId,
        required: true
    },
    transfer: {
        type: stripeTransfersSchema,
        required: true
    }
});


module.exports = mongoose.model('licenseePayout', licenseePayoutsSchema);