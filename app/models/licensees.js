const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const validator = require('validator');
const dotenv = require('dotenv');
const fs = require('fs');
const moment = require('moment');
const rapid = require('eway-rapid');

dotenv.config();
const config = process.env;

const privateKEY = fs.readFileSync('./auth_private.key', 'utf8');
const publicKEY = fs.readFileSync('./auth_public.key', 'utf8');

const Counter = require('./counters');

const authTokenExpirationTime = 8 * 60 * 60; // 8 hours ( in seconds )
// const authTokenExpirationTime = 5 * 60; // 5 minutes ( in seconds )
const emailVerificationTokenExpTime = 24 * 60 * 60;
const passwordResetTokenExpirationTime = 15 * 60; // 15 minutes ( in seconds )

const redisClient = require('../dbs').redisClient;


const JWT_PAYLOAD_OPTIONS = {
    issuer: "Trailer2You",
    subject: "admin@trailer2you.com",
    audience: "ALL"
};


const locationSchema = new Schema({
    type: {
        type: String, trim: true,
        default: "Point",
        enum: {
            values: ["Point"],
            message: "The value of type field should be 'Point'"
        }
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
    },
    city: { type: String, trim: true },
    state: { type: String, trim: true },
    country: { type: String, trim: true }
});


let licenseeSchema = new Schema({
    licenseeRef: { type: String, trim: true, unique: true },

    name: {
        type: String, trim: true,
        required: [true, "Licensee Name is required"]
    },

    mobile: {
        type: String, trim: true, unique: true,
        required: [true, "Mobile Number is required"],
        validate: [{
            validator: (value) => {
                return !validator.isEmpty(value)
            },
            message: "Mobile Number should not be empty"
        }]
    },
    isMobileVerified: { type: Boolean, default: false },
    country: {
        type: String, trim: true,
        required: [true, "Country is required"],
        validate: [{
            validator: (value) => {
                return !validator.isEmpty(value)
            },
            message: "Country should not be empty"
        }]
    },

    email: {
        type: String, trim: true,
        unique: [true, "Account with Email already exists"],
        required: [true, "Email is required"],
        validate: [{
            validator: (value) => {
                return !validator.isEmpty(value)
            },
            message: "Email should not be empty"
        }, {
            validator: (value) => {
                return validator.isEmail(value)
            },
            message: "Email is in Invalid format"
        }]
    },
    isEmailVerified: { type: Boolean, default: false },

    businessType: {
        type: String, trim: true, lowercase: true,
        enum: ["individual", "company"],
        default: "individual"
    },

    logo: {
        type: {
            contentType: {
                type: String, trim: true,
                required: [true, "Licensee Logo is sent in an Invalid format"]
            },
            data: {
                type: String,
                required: [true, "Licensee Logo is sent in an Invalid format"],
            }
        }
    },

    address: {
        type: addressSchema,
        required: [true, "Licensee Address is required"]
    },
    licenseeLocations: {
        type: [addressSchema],
        required: [true, "Licensee Location is required"]
    },
    radius: {
        type: Number,
        default: 100
    },

    proofOfIncorporation: {
        type: {
            contentType: {
                type: String, trim: true,
                required: [true, "Proof of Incorporation for Licensee is sent in an Invalid format"]
            },
            data: {
                type: String,
                required: [true, "Proof of Incorporation for Licensee is sent in an Invalid format"],
            },
            verified: { type: Boolean, default: false },
            accepted: { type: Boolean , default:false }
        },
        required: [true, "Licensee Proof of Incorporation is required"]
    },

    bsbNumber: { type: String, trim: true },

    availability: { type: Boolean, default: true },

    workingDays: { 
        type: [ 
            { 
                type: String, trim: true,
                lowercase: true,
                enum: ["monday","tuesday","wednesday","thursday","friday", "saturday", "sunday"]
            }
        ],
        default: ["monday","tuesday","wednesday","thursday","friday"]
    },
    workingHours: {
        type: String, trim: true,
        default: "1000-1900"
    },

    stripeAccountId: { type: String, trim: true },
    stripeAccountVerified: { type: String, trim: true },
    accountNumber: { type: String, trim: true },
    mcc: { type: String, trim: true, default: "7513" },
    url: { type: String, trim: true },
    productDescription: { type: String, trim: true, default: "Trailer Rental" },
    tosAcceptanceDate: { type: Date },
    tosAcceptanceIP: { type: String, trim: true },
    taxId: { type: String, trim: true },

    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
});

licenseeSchema.index({ "address.location": '2dsphere' });

// Sets the createdAt parameter equal to the current time
licenseeSchema.pre('save', async function(next) {
    const licensee = this;

    const now = new Date();
    if (!licensee.createdAt) {
        licensee.createdAt = now;
    }
    licensee.updatedAt = now;

    if(!licensee.licenseeRef) {
        const licenseeRef = await Counter.getNextSequence("licenseeRef");
        licensee.licenseeRef = `LICENSEE${(licenseeRef.toString()).padStart(10, '0')}`;
    }

    next();
});
licenseeSchema.pre('updateOne', {document:true},async function(query,next) {
    let licensee = this;
    licensee = licensee._update;
    const now = new Date();

    if(licensee && licensee.password) {
        licensee.password = await bcrypt.hash(licensee.password, 10);
    }
    if(!licensee.createdAt) {
        licensee.createdAt = now;
    }
    licensee.updatedAt = now;

    next();
});

licenseeSchema.methods.newEmailVerificationToken = async function() {
    try {
        const licensee = this;

        const signOptions = {
            issuer: JWT_PAYLOAD_OPTIONS.issuer,
            subject: JWT_PAYLOAD_OPTIONS.subject,
            audience: JWT_PAYLOAD_OPTIONS.audience,
            expiresIn: emailVerificationTokenExpTime,
            algorithm: "RS256"
        }

        const token = jwt.sign({ _id: licensee._id.toString() }, privateKEY, signOptions);

        return token;
    } catch (e) {
        console.error("Error in Generating Token");
    }
};

