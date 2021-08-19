const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config();
const config = process.env;

const AdminEmployee = require('../../../models/adminEmployees');

const sendMail = require('../../../helpers/sendMail');
const { BadRequestError } = require('../../../helpers/errors');


/**
 * 
 * @api {PUT} /admin/employee/forgotpassword Forgot Password for Admin Employee
 * @apiName TAAU - Forgot Password Admin Employee
 * @apiGroup Admin App - AdminUser
 * 
 * @apiHeader {String} Content-Type application/json
 * 
 * @apiParam {String} email Email Entered By Employee
 * @apiParam {String} platform android || ios || web
 * 
 * @apiDescription 
 * 
 * API Endpoint PUT /admin/employee/forgotpassword
 * 
 * 
 * @apiSuccessExample {String} - Success-Response:
 * HTTP/1.1 200 OK
 * {
 *     success: true,
 *     message: "Forgot Password Email Sent Successfully"
 * }
 * 
 * @apiErrorExample {json} Error-Response:
 * HTTP/1.1 400
 *  {
 *      success: false,
 *      message: "Error occurred in Forgot Password functionality",
 *      errorsList: []
 *  }
 * 
 * 
 */
async function forgotPassword(req, res, next) {
   const body = req.body;
        const employee = await AdminEmployee.findOne({ email: body.email }, { name: 1, email: 1 });
        if (employee) {
            const token = await employee.newPasswordResetToken();

            const employeeDoc = employee._doc;

            /* const userId = userDoc._id.toString();
            redisClient.hgetall(token, function(err, userObj) {

                redisClient.hmset(token, "userId", userId, function(err, savedUserObj) {
                });
                redisClient.expire(token, (15 * 60));
            }); */

            if(config.NODE_ENV !== "test") {
                let url = `${config.ADMIN_PANEL_HOST}/admin/employee/password/reset?token=${token}`;
                if(body.platform === "android") {
                    url = `${config.ADMINAPP_ANDROID_LINK}/reset_password?token=${token}`;
                } else if(body.platform === "ios") {
                    url = `${config.ADMINAPP_IOS_LINK}/reset_password?token=${token}`;
                }
            
                const data = {
                    to: employeeDoc.email,
                    template: "forgot-password-mail",
                    subject: "Trailer2You - Link To Reset Password",
                    context: {
                        url: url,
                        firstName: employeeDoc.name,
                        token
                    }
                };
                sendMail(data);
            }

            res.status(200).send({
                success: true,
                message: "Forgot Password Email Sent Successfully"
            });
        } else {
            throw new BadRequestError("VALIDATION-User with Email is not found");
        }
    
}

module.exports = forgotPassword;