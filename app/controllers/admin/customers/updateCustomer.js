const mongoose = require('mongoose');
const validator = require('validator');
const countriesISO = require('i18n-iso-countries');
const countriesInfo = require('countries-information');
const fs = require('fs');
const moment = require('moment');

const User = require('../../../models/users');

const objectSize = require('../../../helpers/objectSize');
const objectMinusKeys = require('../../../helpers/objectMinusKeys');
const getFilePath = require('../../../helpers/getFilePath');
const embeddedParser = require('../../../helpers/embeddedParser');
const dateUtils = require('../../../helpers/dateUtils');

const constants = require('../../../helpers/constants');

const aclSettings = require('../../../helpers/getAccessControlList');
const {BadRequestError} = require('./../../../helpers/errors');

/** 
 * 
 * @api {PUT} /admin/customer Update Customer
 * @apiName TAAC - Update Customer
 * @apiGroup Admin App - Customer
 * 
 * 
 * @apiHeader {String} Content-Type application/json
 * @apiHeader {String} authorization Authorization Token sent as a response to signIn request
 * 
 * @apiParam {String} customerId ID of the Customer 
 * 
 * @apiParam {File} photo User's Profile Photo ( File )
 * @apiParam {File} driverLicenseScan Scanned Image/PDF of User's Driving License ( File )
 * 
 * @apiParam {String} email User Email 
 * @apiParam {String} password User Password
 * 
 * @apiParam {Object} name Full Name of the User
 * @apiParam {String} mobile Mobile Number of the User
 * 
 * @apiParam {String} dob Date of Birth of the User
 * 
 * @apiParam {String} address Address of the User
 * @apiParam {Object} address[country] Country of the User
 * @apiParam {Object} address[text] Text Address of the User
 * @apiParam {Object} address[pincode] Pincode of the User Address
 * @apiParam {Object} address[coordinates] Coordinates of the User Address [latitude, longitude]
 * 
 * 
 * @apiParam {Object} driverLicense Object defining User's Driving License
 * @apiParam {Object} driverLicense[card] License Number of the User's Driving License
 * @apiParam {Object} driverLicense[expiry] Expiry Date of the User's Driving License ( 02/23 )
 * @apiParam {Object} driverLicense[state] State of the User's Driving License 
 * 
 * 
 * @apiDescription API Endpoint that can used to update User data
 * 
 * 
 * Request Headers
 * - 'Content-Type: application/json'
 * 
 * @apiParamExample {json} Request-Example:
 * 
    curl --location --request PUT 'http://localhost:5000/admin/customer' \
    --form 'reqBody={
        "mobile":  "919876543210"
    }' \
    --form 'photo=@/home/username/Downloads/user.png' \
    --form 'driverLicenseScan=@/home/username/Downloads/driver_license_sample.jpeg'
 * 
 * 
 * Request Body ( Example )  ( request.body.reqBody )
 * 
    {
        "address": {
            "text" : "NorthBridge, NSW, Australia"
        }
    }
 *
 * 
 * @apiErrorExample {json} Error-Response:
 * HTTP/1.1 400
 * 
    {
        success: false,
        message: "Could not save User data",
        errorsList: []
    }
 * 
 * 
 * @apiSuccess {Boolean} success Success Status
 * @apiSuccess {String} message Success Message
 * @apiSuccess {Object} userObj User Object
 * 
 * 
 * @apiSuccessExample {String} - Success-Response:
 * HTTP/1.1 200 
    {
        success: true,
        message: "Success",
        userObj: {
            "_id": "",
            "email": "user1@gmail.com",
            "mobile": "919876543210",
            "name": "Mr user 1",
            "address": {
                "text" : "NorthBridge, NSW, Australia", 
                "pincode" : "1560", 
                "coordinates" : [ -33.8132, 151.2172 ]
            },
            "dob": "2020-01-20",
            "driverLicense": {
                "card": "223782weyet",
                "expiry": "2022-06-20",
                "state": "MH",
                "scan": driverLicensePicture
            }
        }
    }
 * 
 */
