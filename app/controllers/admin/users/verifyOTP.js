const mongoose = require('mongoose');
const validator = require('validator');
const axios = require('axios');
const dotenv = require('dotenv');
const countriesISO = require('i18n-iso-countries');
const countriesInfo = require('countries-information');
const sinchRequest = require('sinch-request');

dotenv.config();
const config = process.env;

const AdminEmployee = require('../../../models/adminEmployees');
const { BadRequestError } = require('../../../helpers/errors');

/**
 * 
 * @api {POST} /admin/employee/verifyotp Verify OTP sent on SMS for Admin App
 * @apiName TAAU - Verify OTP sent on SMS for Admin App
 * @apiGroup Admin App - AdminUser
 * 
 * 
 * @apiHeader {String} Content-Type application/json
 * 
 * 
 * @apiParam {String} mobile Mobile Number of the Customer
 * @apiParam {String} country Country of Customer
 * @apiParam {String} otp OTP sent on the Customer Mobile
 * 
 * 
 * @apiDescription API Endpoint POST /admin/employee/verifyotp
 * 
 * 
 * @apiSuccessExample {String} - Success-Response:
 * HTTP/1.1 200 OK
 * {
 *     success: true,
 *     message: "Success"
 * }
 * 
 * 
 * @apiErrorExample {json} Error-Response:
 * HTTP/1.1 400
 *  {
 *      success: false,
 *      message: "Error occurred while verifying SMS",
 *      errorsList: []
 *  }
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
    
        const mobileRegex = new RegExp(`\\${body.mobile}$`);
        const employee = await AdminEmployee.findOne({ mobile: { $regex: mobileRegex } }, { _id: 1 });

        if(!employee) {
            throw new BadRequestError("VALIDATION-Invalid Mobile");
        }

        // Using Sinch Package ---------------------------------

        // const mobile = body.mobile.replace("+", "");
        const mobile = body.mobile;

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
    
        //-----------------------------------------------------------------------------

        const isVerified = (otpVerification.data.status === "SUCCESSFUL");
        if(isVerified) {
            await AdminEmployee.updateOne({ mobile: { $regex: mobileRegex } }, { isMobileVerified: true });
        
            res.status(200).send({
                success: true,
                message: "Success"
            });
        } else
            throw new BadRequestError(otpVerification.data.reason || 'OTP is invalid');
}

module.exports = verifyOTP;