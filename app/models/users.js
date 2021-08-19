const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const validator = require('validator');
const dotenv = require('dotenv');
const fs = require('fs');
const moment = require('moment');
const rapid = require('eway-rapid');
const dateUtils = require('./../helpers/dateUtils');

dotenv.config();
const config = process.env;

const Counter = require('./counters');

const privateKEY = fs.readFileSync('./auth_private.key', 'utf8');
const publicKEY = fs.readFileSync('./auth_public.key', 'utf8');

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
        validate: 
        // [
            {
            validator: async (value) => {
                // return moment(value).isAfter(Date.now())
                // const valueSplit = value.split("/");
                // let inputDate = `20${valueSplit[1]}-${valueSplit[0]}-01`;
                // console.log("inside users.js",inputDate)
                // console.log("moment object boolean",moment(value).endOf("month").isAfter(moment()))
                console.log("driving license value at 115",value)
                return dateUtils.isValidExpiry(value);
            },
            message: "Expiry Date of a Driving License should be after Current Date"
        }
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
        validate: [{
            validator: (value) => {
                console.log("dob value",value);
                return dateUtils.isValidDob(value);
            },
            message: "User must be atleast 16 years old"
        }]
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
    userRating:{
        type:Number,
        default:0
    },

    ratingCount:{
        type:Number,
        default:0
    },
    
    isMobileVerified: { type: Boolean, default: false },
    verificationRequestId: { type: String, trim: true },
    verificationResponseId: { type: String, trim: true },

    isEmailVerified: { type: Boolean, default: false },

    payToken: { type: String, trim: true },
    fcmDeviceToken: { type: String, trim: true },

    stripeCustomerId: { type: String, trim: true },
    fcmDeviceToken : { type : String , trim:true},

    createdAt: { type: Date, default: Date.now() },
    updatedAt: { type: Date, default: Date.now() }
});

UserSchema.index({ "mobile": 'text' });

// Sets the createdAt parameter equal to the current time
UserSchema.pre('save', async function(next) {
    const user = this;

    if(user && user.password) {
        user.password = await bcrypt.hash(user.password, 10);
    }

    const now = new Date();
    if (!user.createdAt) {
        user.createdAt = now;
    }
    user.updatedAt = now;

    if(!user.userRef) {
        const userRef = await Counter.getNextSequence("userRef");
        user.userRef = `CUST${(userRef.toString()).padStart(10, '0')}`;
    }

    next();
});

UserSchema.pre('updateOne', { document: true }, async function(query, next) {
    let user = this;
    user = user._update;
    

    if(user && user.password) {
        user.password = await bcrypt.hash(user.password, 10);
    }
    const now = new Date();
    user.updatedAt = now;

    next();
});


UserSchema.methods.newAuthToken = async function() {
    try {
        const user = this;

        const signOptions = {
            issuer: JWT_PAYLOAD_OPTIONS.issuer,
            subject: JWT_PAYLOAD_OPTIONS.subject,
            audience: JWT_PAYLOAD_OPTIONS.audience,
            expiresIn: authTokenExpirationTime,
            algorithm: "RS256"
        }

        // const token =  jwt.sign({ _id: user._id.toString(), expiresOn: new Date(Date.now() + authTokenExpirationTime).toString() }, config.PRIVATE_KEY_AUTH, {expiresIn: "7 days"});
        const token = jwt.sign({ _id: user._id.toString() }, privateKEY, signOptions);

        return token;
    } catch (e) {
        console.error("Error in Generating Token");
    }
};

UserSchema.statics.verifyAuthToken = function(token) {
    try {

        const verifyOptions = {
            issuer: JWT_PAYLOAD_OPTIONS.issuer,
            subject: JWT_PAYLOAD_OPTIONS.subject,
            audience: JWT_PAYLOAD_OPTIONS.audience,
            expiresIn: authTokenExpirationTime,
            algorithm: ["RS256"]
        };
        const verifiedObject = jwt.verify(token, publicKEY, verifyOptions);

        if(verifiedObject && verifiedObject._id) {
            return verifiedObject;
        }
        return false;
    } catch (e) {
        console.error("verifyAuthToken", e);
        return false;
    }
}

