const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const validator = require('validator');

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


module.exports = mongoose.model('upsellitem', UpsellItemSchema);