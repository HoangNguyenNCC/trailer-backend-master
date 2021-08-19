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

const constants = require('../../../helpers/constants');

const aclSettings = require('../../../helpers/getAccessControlList');
const dotify = require('./../../../helpers/dotify');
const dateUtils = require('./../../../helpers/dateUtils');
const {
    BadRequestError,
    ForbiddenError,
    NotFoundError,
    UnauthorizedError,
    ApiError
  } = require("./../../../helpers/errors");

dotenv.config();
const config = process.env;

/** 
 * 
 *  
 * @api {PUT} /employee/profile Employee Update Profile
 * @apiName LA - Employee Update Profile
 * @apiGroup Licensee App - Employee
 * 
 * 
 * @apiHeader {String} Content-Type application/json
 * 
 * 
 * @apiParam {File} employeePhoto User's Profile Photo ( File )
 * @apiParam {File} employeeDriverLicenseScan Scanned Image/PDF of User's Driving License ( File ) [ Driver license ( Front & Back ) ]
 * @apiParam {File} employeeAdditionalDocumentScan Scanned Image/PDF of User's Additional Document ( File ) [ Passport, ID card ( Front & Back ), Photo card (New South Wales) ]
 * 
 * @apiParam {Object} reqBody Request JSON data
 * 
 * @apiParam {String} mobile Mobile Number of Employee
 * @apiParam {String} country Employee's Country
 * @apiParam {String} name Employee's Name
 * @apiParam {String} email Exmployee's Email
 * @apiParam {String} dob Date of Birth ( "YYYY-MM-DD" format )
 * @apiParam {String} type Type of Employee ( "employee", "representative", "director", "executive" )
 * @apiParam {String} title Employee's Title in Company
 * @apiParam {String} acl Exployee Access Privileges List ( Only Owner can change this )
 * @apiParam {String} employeeId Employee Id ( Only Admins have to pass it while updating data of other Employees )
 * 
 * @apiParam {Object} driverLicense Driver License Details
 * @apiParam {String} driverLicense[card] License Number of Driver License
 * @apiParam {String} driverLicense[expiry] Expiry Date of Driver License
 * @apiParam {String} driverLicense[state] State in which Driver License is issued
 * 
 * @apiParam {Object} address Address
 * @apiParam {String} address[text] Address Text
 * @apiParam {String} address[pincode] Address Pincode
 * @apiParam {String} address[coordinates] Address Location [latitude, longitude]
 * @apiParam {String} address[city] Address City
 * @apiParam {String} address[state] Address State
 * @apiParam {String} address[country] Address Country
 * 
 * 
 * @apiDescription API Endpoint PUT /employee/profile
 * 
 * 
 * Request Headers
 * - 'Content-Type: application/json'
 * 
 * @apiParamExample {json} Request-Example:
 * 
    curl --location --request PUT 'http://localhost:3000/employee/profile/' \
    --form 'reqBody={
        "employeeId": "5f3198c0b70e1b0017096116",
        "name": "Owner 1"
    }'
 * 
 * 
 * @apiErrorExample {json} Error-Response:
 * HTTP/1.1 400
    {
        success: false,
        message: "Error occurred while updating Employee account data",
        errorsList: []
    }
 * 
 * 
 * @apiSuccess {Boolean} success Success Status
 * @apiSuccess {String} message Success Message
 * @apiSuccess {Object} employeeObj Employee object
 * 
 * 
 * @apiSuccessExample {String} - Success-Response:
 * HTTP/1.1 200 OK
 * 
    {
        success: true,
        message: "Successfully updated Employee account data"
    }
 * 
 * 
 */
