const mongoose = require('mongoose');
const moment = require('moment');
const validator = require('validator');
const dotenv = require('dotenv');
const countriesISO = require('i18n-iso-countries');
const countriesInfo = require('countries-information');
const fs = require('fs');

const Licensee = require('../../../models/licensees');
const Employee = require('../../../models/employees');

const objectMinusKeys = require('../../../helpers/objectMinusKeys');
const {
    BadRequestError,
    ForbiddenError,
    NotFoundError,
    UnauthorizedError,
  } = require("./../../../helpers/errors");


const dateUtils = require('./../../../helpers/dateUtils');


dotenv.config();
const config = process.env;

/** 
 * 
 *  
 * @api {POST} /employee/invite/accept Employee Invite Accept
 * @apiName LA - Employee Invite Accept
 * @apiGroup Licensee App - Employee Authentication
 * 
 * 
 * @apiHeader {String} Content-Type application/json
 * 
 * 
 * @apiParam {File} employeePhoto User's Profile Photo ( File ) ( required )
 * @apiParam {File} employeeDriverLicenseScan Scanned Image/PDF of User's Driving License ( File ) [ Driver license ( Front & Back ) ] ( required )
 * @apiParam {File} employeeAdditionalDocumentScan Scanned Image/PDF of User's Additional Document ( File ) [ Passport, ID card ( Front & Back ), Photo card (New South Wales) ]
 * 
 * @apiParam {Object} reqBody Request JSON data
 * 
 * @apiParam {String} token Invite Token sent to the Employee  ( required )
 * @apiParam {String} password Password of Employee  ( required )
 * 
 * @apiParam {String} title Employee's Title in Company ( required )
 * @apiParam {String} mobile Mobile Number of Employee ( required )
 * @apiParam {String} country Country of the employee ( required )
 * @apiParam {String} name Employee's Name ( required )
 * @apiParam {String} dob Date of Birth ( "YYYY-MM-DD" format ) ( required )
 * 
 * @apiParam {Object} driverLicense Driver License Details ( required )
 * @apiParam {String} driverLicense[card] License Number of Driver License
 * @apiParam {String} driverLicense[expiry] Expiry Date of Driver License
 * @apiParam {String} driverLicense[state] State in which Driver License is issued
 * 
 * @apiParam {Object} address Address ( required )
 * @apiParam {String} address[text] Address Text
 * @apiParam {String} address[pincode] Address Pincode
 * @apiParam {String} address[coordinates] Address Location [latitude, longitude]
 * @apiParam {String} address[city] Address City
 * @apiParam {String} address[state] Address State
 * @apiParam {String} address[country] Address Country
 * 
 * 
 * @apiDescription API Endpoint POST /employee/invite/accept
 * 
 * 
 * Request Headers
 * - 'Content-Type: application/json'
 * 
 * 
 * @apiParamExample {json} Request-Example:
 * 
    curl --location --request POST 'http://localhost:5000/employee/invite/accept' \
    --form 'reqBody={
        "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI1ZTYyNDg4ZTkwZTUzZjQ2YzE0OGFiOGYiLCJpYXQiOjE1ODM0OTk0MDYsImV4cCI6MTU4MzUwMDMwNn0.nFjBSPvWjYDK_53gFYqPqq61Z2YTc1Kga4oJBtgl05s",
        
        "password": "aBc$56887",
        
        "mobile": "919876543210",
        "country": "India",
        
        "name": "Employee 1",
        "title": "Supervisor",
        "dob": "1980-11-14",
        
        "driverLicense": {
            "card": "223782weyet",
            "expiry": "06/23",
            "state": "NSW"
        },
        "address": {
            "text": "NorthBridge, NSW, Australia",
            "pincode": "1560",
            "coordinates": [-33.8132, 151.2172],
            "city": "Sydney",
            "state": "New South Wales",
            "country": "Australia"
        }
    }' \
    --form 'employeePhoto=@/home/username/Downloads/user.png' \
    --form 'employeeDriverLicenseScan=@/home/username/Downloads/driver_license_sample.jpeg'
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
 * @apiSuccess {Boolean} success Success Status
 * @apiSuccess {String} message Success Message
 * @apiSuccess {Object} employeeObj Employee details object
 * 
 * 
 * @apiSuccessExample {String} - Success-Response:
 * HTTP/1.1 200 OK
 * 
    {
        success: true,
        message: "Successfully saved Employee account data",
        employeeObj: {}
    }
 * 
 * 
 */
