const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const validator = require('validator');
const dotenv = require('dotenv');

dotenv.config();
const config = process.env;

const Counter = require('./counters');

const objectSize = require('../helpers/objectSize');
const constants = require('../helpers/constants');

const photosSchema = new Schema({
    contentType: {
        type: String, trim: true,
        required: [true, "Photo is sent in an Invalid format"],
        validate: [{
            validator: (value) => {
                return !validator.isEmpty(value)
            },
            message: "Photo Content Type should not be empty"
        }]
    },
    data: {
        type: String,
        required: [true, "Photo is sent in an Invalid format"],
        validate: [{
            validator: (value) => {
                return (objectSize(value) < constants.maxPictureSize)
            },
            message: `Size of the Photo data should not exceed 2MB`
        }]
    }
});

const chargesSchema = new Schema({
    duration: {
        type: Number,
        required: [true, "Charges Duration is required"],
        min: 1
    },
    charges: {
        type: Number,
        required: [true, "Charges Value is required"],
        min: 1
    }
});

const salesChargesSchema = new Schema({
    units: {
        type: Number,
        required: [true, "Units is required"],
        min: 1
    },
    price: {
        type: Number,
        required: [true, "Price is required"],
        min: 1
    }
});

let UpsellItemTypeSchema = new Schema({
    upsellItemTypeRef: { type: String, trim: true, unique: true },

    name: {
        type: String, trim: true,
        required: [true, "Upsell Item Name is required"],
        validate: [{
            validator: (value) => {
                return !validator.isEmpty(value)
            },
            message: "Upsell Item Name should not be empty"
        }]
    },
    type: {
        type: String, trim: true,
        required: [true, "Upsell Item Type is required"],
        validate: [{
            validator: (value) => {
                return !validator.isEmpty(value)
            },
            message: "Upsell Item Type should not be empty"
        }]
    },
    description: {
        type: String, trim: true,
        required: [true, "Upsell Item Description is required"],
        validate: [{
            validator: (value) => {
                return !validator.isEmpty(value)
            },
            message: "Upsell Item Description should not be empty"
        }]
    },
    photos: {
        type: [photosSchema],
        required: [true, "Upsell Item Photos are required"],
        validate: [{
            validator: (value) => {
                return (value.length > 0)
            },
            message: "Atleast 1 Photo of a Upsell Item should be provided"
        }, {
            validator: (value) => {
                return (value.length <= constants.maxNumberOfPictures)
            },
            message: `Maximum ${constants.maxNumberOfPictures} Photos of a Upsell Item should be provided`
        }]
    },
    rentalCharges: {
        type: {
            pickUp: [{
                type: chargesSchema
            }],
            door2Door: [{
                type: chargesSchema
            }],
        }
    },
    dlrCharges: { // Damage Liability Reduction
        type: Number,
        require: [true, "DLR Charges is required"]
    },
    salesCharges: {
        type: salesChargesSchema
    },
    availability: {
        type: Boolean,
        default: true,
        required: true
    },

    isFeatured: {
        type: Boolean,
        default: false,
        required: true
    },
    trailerId: { type: Schema.Types.ObjectId },

    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
});


// Sets the createdAt parameter equal to the current time
UpsellItemTypeSchema.pre('save', async function(next) {
    const upsellItem = this;

    const now = new Date();
    if(!upsellItem.createdAt) {
        upsellItem.createdAt = now;
    }
    upsellItem.updatedAt = now;

    if(!upsellItem.upsellItemTypeRef) {
        const upsellItemTypeRef = await Counter.getNextSequence("upsellItemTypeRef");
        upsellItem.upsellItemTypeRef = `UPSELLTYPE${(upsellItemTypeRef.toString()).padStart(10, '0')}`;
    }

    next();
});

UpsellItemTypeSchema.pre('updateOne', { document: true }, async function(query, next) {
    let upsellItem = this;
    upsellItem = upsellItem._update;

    const now = new Date();
    if(!upsellItem.createdAt) {
        upsellItem.createdAt = now;
    }
    upsellItem.updatedAt = now;

    next();
});

UpsellItemTypeSchema.statics.getAllFieldsExceptFile = function() {
    return {    
        upsellItemTypeRef: 1,
        name: 1,
        type: 1,
        description: 1,
        
        rentalCharges: 1,
        dlrCharges: 1,
        salesCharges: 1,
        availability: 1,
    
        isFeatured: 1,
        trailerId: 1,

        /* 
        photos: 1, 
        */

        createdAt: 1,
        updatedAt: 1
    };
};

UpsellItemTypeSchema.statics.getAllUsefulFieldsExceptFile = function() {
    return {   
        upsellItemTypeRef: 1, 
        name: 1,
        type: 1,
        description: 1,
        
        rentalCharges: 1,
        dlrCharges: 1,
        salesCharges: 1,
        availability: 1,
    
        isFeatured: 1,
        trailerId: 1,

        /* 
        photos: 1, 
        */

        createdAt: 1,
        updatedAt: 1
    };
};

UpsellItemTypeSchema.statics.getAllFieldsWithExistsFile = function() {
    return {
        upsellItemTypeRef: 1,
        name: 1,
        type: 1,
        description: 1,
        
        rentalCharges: 1,
        dlrCharges: 1,
        salesCharges: 1,
        availability: 1,
    
        isFeatured: 1,
        trailerId: 1,
        
        "photos": { $cond: { if: { $isArray: "$photos" }, then: { $size: "$photos" }, else: 0 } },

        createdAt: 1,
        updatedAt: 1
    };
};

UpsellItemTypeSchema.statics.getAllFieldsSpecified = function(fieldsArray) {
    const fieldsObj = {};

    fieldsArray.forEach((fieldName) => {
        if(fieldName === "photos") {
            fieldsObj["photos"] = { $cond: { if: { $isArray: "$photos" }, then: { $size: "$photos" }, else: 0 } };
        } else {
            fieldsObj[fieldName] = 1;
        }
    });

    return fieldsObj;
};

module.exports = mongoose.model('upsellitemtype', UpsellItemTypeSchema);