const mongoose = require('mongoose');
const validator = require('validator');
const dotenv = require('dotenv');

const AdminEmployee = require('../../../models/adminEmployees');

const objectMinusKeys = require('../../../helpers/objectMinusKeys');
const embeddedParser = require('../../../helpers/embeddedParser');
const base64MimeType = require('../../../helpers/base64MimeType');
const getFilePath = require('../../../helpers/getFilePath');

const aclSettings = require('../../../helpers/getAccessControlListAdmin');
const{BadRequestError} = require('../../../helpers/errors')

dotenv.config();
const config = process.env;

/** 
 * 
 *  
 * @api {POST} /admin/employee/invite/accept Employee Invite Accept for Admin App
 * @apiName TAAU - Employee Invite Accept for Admin App
 * @apiGroup Admin App - AdminUser
 * 
 * 
 * @apiHeader {String} Content-Type application/json
 * 
 * 
 * @apiParam {String} token Invite Token sent to the Employee 
 * @apiParam {String} password Password of Employee
 * @apiParam {String} mobile Mobile Number of Employee
 * @apiParam {String} name Employee's Name
 * @apiParam {String} photo Base64-encoded string of photo
 * 
 * 
 * @apiDescription API Endpoint POST /admin/employee/invite/accept
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
    let body = req.body;

        const verifiedInviteToken = await AdminEmployee.verifyEmployeeInviteToken(body.token);

        if (verifiedInviteToken.errors) {
            throw new BadRequestError("VALIDATION-Invalid Invite Token");
        }

        if (validator.isEmpty(body.password)) {
            throw new BadRequestError("VALIDATION-Invalid Password");
        }

        if (validator.isEmpty(body.mobile)) {
            throw new BadRequestError("VALIDATION-Invalid Mobile");
        }

        if (!body.name) {
            throw new BadRequestError("VALIDATION-Invalid Name");
        }

        const employeeData = {
            mobile: body.mobile,
            name: body.name,
            acceptedInvite: true,
            password: body.password
        };

        //TODO: No photos in AdminEmployee schema. Check flow later
        // // NEW
        // if (req.files && req.files.photo && req.files.photo[0]) {
        //     employeeData.photo = {
        //         contentType: req.files.photo[0].contentType,
        //         data: req.files.photot[0].location
        //     }
        // }
        // OLD
        // if (body.photo) {
        //     const contentType = base64MimeType(body.photo);
        //     const data = body.photo.split(",")[1];
        //     employeeData.photo = {
        //         contentType: contentType,
        //         data: Buffer.from(data, 'base64')
        //     };
        // }

        const employeeId = mongoose.Types.ObjectId(verifiedInviteToken.employee._id);
        //TODO! Fix password update, add updateOne hook
        let employee = await AdminEmployee.findByIdAndUpdate(employeeId , employeeData, {new: true});

        // COULDNT BARE TO SEE THIS. IS THIS ACTUALLY REQURIED ??
        // let employee = await AdminEmployee.findOne({ _id: employeeId });

        // employee.password = body.password;
        // await employee.save();

        employee = employee._doc;

        employee = objectMinusKeys(employee, ["password"]);

        //TODO! CHeck if really required, will slow down response
        // employee.photo = getFilePath("adminemployeephoto", employee._id.toString());

        res.status(200).send({
            success: true,
            message: "Successfully saved Employee account data",
            employeeObj: employee
        });
}

module.exports = saveEmployee;