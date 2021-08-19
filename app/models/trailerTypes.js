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

let TrailerTypeSchema = new Schema({
    trailerTypeRef: { type: String, trim: true, unique: true },

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
    isFeatured: {
        type: Boolean,
        default: false,
        required: true
    },
    availability: {
        type: Boolean,
        default: true,
        required: true
    },

    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
});

TrailerTypeSchema.pre('save', async function(next) {
    const trailer = this;

    const now = new Date();
    if(!trailer.createdAt) {
        trailer.createdAt = now;
    }
    trailer.updatedAt = now;

    if(!trailer.trailerTypeRef) {
        const trailerTypeRef = await Counter.getNextSequence("trailerTypeRef");
        trailer.trailerTypeRef = `TRAILERTYPE${(trailerTypeRef.toString()).padStart(10, '0')}`;
    }

    next();
});

TrailerTypeSchema.pre('updateOne', { document: true }, async function(query, next) {
    let trailer = this;
    trailer = trailer._update;

    const now = new Date();
    if(!trailer.createdAt) {
        trailer.createdAt = now;
    }
    trailer.updatedAt = now;

    next();
});

TrailerTypeSchema.statics.getAllFieldsExceptFile = function() {
    return {   
        trailerTypeRef: 1, 
        name: 1,
        type: 1,
        description: 1,
        size: 1,
        capacity: 1,
        tare: 1,
        features: 1,
        rentalCharges: 1,
        dlrCharges: 1,
        isFeatured: 1,
        availability: 1,

        /* 
        photos: 1, 
        */

        createdAt: 1,
        updatedAt: 1
    };
};

TrailerTypeSchema.statics.getAllUsefulFieldsExceptFile = function() {
    return {    
        trailerTypeRef: 1,
        name: 1,
        type: 1,
        description: 1,
        size: 1,
        capacity: 1,
        tare: 1,
        features: 1,
        rentalCharges: 1,
        dlrCharges: 1,
        isFeatured: 1,
        availability: 1,

        /* 
        photos: 1, 
        */

        createdAt: 1,
        updatedAt: 1
    };
};

TrailerTypeSchema.statics.getAllFieldsWithExistsFile = function() {
    return {
        trailerTypeRef: 1,
        name: 1,
        type: 1,
        description: 1,
        size: 1,
        capacity: 1,
        tare: 1,
        features: 1,
        rentalCharges: 1,
        dlrCharges: 1,
        isFeatured: 1,
        availability: 1,
        
        "photos": { $cond: { if: { $isArray: "$photos" }, then: { $size: "$photos" }, else: 0 } },

        createdAt: 1,
        updatedAt: 1
    };
};

TrailerTypeSchema.statics.getAllFieldsSpecified = function(fieldsArray) {
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

module.exports = mongoose.model('trailertype', TrailerTypeSchema);