const mongoose = require('mongoose');

const AdminEmployee = require('../../../models/adminEmployees');

const aclSettings = require('../../../helpers/getAccessControlListAdmin');
const objectMinusKeys = require('../../../helpers/objectMinusKeys');


/** 
 * 
 *  
 * @api {PUT} /admin/employee/profile/admin Update Employee Profile by admin Owner
 * @apiName TAAU - Update Employee Profile by Admin Owner
 * @apiGroup Admin App - AdminUser
 * 
 * 
 * @apiHeader {String} Content-Type application/json
 * 
 * 
 * @apiParam {String} employeeId Id of the Employee
 * @apiParam {Array} acl Access Control List
 * @apiParam {String} password Password of Employee
 * @apiParam {String} email Email ID
 * @apiParam {String} mobile Mobile Number of Employee
 * @apiParam {String} name Employee's Name
 * 
 * 
 * @apiDescription API Endpoint PUT /admin/employee/profile/admin
 * 
 * 
 * Request Headers
 * - 'Content-Type: application/json'
 * 
 * Request Body ( Example )  ( request.body )
 * 
    {
        "employeeId": "sdsksjdskj",
        "acl": ["VIEW_TRAILERS", "ADD_TRAILER"]
    }
 * 
 * @apiErrorExample {json} Error-Response:
 * HTTP/1.1 400
    {
        success: false,
        message: "Error occurred while updating Employee data",
        errorsList: []
    }
 * 
 * 
 * @apiSuccessExample {String} - Success-Response:
 * HTTP/1.1 200 OK
 * 
    {
        success: true,
        message: "Successfully updated Employee data"
    }
 * 
 * 
 */
async function updateEmployeeByAdmin(req, res, next) {
    if (!req.requestFrom) {
        throw new BadRequestError('Unauthorised Access')
        }

        if (!req.requestFrom.isOwner) {
            throw new BadRequestError("VALIDATION-Request to update Employee Privileges is received from Unauthorized source");
        }

        let body, embeddedKeys;

        body = req.body;

        // TODO! add objectId Validation
        const employeeId = mongoose.Types.ObjectId(body.employeeId);

        
        const employeeData = {};
        if(body.name) {
            employeeData.name = body.name;
        }
        if(body.email) {
            employeeData.email = body.email;
        }
        if(body.mobile) {
            employeeData.mobile = body.mobile;
        }
        if(body.acl) {

            const aclTypes = Object.keys(aclSettings.accessControlListAdmin);
            aclTypes.forEach((aclType) => {
                body.acl[aclType].forEach((privilege) => {
                    if(!aclSettings.accessControlListAdmin[aclType].includes(privilege)) {
                        throw new BadRequestError(`VALIDATION-Invalid Privilege -- ${privilege}`);
                    }
                });
            });
            employeeData.acl = body.acl;
        }
        if(body.password) {
            employeeData.password = body.password;
        }
        
        let employee = await AdminEmployee.findByIdAndUpdate(employeeId, employeeData, {lean:true});
        // employee = employee._doc;

        employee = objectMinusKeys(employee, ['password']);

        res.status(200).send({
            success: true,
            message: "Successfully updated Employee data",
            employee: employee
        });
}

module.exports = updateEmployeeByAdmin;
