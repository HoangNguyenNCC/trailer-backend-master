const axios = require("axios");
const countriesISO = require("i18n-iso-countries");
const countriesInfo = require("countries-information");
const sinchRequest = require("sinch-request");

const config = process.env;

const User = require("../../../models/users");
const { BadRequestError } = require("./../../../helpers/errors");

/** 
 * 
 *  
 * @api {POST} /signup/verify Verify Mobile Number of the Customer
 * @apiName CA - Verify Mobile Number of the Customer
 * @apiGroup Customer App - User
 * 
 * 
 * @apiHeader {String} Content-Type application/json
 * 
 * 
 * @apiParam {String} mobile Mobile Number of the Customer
 * @apiParam {String} country Country of Customer
 * @apiParam {String} otp OTP sent on the Customer Mobile
 * @apiParam {Boolean} testMode Whether this is a test mode
 * 
 * 
 * @apiDescription API Endpoint POST /signup/verify
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

  if (!body) {
    throw new BadRequestError("Invalid Data");
  }

  if (body.country) {
    countryCode = countriesISO.getAlpha2Code(body.country, "en");
    locale = `en-${countryCode}` || "en-AU";
  }

  const countryInfo = countriesInfo.getCountryInfoByCode(countryCode);
  body.mobile = `${countryInfo.countryCallingCodes[0]}${body.mobile}`;

  if (!body.otp) {
    throw new BadRequestError("Invalid OTP");
  }

  const user = await User.findOne({ mobile: body.mobile });

  if (!user) {
    throw new BadRequestError("Invalid Mobile");
  }

  const mobile = body.mobile;

  let otpVerificationSuccessful = false;
  let otpFailureReason = 'Invalid OTP';

  if (!body.testMode) {
    const creds = {
      key: config.APPLICATION_KEY,
      secret: config.APPLICATION_SECRET,
    };

    const smsBody = {
      method: "sms",
      sms: {
        code: body.otp,
      },
    };

    // HTTP request parameters for sending SMS
    const options = {
      method: "PUT",
      host: "verificationapi-v1.sinch.com",
      port: 443,
      path: `/verification/v1/verifications/number/${mobile}`,
      data: smsBody, // Data to be sent in JSON format
      withCredentials: false, // Necessary for browser compatability (browserify)
    };

    // Add authentication header (application)
    sinchRequest.applicationSigned(options, creds);

    const otpVerification = await axios.put(
      `https://verificationapi-v1.sinch.com/verification/v1/verifications/number/${mobile}`,
      smsBody,
      {
        headers: {
          Authorization: options.headers["authorization"],
          "x-timestamp": options.headers["x-timestamp"],
          "content-type": options.headers["content-type"],
        },
      }
    );

    otpVerificationSuccessful = otpVerification.data.status === "SUCCESSFUL";
    if (!otpVerificationSuccessful) otpFailureReason = otpVerification.data.reason || otpFailureReason;
  } else {
    otpVerificationSuccessful = true;
  }

  if (otpVerificationSuccessful) {
    await User.updateOne({ mobile: body.mobile }, { isMobileVerified: true });

    res.status(200).send({
      success: true,
      message: "Success",
    });
  } else {
    throw new BadRequestError(otpFailureReason);
  }
}

module.exports = verifyOTP;
