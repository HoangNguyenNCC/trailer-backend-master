const Admin = require('../../../models/adminEmployees');
const sendMail = require('../../../helpers/sendMail');
const validator = require('validator');
const { BadRequestError } = require('../../../helpers/errors');

const config = process.env;

const resendEmailverification = async function(req,res,next) {
   const body = req.body;
        if(!body || !body.email || !validator.isEmail(body.email)) {
            throw new BadRequestError("VALIDATION-Invalid Email ID")
        }
        const employee = await Admin.findOne({ email: body.email });
        const token = await employee.newEmailVerificationToken();
        if(config.NODE_ENV !== "test") {
            const data = {
                to: employee.email,
                template: "employee-verification-email",
                subject: "Trailer2You - Employee Email Verification",
                context: {
                    url: `${config.HOST}/admin/employee/email/verify?token=${token}`,   //TODO! fix url system and otp system
                    name: employee.name.firstName,
                    token: token
                }
            };
            sendMail(data);
        }
        res.status(200).send({
            success: true,
            message: "Success"
        });
}

module.exports = resendEmailverification