async function updateUser(req, res) {
    if(!req.requestFrom || !req.requestFrom.employeeId || !req.requestFrom.acl || !aclSettings.validateACL(req.requestFrom.acl, "CUSTOMERS", "UPDATE")) {
            throw new BadRequestError('Unauthorised Access')
        }

        let userBody = req.body;
        if(!userBody) {
            throw new BadRequestError("VALIDATION-Invalid Request Body");
        }

        userBody = JSON.parse(JSON.stringify(userBody));
        if(typeof userBody.address === "string") {
            userBody.address = JSON.parse(userBody.address);
        }
        if(typeof userBody.driverLicense === "string") {
            userBody.driverLicense = JSON.parse(userBody.driverLicense);
        }

        let userId = userBody.customerId;
        
        if(!userId || validator.isEmpty(userId)) {
            throw new BadRequestError("VALIDATION-Customer ID is undefined");
        } else if (objectSize(userId) < 12) {
            throw new BadRequestError("VALIDATION-Customer ID is invalid");
        }
        userId = mongoose.Types.ObjectId(userId);

        let existingUser;

        if(!userBody && uploadedFiles.length === 0) {
            throw new BadRequestError("VALIDATION-Error occurred while parsing User data");
        } else {
            existingUser = await User.findOne({ _id: userId }, {
                email: 1, mobile: 1, address: 1, driverLicense: 1
            });
            existingUser = existingUser._doc;

            if(!existingUser) {
                throw new BadRequestError("VALIDATION-Customer does not exist");
            }
        
            if(userBody.mobile) {
                let country = "Australia";
            
                if(userBody.address && userBody.address.country) {
                    country = userBody.address.country;
                } else if(existingUser.address && existingUser.address.country) {
                    country = existingUser.address.country;
                }

                let locale = "en-AU";
                let countryCode = "AU";
                if(country) {
                    countryCode = countriesISO.getAlpha2Code(country, "en");
                    locale = `en-${countryCode}` || "en-AU";
                }

                const countryInfo = countriesInfo.getCountryInfoByCode(countryCode);
                userBody.mobile = `${countryInfo.countryCallingCodes[0]}${userBody.mobile}`;

                if(existingUser.mobile !== userBody.mobile) {
                    userBody.isMobileVerified = false;
                }
            }

            if(userBody.email && !validator.isEmail(userBody.email)) {
                throw new BadRequestError("VALIDATION-Email is in Invalid format");
            }

            if(userBody.email) {
                if(existingUser.email !== userBody.email) {
                    userBody.isEmailVerified = false;
                }
            }

            if(userBody.address && userBody.address.coordinates) {
                userBody.address.location = {
                    type: "Point",
                    coordinates: [userBody.address.coordinates[1], userBody.address.coordinates[0]]
                };
                delete userBody.address.coordinates;
            }

            if(typeof userBody.address === "string") {
                userBody.address = {
                    text: userBody.address
                };
            }

            if(userBody.dob) {
                userBody.dob = moment(userBody.dob).toISOString();
            }

            if(req.files) {
                if(req.files["photo"] && req.files["photo"].length > 0) {
                    let photo = req.files["photo"][0];
                    const data = photo.location;
                    const contentType = photo.mimetype;

                    userBody.photo = {
                        contentType: contentType,
                        data: data
                    };
                }

                if(req.files["driverLicenseScan"] && req.files["driverLicenseScan"].length > 0) {
                    let doc = req.files["driverLicenseScan"][0];
                    const data = doc.location;
                    const contentType = doc.mimetype;

                    if(!userBody.driverLicense) {
                        userBody.driverLicense = {};
                    }
                    userBody.driverLicense.scan = {
                        contentType: contentType,
                        data: data
                    };
                }
            }

            // Don't update email and mobile fields
            let user = userBody ? objectMinusKeys(userBody, ['_id', 'updatedAt', 'createdAt']) : userBody;
            user = getUpdateObject(user, existingUser);

            // user = new User(user);

            /* if(user && (user.name || user.creditCard)) {
                const userForCreditCard = { ...existingUser._doc, ...user };
                const payToken = await User.createOrUpdateCustomerToken(userForCreditCard);

                if(payToken) {
                    user.payToken = payToken;
                }
            } */

            // await User.updateOne({ _id: userId }, user, { runValidators: true });
           user = await User.findOneAndUpdate({ _id: userId }, userBody,{new:true});
            const userProj = User.getAllUsefulFieldsExceptFile();
//             user = await User.findOne({ _id: userId });
            user = user._doc;
            user = objectMinusKeys(user, ['password', 'tokens']);

            if(user.address) {
                user.address = user.address._doc;
                user.address.coordinates = user.address.location._doc.coordinates;
                user.address.coordinates = [user.address.coordinates[1], user.address.coordinates[0]];
                delete user.address.location;
                delete user.address._id;
            }

            user.photo = user.photo.data;

            user.dob = moment(user.dob).format('YYYY-MM-DD');

            if(!user.driverLicense) {
                user.driverLicense = {};
            }
            if(user.driverLicense) {
                if(user.driverLicense.expiry) {
                    user.driverLicense.expiry = moment(user.driverLicense.expiry).format('YYYY-MM');
                }
                if(user.driverLicense.scan) {
                    user.driverLicense.scan = user.driverLicense.scan.data;
                }
            }

            res.status(200).send({
                success: true,
                message: "Success",
                customerObj: user
            });
        }
}

function getUpdateObject(inputObj, existingUser) {
    try {
        const outputObj = { ...inputObj };

        if (outputObj.address) {
            outputObj.address = {...existingUser.address._doc, ...inputObj.address };
        }

        if (outputObj.driverLicense) {
            outputObj.driverLicense = {...existingUser.driverLicense._doc, ...inputObj.driverLicense };
        }

        return outputObj;
    } catch (err) {
        return false;
    }
}

module.exports = updateUser;
