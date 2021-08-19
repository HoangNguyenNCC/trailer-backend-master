const mongoose = require('mongoose');
const moment = require('moment');
const validator = require('validator');
const dotenv = require('dotenv');
const countriesISO = require('i18n-iso-countries');
const countriesInfo = require('countries-information');
const fs = require('fs');

const Licensee = require('../../../models/licensees');
const Employee = require('../../../models/employees');

const objectSize = require('../../../helpers/objectSize');
const objectMinusKeys = require('../../../helpers/objectMinusKeys');
const embeddedParser = require('../../../helpers/embeddedParser');
const getFilePath = require('../../../helpers/getFilePath');
const sendMail = require('../../../helpers/sendMail');
const constants = require('../../../helpers/constants');
const {BadRequestError} = require('../../../helpers/errors');

const aclSettings = require('../../../helpers/getAccessControlList');

const saveEmployee = async function(req,res){
    const uploadedFiles = [];
    let body = req.body;
        if(!body) {
            throw new BadRequestError("VALIDATION-Invalid Request Body");
        }
        body = JSON.parse(body);
        
        // const verifiedInviteToken = await Employee.verifyEmployeeInviteToken(body.token);
        // if (verifiedInviteToken.errors) {
        //     throw new BadRequestError("VALIDATION-Invalid Invite Token");
        // }
        if (validator.isEmpty(body.password)) {
            throw new BadRequestError("VALIDATION-Invalid Password");
        }
        if (validator.isEmpty(body.mobile)) {
            throw new BadRequestError("VALIDATION-Invalid Mobile");
        }
        /* if (!body.isMobileVerified) {
            throw new BadRequestError("VALIDATION-Employee Mobile is not verified");
        } */
        if (!body.name) {
            throw new BadRequestError("VALIDATION-Invalid Name");
        }
        // -----------------------------------------------------------------------------------
        const fileFields = ["employeePhoto", "employeeDriverLicenseScan", "employeeAdditionalDocumentScan"];
        if(req.files) {
            fileFields.forEach(fileField => {
                if(req.files[fileField]) {
                    req.files[fileField].forEach(file => {
                        uploadedFiles.push(file.path);
                    });
                }
            });
            // Validations -------------------------------------------------------
            fileFields.forEach(fileField => {
                if(req.files[fileField]) {
                    req.files[fileField].forEach(file => {
                        if(!constants.allowedfiles.documents.includes(file.mimetype)) {
                            throw new BadRequestError(`VALIDATION-Upload files with allowed file types - ${file.filename}`);
                        }
                        if(file.size > constants.maxPictureSize) {
                            throw new BadRequestError(`VALIDATION-Document Exceeded Size Limit - ${file.filename}`);
                        }
                    });
                }
            });
        }
        // -----------------------------------------------------------------------------------
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
            const data = fs.readFileSync(photo.path);
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
            if(!moment(body.driverLicense.expiry, "MM/YY").add(2, "days").endOf("month").isAfter(moment())) {
                throw new BadRequestError("VALIDATION-Employee Driver License is expired");
            }
            if(!body.driverLicense.state) {
                throw new BadRequestError("VALIDATION-Employee Driver License Number is empty");
            }
            if(req.files["employeeDriverLicenseScan"] && req.files["employeeDriverLicenseScan"].length > 0) {
                let photo = req.files["employeeDriverLicenseScan"][0];
                const data = fs.readFileSync(photo.path);
                const contentType = photo.mimetype;
    
                body.driverLicense.scan = {
                    contentType: contentType,
                    data: data
                };
            }

            employeeData.driverLicense = body.driverLicense;
        }
        if(req.files["employeeAdditionalDocumentScan"] && req.files["employeeAdditionalDocumentScan"].length > 0) {
            let photo = req.files["employeeAdditionalDocumentScan"][0];
            const data = fs.readFileSync(photo.path);
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
        

        uploadedFiles.forEach((filePath) => {
            if(fs.existsSync(filePath)) {
                fs.unlinkSync(filePath);
            }
        });

        //------------------------------------------------------------------------

        const employeeId = mongoose.Types.ObjectId(verifiedInviteToken.employee._id);

        await Employee.updateOne({ _id: employeeId }, employeeData);

        const employeeProj = Employee.getAllUsefulFieldsExceptFile();
        let employee = await Employee.findOne({ _id: employeeId }, employeeProj);

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

        if(employee.photo) {
            employee.photo = getFilePath("lempl-photo", employee._id.toString());
        }

        if(employee.driverLicense) {
            employee.driverLicense.scan = getFilePath("lempl-drivinglicense", employee._id.toString());
        }

        if(employee.additionalDocument) {
            employee.additionalDocument.scan = getFilePath("lempl-additionaldoc", employee._id.toString());
        }

        res.status(200).send({
            success: true,
            message: "Successfully saved Employee account data",
            employeeObj: employee
        });
}

module.exports = saveEmployee