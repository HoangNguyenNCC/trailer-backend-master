const User = require("../../../models/users");

const objectMinusKeys = require("../../../helpers/objectMinusKeys");
const { BadRequestError } = require("./../../../helpers/errors");

/** 
 * 
 *  
 * @api {POST} /signin User SignIn
 * @apiName CA - User SignIn
 * @apiGroup Customer App - User
 * 
 * 
 * @apiHeader {String} Content-Type application/json
 * 
 * 
 * @apiParam {String} email Email Entered By User
 * @apiParam {String} password Password Entered By User
 * @apiParam {String} fcmDeviceToken Firebase Cloud Messaging Device Token
 * 
 * 
 * @apiDescription API Endpoint POST /signin
 * 
 * 
 * Request Headers
 * - 'Content-Type: application/json'
 * 
 * Request Body ( Example )  ( request.body )
 * 
 *  {
 *      "email": "user1@gmail.com",
 *      "password": "1234567890",
 *      "fcmDeviceToken": ""
 *  }
 * 
 * @apiErrorExample {json} Error-Response:
 * HTTP/1.1 400
 *  {
 *      success: false,
 *      message: "Please enter valid credentials",
 *      errorsList: []
 *  }
 * 
 * 
 * @apiSuccess {Boolean} success Success Status
 * @apiSuccess {String} message Success Message
 * @apiSuccess {Object} dataObj Object containing data
 * @apiSuccess {Object} userObj User Object
 * @apiSuccess {String} token Token
 * 
 * 
 * @apiSuccessExample {String} - Success-Response:
 * HTTP/1.1 200 OK
 * 
 *  {
 *      success: true,
 *      message: "Successfully signed in!",
 *      dataObj: {
 *          userObj: {
 *              "_id": "5e395d2f784ae3441c9486bc",
 *              "email": "user1@gmail.com",
 *              "mobile": "919876543210",
 *              "name": "user 1",
 *              "address": {
                    "text" : "NorthBridge, NSW, Australia", 
                    "pincode" : "1560", 
                    "coordinates" : [ -33.8132, 151.2172 ] 
                },
 *              "dob": "2020-01-20T00:00:00.000Z",
 *              "driverLicense": {
 *                  "card": "223782weyet",
 *                  "expiry": "2020-06-20",
 *                  "state": "MH",
 *                  "scan": "http://localhost:5000/file/userdrivinglicense/5e395d2f784ae3441c9486bc",
 *                  "verified": true,
 *                  "accepted": true
 *              },
 *              "createdAt": "2020-02-04T12:01:51.389Z",
 *              "updatedAt": "2020-02-04T12:26:25.353Z",
 *              "__v": 5
 *          },
 *          "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI1ZTM5NWQyZjc4NGFlMzQ0MWM5NDg2YmMiLCJpYXQiOjE1ODA4MTkxODUsImV4cCI6MTU4MTQyMzk4NX0.-Yg9zNJQvACGQ65I5xGzQ8b3YgyO1s-UIpWG_4QptKE"
 *      }
 *  }
 * 
 *
 * 
 */
async function signIn(req, res, next) {
  let checkResult = await User.checkValidCredentials(
    req.body.email,
    req.body.password
  );
  if (checkResult.errors)
    throw new BadRequestError("Credentials are invalid or User not found");

  let user = checkResult.user;
  const token = await user.newAuthToken();

  if (req.body.fcmDeviceToken) {
    await User.updateOne(
      { _id: user._id },
      { fcmDeviceToken: req.body.fcmDeviceToken }
    );
  }

  user = objectMinusKeys(user._doc, ["password", "tokens"]);

  if (user.address) {
    user.address.coordinates = user.address.location.coordinates;
    user.address.coordinates = [
      user.address.coordinates[1],
      user.address.coordinates[0],
    ];
    delete user.address.location;
    delete user.address._id;
  }

  res.cookie("User-Access-Token", token, { httpOnly: true, expires: 0 });
  res.status(200).send({
    success: true,
    message: "Successfully signed in!",
    dataObj: {
      userObj: user,
      token: token,
    },
  });
}

module.exports = signIn;
