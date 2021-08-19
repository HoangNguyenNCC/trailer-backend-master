const mongoose = require('mongoose');
const validator = require('validator');
const dotenv = require('dotenv');

const Licensee = require('../../../models/licensees');
const Employee = require('../../../models/employees');

const sendMail = require('../../../helpers/sendMail');
const { BadRequestError } = require('../../../helpers/errors');

dotenv.config();
const config = process.env;

async function resendEmailVerification(req, res, next) {
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
            throw new BadRequestError("Could not send Email Verification");
        }
}

module.exports = resendEmailVerification;