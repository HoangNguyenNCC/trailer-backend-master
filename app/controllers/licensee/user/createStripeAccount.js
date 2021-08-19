const mongoose = require('mongoose');
const moment = require('moment');
const validator = require('validator');
const axios = require('axios');

const dotenv = require('dotenv');
dotenv.config();
const config = process.env;

const stripe = require('stripe')(config.STRIPE_SECRET);

const Licensee = require('../../../models/licensees');
const Employee = require('../../../models/employees');

const aclSettings = require('../../../helpers/getAccessControlList');
const {
    BadRequestError,
    ForbiddenError,
    NotFoundError,
  } = require("./../../../helpers/errors");


/** 
 * 
 *  
 * @api {POST} /stripe/account Create Stripe Account for the Licensee
 * @apiName LA - Create Stripe Account for the Licensee
 * @apiGroup Licensee App - Licensee
 * 
 * 
 * @apiHeader {String} authorization Authorization token sent as a response to signIn request
 * 
 * 
 * @apiParam {String} mcc MCC of a Company
 * @apiParam {String} url URL of a Company Website
 * @apiParam {String} productDescription Product Description of a Company
 * @apiParam {String} accountNumber Account Number of a Company
 * 
 * @apiParam {String} taxId Tax Id of a Company ( For Business Type = "company" )
 * 
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
async function createStripeAccount(req, res, next) {
    
        const reqIP = req.headers["X-Forwarded-For"] || req.connection.remoteAddress;

        let reqBody = req.body;
        const licenseeId = mongoose.Types.ObjectId(req.licenseeObj._id);

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

            let doSaveLicenseeDetails = false;

            if(!licensee.mcc) {
                if(!reqBody.mcc || validator.isEmpty(reqBody.mcc)) {
                    throw new BadRequestError("VALIDATION-Merchant Category Code is empty");
                }
                licensee.mcc = reqBody.mcc;
                doSaveLicenseeDetails = true;
            }
            if(!licensee.url) {
                if(reqBody.url) {
                    licensee.url = "www.hardcoded.com";
                }
            }

            if(!licensee.productDescription) {
                if(!reqBody.productDescription || validator.isEmpty(reqBody.productDescription)) {
                    throw new BadRequestError("VALIDATION-Product Description is empty");
                }
                licensee.productDescription = reqBody.productDescription;
                doSaveLicenseeDetails = true;
            }

            if(!licensee.accountNumber) {
                if(!reqBody.accountNumber || validator.isEmpty(reqBody.accountNumber)) {
                    throw new BadRequestError("VALIDATION-Account Number is empty");
                }
                licensee.accountNumber = reqBody.accountNumber;
                doSaveLicenseeDetails = true;
            }

            if(businessType === "company") {
                if(!licensee.taxId) {
                    if(!reqBody.taxId || validator.isEmpty(reqBody.taxId)) {
                        throw new BadRequestError("VALIDATION-Account Number is empty");
                    }
                    licensee.taxId = reqBody.taxId;
                    doSaveLicenseeDetails = true;
                }
            }

            if(doSaveLicenseeDetails) {
                const newLicenseeObj = {
                    mcc: licensee.mcc,
                    url: licensee.url,
                    productDescription: licensee.productDescription,
                    accountNumber: licensee.accountNumber
                };
                if(businessType === "company") {
                    newLicenseeObj.taxId = taxId;
                }

                await Licensee.updateOne({ licenseeId: licenseeId }, newLicenseeObj);
            }

            // --------------------------------------------------------------------------

            let employeeProj = {
                name: 1, type: 1, dob: 1, address: 1, title: 1, 
                email: 1, isEmailVerified: 1,
                mobile: 1, isMobileVerified: 1, 
                driverLicense: 1,
                // "driverLicense.card": 1,
                // "driverLicense.expiry": 1,
                // "driverLicense.state": 1,
                // "driverLicense.verified": 1,
                // "driverLicense.accepted": 1,
                // "driverLicense.scan": { $cond: { if: { $ifNull: ["$driverLicense.scan", false] }, then: true, else: false } },
                additionalDocument: { $cond: { if: { $ifNull: ["$additionalDocument", false] }, then: true, else: false } },
            };

            let employees;
            employees = await Employee.aggregate([
                { $match: { licenseeId: licenseeId, type: "owner" } },
                { $project: employeeProj }
            ]).exec();

            // --------------------------------------------------------------------------

            let stripeAccCreateObj = {
                type: "custom",
                country: "AU",
                email: licensee.email,
                requested_capabilities: [
                    "transfers", "card_payments"
                ],
                business_type: licensee.businessType,
                business_profile: {
                    mcc: licensee.mcc,
                    name: licensee.name,
                    product_description: licensee.productDescription
                },
                tos_acceptance: {
                    date: moment().unix(),
                    ip: reqIP
                },
                external_account: {
                    object: "bank_account",
                    country: "AU",
                    currency: "AUD",
                    // account_number: licensee.accountNumber
                    routing_number: "110000",
                    account_number: "000123456"
                }
            }

          
          

            if(employees && employees.length > 0) {
                const employee = employees[0];
            
                if(employee && businessType == 'individual') {
                    stripeAccCreateObj.individual = {
                        email: employee.email,
                        // phone: employee.mobile
                        phone: "000 000 0000"
                    };

                    const nameComp = employee.name.split(" ");
                    if(nameComp && nameComp.length > 0) {
                        stripeAccCreateObj.individual.first_name = nameComp[0];

                        if(nameComp.length > 1) {
                            stripeAccCreateObj.individual.last_name = nameComp[1];
                        }
                    }
                    
                    if(employee.dob) {
                        let dob = moment(employee.dob); 

                        stripeAccCreateObj.individual.dob = {
                            day: parseInt(dob.format("D")),
                            month: parseInt(dob.format("M")),
                            year: parseInt(dob.format("YYYY"))
                        };
                    }
                    
                    if(employee.address) {
                        stripeAccCreateObj.individual.address = {
                            /* line1: employee.address.text,
                            postal_code: employee.address.pincode,
                            city: employee.address.city ? employee.address.city : "NSW",
                            state: employee.address.state ? employee.address.state : 'Sydney',
                            country: employee.address.country ? employee.address.country : 'AU' */

                            line1: "13, John Street, NSW, Australia",
                            postal_code: 6003,
                            city: "Sydney",
                            state: "New South Wales",
                            country: "AU"
                        };
                    }

                    if(employee.driverLicense) {
                        let fileType = employee.driverLicense.scan.contentType;
                        if(fileType.startsWith("image/")) {
                            fileType = fileType.replace("image/", "");
                        } else if(fileType.startsWith("application/")) {
                            fileType = fileType.replace("application/", "");
                        }

                        // const file = await stripe.files.create({
                        //     purpose: 'identity_document',
                        //     file: {
                        //         data: Buffer.from(employee.driverLicense.scan.data.buffer, 'binary'),
                        //         name: `file.${fileType}`,
                        //         type: 'application/octet-stream',
                        //     },
                        // });

                        /* stripeAccCreateObj.individual.verification = {
                            document: {
                                front: file.id
                            },
                            additional_document: {
                                front: file.id
                            }
                        }; */
                    }
                }
            }

            if(businessType === "company") {
                stripeAccCreateObj.company = {
                    name: licensee.name,
                    phone: licensee.mobile,
                    tax_id: licensee.taxId,
                    address: {
                        /* line1: licensee.address.text,
                        postal_code: licensee.address.pincode,
                        city: licensee.address.city ? licensee.address.city : "NSW",
                        state: licensee.address.state ? licensee.address.state : 'Sydney',
                        country: licensee.address.country ? licensee.address.country : 'AU' */

                        line1: "13, John Street, NSW, Australia",
                        postal_code: 6003,
                        city: "Sydney",
                        state: "New South Wales",
                        country: "AU"
                    }
                };
            }
            const account = await stripe.accounts.create(stripeAccCreateObj);
            // --------------------------------------------------------------------------

            const licenseeObjUpdate = {
                stripeAccountId: account.id
            };

            await Licensee.findOneAndUpdate({ _id: licenseeId }, licenseeObjUpdate);

            // if(licensee.stripeAccountId) {
            //     businessObj.stripeAccountId = licensee.stripeAccountId;
            // }

            // if(licensee.stripeAccountVerified) {
            //     businessObj.stripeAccountVerified = licensee.stripeAccountVerified;
            // }

            // --------------------------------------------------------------------------

            res.status(200).send({
                success: true,
                message: "Success",
                stripeAccountId: licenseeObjUpdate.stripeAccountId,
                licenseeObj: req.licenseeObj,
                employeeObj: req.employeeObj
            });
        }  else {
            throw new NotFoundError("VALIDATION-No Licensee Found");
        }
}

module.exports = createStripeAccount;