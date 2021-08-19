const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const validator = require('validator');
const dotenv = require('dotenv');
const fs = require('fs');
const moment = require('moment');
const redisClient = require('../dbs').redisClient;
const dateUtils = require('./../helpers/dateUtils');

const privateKEY = fs.readFileSync('./auth_private.key', 'utf8');
const publicKEY = fs.readFileSync('./auth_public.key', 'utf8');

const Counter = require('./counters');

dotenv.config();
const config = process.env;

const aclSettings = require('../helpers/getAccessControlList');

const authTokenExpirationTime = 8 * 60 * 60; // 8 hours ( in seconds )
// const authTokenExpirationTime = 5 * 60; // 5 minutes ( in seconds )
const passwordResetTokenExpirationTime = 15 * 60; // 15 minutes ( in seconds )

const employeeInviteTokenExpirationTime = 8 * 60 * 60;

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

const nameSchema = new Schema({
    firstName: {
        type: String, trim: true,
        required: [true, "First Name is required"],
        validate: [{
            validator: (value) => {
                return (!validator.isEmpty(value) || value.length > 0)
            },
            message: "First Name should not be empty"
        }]
    },
    lastName: {
        type: String, trim: true
        /* ,
        required: [true, "Last Name is required"],
        validate: [{
            validator: (value) => {
                return (!validator.isEmpty(value) || value.length > 0)
            },
            message: "Last Name should not be empty"
        }] */
    }
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
        validate: [{
            validator: (value) => {
                // return moment(value).isAfter(Date.now())
                // const valueSplit = value.split("/");
                // let inputDate = `20${valueSplit[1]}-${valueSplit[0]}-01`;
                // console.log("inside employees.js",inputDate)
                // console.log("moment object boolean",moment(inputDate).endOf("month").isAfter(moment()))
                // return moment(inputDate).endOf("month").isAfter(moment());
                // console.log("inside employees.js",inputDate)
                console.log("moment object boolean",moment(value).endOf("month").isAfter(moment()))
                // return dateUtils.isValidExpiry(value);
                return true;
            },
            message: "Expiry Date of a Driving License should be after Current Date"
        }]
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

let EmployeeSchema = new Schema({
    employeeRef: { type: String, trim: true, unique: true },

    acceptedInvite: { type: Boolean, default: false },

    licenseeId: {
        type: mongoose.Types.ObjectId,
        required: [true, "Licensee ID is required"]
    },

    dob: {
        type: Date,
        // required: [true, "Date of Birth is required"],
        validate: [{
            validator: (value) => {
                return dateUtils.isValidDob(value);
            },
            message: "User must be atlease 16 years old"
        }]
    },
    type: { 
        type: String, trim: true, lowercase: true,
        enum: ["employee", "owner", "representative", "director", "executive"],
        default: "employee"
    },
    title: { type: String, trim: true },

    isOwner: { type: Boolean, default: false },
    acl: {
        type: Object,
        required: [true, "Allowed Access Control List for Employee is required"]
    },

    name: { 
        type: String, trim: true
        /* ,
        required: [true, "Name is required"],
        validate: [{
            validator: (value) => {
                return (!validator.isEmpty(value) || value.length > 0)
            },
            message: "Name should not be empty"
        }] */
    },

    mobile: {
        type: String, trim: true,
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

    employeeRating : {
        type : Number,
        default : 0
    },

    ratingCount : {
        type : Number,
        default : 0
    },

    photo: {
        type: {
            contentType: {
                type: String, trim: true,
                required: [true, "Employee Photo is sent in an Invalid format"]
            },
            data: {
                type: String,
                required: [true, "Employee Photo is sent in an Invalid format"],
            }
        }
        /* ,
                required: [true, "Employee Photo is required"], */
    },

    driverLicense: {
        type: drivingLicenseSchema/* ,
        required: [true, "Driving License is required"] */
    },

    password: {
        type: String, trim: true,
        required: [true, "Password is required"],
        minlength: [8, "Password should be minimum 8 characters long"],
        validate: [{
            validator: (value) => {
                const strongRegex = new RegExp("^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{8,})");
                const mediumRegex = new RegExp("^(((?=.*[a-z])(?=.*[A-Z]))|((?=.*[a-z])(?=.*[0-9]))|((?=.*[A-Z])(?=.*[0-9])))(?=.{6,})");
                return strongRegex.test(value);
            },
            message: "Password should be 8 or more characters long. Password should contain one Uppercase Alphabetical Character, one Lowercase Alphabetical Character, one Numeric Character and one Special Character"
        }]
    },

    isDeleted: { type: Boolean, default: false },

    address: {
        type: addressSchema
    },

    additionalDocument: {
        type: {
            scan: {
                type: {
                    contentType: {
                        type: String, trim: true,
                        required: [true, "Image of the Additional Document is sent in an Invalid format"]
                    },
                    data: {
                        type: String,
                        required: [true, "Image of the Additional Document is sent in an Invalid format"],
                    }
                }
            },
            verified: { type: Boolean, default: false },
            accepted: { type: Boolean }
        }
    },
    fcmDeviceToken : { type : String , trim:true},

    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
});

// Sets the createdAt parameter equal to the current time
EmployeeSchema.pre('save', async function(next) {
    const employee = this;

    employee.password = await bcrypt.hash(employee.password, 10);

    const now = new Date();
    if (!employee.createdAt) {
        employee.createdAt = now;
    }
    employee.updatedAt = now;

    if(!employee.employeeRef) {
        const employeeRef = await Counter.getNextSequence("employeeRef");
        employee.employeeRef = `LIEMPL${(employeeRef.toString()).padStart(10, '0')}`;
    }

    next();
});

EmployeeSchema.pre('updateOne', {document:true},async function(query,next) {
    let employee = this;
    employee = employee._update;
    
    if(employee && employee.password) {
        employee.password = await bcrypt.hash(employee.password, 10);
    }

    const now = new Date();
    employee.updatedAt = now;

    next();
});


EmployeeSchema.statics.checkValidCredentials = function(email, password) {
    const Employee = this;
    try {
        return new Promise(async(resolve, reject) => {
            const errors = [];
            
            const employee = await Employee.findOne({
                email: email,
                acceptedInvite: true,
                isDeleted: false
            });
            if (!employee) {
                errors.push("Employee with Email is not found");
                resolve({
                    errors: errors
                })
            } else {
                if (password.length > 0) {
                    bcrypt.compare(password, employee.password, (err, result) => {
                        if (err || !result) {
                            errors.push("Credentials are invalid");
                            resolve({
                                errors: errors
                            })
                        }
                        if (result) {
                            resolve({
                                employee: employee
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

EmployeeSchema.methods.newAuthToken = async function() {
    try {
        const employee = this;

        const signOptions = {
            issuer: JWT_PAYLOAD_OPTIONS.issuer,
            subject: JWT_PAYLOAD_OPTIONS.subject,
            audience: JWT_PAYLOAD_OPTIONS.audience,
            expiresIn: authTokenExpirationTime,
            algorithm: "RS256"
        }

        const token = jwt.sign({ _id: employee._id.toString(), isOwner: employee.isOwner, licenseeId: employee.licenseeId, acl: employee.acl }, privateKEY, signOptions);

        return token;
    } catch (err) {
        console.error("Error in Generating Employee Token");
    }
};

EmployeeSchema.statics.verifyAuthToken = function(token) {
    try {
        // const verifiedObject = jwt.verify(token, config.PRIVATE_KEY_AUTH);

        const verifyOptions = {
            issuer: JWT_PAYLOAD_OPTIONS.issuer,
            subject: JWT_PAYLOAD_OPTIONS.subject,
            audience: JWT_PAYLOAD_OPTIONS.audience,
            expiresIn: authTokenExpirationTime,
            algorithm: ["RS256"]
        };
        const verifiedObject = jwt.verify(token, publicKEY, verifyOptions);

        if (verifiedObject && verifiedObject._id) {
            return verifiedObject;
        }
        return false;
    } catch (err) {
        console.error("verifyAuthToken", err);
        return false;
    }
};

EmployeeSchema.methods.newEmployeeInviteToken = async function() {
    try {
        const employee = this;

        const employeeDoc = employee._doc || employee;
        const token = jwt.sign({ _id: employeeDoc._id.toString() }, config.PRIVATE_KEY_RESET_PASSWORD, { expiresIn: "15 minutes" });

        const employeeId = employeeDoc._id.toString();
        redisClient.hgetall(`employee-invite-${token}`, function(err, employeeObj) {

            redisClient.hmset(`employee-invite-${token}`, "employeeId", employeeId, "email", employeeDoc.email, function(err, savedEmployeeObj) {
            });
            redisClient.expire(`employee-invite-${token}`, employeeInviteTokenExpirationTime);
        });

        return token;
    } catch (err) {
        console.error("Error in Generating Employee Invite Token for Employee", err);
    }
};

EmployeeSchema.statics.verifyEmployeeInviteToken = function(token) {
    const Employee = this;
    try {
        return new Promise((resolve, reject) => {

            const errors = [];

            redisClient.hgetall(`employee-invite-${token}`, async function(err, employeeObj) {
                if (err || !employeeObj) {
                    errors.push("Invalid Employee Invite Token");

                    resolve({
                        errors: errors
                    });
                } else {
                    const newEmployee = await Employee.findOne({
                        _id: mongoose.Types.ObjectId(employeeObj.employeeId),
                        email: employeeObj.email,
                        acceptedInvite: false
                    });

                    if (!newEmployee) {
                        errors.push("Invalid Employee Invite Token");
                    } else {

                        resolve({
                            employee: newEmployee
                        })
                    }

                    if (errors.length > 0) {
                        resolve({
                            errors: errors
                        });
                    }
                }
            });
        });
    } catch (err) {
        console.error("Error in Verifying Employee Invite Token for Employee", err);
    }
};

EmployeeSchema.methods.newEmailVerificationToken = async function() {
    try {
        const employee = this;

        const signOptions = {
            issuer: JWT_PAYLOAD_OPTIONS.issuer,
            subject: JWT_PAYLOAD_OPTIONS.subject,
            audience: JWT_PAYLOAD_OPTIONS.audience,
            expiresIn: emailVerificationTokenExpTime,
            algorithm: "RS256"
        }

        const token = jwt.sign({ _id: employee._id.toString() }, privateKEY, signOptions);

        return token;
    } catch (e) {
        console.error("Error in Generating Token");
    }
};

EmployeeSchema.statics.verifyEmailVerificationToken = function(token) {
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

EmployeeSchema.methods.newPasswordResetToken = async function() {
    try {
        const employee = this;

        const employeeDoc = employee._doc;
        const token = jwt.sign({ _id: employeeDoc._id.toString() }, config.PRIVATE_KEY_RESET_PASSWORD, { expiresIn: "15 minutes" });

        const employeeId = employeeDoc._id.toString();
        redisClient.hgetall(`employee-password-reset-${token}`, function(err, employeeObj) {

            redisClient.hmset(`employee-password-reset-${token}`, "employeeId", employeeId, function(err, savedEmployeeObj) {
            });
            redisClient.expire(`employee-password-reset-${token}`, passwordResetTokenExpirationTime);
        });

        employee.password = '1@Reset_REQUEST_SENT';
        employee.save();

        return token;
    } catch (err) {
        console.error("Error in Generating Password Reset Token for Employee");
    }
};

EmployeeSchema.statics.verifyPasswordResetTokenAndSavePassword = function(token, password) {
    const Employee = this;
    try {
        return new Promise((resolve, reject) => {

            const errors = [];

            redisClient.hgetall(`employee-password-reset-${token}`, async function(err, employeeObj) {
                if (err || !employeeObj) {
                    errors.push("Invalid Password Reset Token");

                    resolve({
                        errors: errors
                    });
                } else {
                    const employeeId = mongoose.Types.ObjectId(employeeObj.employeeId);

                    const employee = await Employee.findOne({ _id: employeeId }, { _id: 1 });
                    if (!employee) {
                        errors.push("Invalid Password Reset Token");
                    } else {
                        if (![undefined, null].includes(password)) {
                            if (validator.isEmpty(password)) {
                                errors.push("Password is blank");
                            } else if (validator.equals(password.toLowerCase(), "password") || validator.contains(password.toLowerCase(), "password")) {
                                errors.push('Password contains keyword "password"')
                            }
                        } else {
                            errors.push("Password is undefined");
                        }

                        if (errors.length === 0) {
                            password = await bcrypt.hash(password, 10);
                            await Employee.updateOne({ _id: employeeId }, { password: password });
                            
                            redisClient.expire(`employee-password-reset-${token}`, 0);

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
    } catch (err) {
        console.error("Error in Verifying Password Reset Token for Employee");
    }
};

EmployeeSchema.statics.getAllFieldsExceptFile = function() {
    return {    
        employeeRef: 1,
        acceptedInvite: 1,

        licenseeId: 1,

        dob: 1,
        type: 1,
        title: 1,

        isOwner: 1,
        acl: 1,

        name: 1,

        mobile: 1,
        isMobileVerified: 1,
        country: 1,

        email: 1,
        isEmailVerified: 1,
        
        photo:1,

        address: 1,

        isDeleted: 1,
        
        "driverLicense.card": 1,
        "driverLicense.expiry": 1,
        "driverLicense.state": 1,
        "driverLicense.verified": 1,
        "driverLicense.accepted": 1,

        "additionalDocument.verified": 1,
        "additionalDocument.accepted": 1,

        createdAt: 1,
        updatedAt: 1
    };
};

EmployeeSchema.statics.getAllUsefulFieldsExceptFile = function() {
    return {
        employeeRef: 1,
        acceptedInvite: 1,

        licenseeId: 1,

        dob: 1,
        type: 1,
        title: 1,

        isOwner: 1,
        acl: 1,

        name: 1,

        mobile: 1,
        isMobileVerified: 1,
        country: 1,

        email: 1,
        isEmailVerified: 1,

        address: 1,

        isDeleted: 1,
        
        "driverLicense.card": 1,
        "driverLicense.expiry": 1,
        "driverLicense.state": 1,
        "driverLicense.verified": 1,
        "driverLicense.accepted": 1,

        "additionalDocument.verified": 1,
        "additionalDocument.accepted": 1,

        createdAt: 1,
        updatedAt: 1
    };
};

EmployeeSchema.statics.getAllFieldsWithExistsFile = function() {
    return {    
        employeeRef: 1,
        acceptedInvite: 1,

        licenseeId: 1,

        dob: 1,
        type: 1,
        title: 1,

        isOwner: 1,
        acl: 1,

        name: 1,

        mobile: 1,
        isMobileVerified: 1,
        country: 1,

        email: 1,
        isEmailVerified: 1,

        isDeleted: 1,
        address: 1,
    
        "driverLicense.card": 1,
        "driverLicense.expiry": 1,
        "driverLicense.state": 1,
        "driverLicense.verified": 1,
        "driverLicense.accepted": 1,
    
        "driverLicense.scan": { $cond: { if: { $ifNull: ["$driverLicense.scan", false] }, then: false, else: true } },
        // "driverLicense.documentType": { $cond: { if: { $ifNull: ["$driverLicense.scan.contentType", false] }, then: "", else: "$driverLicense.scan.contentType" } },
        "photo": { $cond: { if: { $ifNull: ["$photo", false] }, then: false, else: true } },
    
        "additionalDocument.verified": 1,
        "additionalDocument.accepted": 1,
        "additionalDocument.scan": { $cond: { if: { $ifNull: ["$additionalDocument.scan", false] }, then: false, else: true } },
    
        createdAt: 1,
        updatedAt: 1
    };
};

EmployeeSchema.statics.getAllFieldsSpecified = function(fieldsArray) {
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
        } else if(fieldName === "additionalDocument") {
            fieldsObj["additionalDocument.verified"] = 1;
            fieldsObj["additionalDocument.accepted"] = 1;
            fieldsObj["additionalDocument.scan"] = { $cond: { if: { $ifNull: ["$additionalDocument.scan", false] }, then: true, else: false } };
            fieldsObj["additionalDocument.documentType"] = { $cond: { if: { $ifNull: ["$additionalDocument.scan.contentType", false] }, then: "$additionalDocument.scan.contentType", else: "" } };
        } else if(fieldName === "additionalDocument.scan") {
            fieldsObj["additionalDocument.scan"] = { $cond: { if: { $ifNull: ["$additionalDocument.scan", false] }, then: true, else: false } };
            fieldsObj["additionalDocument.documentType"] = { $cond: { if: { $ifNull: ["$additionalDocument.scan.contentType", false] }, then: "$additionalDocument.scan.contentType", else: "" } };
        } else if(fieldName === "photo") {
            fieldsObj["photo"] = { $cond: { if: { $ifNull: ["$photo", false] }, then: true, else: false } };
        } else {
            fieldsObj[fieldName] = 1;
        }
    });

    return fieldsObj;
};

module.exports = mongoose.model('employee', EmployeeSchema);
