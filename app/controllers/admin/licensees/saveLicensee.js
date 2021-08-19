const validator = require('validator');
const moment = require('moment');
const axios = require('axios');
const dotenv = require('dotenv');
const countriesISO = require('i18n-iso-countries');
const countriesInfo = require('countries-information');
const sinchRequest = require('sinch-request');

const Licensee = require('../../../models/licensees');
const Employee = require('../../../models/employees');

const objectMinusKeys = require('../../../helpers/objectMinusKeys');
const sendMail = require('../../../helpers/sendMail');
const dateUtils = require('../../../helpers/dateUtils');

const aclSettings = require('../../../helpers/getAccessControlList');
const { BadRequestError } = require('../../../helpers/errors');


dotenv.config();
const config = process.env;

/** 
 * 
 * @api {POST} /admin/licensee Licensee Signup
 * @apiName TAAL - Licensee Signup
 * @apiGroup Admin App - Licensee
 *  
 * 
 * @apiHeader {String} Content-Type application/json
 * 
 * 
 * @apiParam {File} licenseeLogo Licensee Business Logo ( File ) ( required )
 * @apiParam {File} licenseeProofOfIncorporation Licensee Proof of Incorporation of a Business ( File ) ( required )
 * @apiParam {File} employeePhoto User's Profile Photo ( File ) ( required )
 * @apiParam {File} employeeDriverLicenseScan Scanned Image/PDF of User's Driving License ( File ) [ Driver license ( Front & Back ) ] ( required )
 * @apiParam {File} employeeAdditionalDocumentScan Scanned Image/PDF of User's Additional Document ( File ) [ Passport, ID card ( Front & Back ), Photo card (New South Wales) ] ( required )
 * 
 * @apiParam {Object} reqBody Request JSON data
 * @apiParam {String} licensee[name] Licensee Name ( required )
 * @apiParam {String} licensee[email] Licensee Email ( required )
 * @apiParam {String} licensee[mobile] Licensee Mobile ( required )
 * @apiParam {String} licensee[country] Licensee Country ( required )
 * @apiParam {String} licensee[businessType] Business Type ["individual", "company"] ( required )
 * 
 * @apiParam {Object} licensee[address] Licensee Address ( required )
 * @apiParam {String} licensee[address.text] Licensee Address Text
 * @apiParam {String} licensee[address.pincode] Licensee Address Pincode
 * @apiParam {String} licensee[address.coordinates] Licensee Address Location [latitude, longitude]
 * @apiParam {String} licensee[address.city] Licensee City
 * @apiParam {String} licensee[address.state] Licensee State
 * @apiParam {String} licensee[address.country] Licensee Country
 * 
 * @apiParam {Array} licensee[workingDays] Working Days
 * @apiParam {String} licensee[workingHours] Working Hours
 * 
 * @apiParam {Array} licensee[licenseeLocations] Array of Licensee Locations
 * @apiParam {String} licensee[licenseeLocations.0.text] Licensee Address Text
 * @apiParam {String} licensee[licenseeLocations.0.pincode] Licensee Address Pincode
 * @apiParam {String} licensee[licenseeLocations.0.coordinates] Licensee Address Location [latitude, longitude]
 * @apiParam {String} licensee[licenseeLocations.0.city] Licensee City
 * @apiParam {String} licensee[licenseeLocations.0.state] Licensee State
 * @apiParam {String} licensee[licenseeLocations.0.country] Licensee Country
 * 
 * @apiParam {String} licensee[bsbNumber] BSB Number of the Licensee ( required )
 * @apiParam {String} licensee[accountNumber] Bank Account Number of Licensee ( required )
 * @apiParam {String} licensee[mcc] Merchant Category Code ( required )
 * @apiParam {String} licensee[url] URL of Business Website
 * @apiParam {String} licensee[productDescription] Business/Core Product Description ( required )
 * @apiParam {String} licensee[taxId] Company Tax ID - Australian Company Number (ACN) ( required, 9 numberic digits )
 * 
 * 
 * @apiParam {String} employee[name] Owner Name ( required )
 * @apiParam {String} employee[email] Owner Email ( required )
 * @apiParam {String} employee[mobile] Owner Mobile ( required )
 * @apiParam {String} employee[country] Owner Country ( required )
 * @apiParam {String} employee[password] Owner's Password  ( required )
 * 
 * @apiParam {String} employee[title] Owner Title in Company ( required )
 * @apiParam {String} employee[dob] Owner Date of Birth ( "YYYY-MM-DD" format ) ( required )
 * 
 * @apiParam {Object} employee[address] Owner Address ( required )
 * @apiParam {String} employee[address.text] Owner Address Text
 * @apiParam {String} employee[address.pincode] Owner Address Pincode
 * @apiParam {String} employee[address.coordinates] Owner Address Location [latitude, longitude]
 * @apiParam {String} employee[address.city] Owner Address City
 * @apiParam {String} employee[address.state] Owner Address State
 * @apiParam {String} employee[address.country] Owner Address Country
 * 
 * 
 * @apiParam {Object} employee[driverLicense] Driver License Details ( required )
 * @apiParam {String} employee[driverLicense.card] License Number of Driver License
 * @apiParam {String} employee[driverLicense.expiry] Expiry Date of Driver License
 * @apiParam {String} employee[driverLicense.state] State in which Driver License is issued
 * 
 * 
 * @apiDescription API Endpoint POST /admin/licensee
 * 
 * 
 * @apiParamExample {json} Request-Example: 
 * 
 * 
    curl --location --request POST 'http://localhost:5000/admin/licensee' \
    --form 'reqBody={
        "employee": {
            "name": "Neha Kadam",
            "mobile": "9664815262",
            "country": "india",
            "email": "neha1@licenseetrailers.com",
            "password": "aBcd@1234",
            "title": "Owner",
            "dob": "1970-05-15",
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
                "state": "NSW",
                "country": "Australia"
            }
        },
        "licensee": {
            "name": "Neha'\''s Trailers",
            "mobile": "9664815262",
            "country": "india",
            "email": "neha1@licenseetrailers.com",
            "address": {
                "text": "NorthBridge, NSW, Australia",
                "pincode": "1560",
                "coordinates": [-33.8132, 151.2172],
                "city": "Sydney",
                "state": "NSW",
                "country": "Australia"
            },
            "workingDays": ["Monday","Tuesday","Wednesday"],
            "workingHours": "0700-1900",
            
            "businessType": "individual",
            "bsbNumber": "ABCDEF",
            "accountNumber": "AB1234",
            "mcc": "7513",
            "url": "http://neha1.licenseetrailers.com",
            "productDescription": "Trailer Rental", 
            "taxId": "123456789"
        }
    }' \
    --form 'licenseeLogo=@/home/username/Downloads/company_logo.jpeg' \
    --form 'licenseeProofOfIncorporation=@/home/username/Downloads/proofOfIncorporation.png' \
    --form 'employeePhoto=@/home/username/Downloads/user.png' \
    --form 'employeeDriverLicenseScan=@/home/username/Downloads/driver_license_sample.jpeg'
 * 
 * 
 * 
 * @apiErrorExample {json} Error-Response:
 * HTTP/1.1 400
 *  {
 *      success: false,
 *      message: "Error occurred while creating Licensee Account",
 *      errorsList: []
 *  }
 * 
 * 
 * @apiSuccess {Boolean} success Success Status
 * @apiSuccess {String} message Success Message
 * @apiSuccess {Object} licenseeObj Licensee details object
 * @apiSuccess {Object} employeeObj Onwer details object
 * 
 * 
 * @apiSuccessExample {String} - Success-Response:
 * HTTP/1.1 200 OK
 * 
   {
        success: true,
        message: "Success",
        licenseeObj: {
            isEmailVerified: false,
            businessType: 'individual',
            availability: true,
            _id: '5e61dccae0c80415dd15d6d4',
            name: 'Licensee 1',
            email: 'licensee1@gmail.com',
            mobile: '919876543210',
            address: {
                text: 'NorthBridge, NSW, Australia',
                pincode: '1560',
                location: [Object]
            },
            licenseeLocations: [ [Object] ],
            proofOfIncorporation: 'http://localhost:5000/file/licenseeproof/5e61dccae0c80415dd15d6d4',
            logo: 'http://localhost:5000/file/licenseelogo/5e61dccae0c80415dd15d6d4',
            createdAt: '2020-03-06T05:16:58.146Z',
            updatedAt: '2020-03-06T05:16:58.148Z',
            __v: 0
        },
        employeeObj: {
            isOwner: true,
            acl: {
                'TRAILER': ['VIEW', 'ADD', 'UPDATE'],
                'UPSELL': ['VIEW', 'ADD', 'UPDATE']
            },
            isEmailVerified: false,
            _id: '5e61dccae0c80415dd15d6d6',
            name: 'Owner 1',
            mobile: '919876543210',
            email: 'owner@trailerslicensee.com',
            licenseeId: '5e61dccae0c80415dd15d6d4',
            createdAt: '2020-03-06T05:16:58.152Z',
            updatedAt: '2020-03-06T05:16:58.153Z',
            __v: 0
        }
   }
 * 
 */

