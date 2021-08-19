const mongoose = require('mongoose');
const validator = require('validator');
const dotenv = require('dotenv');

const AdminEmployee = require('../../../models/adminEmployees');

const objectMinusKeys = require('../../../helpers/objectMinusKeys');
const embeddedParser = require('../../../helpers/embeddedParser');
const base64MimeType = require('../../../helpers/base64MimeType');
const getFilePath = require('../../../helpers/getFilePath');

const aclSettings = require('../../../helpers/getAccessControlListAdmin');
const { BadRequestError } = require('../../../helpers/errors');


dotenv.config();
const config = process.env;

/** 
 * 
 *  
 * @api {PUT} /admin/employee/profile Employee Invite Accept for Admin Employee
 * @apiName TAAU - Employee Invite Accept for Admin Employee
 * @apiGroup Admin App - AdminUser
 * 
 * 
 * @apiHeader {String} Content-Type application/json
 * 
 * 
 * @apiParam {String} password Password of Employee
 * @apiParam {String} mobile Mobile Number of Employee
 * @apiParam {String} name Employee's Name
 * @apiParam {String} photo Base64-encoded string of photo
 * @apiParam {String} email Exmployee's Email
 * @apiParam {String} acl Exployee Access Privileges List ( Only Owner can change this )
 * 
 * 
 * @apiDescription API Endpoint PUT /admin/employee/profile
 * 
 * 
 * Request Headers
 * - 'Content-Type: application/json'
 * 
 * Request Body ( Example )  ( request.body )
 * 
    {
        token: "",
        password: "aBc$567",
        mobile: "919876543210",
        name: "Employee 1" 
    }
 * 
 * @apiErrorExample {json} Error-Response:
 * HTTP/1.1 400
    {
        success: false,
        message: "Error occurred while saving Employee account data",
        errorsList: []
    }
 * 
 * 
 * @apiSuccessExample {String} - Success-Response:
 * HTTP/1.1 200 OK
 * 
    {
        success: true,
        message: "Successfully saved Employee account data"
    }
 * 
 * 
 */
async function saveEmployee(req, res, next) {
    if (!req.requestFrom) {
        throw new BadRequestError('Unauthorised Access')
        }

        let body = req.body;
        body = embeddedParser(body, ["name"]);


        if (validator.isEmpty(body.mobile)) {
            throw new BadRequestError("VALIDATION-Invalid Mobile");
        }

        if (!body.name) {
            throw new BadRequestError("VALIDATION-Invalid Name");
        }

        let employeeData = {
            mobile: body.mobile,
            name: body.name,
            password: body.password
        };

        //TODO: Check this. No photo in admin employee schema
        // if (body.photo) {
        //     const contentType = base64MimeType(body.photo);
        //     const data = body.photo.split(",")[1];
        //     employeeData.photo = {
        //         contentType: contentType,
        //         data: Buffer.from(data, 'base64')
        //     };
        // }


        //TODO! Fix password update, add updateOne hook
        // await AdminEmployee.updateOne({ _id: req.requestFrom.employeeId }, employeeData);
        // let employee = await AdminEmployee.findOne({ _id: req.requestFrom.employeeId });

        let employee = await AdminEmployee.findByIdAndUpdate(req.requestFrom.employeeId, employeeData, { new: true });

        // employee.password = body.password;
        // await employee.save();

        employee = employee._doc;
        employee = objectMinusKeys(employee, ["password"]);

        // employee.photo = getFilePath("adminemployeephoto", employee._id.toString()); //TODO: Check this. No photo in admin employee schema

        res.status(200).send({
            success: true,
            message: "Successfully saved Employee account data",
            employeeObj: employee
        });
}

module.exports = saveEmployee;