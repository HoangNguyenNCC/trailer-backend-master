const mongoose = require('mongoose');
const validator = require('validator');

const Employee = require('../../../models/employees');

const aclSettings = require('../../../helpers/getAccessControlList');
const {
    BadRequestError,
    ForbiddenError,
    NotFoundError,
    UnauthorizedError,
  } = require("./../../../helpers/errors");


/** 
 * 
 * @api {DELETE} /employee Delete an Employee
 * @apiName LA - Delete an Employee
 * @apiGroup Licensee App - Employee
 *  
 * 
 * @apiHeader {String} Content-Type application/json
 * @apiHeader {String} authorization Authorization token sent as a response to signIn request
 * 
 * 
 * @apiParam {String} id Id of the Employee
 * 
 * 
 * @apiErrorExample {json} Error-Response:
 * HTTP/1.1 400
 * 
    {
        success: false,
        message: "Could not delete Employee",
        errorsList: []
    }
 * 
 * 
 * @apiSuccess {Boolean} success Success Status
 * @apiSuccess {String} message Success Message
 * 
 * 
 * @apiSuccessExample {String} - Success-Response:
 * HTTP/1.1 200 
 * 
    {
        success: true,
        message: "Success"
    }
 * 
 *
 */

async function deleteEmployee(req, res, next) {

        if (!req.requestFrom || !aclSettings.validateACL(req.requestFrom.acl, "EMPLOYEES", ["DELETE"])) {
            throw new UnauthorizedError('Employee Not Found')
        }
        const employeeId = req.body.id ? mongoose.Types.ObjectId(req.body.id) : undefined;
        const employee = await Employee.findOne({ _id: employeeId }, { _id: 1, isDeleted: 1 });
        if(employee) {
            await Employee.updateOne({ _id: employeeId }, { isDeleted: true });
        } else {
            throw new BadRequestError("VALIDATION-Employee not found");
        }

        res.status(200).send({
            success: true,
            message: "Success"
        });

}

module.exports = deleteEmployee;