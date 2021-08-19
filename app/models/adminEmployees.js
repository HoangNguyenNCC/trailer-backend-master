const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const validator = require('validator');
const dotenv = require('dotenv');
const fs = require('fs');
const redisClient = require('../dbs').redisClient;

const privateKEY = fs.readFileSync('./auth_private.key', 'utf8');
const publicKEY = fs.readFileSync('./auth_public.key', 'utf8');

dotenv.config();
const config = process.env;

const aclSettings = require('../helpers/getAccessControlListAdmin');

const authTokenExpirationTime = 8 * 60 * 60; // 8 hours ( in seconds )
// const authTokenExpirationTime = 5 * 60; // 5 minutes ( in seconds )
const passwordResetTokenExpirationTime = 15 * 60; // 15 minutes ( in seconds )
const emailVerificationTokenExpTime = 24 * 60 * 60; // Added By me

const employeeInviteTokenExpirationTime = 8 * 60 * 60;

const JWT_PAYLOAD_OPTIONS = {
    issuer: "Trailer2You",
    subject: "admin@trailer2you.com",
    audience: "ALL"
};

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

let AdminEmployeeSchema = new Schema({
    isOwner: { type: Boolean, default: false },
    acceptedInvite: { type: Boolean, default: false },
    acl: {
        type: Object,
        enum: aclSettings.accessControlListAdmin,
        required: [true, "Allowed Access Control List for Employee is required"]
    },

    name: { type: nameSchema },

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

    createdAt: { type: Date, default: Date.now() },
    updatedAt: { type: Date, default: Date.now() }
});

// Sets the createdAt parameter equal to the current time
AdminEmployeeSchema.pre('save', async function(next) {
    const employee = this;

    employee.password = await bcrypt.hash(employee.password, 10);

    const now = new Date();
    if (!employee.createdAt) {
        employee.createdAt = now;
    }
    employee.updatedAt = now;

    next();
});


AdminEmployeeSchema.statics.checkValidCredentials = function(email, password) {
    const AdminEmployee = this;
    try {
        return new Promise(async(resolve, reject) => {
            const errors = [];

            const employee = await AdminEmployee.findOne({
                email: email,
                acceptedInvite: true
            });
            if (!employee) {
                errors.push("Employee with Email is not found");
                reject({
                    errors: errors
                })
            } else {
                if (password.length > 0) {
                    bcrypt.compare(password, employee.password, (err, result) => {
                        if (err || !result) {
                            errors.push("Credentials are invalid");
                            reject({
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
                    reject({
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

AdminEmployeeSchema.methods.newAuthToken = async function() {
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
    }
};

AdminEmployeeSchema.statics.verifyAuthToken = function(token) {
    try {
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
        return false;
    }
};

AdminEmployeeSchema.methods.newEmployeeInviteToken = async function() {
    try {
        const employee = this;

        const employeeDoc = employee._doc || employee;
        const token = jwt.sign({ _id: employeeDoc._id.toString() }, config.PRIVATE_KEY_RESET_PASSWORD, { expiresIn: "15 minutes" });

        const employeeId = employeeDoc._id.toString();
        redisClient.hgetall(`admin-employee-invite-${token}`, function(err, employeeObj) {

            redisClient.hmset(`admin-employee-invite-${token}`, "employeeId", employeeId, "email", employeeDoc.email, function(err, savedEmployeeObj) {
            });
            redisClient.expire(`admin-employee-invite-${token}`, employeeInviteTokenExpirationTime);
        });

        return token;
    } catch (err) {
        console.error("Error in Generating Employee Invite Token for Employee", err);
    }
};

AdminEmployeeSchema.statics.verifyEmployeeInviteToken = function(token) {
    const AdminEmployee = this;
    try {
        return new Promise((resolve, reject) => {

            const errors = [];

            redisClient.hgetall(`admin-employee-invite-${token}`, async function(err, employeeObj) {
                if (err || !employeeObj) {
                    errors.push("Invalid Employee Invite Token");

                    resolve({
                        errors: errors
                    });
                } else {
                    const employee = await AdminEmployee.findOne({
                        _id: mongoose.Types.ObjectId(employeeObj.employeeId),
                        email: employeeObj.email,
                        acceptedInvite: false
                    });

                    if (!employee) {
                        errors.push("Invalid Employee Invite Token");
                    } else {

                        resolve({
                            employee: employee
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

AdminEmployeeSchema.methods.newPasswordResetToken = async function() {
    try {
        const employee = this;

        const employeeDoc = employee._doc;
        const token = jwt.sign({ _id: employeeDoc._id.toString() }, config.PRIVATE_KEY_RESET_PASSWORD, { expiresIn: "15 minutes" });

        const employeeId = employeeDoc._id.toString();
        redisClient.hgetall(`admin-employee-password-reset-${token}`, function(err, employeeObj) {

            redisClient.hmset(`employee-password-reset-${token}`, "employeeId", employeeId, function(err, savedEmployeeObj) {
                // console.log("savedEmployeeObj", savedEmployeeObj);
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

AdminEmployeeSchema.statics.verifyPasswordResetTokenAndSavePassword = function(token, password) {
    const Employee = this;
    try {
        return new Promise((resolve, reject) => {

            const errors = [];

            redisClient.hgetall(`admin-employee-password-reset-${token}`, async function(err, employeeObj) {
                if (err || !employeeObj) {
                    errors.push("Invalid Password Reset Token");

                    resolve({
                        errors: errors
                    });
                } else {
                    // employeeObj.employeeId
                    const employee = await Employee.findOne({
                        _id: mongoose.Types.ObjectId(employeeObj.employeeId)
                    }, {
                        _id: 1
                    });
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
                            employee.password = password;
                            employee.save();

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

// Created By Mihir Not Tested and Approved Yet

AdminEmployeeSchema.methods.newEmailVerificationToken = async function(){
    try{
        const employee = this ;

        //Same as User SignIn Options

        const signOptions = {
            issuer: JWT_PAYLOAD_OPTIONS.issuer,
            subject: JWT_PAYLOAD_OPTIONS.subject,
            audience: JWT_PAYLOAD_OPTIONS.audience,
            expiresIn: authTokenExpirationTime,
            algorithm: "RS256"
        }
        const token = jwt.sign({_id : employee._id.toString()},privateKEY,signOptions);
        return token
    }catch(err){
        console.error("Error in Generating Token");
    }
}

AdminEmployeeSchema.statics.verifyEmailVerificationToken = async function(token){
    try{
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
    }catch(err){
        return false;
    }
}

module.exports = mongoose.model('adminemployee', AdminEmployeeSchema);