UserSchema.methods.newPasswordResetToken = async function() {
    try {
        const user = this;

        const userDoc = user._doc;
        const token = jwt.sign({ _id: userDoc._id.toString() }, config.PRIVATE_KEY_RESET_PASSWORD, { expiresIn: "15 minutes" });

        const userId = userDoc._id.toString();
        redisClient.hgetall(`user-password-reset-${token}`, function(err, userObj) {

            redisClient.hmset(`user-password-reset-${token}`, "userId", userId, function(err, savedUserObj) {
            });
            redisClient.expire(`user-password-reset-${token}`, passwordResetTokenExpirationTime);
        });

        // user.password = '1@Reset_REQUEST_SENT';
        user.save();

        return token;
    } catch (e) {
        console.error("Error in Generating Password Reset Token");
    }
};

UserSchema.statics.verifyPasswordResetTokenAndSavePassword = function(token, password) {
    const User = this;
    try {
        return new Promise((resolve, reject) => {

            const errors = [];

            redisClient.hgetall(`user-password-reset-${token}`, async function(err, userObj) {
                if (err || !userObj) {
                    errors.push("Invalid Password Reset Token");

                    resolve({
                        errors: errors
                    });
                } else {
                    const userId = mongoose.Types.ObjectId(userObj.userId);

                    const user = await User.findOne({ _id: userId }, { _id: 1 });
                    if (!user) {
                        errors.push("Invalid Password Reset Token");
                    } else {
                        if (![undefined, null].includes(password)) {
                            if (validator.isEmpty(password)) {
                                errors.push("Password is blank");
                            } 
                        } else {
                            errors.push("Password is undefined");
                        }

                        if (errors.length === 0) {
                            // password = await bcrypt.hash(password, 10);  ---> not required, added update hook above to fix change password
                            await User.updateOne({ _id: userId }, { password: password });
                            
                            redisClient.expire(`user-password-reset-${token}`, 0);

                            resolve(true);
                        }
                    }

                    if (errors.length > 0) {
                        resolve({
                            errors: errors
                        });
                    }
                }
            });
        });
    } catch (e) {
        console.error("Error in Verifying Password Reset Token");
    }
};

UserSchema.statics.checkValidCredentials = function(email, password) {
    try {
        return new Promise(async(resolve, reject) => {
            const errors = [];

            let user = await this.findOne({
                email: email
            });

            if (!user) {
                errors.push("User with Email is not found");
                resolve({
                    errors: errors
                })
            } else {
                if (password.length > 0) {
                    bcrypt.compare(password, user.password, (err, result) => {
                        if (err || !result) {
                            errors.push("Credentials are invalid");
                            resolve({
                                errors: errors
                            })
                        }
                        if (result) {
                            resolve({
                                user: user
                            });
                        }
                    });
                } else {
                    errors.push("Credentials are invalid");
                    resolve({
                        errors: errors
                    })
                }
            }
        })
    } catch (error) {
        return {
            errors: [error]
        }
    }

};

UserSchema.methods.newEmailVerificationToken = async function() {
    try {
        const user = this;

        const signOptions = {
            issuer: JWT_PAYLOAD_OPTIONS.issuer,
            subject: JWT_PAYLOAD_OPTIONS.subject,
            audience: JWT_PAYLOAD_OPTIONS.audience,
            expiresIn: emailVerificationTokenExpTime,
            algorithm: "RS256"
        }

        const token = jwt.sign({ _id: user._id.toString() }, privateKEY, signOptions);

        return token.toString();
    } catch (e) {
        console.error("Error in Generating Token");
    }
};

