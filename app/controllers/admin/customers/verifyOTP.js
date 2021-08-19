const mongoose = require('mongoose');
const validator = require('validator');
const axios = require('axios');
const countriesISO = require('i18n-iso-countries');
const countriesInfo = require('countries-information');
const sinchRequest = require('sinch-request');

const dotenv = require('dotenv');
dotenv.config();
const config = process.env;


const User = require('../../../models/users');

const aclSettings = require('../../../helpers/getAccessControlList');
const {BadRequestError} = require('./../../../helpers/errors');


/** 
 * 
 *  
 * @api {POST} /admin/customer/otp/verify Verify Mobile Number of the Customer
 * @apiName TAAC - Verify Mobile Number of the Customer
 * @apiGroup Admin App - Customer
 * 
 * 
 * @apiHeader {String} Content-Type application/json
 * 
 * 
 * @apiParam {String} customerId ID of the Customer
 * @apiParam {String} mobile Mobile Number of the Customer
 * @apiParam {String} country Country of Customer
 * @apiParam {String} otp OTP sent on the Customer Mobile
 * @apiParam {Boolean} testMode Whether this is a test mode
 * 
 * 
 * @apiDescription API Endpoint POST /admin/customer/otp/verify
 * 
 * 
 * @apiErrorExample {json} Error-Response:
 * HTTP/1.1 400
    {
        success: false,
        message: "Token is invalid"
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
async function verifyOTP(req, res, next) {
    const body = req.body;

        if(!body) {
            throw new BadRequestError("VALIDATION-Invalid Data");
        }

        let locale = "en-AU";
        let countryCode = "AU";
        if(body.country) {
            countryCode = countriesISO.getAlpha2Code(body.country, 'en');
            locale = `en-${countryCode}` || "en-AU";
        }

        const countryInfo = countriesInfo.getCountryInfoByCode(countryCode);
        body.mobile = `${countryInfo.countryCallingCodes[0]}${body.mobile}`;

        if(!body.otp) {
            throw new BadRequestError("VALIDATION-Invalid OTP");
        }
    
        // const user = await User.findOne({ mobile: body.mobile }, { _id: 1 });
        // const user = await User.findOne({ mobile: body.mobile });
        const mobileRegex = new RegExp(`\\${body.mobile}$`);
        const user = await User.findOne({ _id: mongoose.Types.ObjectId(body.customerId), mobile: { $regex: mobileRegex } }, { _id: 1 });

        if(!user) {
            throw new BadRequestError("VALIDATION-Invalid Mobile");
        }

        //------------------------------------------------------------------------------

        /* const axiosInstance = axios.create();

        const smsDelivery = await axios.post(`https://verificationapi-v1.sinch.com/verification/v1/verifications/number/${mobile}`, {
            auth: {
                username: config.APPLICATION_KEY,
                password: config.APPLICATION_SECRET
            },
            data: {
                "method": "sms", 
                "sms": {
                    "code": "OTPCODE"
                }
            }
        }); */

        // const mobile = body.mobile.replace("+", "");
        const mobile = body.mobile;

        let otpVerificationSuccessful = false;
        let otpFailureReason = 'Invalid OTP';

        // Using Sinch Package ---------------------------------

        if(!body.testMode) {

            const creds = {
                key: config.APPLICATION_KEY,
                secret: config.APPLICATION_SECRET
            };

            const smsBody = {
                "method": "sms", 
                "sms": {
                    "code": body.otp
                }
            };

            // HTTP request parameters for sending SMS
            const options = {
                method: 'PUT',
                host: 'verificationapi-v1.sinch.com',
                port: 443,
                path: `/verification/v1/verifications/number/${mobile}`,
                data: smsBody, // Data to be sent in JSON format
                withCredentials: false, // Necessary for browser compatability (browserify)
            };
            
            // Add authentication header (application)
            sinchRequest.applicationSigned(options, creds);

            const otpVerification = await axios.put(`https://verificationapi-v1.sinch.com/verification/v1/verifications/number/${mobile}`, smsBody, {
                headers: {
                    "Authorization": options.headers["authorization"], 
                    "x-timestamp": options.headers["x-timestamp"],
                    "content-type": options.headers["content-type"]
                }
            });

            otpVerificationSuccessful = (otpVerification.data.status === "SUCCESSFUL");
            if (!otpVerificationSuccessful) otpFailureReason = otpVerification.data.reason || otpFailureReason;
        } else {
            otpVerificationSuccessful = true;
        }
        //-----------------------------------------------------------------------------

        if(otpVerificationSuccessful) {
            await User.updateOne({ mobile: { $regex: mobileRegex } }, { isMobileVerified: true });
        
            res.status(200).send({
                success: true,
                message: "Success"
            });
        } else
            throw new BadRequestError(otpFailureReason);
}

module.exports = verifyOTP;