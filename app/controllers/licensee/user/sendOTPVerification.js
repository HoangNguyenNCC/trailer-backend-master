const mongoose = require('mongoose');
const validator = require('validator');
const countriesISO = require('i18n-iso-countries');
const countriesInfo = require('countries-information');
const sinchRequest = require('sinch-request');
const axios = require('axios');
const dotenv = require('dotenv');

const Licensee = require('../../../models/licensees');
const Employee = require('../../../models/employees');

const {
    BadRequestError,
    ForbiddenError,
    NotFoundError,
    UnauthorizedError,
    ApiError
  } = require("./../../../helpers/errors");

dotenv.config();
const config = process.env;

/** 
 * 
 *  
 * @api {POST} /licensee/otp/resend Resend OTP
 * @apiName LA - Resend OTP
 * @apiGroup Licensee App - Licensee Authentication
 * 
 * 
 * @apiHeader {String} Content-Type application/json
 * 
 * 
 * @apiParam {String} mobile Mobile of the Licensee 
 * @apiParam {String} country Country of Licensee
 * @apiParam {String} user Type of User - "licensee" or "employee" ( default : "employee" )
 * @apiParam {Boolean} testMode Whether this is a test mode
 * 
 * 
 * @apiDescription API Endpoint POST /licensee/otp/resend
 * 
 * 
 * @apiErrorExample {json} Error-Response:
 * HTTP/1.1 400
    {
        success: false,
        message: "Token is invalid.""
    }
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
        message: "Success"
    }
 * 
 * 
 */
async function sendOTPVerification(req, res, next) {
        const body = req.body;
        
        let locale = "en-AU";
        let countryCode = "AU";
        if(body.country) {
            countryCode = countriesISO.getAlpha2Code(body.country, 'en');
            locale = `en-${countryCode}` || "en-AU";
        }

        if(!body || !body.mobile) {
            throw new BadRequestError("VALIDATION-Invalid Mobile");
        }

        const countryInfo = countriesInfo.getCountryInfoByCode(countryCode);
        body.mobile = `${countryInfo.countryCallingCodes[0]}${body.mobile}`;

        // const user = await User.findOne({ mobile: body.mobile });
        const mobileRegex = new RegExp(`\\${body.mobile}$`);

        let user;
        if(!body.user || !["licensee", "employee"].includes(body.user)) {
            body.user = "employee";
        }
        if(body.user) {
            if(body.user === "licensee") {
                user = await Licensee.findOne({ mobile: body.mobile }, { _id: 1 });
            } else {
                user = await Employee.findOne({ mobile: body.mobile }, { _id: 1 });
            }
        }

        if(!user) {
            throw new BadRequestError("VALIDATION-Licensee with Mobile not found");
        }
        user = user._doc;

        // Using Sinch Package --------------------------------------------------------

        if(!body.testMode) {
            const creds = {
                key: config.APPLICATION_KEY,
                secret: config.APPLICATION_SECRET
            };

            const smsBody = {
                "method": "sms",
                "identity": {
                    "type": "number",
                    "endpoint": body.mobile
                }
            };

            // HTTP request parameters for sending SMS
            const options = {
                method: 'POST',
                host: 'verificationapi-v1.sinch.com',
                port: 443,
                path: '/verification/v1/verifications',
                data: smsBody, // Data to be sent in JSON format
                withCredentials: false, // Necessary for browser compatability (browserify)
            };
            
            // Add authentication header (application)
            sinchRequest.applicationSigned(options, creds);

            const smsDelivery = await axios.post("https://verificationapi-v1.sinch.com/verification/v1/verifications", smsBody, {
                headers: {
                    "Authorization": options.headers["authorization"], 
                    "x-timestamp": options.headers["x-timestamp"],
                    "content-type": options.headers["content-type"]
                }
            });
        }
    
        //-----------------------------------------------------------------------------

        res.status(200).send({
            success: true,
            message: "Success"
        });
}

module.exports = sendOTPVerification;