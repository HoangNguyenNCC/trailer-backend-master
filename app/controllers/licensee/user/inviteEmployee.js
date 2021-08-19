const mongoose = require('mongoose');
const validator = require('validator');
const dotenv = require('dotenv');

const Licensee = require('../../../models/licensees');
const Employee = require('../../../models/employees');

const sendMail = require('../../../helpers/sendMail');

const aclSettings = require('../../../helpers/getAccessControlList');
const {
    BadRequestError,
    ForbiddenError,
    NotFoundError,
    UnauthorizedError,
  } = require("./../../../helpers/errors");


dotenv.config();
const config = process.env;

/** 
 * 
 *  
 * @api {POST} /employee/invite Employee Invite
 * @apiName LA - Employee Invite
 * @apiGroup Licensee App - Employee Authentication
 * 
 * 
 * @apiHeader {String} Content-Type application/json
 * 
 * 
 * @apiParam {String} email Email Entered By Employee
 * @apiParam {Array} acl ACL List
 * @apiParam {String} type Type of Employee ( "employee", "representative", "director", "executive" )
 * 
 * 
 * @apiDescription API Endpoint POST /employee/signin
 * 
 * 
 * Request Headers
 * - 'Content-Type: application/json'
 * 
 * Request Body ( Example )  ( request.body )
 * 
 *  {
 *      "email": "user1@gmail.com",
 *      "acl": { "TRAILER" : [ "VIEW" ], "UPSELL" : [ "VIEW" ] }
 *  }
 * 
 * 
    curl --location --request POST 'http://trailer2you.herokuapp.com/employee/invite' \
    --header 'Content-Type: application/json' \
    --data-raw '{
        "email": "nehakadam@nimapinfotech.com",
        "acl": { "TRAILER" : [ "VIEW" ], "UPSELL" : [ "VIEW" ] },
        "type": "employee"
    }'
 * 
 * 
 * @apiErrorExample {json} Error-Response:
 * HTTP/1.1 400
    {
        success: false,
        message: "Error occurred while sending an Invitation to Employee",
        errorsList: []
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
        message: "Successfully sent an Invitation to Employe"
    }
 * 
 * 
 */
async function inviteEmployee(req, res, next) {
        if (!req.requestFrom) {
            throw new ForbiddenError('Unauthorised Access')
        }

        if (!req.requestFrom.isOwner) {
            throw new BadRequestError("VALIDATION-Request for Inviting Employee is received from Unauthorized source");
        }

        let body = req.body;

        if (validator.isEmpty(body.email) || !validator.isEmail(body.email)) {
            throw new BadRequestError("VALIDATION-Invalid Email");
        }

        if (!body.acl || body.acl.length <= 0) {
            throw new BadRequestError("VALIDATION-Access Control List is Empty");
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

        const licenseeId = mongoose.Types.ObjectId(req.requestFrom.licenseeId);

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

module.exports = inviteEmployee;