async function saveEmployee(req, res, next) {

        let body = req.body.reqBody;

        if(!body) {
            throw new BadRequestError("VALIDATION-Invalid Request Body");
        }

        try {
            body = JSON.parse(body);
        } catch(err) {

        }

        const verifiedInviteToken = await Employee.verifyEmployeeInviteToken(body.token);

        if (verifiedInviteToken.errors) {
            throw new BadRequestError("VALIDATION-Invalid Invite Token");
        }

        if (validator.isEmpty(body.password)) {
            throw new BadRequestError("VALIDATION-Invalid Password");
        }

        if (validator.isEmpty(body.mobile)) {
            throw new BadRequestError("VALIDATION-Invalid Mobile");
        }

        /* if (!body.isMobileVerified) {
            throw new Error("VALIDATION-Employee Mobile is not verified");
        } */

        if (!body.name) {
            throw new BadRequestError("VALIDATION-Invalid Name");
        }

        const employeeData = {
            mobile: body.mobile,
            // isMobileVerified: body.isMobileVerified,
            name: body.name,
            acceptedInvite: true
        };

        if(body.dob) {
            employeeData.dob = moment(body.dob).toISOString();
        }

        if(body.title) {
            employeeData.title = body.title;
        }

        if(body.address && body.address.coordinates) {
            employeeData.address = {...body.address};
            employeeData.address.location = {
                type: "Point",
                coordinates: [employeeData.address.coordinates[1], employeeData.address.coordinates[0]]
            };
            delete employeeData.address.coordinates;
        }
    
        if(req.files["employeePhoto"] && req.files["employeePhoto"].length > 0) {
            let photo = req.files["employeePhoto"][0];
            const data = photo.location;
            const contentType = photo.mimetype;

            employeeData.photo = {
                contentType: contentType,
                data: data
            };
        }

        if(body.driverLicense) {
            if(!body.driverLicense.card) {
                throw new BadRequestError("VALIDATION-Employee Driver License Number is empty");
            }

            if(!body.driverLicense.expiry) {
                throw new BadRequestError("VALIDATION-Employee Driver License Number is empty");
            }

            // if (!dateUtils.isValidExpiry(body.driverLicense.expiry)) {
            //     throw new Error("VALIDATION-Employee Driver License is expired");
            // }

            if(!body.driverLicense.state) {
                throw new BadRequestError("VALIDATION-Employee Driver License Number is empty");
            }

            if(req.files["employeeDriverLicenseScan"] && req.files["employeeDriverLicenseScan"].length > 0) {
                let photo = req.files["employeeDriverLicenseScan"][0];
                const data = photo.location;
                const contentType = photo.mimetype;
    
                body.driverLicense.scan = {
                    contentType: contentType,
                    data: data
                };
            }
            if(employeeData.driverLicense){
                employeeData.driverLicense.expiry = moment(employeeData.driverLicense.expiry).format('YYYY-MM-DD')
            }
            employeeData.driverLicense = body.driverLicense;
        }

        if(req.files["employeeAdditionalDocumentScan"] && req.files["employeeAdditionalDocumentScan"].length > 0) {
            let photo = req.files["employeeAdditionalDocumentScan"][0];
            const data = photo.location;
            const contentType = photo.mimetype;

            if(!body.additionalDocument) {
                body.additionalDocument = {
                    verified: false
                };
            }

            employeeData.additionalDocument = { 
                ...body.additionalDocument,
                scan: {
                    contentType: contentType,
                    data: data
                }
            };
        }
        
        //------------------------------------------------------------------------

        const employeeId = mongoose.Types.ObjectId(verifiedInviteToken.employee._id);

        await Employee.updateOne({ _id: employeeId }, employeeData);

        let employee = await Employee.findOne({ _id: employeeId });

        employee.password = body.password;
        await employee.save();

        employee = employee._doc;
        employee = objectMinusKeys(employee, ["password"]);

        if(employee.dob) {
            employee.dob = moment(employee.dob).format("YYYY-MM-DD");
        }

        if(employee.address) {
            employee.address = employee.address._doc;
            employee.address.coordinates = employee.address.location._doc.coordinates;
            employee.address.coordinates = [employee.address.coordinates[1], employee.address.coordinates[0]];
            delete employee.address.location;
            delete employee.address._id;
        }
        

        res.status(200).send({
            success: true,
            message: "Successfully saved Employee account data",
            employeeObj: employee
        });
}

module.exports = saveEmployee;