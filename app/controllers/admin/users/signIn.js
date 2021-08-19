const AdminEmployee = require('../../../models/adminEmployees');
const aclSettings = require('../../../helpers/getAccessControlListAdmin');
const aclSettingsLicensee = require('../../../helpers/getAccessControlList');

const objectMinusKeys = require('../../../helpers/objectMinusKeys');
const { BadRequestError } = require('../../../helpers/errors');


/** 
 * 
 *  
 * @api {POST} /admin/employee/signin Employee SignIn for Admin Employee
 * @apiName TAAU - Employee SignIn for Admin Employee
 * @apiGroup Admin App - AdminUser
 * 
 * 
 * @apiHeader {String} Content-Type application/json
 * 
 * 
 * @apiParam {String} email Email Entered By Employee
 * @apiParam {String} password Password Entered By Employee
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
 *      "password": "1234567890"
 *  }
 * 
 * @apiErrorExample {json} Error-Response:
 * HTTP/1.1 400
 *  {
 *      success: false,
 *      message: "Please enter valid credentials",
 *      errorsList: []
 *  }
 * 
 * 
 * @apiSuccessExample {String} - Success-Response:
 * HTTP/1.1 200 OK
 * 
    {
        success: true,
        message: "Successfully signed in!",
        dataObj: {
            employeeObj: {
            }
            "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI1ZTM5NWQyZjc4NGFlMzQ0MWM5NDg2YmMiLCJpYXQiOjE1ODA4MTkxODUsImV4cCI6MTU4MTQyMzk4NX0.-Yg9zNJQvACGQ65I5xGzQ8b3YgyO1s-UIpWG_4QptKE"
        }
    }
 * 
 *
 * 
 */
async function signIn(req, res, next) {
    let checkResult = await AdminEmployee.checkValidCredentials(req.body.email, req.body.password);
        if (checkResult.errors) {
            throw new BadRequestError("VALIDATION-Please enter valid credentials");
        } else {
            let employee = checkResult.employee;
            const token = await employee.newAuthToken();

            employee = objectMinusKeys(employee._doc, ['password']);

            // if(employee.acl.includes("UPDATE_ADMIN_EMPLOYEE_PRIVILEGES")) {
            if(employee.isOwner) {
                employee.aclSettings = aclSettings.accessControlListAdmin;
            }

            res.cookie('Admin-Access-Token', token, { httpOnly: true, expires: 0 });
            res.status(200).send({
                success: true,
                message: "Successfully signed in!",
                employeeObj: employee,
                token: token,
                aclSettingsAdmin: aclSettings.accessControlListAdmin,
                aclSettingsLicensee: aclSettings.aclSettingsLicensee
            });
        }
}

module.exports = signIn;