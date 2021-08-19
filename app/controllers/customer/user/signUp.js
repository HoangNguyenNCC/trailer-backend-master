const validator = require("validator");
const axios = require("axios");
const dotenv = require("dotenv");
const countriesISO = require("i18n-iso-countries");
const countriesInfo = require("countries-information");
const moment = require("moment");
const sinchRequest = require("sinch-request");

const User = require("../../../models/users");

const objectMinusKeys = require("../../../helpers/objectMinusKeys");
const embeddedParser = require("../../../helpers/embeddedParser");
const sendMail = require("../../../helpers/sendMail");
const { BadRequestError, NotFoundError } = require("../../../helpers/errors");

const config = process.env;

/** 
 * 
 * @api {POST} /signup User SignUp
 * @apiName CA - User SignUp
 * @apiGroup Customer App - User
 *  
 * 
 * @apiHeader {String} Content-Type application/json
 * 
 * 
 * @apiParam {File} photo User's Profile Photo ( File )
 * @apiParam {File} driverLicenseScan Scanned Image/PDF of User's Driving License ( File )
 * 
 * @apiParam {Object} reqBody Request JSON data containing the following:
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
 * @apiDescription API Endpoint POST /signup
 * 
 * 
 * @apiParamExample {json} Request-Example:
 * 
    curl --location --request POST 'http://localhost:5000/signup' \
    --form 'reqBody={
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
    }' \
    --form 'photo=@/home/username/Downloads/user.png' \
    --form 'driverLicenseScan=@/home/username/Downloads/driver_license_sample.jpeg'
 * 
 * 
 * Request Headers
 * - 'Content-Type: application/json'
 * 
 * Request Body ( Example )  ( request.body.reqBody )
 * 
    {
        "email": "johndoe@gmail.com",
        "mobile": "919876543210",
        "name": "John Doe",
        "dob": "2020-01-20",
        "password": "aBcd@1234",
        "address": {
            "country": "Australia",
            "text" : "NorthBridge, NSW, Australia", 
            "pincode" : "1560", 
            "coordinates" : [ -33.8132, 151.2172 ] 
        },
        "driverLicense": {
            "card": "223782weyet",
            "expiry": "2020-06-20",
            "state": "MH",
        }
    }
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
        message: "Success"
    }
 * 
 * 
 */

async function signUp(req, res, next) {
  let userBody = req.body.reqBody;

  if (!userBody) throw new BadRequestError("Invalid user body");

  try {
    userBody = JSON.parse(userBody);
  } catch (err) {}

  const embeddedKeys = ["driverLicense"];
  userBody = embeddedParser(userBody, embeddedKeys);

  if (!userBody)
    throw new BadRequestError("Error occurred while parsing SignUp data");

  let validationErrors = undefined;

  if (!userBody.name || !userBody.name.trim())
    throw new BadRequestError("Name is empty");

  if (!userBody.mobile || !userBody.mobile.trim())
    throw new BadRequestError("Mobile Number is empty");

  // let locale = "en-AU";
  // let countryCode = "AU";
  if (userBody.address && userBody.address.country) {
    countryCode = countriesISO.getAlpha2Code(userBody.address.country, "en");
    locale = `en-${countryCode}` || "en-AU";
  }
  const countryInfo = countriesInfo.getCountryInfoByCode(countryCode);
  userBody.mobile = `${countryInfo.countryCallingCodes[0]}${userBody.mobile}`;

  if (!userBody.email || !userBody.email.trim())
    throw new BadRequestError("Email is empty");

  if (!validator.isEmail(userBody.email))
    throw new BadRequestError("Email is in Invalid format");

  if (userBody.address && userBody.address.coordinates) {
    userBody.address.location = {
      type: "Point",
      coordinates: [
        userBody.address.coordinates[1],
        userBody.address.coordinates[0],
      ],
    };
    delete userBody.address.coordinates;
  }

  if (typeof userBody.address === "string") {
    userBody.address = {
      text: userBody.address,
    };
  }

  if (req.files && req.files["photo"] && req.files["photo"].length > 0) {
    let photo = req.files["photo"][0];
    const data = photo.location;
    const contentType = photo.mimetype;

    userBody.photo = {
      contentType: contentType,
      data: data,
    };
  }

  if (!userBody.driverLicense) {
    throw new BadRequestError("-Driving License is required");
  }

  if (userBody.driverLicense) {
    if (userBody.driverLicense.expiry) {
      userBody.driverLicense.expiry = moment(userBody.driverLicense.expiry).format("YYYY-MM-DD");
    }
  }

  if (
    userBody.driverLicense &&
    req.files &&
    req.files["driverLicenseScan"] &&
    req.files["driverLicenseScan"].length > 0
  ) {
    let doc = req.files["driverLicenseScan"][0];
    const data = doc.location;
    const contentType = doc.mimetype;

    userBody.driverLicense.scan = {
      contentType: contentType,
      data: data,
    };
  } else {
    throw new BadRequestError("Driver License Scan is required");
  }

  let user = new User(userBody);

  const dbValidationError = user.validateSync();

  if (dbValidationError) {
    validationErrors = [];
    const fieldKeys = Object.keys(dbValidationError.errors);
    fieldKeys.forEach((fieldKey) => {
      if (fieldKey.split(".").length === 1) {
        validationErrors.push(dbValidationError.errors[fieldKey].message);
      }
    });
  }

  if (validationErrors) {
    const errorMessage = validationErrors[0] || "Signup data in Invalid Format";
    throw new BadRequestError(errorMessage);
  }

  user = await user.save();
  const token = await user.newEmailVerificationToken();

  user = user._doc;
  user = objectMinusKeys(user, ["password", "tokens"]);

  if (!user.driverLicense) {
    user.driverLicense = {};
  }

  if (user.address) {
    user.address = user.address._doc;
    user.address.coordinates = user.address.location._doc.coordinates;
    user.address.coordinates = [
      user.address.coordinates[1],
      user.address.coordinates[0],
    ];
    delete user.address.location;
    delete user.address._id;
  }

  res.status(200).send({
    success: true,
    message: "Success",
  });

  // ----------------------------------------------------------------------------

  if (config.NODE_ENV !== "test") {
    //-----------------------------------------------------------------

    const data = {
      to: user.email,
      template: "customer-verification-email",
      subject: "Trailer2You - Customer Email Verification",
      context: {
        url: `${config.HOST}/customer/email/verify?token=${token}`,
        name: user.name,
        token: token,
      },
    };
    sendMail(data);

    //-----------------------------------------------------------------

    // Using Sinch Package --------------------------------------------

    const creds = {
      key: config.APPLICATION_KEY,
      secret: config.APPLICATION_SECRET,
    };

    const smsBody = {
      method: "sms",
      identity: {
        type: "number",
        endpoint: userBody.mobile,
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

    //-----------------------------------------------------------------
  }
}

module.exports = signUp;
