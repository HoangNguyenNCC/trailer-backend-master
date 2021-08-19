const mongoose = require('mongoose');
const moment = require('moment');
const validator = require('validator');
const dotenv = require('dotenv');

const Licensee = require('../../../models/licensees');
const Employee = require('../../../models/employees');

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
 * @api {GET} /stripe/details Get Stripe Details for the Licensee
 * @apiName LA - Get Stripe Details for the Licensee
 * @apiGroup Licensee App - Licensee
 * 
 * 
 * @apiHeader {String} authorization Authorization token sent as a response to signIn request
 * 
 * 
 * @apiDescription API Endpoint GET /stripe/details
 * 
 * 
 * @apiErrorExample {json} Error-Response:
 * HTTP/1.1 400
    {
        success: false,
        message: "Could not fetch Stripe Details for the Licensee",
        errorsList: []
    }
 * 
 * 
 * @apiSuccess {Boolean} success Success Status
 * @apiSuccess {String} message Success Message
 * @apiSuccess {Object} detailsObj Licensee details
 * 
 * 
 * @apiSuccessExample {String} - Success-Response:
 * HTTP/1.1 200 OK
 * 
    {
        success: true,
        message: "Success",
        detailsObj: {}
    }
 * 
 * 
 */
async function getStripeDetails(req, res, next) {

        if(!req.requestFrom || !req.requestFrom.employeeId || !req.requestFrom.licenseeId || !req.requestFrom.isOwner) {
            throw new ForbiddenError('Unauthorised Access');
        }

        const licenseeId = mongoose.Types.ObjectId(req.requestFrom.licenseeId);

        // --------------------------------------------------------------------------

        const licenseeProj = {
            name: 1, businessType: 1,
            mobile: 1, isMobileVerified: 1, 
            address: 1, 
            taxId: 1,
            "proofOfIncorporation.verified": 1, "proofOfIncorporation.accepted": 1,
            stripeAccountId: 1, stripeAccountVerified: 1, 
            accountNumber: 1, mcc: 1,
            url: 1, productDescription: 1, 
            tosAcceptanceDate: 1, tosAcceptanceIP: 1
        };

        const licensees = await Licensee.aggregate([
            { $match: { _id: licenseeId } },
            { $project: licenseeProj }
        ]).exec();

        if(licensees && licensees.length > 0 && licensees[0]) {
            let licensee = licensees[0];
            // licensee = licensee._doc;

            const businessType = licensee.businessType;

            // --------------------------------------------------------------------------

            const businessObj = {};

            if(licensee.stripeAccountId) {
                businessObj.stripeAccountId = licensee.stripeAccountId;
            }

            if(licensee.stripeAccountVerified) {
                businessObj.stripeAccountVerified = licensee.stripeAccountVerified;
            }

            if(licensee.accountNumber) {
                businessObj.accountNumber = licensee.accountNumber;
            }

            if(licensee.mcc) {
                businessObj.mcc = licensee.mcc;
            }
        
            if(licensee.url) {
                businessObj.url = licensee.url;
            }

            if(licensee.productDescription) {
                businessObj.productDescription = licensee.productDescription;
            }

            if(licensee.tosAcceptanceDate) {
                businessObj.tosAcceptanceDate = licensee.tosAcceptanceDate;
                businessObj.tosAccepted = true;
            } else {
                businessObj.tosAccepted = false;
            }

            if(licensee.tosAcceptanceIP) {
                businessObj.tosAcceptanceIP = licensee.tosAcceptanceIP;
            }

            // --------------------------------------------------------------------------

            let detailsObj = {
                businessObj: businessObj
            };
            
            let companyObj = {};
            let owners = [];
            let representatives = [];
            let directors = [];
            let executives = [];

            let employeeProj = Employee.getAllFieldsWithExistsFile();

            let employees;
            if(businessType === "individual") {
                employees = await Employee.aggregate([
                    { $match: { licenseeId: licenseeId, type: "owner" } },
                    { $project: employeeProj }
                ]).exec();
            } else if(businessType === "company") {
                employees = await Employee.aggregate([
                    { $match: { licenseeId: licenseeId, type: { $in: ["owner", "representative", "director", "executive"] } } }, 
                    { $project: employeeProj }
                ]).exec();
            
                if(licensee.name) {
                    companyObj.name = licensee.name;
                }

                if(licensee.mobile) {
                    companyObj.mobile = licensee.mobile;
                    companyObj.isMobileVerified = licensee.isMobileVerified;
                }

                if(licensee.address) {
                    companyObj.address = {
                        "text": licensee.address.text ? licensee.address.text : "",
                        "pincode": licensee.address.pincode ? licensee.address.pincode : "",
                        "coordinates": licensee.address.location ? licensee.address.location.coordinates : "",
                        "city": licensee.address.city ? licensee.address.city : "",
                        "state": licensee.address.state ? licensee.address.state : "",
                        "country": licensee.address.country ? licensee.address.country : ""                   
                    };

                    if(companyObj.address.coordinates && companyObj.address.coordinates.length === 2) {
                        companyObj.address.coordinates = [companyObj.address.coordinates[1], companyObj.address.coordinates[0]];
                    }
                }

                if(licensee.taxId) {
                    companyObj.taxId = licensee.taxId;
                }

                if(licensee.proofOfIncorporation) {
                    companyObj.proofOfIncorporation = {
                        verified: licensee.proofOfIncorporation.verified,
                        accepted: licensee.proofOfIncorporation.accepted,
                        document: licensee.proofOfIncorporation.data
                    };
                }

                detailsObj.companyObj = companyObj;
            }

            // --------------------------------------------------------------------------
            if(employees && employees.length > 0) {
                employees.forEach((employee) => {
                    // employee = employee._doc;
                
                    const employeeObj = {
                        name: employee.name,
                        type: employee.type
                    };

                    if(employee.dob) {
                        employeeObj.dob = moment(employee.dob).format("YYYY-MM-DD");
                    }

                    if(employee.address) {
                        employeeObj.address = {
                            "text": employee.address.text,
                            "pincode": employee.address.pincode,
                            "coordinates": employee.address.location.coordinates,
                            "city": employee.address.city || "",
                            "state": employee.address.state || "",
                            "country": employee.address.country || ""
                        };
                    } else if(licensee.address) {
                        employeeObj.address = {
                            "text": licensee.address.text,
                            "pincode": licensee.address.pincode,
                            "coordinates": licensee.address.location.coordinates,
                            "city": licensee.address.city || "",
                            "state": licensee.address.state || "",
                            "country": licensee.address.country || ""
                        };
                    }

                    if(employeeObj.address.coordinates && employeeObj.address.coordinates.length === 2) {
                        employeeObj.address.coordinates = [employeeObj.address.coordinates[1], employeeObj.address.coordinates[0]];
                    }

                    if(employee.title) {
                        employeeObj.title = employee.title;
                    }

                    if(employee.email) {
                        employeeObj.email = employee.email;
                        employeeObj.isEmailVerified = employee.isEmailVerified;
                    }
                    
                    if(employee.mobile) {
                        employeeObj.mobile = employee.mobile;
                        employeeObj.isMobileVerified = employee.isMobileVerified;
                    }
            
                    if(employee.driverLicense) {
                        employeeObj.driverLicense = employee.driverLicense;
                    }
            
                    if(employee.additionalDocument) {
                        employeeObj.additionalDocument = employee.additionalDocument;
                    }

                    if(employee.type === "owner") {
                        owners.push(employeeObj);
                    } else if(employee.type === "representative") {
                        representatives.push(employeeObj);
                    } else if(employee.type === "director") {
                        directors.push(employeeObj);
                    } else if(employee.type === "executive") {
                        executives.push(employeeObj);
                    }
                });
            }

            // --------------------------------------------------------------------------

            if(businessType === "individual") {
                detailsObj.owners = owners;
            } else if(businessType === "company") {
                detailsObj.owners = owners;
                detailsObj.representatives = representatives;
                detailsObj.directors = directors;
                detailsObj.executives = executives;
            }

            // --------------------------------------------------------------------------

            res.status(200).send({
                success: true,
                message: "Success",
                detailsObj: detailsObj
            });
        }  else {
            throw new BadRequestError("VALIDATION-No Licensee Found");
        }
}

module.exports = getStripeDetails;