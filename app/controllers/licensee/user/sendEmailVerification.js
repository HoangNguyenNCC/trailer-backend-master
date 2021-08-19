const mongoose = require('mongoose');
const validator = require('validator');
const dotenv = require('dotenv');

const Licensee = require('../../../models/licensees');
const Employee = require('../../../models/employees');

const sendMail = require('../../../helpers/sendMail');
const {
    BadRequestError,
    ForbiddenError,
    NotFoundError,
    UnauthorizedError,
    ApiError
  } = require("./../../../helpers/errors");

dotenv.config();
const config = process.env;

/** 
 * 
 *  
 * @api {POST} /licensee/email/verify/resend Send Email Verification Link
 * @apiName LA - Send Email Verification Link
 * @apiGroup Licensee App - Licensee Authentication
 * 
 * 
 * @apiHeader {String} Content-Type application/json
 * @apiHeader {String} authorization Authorization token sent as a response to signIn request
 * 
 * 
 * @apiParam {String} email Email Id of the Licensee 
 * @apiParam {String} user Type of User ( "licensee" or "employee" ) ( default : "employee" )
 * 
 * 
 * @apiDescription API Endpoint POST /licensee/email/verify/resend
 * 
 * 
 * @apiErrorExample {json} Error-Response:
 * HTTP/1.1 400
    {
        success: false,
        message: "Could not send Email Verification"
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
async function sendEmailVerification(req, res, next) {
        const body = req.body;
        
        if(!body || !body.email || !validator.isEmail(body.email)) {
            throw new BadRequestError("VALIDATION-Invalid Email ID")
        }

        if(!body.user || !["licensee", "employee"].includes(body.user)) {
            body.user = "employee";
        }

        let data;
        if(body.user && body.user === "licensee") {
            const licensee = await Licensee.findOne({ email: body.email }, { name: 1, email: 1 });
            const licenseeToken = await licensee.newEmailVerificationToken();
            data = {
                to: licensee.email,
                template: "licensee-verification-email",
                subject: "Trailer2You - Licensee Email Verification",
                context: {
                    url: `${config.HOST}/licensee/email/verify?token=${licenseeToken}`,
                    name: licensee.name,
                    token: licenseeToken
                }
            };
        } else {
            const employee = await Employee.findOne({ email: body.email }, { name: 1, email: 1, acceptedInvite: 1 });
        
            if(employee) {
                if(employee._doc.acceptedInvite) {
                    const employeeToken = await employee.newEmailVerificationToken();
                    data = {
                        to: employee.email,
                        template: "employee-verification-email",
                        subject: "Trailer2You - Employee Email Verification",
                        context: {
                            url: `${config.HOST}/employee/email/verify?token=${employeeToken}`,
                            name: employee.name,
                            token: employeeToken
                        }
                    }
                } else {
                    const employeeToken = await employee.newEmployeeInviteToken();
                    data = {
                        to: employee.email,
                        template: "employee-invitation-email",
                        subject: "Trailer2You - Employee Invitation",
                        context: {
                            url: `${config.HOST}/invite?token=${employeeToken}`,
                            firstName: "User",
                            token: token
                        }
                    };
                }
            }
        }

        if(data) {
            if(config.NODE_ENV !== "test") {
                sendMail(data);
            }

            res.status(200).send({
                success: true,
                message: "Success"
            });
        } else {
            throw new ApiError("Could not send Email Verification");
        }
}

module.exports = sendEmailVerification;