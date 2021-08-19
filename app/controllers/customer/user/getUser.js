const User = require("../../../models/users");

const { ForbiddenError, NotFoundError } = require("./../../../helpers/errors");
const objectMinusKeys = require("../../../helpers/objectMinusKeys");
const moment = require('moment');

/**
 * 
 * @api {GET} /user Get User Details
 * @apiName CA - Get User Details
 * @apiGroup Customer App - User
 * 
 * 
 * @apiHeader {String} authorization Authorization token sent as a response to signIn request
 * 
 * 
 * @apiParam {String} id UserId
 * 
 * 
 * @apiDescription API Endpoint that can used to get User data
 * 
 * 
 * @apiErrorExample {json} Error-Response:
 * HTTP/1.1 400
 * 
    {
        success: false,
        message: "Error occurred while fetching User data",
        errorsList: []
    }
 * 
 * 
 * @apiSuccess {Boolean} success Success Status
 * @apiSuccess {String} message Success Message
 * @apiSuccess {Object} userObj User Object
 * 
 * @apiSuccessExample {String} - Success-Response:
 * HTTP/1.1 200 
 *
    {
        success: true,
        message: "Successfully saved User data",
        userObj: {
            "email": "user1@gmail.com",
            "mobile": "919876543210",
            "name":  "user 1",
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
                "scan": "http://localhost:5000/file/userdrivinglicense/5e395d2f784ae3441c9486bc",
                "verified": true,
                "accepted": true
            }
        }
    }
 * 
 */
async function getUser(req, res, next) {
  if (!req.userId) throw new ForbiddenError("UnAuthorized Access");
  const userId = req.userId;

  let user = await User.findOne({ _id: userId }).lean();

  if (!user) throw new NotFoundError("User not found");

  user = objectMinusKeys(user, ["password", "tokens"]);

  if (user.address) {
    user.address.coordinates = user.address.location.coordinates;
    user.address.coordinates = [
      user.address.coordinates[1],
      user.address.coordinates[0],
    ];
    delete user.address.location;
    delete user.address._id;
  }

  if(user.driverLicense.expiry){
    user.driverLicense.expiry = moment(user.driverLicense.expiry).format('YYYY-MM-DD')
  }

  if (!user.driverLicense) {
    user.driverLicense = {};
  }

  return res.status(200).send({
    success: true,
    message: "Successfully fetched User data",
    userObj: user,
  });
}

module.exports = getUser;
