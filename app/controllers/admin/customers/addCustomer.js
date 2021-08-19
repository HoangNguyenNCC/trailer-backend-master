const validator = require('validator');
const dotenv = require('dotenv');
const countriesISO = require('i18n-iso-countries');
const countriesInfo = require('countries-information');

const User = require('../../../models/users');

const objectMinusKeys = require('../../../helpers/objectMinusKeys');
const sendMail = require('../../../helpers/sendMail');
const dateUtils = require('../../../helpers/dateUtils');

const aclSettings = require('../../../helpers/getAccessControlList');
const {BadRequestError} = require('./../../../helpers/errors');


dotenv.config();
const config = process.env;

/** 
 * 
 * @api {POST} /admin/customer Add Customer
 * @apiName TAAC - Add Customer
 * @apiGroup Admin App - Customer
 *  
 * 
 * @apiHeader {String} Content-Type application/json
 * 
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
 * @apiParam {Object} address Address of the User
 * @apiParam {String} address[country] Country of the User
 * @apiParam {String} address[text] Text Address of the User
 * @apiParam {String} address[pincode] Pincode of the User Address
 * @apiParam {String} address[coordinates] Coordinates of the User Address [latitude, longitude]
 * @apiParam {String} address[city] City of the User
 * @apiParam {String} address[state] State of the User
 * 
 * @apiParam {Object} driverLicense Object defining User's Driving License
 * @apiParam {Object} driverLicense[card] License Number of the User's Driving License
 * @apiParam {Object} driverLicense[expiry] Expiry Date of the User's Driving License ( 02/23 )
 * @apiParam {Object} driverLicense[state] State of the User's Driving License 
 * 
 * 
 * @apiDescription API Endpoint POST /admin/customer
 * 
 * 
 * @apiParamExample {json} Request-Example:
 * 
    curl --location --request POST 'http://localhost:5000/admin/customer' \
    --form '{
        "email": "nehakadam@usernameinfotech.com",
        "mobile": "9664815262",
        "name": "User 6",
        "address": {
            "country": "India",
            "text": "Lower Parel, Mumbai, India",
            "pincode": "400013",
            "coordinates": [72.877656, 19.075984]
        },
        "dob": "1995-01-20",
        "password": "abCd@1234",
        "driverLicense": {
            "card": "223782weyet",
            "expiry": "06/23",
            "state": "NSW"
        }
        "photo":@/home/username/Downloads/user.png
        "driverLicenseScan":@/home/username/Downloads/driver_license_sample.jpeg
    }'
 * 
 * 
 *
 * @apiErrorExample {json} Error-Response:
 * HTTP/1.1 400
 *  {
 *      success: false,
 *      message: "Email is empty",
 *      errorsList: []
 *  }
 * 
 * 
 * @apiSuccess {Boolean} success Success Status
 * @apiSuccess {String} message Success Message
 * 
 * 
 * @apiSuccessExample {String} - Success-Response:
 * HTTP/1.1 200 OK
 * 
    {
        success: true,
        message: "Success",
        customerObj: {}
    }
 * 
 * 
 */

