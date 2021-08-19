const validator = require("validator");

const User = require("../../../models/users");

const { BadRequestError, NotFoundError } = require("../../../helpers/errors");
const sendMail = require("../../../helpers/sendMail");

const config = process.env;

/** 
 * 
 *  
 * @api {POST} /customer/email/verify Send Email Verification Link
 * @apiName CA - Send Email Verification Link
 * @apiGroup Customer App - User
 * 
 * 
 * @apiHeader {String} Content-Type application/json
 * 
 * 
 * @apiParam {String} email Email Id of the Customer 
 * 
 * 
 * @apiDescription API Endpoint POST /customer/email/verify
 * 
 * 
 * @apiErrorExample {json} Error-Response:
 * HTTP/1.1 400
    {
        success: false,
        message: "Token is invalid.""
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
async function sendEmailVerification(req, res) {
  try{
  const body = req.body;

  if (!body || !body.email || !validator.isEmail(body.email))
    throw new BadRequestError("Invalid Email ID");

  const user = await User.findOne(
    { email: body.email },
    { name: 1, email: 1 }
  )

  if (!user) throw new NotFoundError("User not found");

  const token =  await user.newEmailVerificationToken();
  if (config.NODE_ENV !== "test") {
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
  }

  res.status(200).send({
    success: true,
    message: "Success",
  });
}catch(err){
  console.log(err)
}
}

module.exports = sendEmailVerification;