UserSchema.statics.verifyEmailVerificationToken = function(token) {
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

UserSchema.statics.createOrUpdateCustomerToken = async function(user) {
    try {
        const client = rapid.createClient(config.PAY_API_KEY, config.PAY_API_PASS, config.PAY_API_ENDPOINT);

        let response;
        if(user.payToken) {
            response = await client.updateCustomer(rapid.Enum.Method.DIRECT, {
                "TokenCustomerID": user.payToken,
                "Title": user.name.title,
                "FirstName": user.name.firstName,
                "LastName": user.name.lastName,
                "Country": "in",
                "CardDetails": {
                    "Name": user.creditCard.name,
                    "Number": user.creditCard.number,
                    "ExpiryMonth": user.creditCard.expiryMonth,
                    "ExpiryYear": user.creditCard.expiryYear,
                    "CVN": user.creditCard.code
                }
            });
        } else {
            response = await client.createCustomer(rapid.Enum.Method.DIRECT, {
                "Title": user.name.title,
                "FirstName": user.name.firstName,
                "LastName": user.name.lastName,
                "Country": "in",
                "CardDetails": {
                    "Name": user.creditCard.name,
                    "Number": user.creditCard.number,
                    "ExpiryMonth": user.creditCard.expiryMonth,
                    "ExpiryYear": user.creditCard.expiryYear,
                    "CVN": user.creditCard.code
                }
            });
        }

        if(response.attributes.Errors) {
            throw new Error(`${response.attributes.Errors}`);
        } else {
            return response.attributes.Customer.TokenCustomerID;
        }

        // V6111,V6110
    } catch(err) {
        console.error("createOrUpdateCustomerToken Error", err);
        return false;
    }
};

UserSchema.statics.getAllFieldsExceptFile = function() {
    return {    
        userRef: 1,
        name: 1,
        address: 1,
        dob: 1,

        mobile: 1,
        isMobileVerified: 1,

        email: 1,
        isEmailVerified: 1,
    
        "driverLicense.card": 1,
        "driverLicense.expiry": 1,
        "driverLicense.state": 1,
        "driverLicense.verified": 1,
        "driverLicense.accepted": 1,

        /* "driverLicense.scan": 1,
        photo: 1, */
        
        verificationRequestId: 1,
        verificationResponseId: 1,

        payToken: 1,
        fcmDeviceToken: 1,

        stripeCustomerId: 1,

        createdAt: 1,
        updatedAt: 1
    };
};

UserSchema.statics.getAllUsefulFieldsExceptFile = function() {
    return {    
        userRef: 1,
        name: 1,
        address: 1,
        dob: 1,

        mobile: 1,
        isMobileVerified: 1,

        email: 1,
        isEmailVerified: 1,
    
        "driverLicense.card": 1,
        "driverLicense.expiry": 1,
        "driverLicense.state": 1,
        "driverLicense.verified": 1,
        "driverLicense.accepted": 1,

        stripeCustomerId: 1,

        createdAt: 1,
        updatedAt: 1
    };
};

UserSchema.statics.getAllFieldsWithExistsFile = function() {
    return {    
        userRef: 1,
        name: 1,
        address: 1,
        dob: 1,

        mobile: 1,
        isMobileVerified: 1,

        email: 1,
        isEmailVerified: 1,
    
        "driverLicense.card": 1,
        "driverLicense.expiry": 1,
        "driverLicense.state": 1,
        "driverLicense.verified": 1,
        "driverLicense.accepted": 1,

        
        "driverLicense.scan": { $cond: { if: { $ifNull: ["$driverLicense.scan", false] }, then: true, else: false } },
        // "driverLicense.documentType": { $cond: { if: { $ifNull: ["$driverLicense.scan.contentType", false] }, then: "", else: "$driverLicense.scan.contentType" } },
        "photo": { $cond: { if: { $ifNull: ["$photo", false] }, then: true, else: false } },
        
        verificationRequestId: 1,
        verificationResponseId: 1,

        payToken: 1,
        fcmDeviceToken: 1,

        stripeCustomerId: 1,

        createdAt: 1,
        updatedAt: 1
    };
};

UserSchema.statics.getAllFieldsSpecified = function(fieldsArray) {
    const fieldsObj = {};

    fieldsArray.forEach((fieldName) => {
        if(fieldName === "driverLicense") {
            fieldsObj["driverLicense.card"] = 1;
            fieldsObj["driverLicense.expiry"] = 1;
            fieldsObj["driverLicense.state"] = 1;
            fieldsObj["driverLicense.verified"] = 1;
            fieldsObj["driverLicense.accepted"] = 1;
            fieldsObj["driverLicense.card"] = 1;
            fieldsObj["driverLicense.scan"] = { $cond: { if: { $ifNull: ["$driverLicense.scan", false] }, then: true, else: false } };
            fieldsObj["driverLicense.documentType"] = { $cond: { if: { $ifNull: ["$driverLicense.scan.contentType", false] }, then: "$driverLicense.scan.contentType", else: "" } };
        } else if(fieldName === "driverLicense.scan") {
            fieldsObj["driverLicense.scan"] = { $cond: { if: { $ifNull: ["$driverLicense.scan", false] }, then: true, else: false } };
            fieldsObj["driverLicense.documentType"] = { $cond: { if: { $ifNull: ["$driverLicense.scan.contentType", false] }, then: "$driverLicense.scan.contentType", else: "" } };
        } else if(fieldName === "photo") {
            fieldsObj["photo"] = { $cond: { if: { $ifNull: ["$photo", false] }, then: true, else: false } };
        } else {
            fieldsObj[fieldName] = 1;
        }
    });

    return fieldsObj;
};

module.exports = mongoose.model('user', UserSchema);