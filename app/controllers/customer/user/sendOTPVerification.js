const countriesISO = require("i18n-iso-countries");
const countriesInfo = require("countries-information");
const sinchRequest = require("sinch-request");
const axios = require("axios");

const User = require("../../../models/users");
const { BadRequestError, NotFoundError } = require("./../../../helpers/errors");

const config = process.env;

/** 
 * 
 * @api {POST} /signup/otp/resend Resend OTP
 * @apiName CA - Resend OTP
 * @apiGroup Customer App - User
 * 
 * 
 * @apiHeader {String} Content-Type application/json
 * 
 * 
 * @apiParam {String} mobile Mobile of the Customer 
 * @apiParam {String} country Country of Customer
 * @apiParam {Boolean} testMode Whether this is a test mode
 * 
 * 
 * @apiDescription API Endpoint POST /signup/otp/resend
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
    {
        success: true,
        message: "Success"
    }
 * 
 * 
 */
async function sendOTPVerification(req, res, next) {
  const body = req.body;
  if (!body) throw new BadRequestError("Invalid Request Body");

  let locale = "en-AU";
  let countryCode = "AU";
  if (body.country) {
    countryCode = countriesISO.getAlpha2Code(body.country, "en");
    locale = `en-${countryCode}` || "en-AU";
  }

  const countryInfo = countriesInfo.getCountryInfoByCode(countryCode);
  body.mobile = `${countryInfo.countryCallingCodes[0]}${body.mobile}`;

  // const user = await User.findOne({ mobile: body.mobile });
  const mobileRegex = new RegExp(`\\${body.mobile}$`);
  let user = await User.findOne(
    { mobile: { $regex: mobileRegex } },
    { mobile: 1, email: 1 }
  ).lean();

  if (!user) throw new NotFoundError("User not found");
  // Using Sinch Package --------------------------------------------------------

  if (!body.testMode) {
    const creds = {
      key: config.APPLICATION_KEY,
      secret: config.APPLICATION_SECRET,
    };

    const smsBody = {
      method: "sms",
      identity: {
        type: "number",
        endpoint: body.mobile,
      },
    };

    // HTTP request parameters for sending SMS
    const options = {
      method: "POST",
      host: "verificationapi-v1.sinch.com",
      port: 443,
      path: "/verification/v1/verifications",
      data: smsBody, // Data to be sent in JSON format
      withCredentials: false, // Necessary for browser compatability (browserify)
    };

    // Add authentication header (application)
    sinchRequest.applicationSigned(options, creds);

    const smsDelivery = await axios.post(
      "https://verificationapi-v1.sinch.com/verification/v1/verifications",
      smsBody,
      {
        headers: {
          Authorization: options.headers["authorization"],
          "x-timestamp": options.headers["x-timestamp"],
          "content-type": options.headers["content-type"],
        },
      }
    );
  }

  //-----------------------------------------------------------------------------

  res.status(200).send({
    success: true,
    message: "Success",
  });
}

module.exports = sendOTPVerification;
