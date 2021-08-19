const mongoose = require('mongoose');
const validator = require('validator');
const axios = require('axios');
const dotenv = require('dotenv');
const countriesISO = require('i18n-iso-countries');
const countriesInfo = require('countries-information');
const sinchRequest = require('sinch-request');

const Licensee = require('../../../models/licensees');
const Employee = require('../../../models/employees');

const {
    BadRequestError,
    NotFoundError,
  } = require("./../../../helpers/errors");

dotenv.config();
const config = process.env;

/** 
 * 
 *  
 * @api {POST} /licensee/otp/verify Verify Mobile Number of the Licensee
 * @apiName LA - Verify Mobile Number of the Licensee
 * @apiGroup Licensee App - Licensee Authentication
 * 
 * 
 * @apiHeader {String} Content-Type application/json
 * 
 * 
 * @apiParam {String} mobile Mobile Number of the Licensee
 * @apiParam {String} country Country of Licensee
 * @apiParam {String} user Type of User - "licensee" or "employee" ( default : "employee" )
 * @apiParam {String} otp OTP sent on the Licensee Mobile
 * @apiParam {Boolean} testMode Whether this is a test mode
 * 
 * 
 * @apiDescription API Endpoint POST /licensee/otp/verify
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
    {
        success: true,
        message: "Success"
    }
 * 
 * 
 */
async function verifyOTP(req, res, next) {
        const body = req.body;
        console.log({body});
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

        let employee =  await Licensee.findOne({ mobile: body.mobile}, { _id: 1 });
    
        if (employee === null) {
            employee = await Employee.findOne({mobile: body.mobile}, {_id: 1});
        }

        if (employee === null) {
            // no employee or licensee
            return res.status(404).json({
                error: 'Invalid'
            });
        }
        console.log(employee);


        let user;
        if(!body.user || !["licensee", "employee"].includes(body.user)) {
            body.user = "employee";
        }
        if(body.user) {
            if(body.user === "licensee") {
                user = employee
                ;
            } else {
                user = await Employee.findOne({ mobile: body.mobile}, { _id: 1 });
            }
        }

        if(!user) {
            throw new NotFoundError("VALIDATION-NO User Found");
        }

        //------------------------------------------------------------------------------

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
            if (!otpVerificationSuccessful) otpFailureReason = otpVerification.data.reason || 'Invalid OTP';
        } else {
            otpVerificationSuccessful = true;
        } 
        if(otpVerificationSuccessful){
            if(body.user==='licensee'){
                await Licensee.updateOne({ _id:user._id},{isMobileVerified:true});
            }
            else{
                await Employee.updateOne({ _id:user},{isMobileVerified:true});
            }
            return res.status(200).json("verification succesful")
        }
        else{
            throw new BadRequestError(otpFailureReason)
        }
}

module.exports = verifyOTP;