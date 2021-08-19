const mongoose = require('mongoose');
const moment = require('moment');
const validator = require('validator');
const dotenv = require('dotenv');

const Licensee = require('../../../models/licensees');
const Employee = require('../../../models/employees');

const objectSize = require('../../../helpers/objectSize');
const objectMinusKeys = require('../../../helpers/objectMinusKeys');
const constants = require('../../../helpers/constants');

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
 * @api {GET} /employee/profile Get Employee Profile
 * @apiName LA - Get Employee Profile
 * @apiGroup Licensee App - Employee
 * 
 * 
 * @apiHeader {String} authorization Authorization token sent as a response to signIn request
 * 
 * 
 * @apiParam {String} employeeId Employee ID
 * 
 * 
 * @apiDescription API Endpoint GET /employee/profile
 * 
 * 
 * @apiErrorExample {json} Error-Response:
 * HTTP/1.1 400
    {
        success: false,
        message: "Error occurred while fetching Employee data",
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
        message: "Success",
        employeeObj: {}
    }
 * 
 * 
 */
async function getEmployee(req, res, next) {

        let employeeId = req.query.employeeId || (req.requestFrom && req.requestFrom.employeeId);
        if (!employeeId || validator.isEmpty(employeeId)) {
            throw new BadRequestError("VALIDATION-Employee ID is undefined");
        } else if (objectSize(employeeId) < 12) {
            throw new BadRequestError("VALIDATION-Employee ID is invalid");
        }
    
        // -----------------------------------------------------------------------------------------

        if (!req.requestFrom || req.requestFrom.employeeId !== employeeId) {
            throw new ForbiddenError('Unauthorized Access');
        }

        // -----------------------------------------------------------------------------------------

        employeeId = mongoose.Types.ObjectId(employeeId);
        const licenseeId = mongoose.Types.ObjectId(req.requestFrom.licenseeId);

        let employee = await Employee.findOne({ _id: employeeId, licenseeId: licenseeId });
        if(employee) {
            employee = employee._doc;
            employee = objectMinusKeys(employee, ['password']);
            employee.driverLicense.expiry = moment(employee.driverLicense.expiry).format('YYYY-MM-DD')
            // employee.photo = getFilePath("lempl-photo", employee._id.toString());

            // if(employee.driverLicense) {
            //     employee.driverLicense.scan = getFilePath("lempl-drivinglicense", employee._id.toString());
            // }

            // if(employee.additionalDocument) {
            //     employee.additionalDocument.scan = getFilePath("lempl-additionaldoc", employee._id.toString());
            // }

            // -----------------------------------------------------------------------------------------

            const responseJson = {
                success: true,
                message: "Success",
                employeeObj: employee
            };

            // if(employee.isOwner) {

        let licensee = await Licensee.findById(licenseeId);
                if(licensee) {
                    licensee = licensee._doc;

                    licensee.workingDays = licensee.workingDays.map((day) => {
                        return constants.daysMapping[day];
                    });

                    const workingHoursComp = licensee.workingHours.split("-");
                    const formattedStartTime = moment(workingHoursComp[0], "hmm").format("HH:mm");
                    const formattedEndTime = moment(workingHoursComp[1], "hmm").format("HH:mm");

                    // -----------------------------------------------------------------------------------------

                    responseJson.licenseeObj = {
                        name: licensee.name,
                        email: licensee.email,
                        mobile: licensee.mobile, 
                        address: {
                            text: licensee.address.text ? licensee.address.text : "",
                            pincode: licensee.address.pincode ? licensee.address.pincode : "",
                            coordinates: licensee.address.location ? licensee.address.location._doc.coordinates : ""
                        },
                        isEmailVerified: licensee.isEmailVerified,
                        isMobileVerified: licensee.isMobileVerified,
                        logo: licensee.logo,
                        proofOfIncorporation: {
                            doc: licensee.proofOfIncorporation.data, 
                            verified: licensee.proofOfIncorporation.verified,
                            accepted: licensee.proofOfIncorporation.accepted
                        },
                        workingDays: licensee.workingDays.join(", "),
                        licenseeRating : employee.employeeRating,
                        ratingCount:employee.ratingCount,
                        workingHours: `${formattedStartTime}-${formattedEndTime}`,
                        payment: {
                            stripeAccountId: licensee.stripeAccountId,
                            accountNumber: licensee.accountNumber,
                            bsbNumber: licensee.bsbNumber,
                            taxId: licensee.taxId
                        }
                    };

                    responseJson.licenseeObj.address.coordinates = [responseJson.licenseeObj.address.coordinates[1], responseJson.licenseeObj.address.coordinates[0]];
                }

            res.status(200).send(responseJson);
        } else {
            throw new NotFoundError("VALIDATION-No Employee Found");
        }
}

module.exports = getEmployee;
