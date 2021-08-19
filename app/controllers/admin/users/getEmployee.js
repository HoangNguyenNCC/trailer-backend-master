const mongoose = require('mongoose');
const validator = require('validator');

const AdminEmployee = require('../../../models/adminEmployees');

const objectSize = require('../../../helpers/objectSize');
const objectMinusKeys = require('../../../helpers/objectMinusKeys');
const { BadRequestError } = require('../../../helpers/errors');

/** 
 * 
 *  
 * @api {GET} /admin/employee/profile Get Admin Employee Profile
 * @apiName TAAU - Get Admin Employee Profile
 * @apiGroup Admin App - AdminUser
 * 
 * 
 * @apiHeader {String} Content-Type application/json
 * 
 * 
 * @apiParam {String} employeeId Employee ID
 * 
 * 
 * @apiDescription API Endpoint GET /admin/employee/profile
 * 
 * 
 * @apiErrorExample {json} Error-Response:
 * HTTP/1.1 400
    {
        success: false,
        message: "Error occurred while fetching Employee data",
        errorsList: []
    }
 * 
 * 
 * @apiSuccessExample {String} - Success-Response:
 * HTTP/1.1 200 OK
 * 
    {
        success: true,
        message: "Successfully fetched Employee data"
    }
 * 
 * 
 */
async function getEmployee(req, res, next) {
    if (!req.query) {
            throw new BadRequestError("VALIDATION-Parameters are not specified");
        }

        let employeeId = req.query.employeeId;

        if (!req.requestFrom || (req.requestFrom.employeeId !== employeeId && !req.requestFrom.isOwner)) {
            throw new BadRequestError('Unauthorised Access')
        }
    
        if (!employeeId || validator.isEmpty(employeeId)) {
            throw new BadRequestError("VALIDATION-Employee ID is undefined");
        } else if (objectSize(employeeId) < 12) {
            throw new BadRequestError("VALIDATION-Employee ID is invalid");
        }
    
        // -----------------------------------------------------------------------------------------

        employeeId = mongoose.Types.ObjectId(employeeId);

        let employee = await AdminEmployee.findOne({ _id: employeeId });
        employee = employee._doc;
        employee = objectMinusKeys(employee, ['password']);

        // employee.photo = getFilePath("adminemployeephoto", employee._id.toString()); //TODO: No photos in admin employee schema

        // -----------------------------------------------------------------------------------------

        const responseJson = {
            success: true,
            message: "Successfully fetched Employee account data",
            employeeObj: employee
        };

        res.status(200).send(responseJson);
}

module.exports = getEmployee;