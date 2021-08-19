const mongoose = require('mongoose');
const dotenv = require('dotenv');

const Employee = require('../../../models/employees');

const sendMail = require('../../../helpers/sendMail');
const { BadRequestError } = require('../../../helpers/errors');


dotenv.config();
const config = process.env;


const forgotPasswordMail = async function(req,res){
    const body = req.body;
        const employee = await Employee.findOne({ email: body.email }, { name: 1, email: 1 });
        if (employee) {
            const token = await employee.newPasswordResetToken();
            const employeeDoc = employee._doc;
            console.log("hey",employee)

            /* const userId = userDoc._id.toString();
            redisClient.hgetall(token, function(err, userObj) {

                redisClient.hmset(token, "userId", userId, function(err, savedUserObj) {
                });
                redisClient.expire(token, (15 * 60));
            }); */

            if(config.NODE_ENV !== "test") {
                let url = `${config.ADMIN_PANEL_HOST}/licensee/employee/password/reset?token=${token}`;
                if(body.platform === "android") {
                    url = `${config.LICENSEEAPP_ANDROID_LINK}/employee/reset_password?token=${token}`;
                } else if(body.platform === "ios") {
                    url = `${config.LICENSEEAPP_IOS_LINK}/employee/reset_password?token=${token}`;
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

module.exports = forgotPasswordMail