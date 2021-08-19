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

let TrailerSchema = new Schema({
    trailerRef: { type: String, trim: true, unique: true },

    name: {
        type: String, trim: true,
        required: [true, "Trailer Name is required"],
        validate: [{
            validator: (value) => {
                return !validator.isEmpty(value)
            },
            message: "Trailer Name should not be empty"
        }]
    },
    vin: {
        type: String, trim: true,
        required: [true, "VIN is required"],
        validate: [{
            validator: (value) => {
                return !validator.isEmpty(value)
            },
            message: "VIN should not be empty"
        }]
    },
    type: {
        type: String, trim: true,
        required: [true, "Trailer Type is required"],
        validate: [{
            validator: (value) => {
                return !validator.isEmpty(value)
            },
            message: "Trailer Type should not be empty"
        }]
    },
    description: {
        type: String, trim: true,
        required: [true, "Trailer Description is required"],
        validate: [{
            validator: (value) => {
                return !validator.isEmpty(value)
            },
            message: "Trailer Description should not be empty"
        }]
    },
    size: {
        type: String, trim: true,
        required: [true, "Trailer Size is required"],
        validate: [{
            validator: (value) => {
                return !validator.isEmpty(value)
            },
            message: "Trailer Size should not be empty"
        }]
    },
    capacity: {
        type: String, trim: true,
        required: [true, "Trailer Capacity is required"],
        validate: [{
            validator: (value) => {
                return !validator.isEmpty(value)
            },
            message: "Trailer Capacity should not be empty"
        }]
    },
    tare: {
        type: String, trim: true,
        required: [true, "Trailer Tare Weight is required"],
        validate: [{
            validator: (value) => {
                return !validator.isEmpty(value)
            },
            message: "Trailer Tare Weight should not be empty"
        }]
    },
    age: {
        type: Number,
        required: [true, "Trailer Age is required"]
    },
    features: {
        type: [{
            type: String, trim: true,
            required: [true, "Trailer Feature Text is required"],
            validate: [{
                validator: (value) => {
                    return !validator.isEmpty(value)
                },
                message: "Trailer Feature Text should not be empty"
            }]
        }],
        required: [true, "Trailer Features are required"]
    },
    photos: {
        type: [photosSchema],
        required: [true, "Trailer Photos are required"],
        validate: [{
            validator: (value) => {
                return (value.length > 0)
            },
            message: "Atleast 1 Photo of a Trailer should be provided"
        }, {
            validator: (value) => {
                return (value.length <= constants.maxNumberOfPictures)
            },
            message: `Maximum ${constants.maxNumberOfPictures} Photos of a Trailer should be provided`
        }]
    },
    availability: { type: Boolean, default: true },

    trailerModel : {
        type : mongoose.Types.ObjectId
    },
    
    upsellItems : [{
        upsellItemId:{type:mongoose.Types.ObjectId}
    }],

    rating: {
        type: Number,
        default: 0
    },

    ratingCount : {
        type : Number,
        default : 0
    },

    address: { type: addressSchema },
    isFeatured: { type: Boolean, default: false },

    licenseeId: { type: Schema.Types.ObjectId },
    adminRentalItemId: { type: Schema.Types.ObjectId },

    isDeleted: { type: Boolean, default: false },

    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
});

TrailerSchema.index({ "address.location": '2dsphere' });

// Sets the createdAt parameter equal to the current time
TrailerSchema.pre('save', async function(next) {
    const trailer = this;

    const now = new Date();
    if(!trailer.createdAt) {
        trailer.createdAt = now;
    }
    trailer.updatedAt = now;

    if(!trailer.trailerRef) {
        const trailerRef = await Counter.getNextSequence("trailerRef");
        trailer.trailerRef = `TRAILER${(trailerRef.toString()).padStart(10, '0')}`;
    }

    next();
});

TrailerSchema.pre('updateOne', { document: true }, async function(query, next) {
    let trailer = this;
    trailer = trailer._update;

    const now = new Date();
    if(!trailer.createdAt) {
        trailer.createdAt = now;
    }
    trailer.updatedAt = now;

    next();
});

TrailerSchema.statics.getAllFieldsExceptFile = function() {
    return {    
        trailerRef: 1,
        name: 1,
        vin: 1,
        type: 1,
        description: 1,
        size: 1,
        capacity: 1,
        tare: 1,
        age: 1,
        features: 1,
        availability: 1,
    
        address: 1,
        isFeatured: 1,
    
        licenseeId: 1,
        adminRentalItemId: 1,

        trailerModel:1,
        upsellItems:1,
    
        isDeleted: 1,

        /* 
        photos: 1, 
        */

        createdAt: 1,
        updatedAt: 1
    };
};

TrailerSchema.statics.getAllUsefulFieldsExceptFile = function() {
    return {    
        trailerRef: 1,
        name: 1,
        vin: 1,
        type: 1,
        description: 1,
        size: 1,
        capacity: 1,
        tare: 1,
        age: 1,
        features: 1,
        availability: 1,
    
        address: 1,
        isFeatured: 1,
    
        licenseeId: 1,
        adminRentalItemId: 1,

        trailerModel:1,
        upsellItems:1,
    
        isDeleted: 1,

        /* 
        photos: 1, 
        */

        createdAt: 1,
        updatedAt: 1
    };
};

TrailerSchema.statics.getAllFieldsWithExistsFile = function() {
    return {
        trailerRef: 1,
        name: 1,
        vin: 1,
        type: 1,
        description: 1,
        size: 1,
        capacity: 1,
        tare: 1,
        age: 1,
        features: 1,
        availability: 1,

        trailerModel:1,
        upsellItems:1,
    
        address: 1,
        isFeatured: 1,
    
        licenseeId: 1,
        adminRentalItemId: 1,
    
        isDeleted: 1,
        
        "photos": { $cond: { if: { $isArray: "$photos" }, then: { $size: "$photos" }, else: 0 } },

        createdAt: 1,
        updatedAt: 1
    };
};

TrailerSchema.statics.getAllFieldsSpecified = function(fieldsArray) {
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

module.exports = mongoose.model('trailer', TrailerSchema);