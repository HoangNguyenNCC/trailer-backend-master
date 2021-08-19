const validator = require('validator');
const dotenv = require('dotenv');

const AdminEmployee = require('../../../models/adminEmployees');

const sendMail = require('../../../helpers/sendMail');

const aclSettings = require('../../../helpers/getAccessControlListAdmin');
const { BadRequestError } = require('../../../helpers/errors');


dotenv.config();
const config = process.env;

/** 
 * 
 *  
 * @api {POST} /admin/employee/invite Admin Employee Invite
 * @apiName TAAU - Admin Employee Invite
 * @apiGroup Admin App - AdminUser
 * 
 * 
 * @apiHeader {String} Content-Type application/json
 * 
 * 
 * @apiParam {String} email Email Entered By Employee
 * @apiParam {Array} acl Access Control List
 * 
 * 
 * @apiDescription API Endpoint POST /admin/employee/signin
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
 * @apiErrorExample {json} Error-Response:
 * HTTP/1.1 400
    {
        success: false,
        message: "Error occurred while sending an Invitation to Employee",
        errorsList: []
    }
 * 
 * 
 * @apiSuccessExample {String} - Success-Response:
 * HTTP/1.1 200 OK
 * 
    {
        success: true,
        message: "Successfully sent an Invitation to Employee"
    }
 * 
 * 
 */
async function inviteEmployee(req, res, next) {
   if(!req.requestFrom || !req.requestFrom.employeeId) {
    throw new BadRequestError('Unauthorised Access')
        }

        // if (!req.requestFrom.acl.includes("ADD_ADMIN_EMPLOYEE")) {
        if(!req.requestFrom.acl || !aclSettings.validateACL(req.requestFrom.acl, "ADMINEMPLOYEE", "ADD")) {
            throw new BadRequestError("VALIDATION-Request for Inviting Employee is received from Unauthorized source");
        }

        let body, embeddedKeys;

        body = req.body;

        if(validator.isEmpty(body.email) || !validator.isEmail(body.email)) {
            throw new BadRequestError("VALIDATION-Invalid Email");
        }

        if(!body.acl || body.acl.length <= 0) {
            throw new BadRequestError("VALIDATION-Access Control List is Empty");
        }
        
        const aclTypes = Object.keys(aclSettings.accessControlListAdmin);
        aclTypes.forEach((aclType) => {
            if(body.acl[aclType]) {
                body.acl[aclType].forEach((privilege) => {
                    if(!aclSettings.accessControlListAdmin[aclType].includes(privilege)) {
                        throw new BadRequestError(`VALIDATION-Invalid Privilege -- ${privilege}`);
                    }
                });
            }
        });

        const employeeData = {
            name: {
                firstName:'firstName',
                lastName: 'lastName'
            },
            email: body.email,
            acl: body.acl,
            isOwner: false,
            password: "PaSSwOrd@123",
            mobile: "919999999999"
        };

        let employee = new AdminEmployee(employeeData);
        employee.save();

        const token = await employee.newEmployeeInviteToken();

        employee = employee._doc;

        if(config.NODE_ENV !== "test") {
            const data = {
                to: employee.email,
                template: "admin-employee-invitation-email",
                subject: "Trailer2You - Admin Employee Invitation",
                context: {
                    // url: `${config.HOST}/admin/employee/invite?token=${token}`,
                    url: `${config.ADMIN_PANEL_HOST}/employee/invite/accept?token=${token}`,
                    firstName: "User",
                    token: token
                }
            };
            sendMail(data);
        }

        res.status(200).send({
            success: true,
            message: "Successfully sent an Invitation to an Admin Employee",
            token: token,
            employeeObj: employee
        });
}

module.exports = inviteEmployee;