licenseeSchema.statics.verifyEmailVerificationToken = function(token) {
    try {
        // const verifiedObject = jwt.verify(token, config.PRIVATE_KEY_AUTH);

        const verifyOptions = {
            issuer: JWT_PAYLOAD_OPTIONS.issuer,
            subject: JWT_PAYLOAD_OPTIONS.subject,
            audience: JWT_PAYLOAD_OPTIONS.audience,
            expiresIn: emailVerificationTokenExpTime,
            algorithm: ["RS256"]
        };
        const verifiedObject = jwt.verify(token, publicKEY, verifyOptions);

        if (verifiedObject && verifiedObject._id) {
            return verifiedObject;
        }
        return false;
    } catch (e) {
        console.error("verifyAuthToken", e);
        return false;
    }
};

licenseeSchema.statics.getAllFieldsExceptFile = function() {
    return {    
        licenseeRef: 1,
        name: 1,
    
        mobile: 1,
        isMobileVerified: 1,
        country: 1,
    
        email: 1,
        isEmailVerified: 1,
    
        businessType: 1,
    
        address: 1,
        licenseeLocations: 1,
        radius: 1,
    
        availability: 1,
    
        workingDays: 1,
        workingHours: 1,
    
        stripeAccountId: 1,
        stripeAccountVerified: 1,

        bsbNumber: 1,
        accountNumber: 1,

        mcc: 1,
        url: 1,
        productDescription: 1,
        tosAcceptanceDate: 1,
        tosAcceptanceIP: 1,
        taxId: 1,

        /* logo: 1,
        proofOfIncorporation: 1, */
        "proofOfIncorporation.verified": 1,
        "proofOfIncorporation.accepted": 1,

        createdAt: 1,
        updatedAt: 1
    };
};

licenseeSchema.statics.getAllUsefulFieldsExceptFile = function() {
    return {    
        licenseeRef: 1,
        name: 1,
    
        mobile: 1,
        isMobileVerified: 1,
        country: 1,
    
        email: 1,
        isEmailVerified: 1,
    
        businessType: 1,
    
        address: 1,
        licenseeLocations: 1,
        radius: 1,
    
        availability: 1,
    
        workingDays: 1,
        workingHours: 1,
    
        stripeAccountId: 1,
        stripeAccountVerified: 1,

        bsbNumber: 1,
        accountNumber: 1,

        mcc: 1,
        url: 1,
        productDescription: 1,
        tosAcceptanceDate: 1,
        tosAcceptanceIP: 1,
        taxId: 1,

        /* logo: 1,
        proofOfIncorporation: 1, */
        "proofOfIncorporation.verified": 1,
        "proofOfIncorporation.accepted": 1,

        createdAt: 1,
        updatedAt: 1
    };
};

licenseeSchema.statics.getAllFieldsWithExistsFile = function() {
    return {    
        licenseeRef: 1,
        name: 1,
    
        mobile: 1,
        isMobileVerified: 1,
        country: 1,
    
        email: 1,
        isEmailVerified: 1,
    
        businessType: 1,
    
        address: 1,
        licenseeLocations: 1,
        radius: 1,
    
        availability: 1,
    
        workingDays: 1,
        workingHours: 1,
    
        stripeAccountId: 1,
        stripeAccountVerified: 1,

        bsbNumber: 1,
        accountNumber: 1,

        mcc: 1,
        url: 1,
        productDescription: 1,
        tosAcceptanceDate: 1,
        tosAcceptanceIP: 1,
        taxId: 1,

        "logo": { $cond: { if: { $ifNull: ["$logo", false] }, then: false, else: true } },
    
        "proofOfIncorporation.verified": 1,
        "proofOfIncorporation.accepted": 1,
        "proofOfIncorporation.scan": { $cond: { if: { $ifNull: ["$proofOfIncorporation.scan", false] }, then: false, else: true } },
    
        createdAt: 1,
        updatedAt: 1
    };
};

licenseeSchema.statics.getAllFieldsSpecified = function(fieldsArray) {
    const fieldsObj = {};

    fieldsArray.forEach((fieldName) => {
        if(fieldName === "proofOfIncorporation") {
            fieldsObj["proofOfIncorporation.verified"] = 1;
            fieldsObj["proofOfIncorporation.accepted"] = 1;
            fieldsObj["proofOfIncorporation.scan"] = { $cond: { if: { $ifNull: ["$proofOfIncorporation.scan", false] }, then: true, else: false } };
            fieldsObj["proofOfIncorporation.documentType"] = { $cond: { if: { $ifNull: ["$proofOfIncorporation.scan.contentType", false] }, then: "$proofOfIncorporation.scan.contentType", else: "" } };
        } else if(fieldName === "proofOfIncorporation.scan") {
            fieldsObj["proofOfIncorporation.scan"] = { $cond: { if: { $ifNull: ["$proofOfIncorporation.scan", false] }, then: true, else: false } };
            fieldsObj["proofOfIncorporation.documentType"] = { $cond: { if: { $ifNull: ["$proofOfIncorporation.scan.contentType", false] }, then: "$proofOfIncorporation.scan.contentType", else: "" } };
        } else if(fieldName === "logo") {
            fieldsObj["logo"] = { $cond: { if: { $ifNull: ["$logo", false] }, then: true, else: false } };
        } else {
            fieldsObj[fieldName] = 1;
        }
    });

    return fieldsObj;
};

module.exports = mongoose.model('licensee', licenseeSchema);