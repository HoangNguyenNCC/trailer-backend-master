const mongoose = require('mongoose');
const validator = require('validator');
const countriesISO = require('i18n-iso-countries');
const countriesInfo = require('countries-information');
const sinchRequest = require('sinch-request');
const axios = require('axios');
const dotenv = require('dotenv');

dotenv.config();
const config = process.env;

const AdminEmployee = require('../../../models/adminEmployees');
const { BadRequestError } = require('../../../helpers/errors');

/**
 * 
 * @api {POST} /admin/employee/generateotp Generate OTP and send on Mobile
 * @apiName TAAU - Generate OTP and send on Mobile
 * @apiGroup Admin App - AdminUser
 * 
 * 
 * @apiHeader {String} Content-Type application/json
 * 
 * 
 * @apiParam {String} mobile Mobile of the Customer 
 * @apiParam {String} country Country of Customer
 * 
 * 
 * @apiDescription API Endpoint POST /admin/employee/generateotp
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
 *      message: "Error occurred while sending OTP Verification SMS",
 *      errorsList: []
 *  }
 * 
 * 
 */
async function generateOTP(req, res, next) {
   const body = req.body;

        if (!body) throw new BadRequestError('VALIDATION-Invalid Body');
    
        let locale = "en-AU";
        let countryCode = "AU";
        if(body.country) {
            countryCode = countriesISO.getAlpha2Code(body.country, 'en');
            locale = `en-${countryCode}` || "en-AU";
        }

        const countryInfo = countriesInfo.getCountryInfoByCode(countryCode);
        // const mobileRegex = new RegExp(`\\${body.mobile}$`);
        
        let employeeCount = await AdminEmployee.countDocuments({ mobile: body.mobile  });

        //convert mobile number to suitable format for sinch
        body.mobile = `${countryInfo.countryCallingCodes[0]}${body.mobile}`;

        if(employeeCount == 0) {
            throw new BadRequestError("Invalid Mobile Number");
        }
    
        // Using Sinch Package --------------------------------------------------------
    
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

        //-----------------------------------------------------------------------------

        res.status(200).send({
            success: true,
            message: "Success"
        });
}

module.exports = generateOTP;