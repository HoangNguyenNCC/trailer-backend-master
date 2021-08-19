const mongoose = require("mongoose");
const validator = require("validator");
const countriesISO = require("i18n-iso-countries");
const countriesInfo = require("countries-information");

const User = require("../../../models/users");

const objectMinusKeys = require("../../../helpers/objectMinusKeys");
const dateUtils = require("../../../helpers/dateUtils");
const moment = require('moment');
const dotify = require("../../../helpers/dotify");
const {
  BadRequestError,
  ForbiddenError,
} = require("./../../../helpers/errors");

/** 
 * 
 * @api {PUT} /user Update User
 * @apiName CA - Update User
 * @apiGroup Customer App - User
 * 
 * 
 * @apiHeader {String} Content-Type application/json
 * @apiHeader {String} authorization Authorization Token sent as a response to signIn request
 * 
 * 
 * @apiParam {File} photo User's Profile Photo ( File )
 * @apiParam {File} driverLicenseScan Scanned Image/PDF of User's Driving License ( File )
 * 
 * @apiParam {Object} reqBody Request JSON data containing all the following params:
 * 
 * @apiParam {String} email User Email - Send current email if email is unchanged
 * @apiParam {String} [password] User Password
 * 
 * @apiParam {Object} [name] Full Name of the User
 * @apiParam {String} [mobile] Mobile Number of the User
 * @apiParam {String} [dob] Date of Birth of the User ( YYYY-MM-DD )
 * @apiParam {String} [address] Address of the User
 * @apiParam {Object} [address[country]] Country of the User
 * @apiParam {Object} [address[text]] Text Address of the User
 * @apiParam {Object} [address[pincode]] Pincode of the User Address
 * @apiParam {Object} [address[coordinates]] Coordinates of the User Address [latitude, longitude]
 * 
 * 
 * @apiParam {Object} [driverLicense] Object defining User's Driving License
 * @apiParam {Object} [driverLicense[card]] License Number of the User's Driving License
 * @apiParam {Object} [driverLicense[expiry]] Expiry Date of the User's Driving License ( MM/YY )
 * @apiParam {Object} [driverLicense[state]] State of the User's Driving License 
 * 
 * 
 * @apiDescription API Endpoint that can used to update User data
 * 
 * 
 * Request Headers
 * - 'Content-Type: application/json'
 * 
 * @apiParamExample {json} Request-Example:
 * 
    curl --location --request PUT 'http://localhost:5000/user' \
    --form 'reqBody={
        "email": "a@b.com"
        "mobile":  "919876543210"
    }' \
    --form 'photo=@/home/username/Downloads/user.png' \
    --form 'driverLicenseScan=@/home/username/Downloads/driver_license_sample.jpeg'
 * 
 * 
 * Request Body ( Example )  ( request.body.reqBody )
 * 
    {
        "address": {
            "text" : "NorthBridge, NSW, Australia"
        }
    }
 *
 * 
 * @apiErrorExample {json} Error-Response:
 * HTTP/1.1 400
 * 
    {
        success: false,
        message: "Could not save User data",
        errorsList: []
    }
 * 
 * 
 * @apiSuccess {Boolean} success Success Status
 * @apiSuccess {String} message Success Message
 * @apiSuccess {Object} userObj User Object
 * 
 * 
 * @apiSuccessExample {String} - Success-Response:
 * HTTP/1.1 200 
    {
        success: true,
        message: "Success",
        userObj: {
            "_id": "",
            "email": "user1@gmail.com",
            "mobile": "919876543210",
            "name": "Mr user 1",
            "address": {
                "text" : "NorthBridge, NSW, Australia", 
                "pincode" : "1560", 
                "coordinates" : [ -33.8132, 151.2172 ]
            },
            "dob": "2020-01-20",
            "driverLicense": {
                "card": "223782weyet",
                "expiry": "2022-06-20",
                "state": "MH",
                "scan": driverLicensePicture
            }
        }
    }
 * 
 */
async function updateUser(req, res) {
  if (!req.userId) throw new ForbiddenError("UnAuthorized Access");

  const userId = req.userId;

  let userBody = req.body.reqBody;

  if (!userBody) {
    throw new BadRequestError("Invalid Request Body");
  }

  try {
    userBody = JSON.parse(userBody);
  } catch (e) {}

  let existingUser;

  if (!userBody) {
    throw new BadRequestError("Error occurred while parsing User data");
  }

  existingUser = await User.findOne(
    { _id: mongoose.Types.ObjectId(req.userId) },
    {
      email: 1,
      mobile: 1,
      address: 1,
      driverLicense: 1,
    }
  ).lean();

  if (!existingUser) throw new NotFoundError("User does not exist");

  if (userBody.mobile) {
    let country = "Australia";

    if (userBody.address && userBody.address.country) {
      country = userBody.address.country;
    } else if (existingUser.address && existingUser.address.country) {
      country = existingUser.address.country;
    }

    let locale = "en-AU";
    let countryCode = "AU";
    if (country) {
      countryCode = countriesISO.getAlpha2Code(country, "en");
      locale = `en-${countryCode}` || "en-AU";
    }

    const countryInfo = countriesInfo.getCountryInfoByCode(countryCode);
    userBody.mobile = `${countryInfo.countryCallingCodes[0]}${userBody.mobile}`;

    if (existingUser.mobile !== userBody.mobile) {
      userBody.isMobileVerified = false;
    }
  }

  if (userBody.email && !validator.isEmail(userBody.email)) {
    throw new BadRequestError("Email is in Invalid format");
  }

  if (userBody.email) {
    if (existingUser.email !== userBody.email) {
      userBody.isEmailVerified = false;
    }
  }

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

  if (req.files) {
    if (req.files["photo"] && req.files["photo"].length > 0) {
      let photo = req.files["photo"][0];
      const data = photo.location;
      const contentType = photo.mimetype;

      userBody.photo = {
        contentType: contentType,
        data: data,
      };
    }

    if (
      req.files["driverLicenseScan"] &&
      req.files["driverLicenseScan"].length > 0
    ) {
      let doc = req.files["driverLicenseScan"][0];
      const data = doc.location;
      const contentType = doc.mimetype;

      if (!userBody.driverLicense) {
        userBody.driverLicense = {};
      }
      userBody.driverLicense.scan = {
        contentType: contentType,
        data: data,
      };
    }
  }

  let user = objectMinusKeys(userBody, ["_id"]);
  user = dotify(user);

  user = await User.findByIdAndUpdate(
    userId,
    { $set: user },
    { new: true }
  ).lean();

  user = objectMinusKeys(user, ["password", "tokens"]);

  if (user.address) {
    user.address = user.address;
    user.address.coordinates = [
      user.address.location.coordinates[1],
      user.address.location.coordinates[0],
    ];
    delete user.address.location;
    delete user.address._id;
  }

  if (!user.driverLicense) {
    user.driverLicense = {};
  }
  if(user.driverLicense.expiry){
    user.driverLicense.expiry = moment(user.driverLicense.expiry).format('YYYY-MM-DD')
  }

  res.status(200).send({
    success: true,
    message: "Success",
    userObj: user,
  });
}

module.exports = updateUser;
