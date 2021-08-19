const path = require("path");
const mongoose = require("mongoose");
const User = require("../../../models/users");
const { BadRequestError } = require("./../../../helpers/errors");

/** 
 * 
 *  
 * @api {GET} /customer/email/verify Verify Email Id of the Customer
 * @apiName CA - Verify Email Id of the Customer
 * @apiGroup Customer App - User
 * 
 * 
 * @apiHeader {String} Content-Type application/json
 * 
 * 
 * @apiParam {String} token Token sent in the Email Link
 * 
 * 
 * @apiDescription API Endpoint GET /customer/email/verify
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
 * @apiSuccess {File} file HTML File
 * 
 * 
 * @apiSuccessExample {String} - Success-Response:
 * HTTP/1.1 200 OK with appropriate html file
 * 
 * 
 */
async function verifyEmail(req, res) {
  if (!req.query) {
    throw new BadRequestError("Token is invalid.");
  }

  const token = req.query.token;
  const verifiedUserObj = User.verifyEmailVerificationToken(token);

  if (verifiedUserObj) {
    await User.updateOne(
      { _id: mongoose.Types.ObjectId(verifiedUserObj._id) },
      { isEmailVerified: true }
    );

    res
      .status(200)
      .sendFile(
        path.join(__dirname, "../../../helpers/templates/email-verified.html")
      );
  } else {
    res
      .status(400)
      .sendFile(
        path.join(
          __dirname,
          "../../../helpers/templates/email-verification-failed.html"
        )
      );
  }
}

module.exports = verifyEmail;