async function addCustomer(req, res, next) {
    const uploadedFiles = [];
    if(!req.requestFrom || !req.requestFrom.employeeId || !req.requestFrom.acl || !aclSettings.validateACL(req.requestFrom.acl, "CUSTOMERS", "ADD")) {
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

        if(!userBody) {
            throw new BadRequestError("VALIDATION-Error occurred while parsing addCustomer data");
        } else {
            let validationErrors = undefined;

            // userBody.password = "aBcd@1234";

            if(!userBody.name || !userBody.name.trim()) {
                console.log("userBody",userBody)
                throw new BadRequestError("VALIDATION-Name is empty");
            }

            if(!userBody.mobile || !userBody.mobile.trim()) {
                throw new BadRequestError("VALIDATION-Mobile Number is empty");
            }

            let locale = "en-AU";
            let countryCode = "AU";
            if(userBody.address && userBody.address.country) {
                countryCode = countriesISO.getAlpha2Code(userBody.address.country, 'en');
                locale = `en-${countryCode}` || "en-AU";
            }
            const countryInfo = countriesInfo.getCountryInfoByCode(countryCode);
            userBody.mobile = `${countryInfo.countryCallingCodes[0]}${userBody.mobile}`;

            if(!userBody.email || !userBody.email.trim()) {
                throw new BadRequestError("VALIDATION-Email is empty");
            }

            if(!validator.isEmail(userBody.email)) {
                throw new BadRequestError("VALIDATION-Email is in Invalid format");
            }
             
            if(userBody.address && userBody.address.coordinates) {
                userBody.address.location = {
                    type: "Point",
                    coordinates: [userBody.address.coordinates[1], userBody.address.coordinates[0]]
                };
                delete userBody.address.coordinates;
            }

            // this is useless as we already have text in userBody from front end
            // and userBody.address is not meaningful anyways
            
            // console.log("userBody on line 218:", userBody)
            // if(typeof userBody.address === "string") {
            //     console.log("if address is a string it will run")
            //     userBody.address = {
            //         text: userBody.address
            //     };
            // }

            if(req.files["photo"] && req.files["photo"].length > 0) {
                let photo = req.files["photo"][0];
                const data = photo.location;
                const contentType = photo.mimetype;

                userBody.photo = {
                    contentType: contentType,
                    data: data
                };
            }

            if(!userBody.driverLicense) {
                throw new BadRequestError("VALIDATION-Driving License is required");
            }

            if(userBody.driverLicense && req.files["driverLicenseScan"] && req.files["driverLicenseScan"].length > 0) {
                let doc = req.files["driverLicenseScan"][0];
                const data = doc.location;
                const contentType = doc.mimetype;

                userBody.driverLicense.scan = {
                    contentType: contentType,
                    data: data
                };
            } else {
                throw new BadRequestError("VALIDATION-Driver License Scan is required");
            }

            if (!userBody.dob || !dateUtils.isValidDob(userBody.dob)) {
                throw new BadRequestError('Unauthorised Access')
            } 

            if (!userBody.driverLicense.expiry || !dateUtils.isValidExpiry(userBody.driverLicense.expiry)) {
                throw new BadRequestError('Unauthorised Access')
            } else {
                console.log({expiry: userBody.driverLicense.expiry, valid: dateUtils.isValidExpiry(userBody.driverLicense.expiry)});
            }

            let user = new User(userBody);
            const dbValidationError = user.validateSync();
            if(dbValidationError) {
                // console.clear()
                console.log("validation error of user")
                // console.log(dbValidationError)
                validationErrors = [];

                const fieldKeys = Object.keys(dbValidationError.errors);
                fieldKeys.forEach((fieldKey) => {
                    if(fieldKey.split(".").length === 1) {
                        validationErrors.push(dbValidationError.errors[fieldKey].message);
                    }
                })
            }

            if(!validationErrors) {

                user = await user.save();
                const token = await user.newEmailVerificationToken();

                user = user._doc;
                user = objectMinusKeys(user, ['password', 'tokens']);

                if(user.photo) {
                    user.photo = user.photo.data;
                }

                user.dob = dateUtils.formatDob(user.dob);

                if(!user.driverLicense) {
                    user.driverLicense = {};
                }
                if(user.driverLicense) {
                    if(user.driverLicense.expiry) {
                        user.driverLicense.expiry = dateUtils.formatExpiry(user.driverLicense.expiry);
                    }
                    if(user.driverLicense.scan) {
                        user.driverLicense.scan = user.driverLicense.scan.data;
                    }
                }

                if(user.address) {
                    user.address = user.address._doc;
                    user.address.coordinates = user.address.location._doc.coordinates;
                    user.address.coordinates = [user.address.coordinates[1], user.address.coordinates[0]];
                    delete user.address.location;
                    delete user.address._id;
                }

                res.status(200).send({
                    success: true,
                    message: "Success",
                    customerObj: user
                });

                // ----------------------------------------------------------------------------

                if(config.NODE_ENV !== "test") {
                    //-----------------------------------------------------------------

                    const data = {
                        to: user.email,
                        template: "customer-verification-email",
                        subject: "Trailer2You - Customer Email Verification",
                        context: {
                            url: `${config.HOST}/customer/email/verify?token=${token}`,
                            name: user.name,
                            token: token
                        }
                    };
                    sendMail(data);

                    //-----------------------------------------------------------------
                }
            } else {
                const errorMessage = validationErrors[0] || "addCustomer data in Invalid Format";
                res.status(400).send({
                    success: false,
                    message: errorMessage,
                    errorsList: validationErrors
                });
            }
        }
    
}

module.exports = addCustomer;