const mongoose = require('mongoose');
const validator = require('validator');
const axios = require('axios');
const dotenv = require('dotenv');
const countriesISO = require('i18n-iso-countries');
const countriesInfo = require('countries-information');
const sinchRequest = require('sinch-request');

const Licensee = require('../../../models/licensees');
const Employee = require('../../../models/employees');
const { BadRequestError } = require('../../../helpers/errors');

dotenv.config();
const config = process.env;


const verifyOTP = async function(req,res){
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

        let user;
        if(!body.user || !["licensee", "employee"].includes(body.user)) {
            body.user = "employee";
        }
        if(body.user) {
            if(body.user === "licensee") {
                user = await Licensee.findOne({ mobile: body.mobile});
            } else {
                user = await Employee.findOne({ mobile: body.mobile});
            }
        }

        if(!user) {
            throw new BadRequestError("VALIDATION-Invalid Mobile");
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
            if (!otpVerificationSuccessful) otpFailureReason = otpVerification.data.reason || otpFailureReason;
        } else {
            otpVerificationSuccessful = true;
        }
    
        //-----------------------------------------------------------------------------

        if(otpVerificationSuccessful) {
            await Licensee.findOneAndUpdate({ mobile: body.mobile  }, { isMobileVerified: true });
            // const licenseeAfter = await Licensee.findOne({ mobile:body.mobile }, { _id: 1, isMobileVerified: 1 });        
            await Employee.findOneAndUpdate({ mobile: body.mobile}, { isMobileVerified: true });
            // const employeeAfter = await Employee.findOne({ mobile:body.mobile }, { _id: 1, isMobileVerified: 1 });

            res.status(200).send({
                success: true,
                message: "Success"
            });
        } else 
            throw new BadRequestError(otpFailureReason);
}

module.exports = verifyOTP