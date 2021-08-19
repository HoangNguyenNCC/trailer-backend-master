const mongoose = require('mongoose');
const moment = require('moment');
const validator = require('validator');
const countriesISO = require('i18n-iso-countries');
const countriesInfo = require('countries-information');

const Employee = require('../../../models/employees');

const objectMinusKeys = require('../../../helpers/objectMinusKeys');
const dateUtils = require('../../../helpers/dateUtils');

const aclSettings = require('../../../helpers/getAccessControlList');
const { BadRequestError } = require('../../../helpers/errors');

/** 
 * 
 *  
 * @api {PUT} /admin/licensee/employee/profile Employee Update Profile
 * @apiName TAAL - Employee Update Profile
 * @apiGroup Admin App - Licensee
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
 * @apiDescription API Endpoint PUT /admin/licensee/employee/profile
 * 
 * 
 * Request Headers
 * - 'Content-Type: application/json'
 * 
 * @apiParamExample {json} Request-Example:
 * 
    curl --location --request PUT 'http://localhost:5000/admin/licensee/employee/profile/' \
    --form 'reqBody={
        "employeeId": "123",
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
        
        body = JSON.parse(body);
       

        let employeeId = (req.requestFrom && req.requestFrom.isOwner) ? (body.employeeId || req.requestFrom.employeeId.toString()) : req.requestFrom.employeeId.toString();

        if(!req.requestFrom || (!req.requestFrom.isOwner && req.requestFrom.employeeId !== employeeId)) {
            throw new BadRequestError('Unauthorised Access')
        }

        if(!employeeId) {
            throw new BadRequestError("VALIDATION-Employee Id is not specified");
        }
        employeeId = mongoose.Types.ObjectId(employeeId);

        let existingEmployee = await Employee.findOne({ _id: employeeId }, { email: 1, mobile: 1, country: 1 });
        existingEmployee = existingEmployee._doc;

        //#region Deprecated in favor of S3
        // const fileFields = ["employeePhoto", "employeeDriverLicenseScan", "employeeAdditionalDocumentScan"];
        // if(req.files) {
        //     fileFields.forEach(fileField => {
        //         if(req.files[fileField]) {
        //             req.files[fileField].forEach(file => {
        //                 uploadedFiles.push(file.path);
        //             });
        //         }
        //     });

        //     // Validations -------------------------------------------------------

        //     fileFields.forEach(fileField => {
        //         if(req.files[fileField]) {
        //             req.files[fileField].forEach(file => {
        //                 if(!constants.allowedfiles.documents.includes(file.mimetype)) {
        //                     throw new BadRequestError(`VALIDATION-Upload files with allowed file types - ${file.filename}`);
        //                 }
        //                 if(file.size > constants.maxPictureSize) {
        //                     throw new BadRequestError(`VALIDATION-Document Exceeded Size Limit - ${file.filename}`);
        //                 }
        //             });
        //         }
        //     });
        // }
        //#endregion

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

        const employeeData = {};

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

        if(!body.dob || !moment(body.dob).isBefore(moment().subtract(18, "years"))) {
            throw new BadRequestError("VALIDATION-Invalid Date Of Birth");
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

            if (!dateUtils.isValidExpiry(body.driverLicense.expiry)) {
                throw new BadRequestError("VALIDATION-Employee Driver License is expired");
            }

            if(!body.driverLicense.state) {
                throw new BadRequestError("VALIDATION-Employee Driver License Number is empty");
            }

            employeeData.driverLicense = body.driverLicense;
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
        
        if(req.files["employeeAdditionalDocumentScan"] && req.files["employeeAdditionalDocumentScan"].length > 0) {
            let photo = req.files["employeeAdditionalDocumentScan"][0];
            const data = photo.location;
            const contentType = photo.mimetype;

            if(!body.additionalDocument) {
                body.additionalDocument = {};
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

        await Employee.updateOne({ _id: employeeId }, employeeData);

        const employeeProj = Employee.getAllUsefulFieldsExceptFile();
        let employee = await Employee.findOne({ _id: employeeId }, employeeProj);

        employee = employee._doc;
        employee = objectMinusKeys(employee, ["password"]);

        if(employee.dob) {
            employee.dob = dateUtils.formatDob(employee.dob);
        }

        if(employee.address) {
            employee.address = employee.address._doc;
            employee.address.coordinates = employee.address.location._doc.coordinates;
            employee.address.coordinates = [employee.address.coordinates[1], employee.address.coordinates[0]];
            delete employee.address.location;
            delete employee.address._id;
        }

        //#region Deprecated in favour of S3
        // if(employee.photo) {
        //     employee.photo = getFilePath("lempl-photo", employee._id.toString());
        // }

        // if(employee.driverLicense) {
        //     employee.driverLicense.scan = getFilePath("lempl-drivinglicense", employee._id.toString());
        // }

        // if(employee.additionalDocument) {
        //     employee.additionalDocument.scan = getFilePath("lempl-additionaldoc", employee._id.toString());
        // }
        //#endregion

        res.status(200).send({
            success: true,
            message: "Successfully updated Employee account data",
            employeeObj: employee
        });
}

module.exports = updateEmployee;