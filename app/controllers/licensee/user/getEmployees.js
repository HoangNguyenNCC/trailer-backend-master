const mongoose = require('mongoose');
const validator = require('validator');
const dotenv = require('dotenv');
const moment = require('moment');

const Employee = require('../../../models/employees');

const objectMinusKeys = require('../../../helpers/objectMinusKeys');

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
 * @api {GET} /employees Get all employees
 * @apiName LA - Get all employees
 * @apiGroup Licensee App - Employee
 * 
 * 
 * @apiHeader {String} authorization Authorization token sent as a response to signIn request
 * 
 * 
 * @apiHeader {String} Content-Type application/json
 * @apiHeader {String} Authorization Authorization Token
 * 
 * 
 * @apiDescription API Endpoint GET /employees
 * 
 * 
 * @apiErrorExample {json} Error-Response:
 * HTTP/1.1 400
    {
        success: false,
        message: "Error occurred while fetching Employees List",
        errorsList: []
    }
 * 
 * 
 * @apiSuccess {Boolean} success Success Status
 * @apiSuccess {String} message Success Message
 * @apiSuccess {Object} employeeList List of Employees
 * 
 * 
 * @apiSuccessExample {String} - Success-Response:
 * HTTP/1.1 200 OK
 * 
    {
        success: true,
        message: "Successfully fetched Employees List",
        employeeList: []
    }
 * 
 * 
 */
async function getEmployee(req, res, next) {
        if (!req.requestFrom) {
            throw new ForbiddenError('Unauthorised Access')
        }

        // -----------------------------------------------------------------------------------------
        let licenseeId;
        if(req.query.licenseeId){
            licenseeId = mongoose.Types.ObjectId(req.query.licenseeId);
        }else{
            licenseeId = mongoose.Types.ObjectId(req.requestFrom.licenseeId);
        }
        let employees = await Employee.find({ licenseeId: licenseeId, isDeleted: false, acceptedInvite: true }); 

        employees.forEach((employee, employeeIndex) => {
            employee = employee._doc;
            employee = objectMinusKeys(employee, ['password']);
            if(employee.driverLicense){
                employee.driverLicense.expiry = moment(employee.driverLicense.expiry).format('YYYY-MM-DD')
            }
            employees[employeeIndex] = employee;
        });
    
        // -----------------------------------------------------------------------------------------
    
        res.status(200).send({
            success: true,
            message: "Successfully fetched Employees List",
            employeeList: employees
        });
}

module.exports = getEmployee;
