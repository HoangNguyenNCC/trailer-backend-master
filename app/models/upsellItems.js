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

const locationSchema = new Schema({
    type: {
        type: String, trim: true,
        default: "Point",
        enum: ["Point"]
    },
    coordinates: {
        type: [Number, Number],
        required: [true, "Address Location Coordinates is required"],
        validate: [{
            validator: (value) => {
                return (value.length === 2)
            },
            message: "Address Location Coordinates should have a length of 2"
        }]
    }
});

const addressSchema = new Schema({
    text: {
        type: String, trim: true,
        required: [true, "Address Text is required"],
        validate: [{
            validator: (value) => {
                return !validator.isEmpty(value)
            },
            message: "Address Text should not be empty"
        }]
    },
    pincode: {
        type: String, trim: true
            /* ,
                    required: [true, "Address Pincode is required"],
                    validate: [{
                        validator: (value) => {
                            return !validator.isEmpty(value)
                        },
                        message: "Address Pincode should not be empty"
                    }] */
    },
    location: {
        type: locationSchema
            /* ,
                    required: [true, "Address Location is required"] */
    }
});

let UpsellItemSchema = new Schema({
    upsellItemRef: { type: String, trim: true, unique: true },

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
    
    // address: { type: addressSchema },

    availability: { type: Boolean, require: true, default: true },
    quantity: { type: Number, default: 1  },

    // trailerId: { type: Schema.Types.ObjectId },
    trailerModel : { 
        type : Schema.Types.ObjectId
    },
    licenseeId: { type: Schema.Types.ObjectId },

    adminRentalItemId: { type: Schema.Types.ObjectId },

    isDeleted: { type: Boolean, default: false },

    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
});

// Sets the createdAt parameter equal to the current time
UpsellItemSchema.pre('save', async function(next) {
    const upsellItem = this;

    const now = new Date();
    if(!upsellItem.createdAt) {
        upsellItem.createdAt = now;
    }
    upsellItem.updatedAt = now;

    if(!upsellItem.upsellItemRef) {
        const upsellItemRef = await Counter.getNextSequence("upsellItemRef");
        upsellItem.upsellItemRef = `UPSELL${(upsellItemRef.toString()).padStart(10, '0')}`;
    }

    next();
});

UpsellItemSchema.pre('updateOne', { document: true }, async function(query, next) {
    let upsellItem = this;
    upsellItem = upsellItem._update;

    const now = new Date();
    if(!upsellItem.createdAt) {
        upsellItem.createdAt = now;
    }
    upsellItem.updatedAt = now;

    next();
});

UpsellItemSchema.statics.getAllFieldsExceptFile = function() {
    return {    
        upsellItemRef: 1,
        name: 1,
        type: 1,
        description: 1,
        
        address: 1,
    
        availability: 1,
        quantity: 1,
    
        trailerModel: 1,
        licenseeId: 1,
    
        adminRentalItemId: 1,
    
        isDeleted: 1,

        /* 
        photos: 1, 
        */

        createdAt: 1,
        updatedAt: 1
    };
};

UpsellItemSchema.statics.getAllUsefulFieldsExceptFile = function() {
    return {    
        upsellItemRef: 1,
        name: 1,
        type: 1,
        description: 1,
        
        address: 1,
    
        availability: 1,
        quantity: 1,
    
        trailerModel: 1,
        licenseeId: 1,
    
        adminRentalItemId: 1,
    
        isDeleted: 1,

        /* 
        photos: 1, 
        */

        createdAt: 1,
        updatedAt: 1
    };
};

UpsellItemSchema.statics.getAllFieldsWithExistsFile = function() {
    return {
        upsellItemRef: 1,
        name: 1,
        type: 1,
        description: 1,
        
        address: 1,
    
        availability: 1,
        quantity: 1,
    
        trailerModel: 1,
        licenseeId: 1,
    
        adminRentalItemId: 1,
    
        isDeleted: 1,
        
        "photos": { $cond: { if: { $isArray: "$photos" }, then: { $size: "$photos" }, else: 0 } },

        createdAt: 1,
        updatedAt: 1
    };
};

UpsellItemSchema.statics.getAllFieldsSpecified = function(fieldsArray) {
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

module.exports = mongoose.model('upsellitem', UpsellItemSchema);