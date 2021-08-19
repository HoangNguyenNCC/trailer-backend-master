const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const validator = require('validator');


const JWT_PAYLOAD_OPTIONS = {
    issuer: "Trailer2You",
    subject: "admin@trailer2you.com",
    audience: "ALL"
};

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
    country: {
        type: String, trim: true,
        required: [true, "Address Country is required"],
        validate: [{
            validator: (value) => {
                return !validator.isEmpty(value)
            },
            message: "Address Country should not be empty"
        }]
    },
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
    state: { type: String, trim: true }
});

const drivingLicenseSchema = new Schema({
    card: {
        type: String, trim: true,
        required: [true, "License Number of a Driving License is required"],
        validate: [{
            validator: (value) => {
                return !validator.isEmpty(value)
            },
            message: "License Number of a Driving License should not be empty"
        }]
    },
    expiry: {
        type: String, trim: true,
        required: [true, "Expiry Date of a Driving License is required"],
        // validate: 
        // [
        //     {
        //     validator: async (value) => {
        //         // return moment(value).isAfter(Date.now())
        //         // const valueSplit = value.split("/");
        //         // let inputDate = `20${valueSplit[1]}-${valueSplit[0]}-01`;
        //         // console.log("inside users.js",inputDate)
        //         // console.log("moment object boolean",moment(value).endOf("month").isAfter(moment()))
        //         console.log("driving license value at 115",value)
        //         return dateUtils.isValidExpiry(value);
        //     },
        //     message: "Expiry Date of a Driving License should be after Current Date"
        // }
    // ]
    },
    state: {
        type: String, trim: true,
        required: [true, "State in which a Driving License is issued is required"],
        validate: [{
            validator: (value) => {
                return !validator.isEmpty(value)
            },
            message: "State in which a Driving License should not be empty"
        }]
    },
    scan: {
        type: {
            contentType: {
                type: String, trim: true,
                required: [true, "Image of the Driving License is sent in an Invalid format"]
            },
            data: {
                type: String,
                required: [true, "Image of the Driving License is sent in an Invalid format"],
            }
        },
        required: [true, "Image of a Driving License is required"],
    },
    verified: { type: Boolean, default: false },
    accepted: { type: Boolean }
});

let UserSchema = new Schema({
    userRef: { type: String, trim: true, unique: true },

    name: {
        type: String, trim: true,
        required: [true, "Name is required"]
    },
    address: {
        type: addressSchema,
        required: [true, "Address is required"]
    },
    dob: {
        type: Date,
        required: [true, "Date of Birth is required"],
        // validate: [{
        //     validator: (value) => {
        //         console.log("dob value",value);
        //         return dateUtils.isValidDob(value);
        //     },
        //     message: "User must be atleast 16 years old"
        // }]
    },
    driverLicense: {
        type: drivingLicenseSchema,
        required: [true, "Driving License is required"]
    },
    mobile: {
        type: String, trim: true,
        unique: true,
        required: [true, "Mobile Number is required"],
        validate: [{
            validator: (value) => {
                return !validator.isEmpty(value)
            },
            message: "Mobile Number should not be empty"
        }]
    },
    email: {
        type: String, trim: true,
        unique: true,
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
    password: {
        type: String, trim: true,
        required: [true, "Password is required"],
        validate: [{
            validator: (value) => {
                const strongRegex = new RegExp("^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{8,})");
                const mediumRegex = new RegExp("^(((?=.*[a-z])(?=.*[A-Z]))|((?=.*[a-z])(?=.*[0-9]))|((?=.*[A-Z])(?=.*[0-9])))(?=.{6,})");
                return strongRegex.test(value);
            },
            message: "Password should be 8 or more characters long. Password should contain one Uppercase Alphabetical Character, one Lowercase Alphabetical Character, one Numeric Character and one Special Character"
        }]
    },
    photo: {
        type: {
            contentType: {
                type: String, trim: true,
                required: [true, "User Photo is sent in an Invalid format"]
            },
            data: {
                type: String,
                required: [true, "User Photo is sent in an Invalid format"],
            }
        }
        /* ,
                required: [true, "User Photo is required"], */
    },
    
    isMobileVerified: { type: Boolean, default: false },
    verificationRequestId: { type: String, trim: true },
    verificationResponseId: { type: String, trim: true },

    isEmailVerified: { type: Boolean, default: false },

    payToken: { type: String, trim: true },
    fcmDeviceToken: { type: String, trim: true },

    stripeCustomerId: { type: String, trim: true },

    createdAt: { type: Date, default: Date.now() },
    updatedAt: { type: Date, default: Date.now() }
});

UserSchema.index({ "mobile": 'text' });

UserSchema.pre('updateOne', { document: true }, async function(query, next) {
    let user = this;
    user = user._update;

    // if(user && user.password) {
    //     user.password = await bcrypt.hash(user.password, 10);
    // }
    const now = new Date();
    user.updatedAt = now;

    next();
});


module.exports = mongoose.model('user', UserSchema);