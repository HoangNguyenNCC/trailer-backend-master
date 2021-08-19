const mongoose = require('mongoose');
const validator = require('validator');
const dotenv = require('dotenv');

const Employee = require('../../../models/employees');

const sendMail = require('../../../helpers/sendMail');

const aclSettings = require('../../../helpers/getAccessControlList');
const { BadRequestError } = require('../../../helpers/errors');


dotenv.config();
const config = process.env;

const resendInvite = async function(req,res){
    if (!req.requestFrom) {
            throw new BadRequestError('Unauthorised Access')
        }

        // if (!req.requestFrom.isOwner) {
        //     throw new BadRequestError("VALIDATION-Request for Inviting Employee is received from Unauthorized source");
        // } Allowing for Admin Employees

        let body = req.body;

        if (validator.isEmpty(body.email) || !validator.isEmail(body.email)) {
            throw new BadRequestError("VALIDATION-Invalid Email");
        }

        if (!body.acl || body.acl.length <= 0) {
            throw new BadRequestError("VALIDATION-Access Control List is Empty");
        }

        if(!body.licenseeId){
            throw new BadRequestError("VALIDATION- Licensee ID not Provided");
        }

        const aclKeys = Object.keys(aclSettings.accessControlListApps);
        const bodyACLKeys = Object.keys(body.acl);
        const commonKeys = aclKeys.filter(key => bodyACLKeys.includes(key));
        if(commonKeys.length !== bodyACLKeys.length) {
            throw new BadRequestError("VALIDATION-Access Control List contains invalid privilege keys");
        }

        aclKeys.forEach((privilege) => {
            const aclValues = aclSettings.accessControlListApps[privilege];
            const bodyValues = body.acl[privilege] || [];
            const commonValues = bodyValues ? aclValues.filter(key => bodyValues.includes(key)) : [];
            if(commonValues.length !== bodyValues.length) {
                throw new BadRequestError("VALIDATION-Access Control List contains invalid privilege values");
            }
        });

        const licenseeId = mongoose.Types.ObjectId(body.licenseeId);

        const employeeData = {
            email: body.email,
            acl: body.acl,
            type: body.type ? body.type : "employee",
            licenseeId: licenseeId,
            isOwner: false,
            password: "Sample#7",
            mobile: "919876543210",
            country: "Australia"
        };

        let employee = new Employee(employeeData);
        await employee.save();

        const token = await employee.newEmployeeInviteToken();

        employee = employee._doc;

        if(config.NODE_ENV !== "test") {
            const data = {
                to: employee.email,
                template: "employee-invitation-email",
                subject: "Trailer2You - Employee Invitation",
                context: {
                    url: `${config.HOST}/invite?token=${token}`,
                    firstName: "User",
                    token: token
                }
            };
            sendMail(data);
        }

        res.status(200).send({
            success: true,
            message: "Successfully sent an Invitation to Employee",
            token: token
        });
}

module.exports = resendInvite