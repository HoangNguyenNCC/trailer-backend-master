const User = require("../../../models/users");
const { BadRequestError } = require("./../../../helpers/errors");

/**
 *
 * @api {PUT} /resetpassword Reset Password
 * @apiName CA - Reset Password
 * @apiGroup Customer App - User
 *
 *
 * @apiHeader {String} Content-Type application/json
 *
 *
 * @apiParam {String} token Password Reset Token
 * @apiParam {String} password Password Entered by User
 *
 *
 * @apiDescription API Endpoint PUT /resetpassword
 *
 *
 * @apiSuccess {Boolean} success Success Status
 * @apiSuccess {String} message Success Message
 *
 *
 * @apiSuccessExample {String} - Success-Response:
 * HTTP/1.1 200 OK
 * {
 *      success: true,
 *      message: "Password is reset successfully"
 * }
 *
 * @apiErrorExample {json} Error-Response:
 * HTTP/1.1 400
 *  {
 *      success: false,
 *      message: "Error occurred while resetting a password",
 *      errorsList: []
 *  }
 *
 *
 */
async function resetPassword(req, res, next) {
  const token = req.body.token;
  const password = req.body.password;

  if (!token) throw new BadRequestError("Invalid token sent");
  if (!password) throw new BadRequestError("Invalid Password sent");

  const savedPassword = await User.verifyPasswordResetTokenAndSavePassword(
    token,
    password
  );

  if (!savedPassword) throw new BadRequestError("Old Password doesn't match");

  if (savedPassword.errors && savedPassword.errors.length > 0)
    throw new BadRequestError(savedPassword.errors);

  res.status(200).send({
    success: true,
    message: "Password is reset successfully",
  });
}

module.exports = resetPassword;