async function saveLicensee(req, res, next) {

    const uploadedFiles = [];
   if(!req.requestFrom || !req.requestFrom.employeeId || !req.requestFrom.acl || !aclSettings.validateACL(req.requestFrom.acl, "LICENSEE", "ADD")) {
            throw new BadRequestError('Unauthorised Access')
        }

        let body, licenseeBody, employeeBody, embeddedKeys;

        body = req.body.reqBody;

        if(!body) {
            throw new BadRequestError("VALIDATION-Invalid Request Body");
        }
        
        body = JSON.parse(body);
        
        

        // embeddedKeys = ["licensee", "employee"];
        // body = embeddedParser(body, embeddedKeys);

        // embeddedKeys = ["address"];
        licenseeBody = body.licensee;
        // licenseeBody = embeddedParser(body.licensee, embeddedKeys);

        employeeBody = body.employee;
        if(!body || !licenseeBody || !employeeBody) {
            throw new BadRequestError("VALIDATION-Error occurred while parsing Request Data");
        }

        // -----------------------------------------------------------------------------------

        licenseeBody.mcc = "7513";
        licenseeBody.productDescription = "Trailer Rental";

        if(!licenseeBody.taxId || licenseeBody.taxId.length !== 9 || !validator.isNumeric(licenseeBody.taxId, {no_symbols: true})) {
            throw new BadRequestError("VALIDATION-Invalid Tax ID");
        }

        //#region Deprecated in favor of S3
        // const fileFields = ["licenseeLogo", "licenseeProofOfIncorporation", "employeePhoto", "employeeDriverLicenseScan", "employeeAdditionalDocumentScan"];
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

        // -----------------------------------------------------------------------------------

        if(!licenseeBody.name || !licenseeBody.name.trim()) {
            throw new BadRequestError("VALIDATION-Licensee Name is empty");
        }

        if(!licenseeBody.mobile || !licenseeBody.mobile.trim()) {
            throw new BadRequestError("VALIDATION-Licensee Mobile Number is empty");
        }

        let locale = "en-AU";
        let countryCode = "AU";
        if(licenseeBody && licenseeBody.country) {
            countryCode = countriesISO.getAlpha2Code(licenseeBody.country, 'en');
            locale = `en-${countryCode}` || "en-AU";
        }
        let countryInfo = countriesInfo.getCountryInfoByCode(countryCode);
        licenseeBody.mobile = `${countryInfo.countryCallingCodes[0]}${licenseeBody.mobile}`;

        if(!licenseeBody.email || !licenseeBody.email.trim()) {
            throw new BadRequestError("VALIDATION-Licensee Email is empty");
        }

        if(!validator.isEmail(licenseeBody.email)) {
            throw new BadRequestError("VALIDATION-Licensee Email is in Invalid format");
        }

        if(licenseeBody.address && licenseeBody.address.coordinates) {
            if(typeof licenseeBody.address.coordinates === "string") {
                licenseeBody.address.coordinates = licenseeBody.address.coordinates.split(",");
            }
            licenseeBody.address.location = {
                type: "Point",
                coordinates: [licenseeBody.address.coordinates[1], licenseeBody.address.coordinates[0]]
            };
            delete licenseeBody.address.coordinates;
        }

        if(!licenseeBody.licenseeLocations || licenseeBody.licenseeLocations.length === 0) {
            licenseeBody.licenseeLocations = [licenseeBody.address];
        } else {
            licenseeBody.licenseeLocations.forEach((licenseeLocation, licenseeLocationIndex) => {
                const licenseeLocationBody = licenseeLocation;
                if(licenseeLocationBody) {
                    if(typeof licenseeLocationBody.coordinates === "string") {
                        licenseeLocationBody.coordinates = licenseeLocationBody.coordinates.split(",");
                    }

                    licenseeLocationBody.location = {
                        type: "Point",
                        coordinates: [licenseeLocationBody.coordinates[1], licenseeLocationBody.coordinates[0]]
                    }
                }
                licenseeBody.licenseeLocations[licenseeLocationIndex] = licenseeLocationBody;
            });
        }

        //------------------------------------------------------------------------------
        // ["licenseeLogo", "licenseeProofOfIncorporation", "employeePhoto", "employeeDriverLicenseScan", "employeeAdditionalDocumentScan"];
        
        if(req.files["licenseeLogo"] && req.files["licenseeLogo"].length > 0) {
            let photo = req.files["licenseeLogo"][0];
            const data = photo.location;
            const contentType = photo.mimetype;

            licenseeBody.logo = {
                contentType: contentType,
                data: data
            };
        }

        if(req.files["licenseeProofOfIncorporation"] && req.files["licenseeProofOfIncorporation"].length > 0) {
            let photo = req.files["licenseeProofOfIncorporation"][0];
            const data = photo.location;
            const contentType = photo.mimetype;

            licenseeBody.proofOfIncorporation = {
                contentType: contentType,
                data: data
            };
        }

        // -----------------------------------------------------------------------------------

        employeeBody.password = "aBcd@1234";

        if(!employeeBody.name || !employeeBody.name.trim()) {
            throw new BadRequestError("VALIDATION-Employee Name is empty");
        }

        if(!employeeBody.mobile || !employeeBody.mobile.trim()) {
            throw new BadRequestError("VALIDATION-Employee Mobile Number is empty");
        }

        if(employeeBody.country && employeeBody.country) {
            countryCode = countriesISO.getAlpha2Code(employeeBody.country, 'en');
            locale = `en-${countryCode}` || "en-AU";
        }
        countryInfo = countriesInfo.getCountryInfoByCode(countryCode);
        employeeBody.mobile = `${countryInfo.countryCallingCodes[0]}${employeeBody.mobile}`;

        if(!employeeBody.email || !employeeBody.email.trim()) {
            throw new BadRequestError("VALIDATION-Employee Email is empty");
        }

        if(!validator.isEmail(employeeBody.email)) {
            throw new BadRequestError("VALIDATION-Employee Email is in Invalid format");
        }

        if(!employeeBody.dob || !moment(employeeBody.dob).isBefore(moment().subtract(18, "years"))) {
            throw new BadRequestError("VALIDATION-Invalid Date Of Birth");
        }

        if(employeeBody.dob) {
            employeeBody.dob = moment(employeeBody.dob).toISOString();
        }

        if(employeeBody.address && employeeBody.address.coordinates) {
            if(typeof employeeBody.address.coordinates === "string") {
                employeeBody.address.coordinates = employeeBody.address.coordinates.split(",");
            }

            employeeBody.address.location = {
                type: "Point",
                coordinates: [employeeBody.address.coordinates[1], employeeBody.address.coordinates[0]]
            };
            delete employeeBody.address.coordinates;
        }

        if(req.files["employeePhoto"] && req.files["employeePhoto"].length > 0) {
            let photo = req.files["employeePhoto"][0];
            const data = photo.location;
            const contentType = photo.mimetype;

            employeeBody.photo = {
                contentType: contentType,
                data: data
            };
        }

        if(employeeBody.driverLicense) {
            if(!employeeBody.driverLicense.card) {
                throw new BadRequestError("VALIDATION-Employee Driver License Number is empty");
            }

            if(!employeeBody.driverLicense.expiry) {
                throw new BadRequestError("VALIDATION-Employee Driver License Number is empty");
            }
    
            if (!dateUtils.isValidExpiry(employeeBody.driverLicense.expiry)) {
                throw new BadRequestError("VALIDATION-Employee Driver License is expired");
            }

            if(!employeeBody.driverLicense.state) {
                throw new BadRequestError("VALIDATION-Employee Driver License Number is empty");
            }
        
            if(req.files["employeeDriverLicenseScan"] && req.files["employeeDriverLicenseScan"].length > 0) {
                let photo = req.files["employeeDriverLicenseScan"][0];
                const data = photo.location;
                const contentType = photo.mimetype;
    
                employeeBody.driverLicense.scan = {
                    contentType: contentType,
                    data: data
                };
            }
        } else {
            throw new BadRequestError("VALIDATION-Employee Driver License is empty");
        }

        // ["licenseeLogo", "licenseeProofOfIncorporation", "employeePhoto", "employeeDriverLicenseScan", "employeeAdditionalDocumentScan"];
        
        if(req.files["employeeAdditionalDocumentScan"] && req.files["employeeAdditionalDocumentScan"].length > 0) {
            let photo = req.files["employeeAdditionalDocumentScan"][0];
            const data = photo.location;
            const contentType = photo.mimetype;

            if(!employeeBody.additionalDocument) {
                employeeBody.additionalDocument = {};
            }

            employeeBody.additionalDocument = {
                ...employeeBody.additionalDocument,
                scan: {
                    contentType: contentType,
                    data: data
                }
            };
        }

        // -----------------------------------------------------------------------------------

        let licensee = new Licensee(licenseeBody);
        licensee = await licensee.save();
        const licenseeToken = await licensee.newEmailVerificationToken();

        licensee = licensee._doc;

        if(licensee.address) {
            licensee.address = licensee.address._doc;
            licensee.address.coordinates = licensee.address.location._doc.coordinates;
            licensee.address.coordinates = [licensee.address.coordinates[1], licensee.address.coordinates[0]];
            delete licensee.address.location;
            delete licensee.address._id;
        }

        if(licensee.licenseeLocations && licensee.licenseeLocations.length > 0 && licensee.licenseeLocations[0] !== null) {
            licensee.licenseeLocations.forEach((licenseeLocation, licenseeLocationIndex) => {
                licenseeLocation = licenseeLocation._doc;
                const coordinates = licenseeLocation.location._doc.coordinates;
                licensee.licenseeLocations[licenseeLocationIndex] = {
                    ...licenseeLocation,
                    coordinates: [coordinates[1], coordinates[0]]
                };
                delete licensee.licenseeLocations[licenseeLocationIndex].location;
                delete licensee.licenseeLocations[licenseeLocationIndex]._id;
            });
        } else {
            licensee.licenseeLocations = [licensee.address];
        }

        // -----------------------------------------------------------------------------------

        employeeBody.licenseeId = licensee._id;
        employeeBody.isOwner = true;
        employeeBody.acl = aclSettings.accessControlListApps;
        employeeBody.acceptedInvite = true;
        employeeBody.type = "owner";

        let employee = new Employee(employeeBody);
        employee = await employee.save();
        let employeeToken;
        if(licenseeBody.email !== employeeBody.email) {
            employeeToken = await employee.newEmailVerificationToken();
        }

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

        if(employee.driverLicense) {
            /* if(employee.driverLicense.expiry) {
                employee.driverLicense.expiry = formatExpiryDate(employee.driverLicense.expiry);
            } */
            if(employee.driverLicense.scan) {
                employee.driverLicense.scan = employee.driverLicense.scan.data;
            }
        }

        if(employee.additionalDocument) {
            employee.additionalDocument.scan = employee.additionalDocument.scan.data;
        }

        // ----------------------------------------------------------------------------

        res.status(200).send({
            success: true,
            message: "Success",
            licenseeObj: licensee,
            employeeObj: employee
        });

        // ----------------------------------------------------------------------------

        if(config.NODE_ENV !== "test") {
            //-----------------------------------------------------------------

            const data = {
                to: licensee.email,
                template: "licensee-verification-email",
                subject: "Trailer2You - Licensee Email Verification",
                context: {
                    url: `${config.HOST}/licensee/email/verify?token=${licenseeToken}`,
                    name: licensee.name,
                    token: licenseeToken
                }
            };
            sendMail(data);

            if(employeeToken) {
                const data = {
                    to: employee.email,
                    template: "employee-verification-email",
                    subject: "Trailer2You - Employee Email Verification",
                    context: {
                        url: `${config.HOST}/employee/email/verify?token=${employeeToken}`,
                        name: employee.name,
                        token: employeeToken
                    }
                };
                sendMail(data);
            }

            //-----------------------------------------------------------------

            // Using Sinch Package --------------------------------------------

            const creds = {
                key: config.APPLICATION_KEY,
                secret: config.APPLICATION_SECRET
            };

            let smsBody = {
                "method": "sms",
                "identity": {
                    "type": "number",
                    "endpoint": licenseeBody.mobile
                }
            };

            // HTTP request parameters for sending SMS
            let options = {
                method: 'POST',
                host: 'verificationapi-v1.sinch.com',
                port: 443,
                path: '/verification/v1/verifications',
                data: smsBody, // Data to be sent in JSON format
                withCredentials: false, // Necessary for browser compatability (browserify)
            };
            
            // Add authentication header (application)
            sinchRequest.applicationSigned(options, creds);

            const smsDelivery = await axios.post("https://verificationapi-v1.sinch.com/verification/v1/verifications", smsBody, {
                headers: {
                    "Authorization": options.headers["authorization"], 
                    "x-timestamp": options.headers["x-timestamp"],
                    "content-type": options.headers["content-type"]
                }
            });

            if(licenseeBody.mobile !== employeeBody.mobile) {
                smsBody = {
                    "method": "sms",
                    "identity": {
                        "type": "number",
                        "endpoint": employeeBody.mobile
                    }
                };
    
                // HTTP request parameters for sending SMS
                options = {
                    method: 'POST',
                    host: 'verificationapi-v1.sinch.com',
                    port: 443,
                    path: '/verification/v1/verifications',
                    data: smsBody, // Data to be sent in JSON format
                    withCredentials: false, // Necessary for browser compatability (browserify)
                };
                
                // Add authentication header (application)
                sinchRequest.applicationSigned(options, creds);
        
                const smsDelivery = await axios.post("https://verificationapi-v1.sinch.com/verification/v1/verifications", smsBody, {
                    headers: {
                        "Authorization": options.headers["authorization"], 
                        "x-timestamp": options.headers["x-timestamp"],
                        "content-type": options.headers["content-type"]
                    }
                });
                }
            
            //-----------------------------------------------------------------
        }
}

module.exports = saveLicensee;