async function updateEmployee(req, res, next) {
        let body = req.body.reqBody;

        if(!body) {
            throw new BadRequestError("VALIDATION-Invalid Request Body");
        }
        console.log(body);
        try {
            body = JSON.parse(body);
        } catch(err) {

        }
        

        let employeeId = (req.requestFrom && req.requestFrom.isOwner) ? (body.employeeId || req.requestFrom.employeeId.toString()) : req.requestFrom.employeeId.toString();

        if(!req.requestFrom || (!req.requestFrom.isOwner && req.requestFrom.employeeId !== employeeId)) {
           throw new ForbiddenError('Unauthorised Access')
        }

        if(!employeeId) {
            throw new BadRequestError("VALIDATION-Employee Id is not specified");
        }
        employeeId = mongoose.Types.ObjectId(employeeId);

        let existingEmployee = await Employee.findOne({ _id: employeeId });

        if (!existingEmployee) throw new BadRequestError('VALIDATION-Employee not found');

        existingEmployee = existingEmployee._doc;

        /* if(validator.isEmpty(body.password)) {
            throw new Error("VALIDATION-Invalid Password");
        }

        if(validator.isEmpty(body.mobile)) {
            throw new Error("VALIDATION-Invalid Mobile");
        } */

        /* if(!body.isMobileVerified) {
            throw new Error("VALIDATION-Employee Mobile is not verified");
        } */
        if(body.acl) {
            const aclKeys = Object.keys(aclSettings.accessControlListApps);
            const bodyACLKeys = Object.keys(body.acl);
            const commonKeys = aclKeys.filter(key => bodyACLKeys.includes(key));
            if(commonKeys.length !== bodyACLKeys.length) {
                throw new BadRequestError("VALIDATION-Access Control List contains invalid privilege keys");
            }

            aclKeys.forEach((privilege) => {
                const aclValues = aclSettings.accessControlListApps[privilege];
                const bodyValues = body.acl[privilege];
                const commonValues = bodyValues ? aclValues.filter(key => bodyValues.includes(key)) : [];
                if(commonValues.length !== bodyValues.length) {
                    throw new BadRequestError("VALIDATION-Access Control List contains invalid privilege values");
                }
            });
        }

        let employeeData = {};

        if(body.mobile) {
            let country = "Australia";
        
            if(body.country) {
                country = body.country;
            } else if(existingEmployee.country) {
                country = existingEmployee.country;
            }

            let locale = "en-AU";
            let countryCode = "AU";
            if(country) {
                countryCode = countriesISO.getAlpha2Code(country, 'en');
                locale = `en-${countryCode}` || "en-AU";
            }

            const countryInfo = countriesInfo.getCountryInfoByCode(countryCode);
            body.mobile = `${countryInfo.countryCallingCodes[0]}${body.mobile}`;

            if(body.mobile !== existingEmployee.mobile) {
                employeeData.mobile = body.mobile;
                employeeData.isMobileVerified = false;
            }
        }
        if(body.email) {
            if(body.email !== existingEmployee.email) {
                employeeData.email = body.email;
                employeeData.isEmailVerified = false;
            }
        }
        if(body.name) {
            employeeData.name = body.name;
        }

        if(body.dob) {
            employeeData.dob = moment(body.dob).toISOString();
        }

        if(body.title) {
            employeeData.title = body.title;
        }

        if(req.requestFrom.isOwner) {
            if(body.acl) {
                employeeData.acl = body.acl;
            }

            if(body.type) {
                employeeData.type = body.type;
            }
        }

        if(body.address) {
            employeeData.address = {
                // ...existingEmployee.address._doc,
                ...body.address
            };
            if (body.address.coordinates) {
                employeeData.address.location = {
                    type: "Point",
                    coordinates: [employeeData.address.coordinates[1], employeeData.address.coordinates[0]]
                };
                delete employeeData.address.coordinates;
            }
        }
    
        if(req.files && req.files["employeePhoto"] && req.files["employeePhoto"].length > 0) {
            let photo = req.files["employeePhoto"][0];
            const data = photo.location;;
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

            if(!dateUtils.isValidExpiry(body.driverLicense.expiry)) {
                throw new BadRequestError("VALIDATION-Employee Driver License is expired");
            }

            if(!body.driverLicense.state) {
                throw new BadRequestError("VALIDATION-Employee Driver License Number is empty");
            }

            // const driverLicense = {
            //     // ...existingEmployee.driverLicense._doc,
            //     ...body.driverLicense
            // };

            // body.driverLicense = {
            //     ...driverLicense
            // };
        }

            if(req.files["employeeDriverLicenseScan"] && req.files["employeeDriverLicenseScan"].length > 0) {
                let photo = req.files["employeeDriverLicenseScan"][0];
                const data = photo.location;;
                const contentType = photo.mimetype;
    
                body.driverLicense.scan = {
                    contentType: contentType,
                    data: data
                };
            }

        // console.log({employeeData});

        if(req.files && req.files["employeeDriverLicenseScan"] && req.files["employeeDriverLicenseScan"].length > 0) {
            let photo = req.files["employeeDriverLicenseScan"][0];
            const data = fs.readFileSync(photo.path);
            const contentType = photo.mimetype;

            body.driverLicense.scan = {
                contentType: contentType,
                data: data
            };
        }

        employeeData.driverLicense = body.driverLicense;

        if(employeeData.driverLicense){
            employeeData.driverLicense.expiry = moment(employeeData.driverLicense.expiry).format('YYYY-MM-DD')
        }
        if(req.files && req.files["employeePhoto"] && req.files["employeePhoto"].length > 0) {
            let photo = req.files["employeePhoto"][0];
            const data = photo.location;
            const contentType = photo.mimetype;

            employeeData.photo = {
                contentType: contentType,
                data: data
            };
        }

        if(req.files && req.files["employeeAdditionalDocumentScan"] && req.files["employeeAdditionalDocumentScan"].length > 0) {
            let photo = req.files["employeeAdditionalDocumentScan"][0];
            const data = photo.location;
            const contentType = photo.mimetype;

            if(!body.additionalDocument) {
                body.additionalDocument = {};
            }

            const additionalDocument = {
                ...existingEmployee.additionalDocument,
                ...body.additionalDocument
            };

            body.additionalDocument = {
                ...additionalDocument
            };

            employeeData.additionalDocument = { 
                ...body.additionalDocument,
                scan: {
                    contentType: contentType,
                    data: data
                }
            };
        }

        console.log('---------- dotifying ---------', {employeeData});
        employeeData = dotify(employeeData);
    
        employeeData = objectMinusKeys(employeeData, ["_id"]);

        console.log('employee update body', {employeeData});
        //------------------------------------------------------------------------
        let employee = await Employee.findByIdAndUpdate(employeeId, { $set: employeeData }, {new: true});


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
            message: "Successfully updated Employee account data",
            employeeObj: employee
        });
}

module.exports = updateEmployee;