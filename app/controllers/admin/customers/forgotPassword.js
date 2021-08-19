const mongoose = require('mongoose');
const dotenv = require('dotenv');

const User = require('../../../models/users');

const sendMail = require('../../../helpers/sendMail');

dotenv.config();
const config = process.env;

const aclSettings = require('../../../helpers/getAccessControlList');
const {BadRequestError} = require('./../../../helpers/errors');



/**
 * 
 * @api {PUT} /admin/customer/password/forgot Forgot Password
 * @apiName TAAC - Forgot Password
 * @apiGroup Admin App - Customer
 * 
 * 
 * @apiHeader {String} Content-Type application/json
 * 
 * 
 * @apiParam {String} customerId ID of the Customer
 * @apiParam {String} email Email Entered By User
 * @apiParam {String} platform android || ios || web
 * 
 * 
 * @apiDescription API Endpoint PUT /admin/customer/password/forgot
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
        if(!req.requestFrom || !req.requestFrom.employeeId || !req.requestFrom.acl || !aclSettings.validateACL(req.requestFrom.acl, "CUSTOMERS", "UPDATE")) {
            throw new BadRequestError('Unauthorised Access')
        }

        const errors = [];
        const body = req.body;
        const user = await User.findOne({ _id: mongoose.Types.ObjectId(body.customerId) }, { email: 1, name: 1 });
        if (user) {
            const token = await user.newPasswordResetToken();
            const userDoc = user._doc;


            if(config.NODE_ENV !== "test") {
                let url = `${config.ADMIN_PANEL_HOST}/admin/customer/password/reset?token=${token}`;
                if(body.platform === "android") {
                    url = `${config.CUSTOMERAPP_ANDROID_LINK}/reset_password?token=${token}`;
                } else if(body.platform === "ios") {
                    url = `${config.CUSTOMERAPP_IOS_LINK}/reset_password?token=${token}`;
                }

                const data = {
                    to: userDoc.email,
                    template: "forgot-password-mail",
                    subject: "Trailer2You - Link To Reset Password",
                    context: {
                        url: url,
                        firstName: userDoc.name,
                        token
                    }
                };
                sendMail(data);
            }

            res.status(200).send({
                success: true,
                message: "Success"
            });
        } else {
            throw new BadRequestError("VALIDATION-User with Email is not found");
        }
}

module.exports = forgotPassword;