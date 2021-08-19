const User = require("../../../models/users");

const sendMail = require("../../../helpers/sendMail");
const { NotFoundError } = require("./../../../helpers/errors");

/**
 *
 * @api {PUT} /forgotpassword Forgot Password
 * @apiName CA - Forgot Password
 * @apiGroup Customer App - User
 *
 *
 * @apiHeader {String} Content-Type application/json
 *
 *
 * @apiParam {String} email Email Entered By User
 * @apiParam {String} platform android || ios || web
 *
 *
 * @apiDescription API Endpoint PUT /forgotpassword
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
 *      message: "Success"
 * }
 *
 * @apiErrorExample {json} Error-Response:
 * HTTP/1.1 400
 * {
 *      success: false,
 *      message: "Error occurred in Forgot Password functionality",
 *      errorsList: []
 * }
 *
 *
 */
async function forgotPassword(req, res, next) {
  const body = req.body;
  const user = await User.findOne(
    { email: body.email },
    { email: 1, name: 1 }
  ).lean();

  if (!user) throw new NotFoundError("User with email not found");

  const token = await user.newPasswordResetToken();

  if (config.NODE_ENV !== "test") {
    let url = `${config.ADMIN_PANEL_HOST}/customer/password/reset?token=${token}`;
    if (body.platform === "android") {
      url = `${config.CUSTOMERAPP_ANDROID_LINK}/reset_password?token=${token}`;
    } else if (body.platform === "ios") {
      url = `${config.CUSTOMERAPP_IOS_LINK}/reset_password?token=${token}`;
    }

    const data = {
      to: userDoc.email,
      template: "forgot-password-mail",
      subject: "Trailer2You - Link To Reset Password",
      context: {
        url: url,
        firstName: userDoc.name,
        token,
      },
    };
    sendMail(data);
  }

  res.status(200).send({
    success: true,
    message: "Success",
  });
}

module.exports = forgotPassword;
