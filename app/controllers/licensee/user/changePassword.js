const mongoose = require('mongoose');
const moment = require('moment');
const validator = require('validator');
const dotenv = require('dotenv');

const Employee = require('../../../models/employees');
const {
    BadRequestError,
    ForbiddenError,
  } = require("./../../../helpers/errors");

dotenv.config();
const config = process.env;

/** 
 * 
 * @api {PUT} /employee/password/change Change Employee Password
 * @apiName LA - Change Employee Password
 * @apiGroup Licensee App - Employee Authentication
 * 
 * 
 * @apiHeader {String} Content-Type application/json
 * @apiHeader {String} authorization Authorization token sent as a response to signIn request
 * 
 * 
 * @apiParam {String} oldPassword Old Password of Employee
 * @apiParam {String} newPassword New Password of Employee
 * 
 * 
 * @apiDescription API Endpoint PUT /employee/password/change
 * 
 * 
 * @apiSuccess {Boolean} success Success Status
 * @apiSuccess {String} message Success Message
 * 
 * 
 * @apiErrorExample {json} Error-Response:
 * HTTP/1.1 400
    {
        success: false,
        message: "Could not change password",
        errorsList: []
    }
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
async function changePassword(req, res, next) {

        let body = req.body;

        let employeeId = req.requestFrom.employeeId;
        if (!req.requestFrom || !employeeId) {
            throw new ForbiddenError("UnAuthorized Access")
        }

        if(!body.oldPassword) {
            throw new BadRequestError("VALIDATION-Old Password should not be empty");
        }

        if(!body.newPassword) {
            throw new BadRequestError("VALIDATION-New Password should not be empty");
        }

        let employee = await Employee.findOne({ _id: employeeId }, { email: 1 });
        if(employee) {
            employee = employee._doc;
            let checkResult = await Employee.checkValidCredentials(employee.email, body.oldPassword);
            if (checkResult.errors) {
                throw new BadRequestError("VALIDATION-Old Password is Invalid");
            } else {
                await Employee.updateOne({ _id: employeeId }, { password: body.newPassword });
            }
        } else {
            throw new BadRequestError("VALIDATION-Could not find Employee");
        }

        res.status(200).send({
            success: true,
            message: "Success"
        });
    
}

module.exports = changePassword;