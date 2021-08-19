const mongoose = require('mongoose');
const moment = require('moment');
const validator = require('validator');
const dotenv = require('dotenv');

const Licensee = require('../../../models/licensees');
const Employee = require('../../../models/employees');

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
 * @api {GET} /employee/profile/licensee Get Licensee Details for where Employee works
 * @apiName LA - Get Licensee Details for where Employee works
 * @apiGroup Licensee App - Employee
 * 
 * 
 * @apiHeader {String} authorization Authorization token sent as a response to signIn request
 * 
 * 
 * @apiDescription API Endpoint GET /employee/profile/licensee
 * 
 * 
 * @apiErrorExample {json} Error-Response:
 * HTTP/1.1 400
    {
        success: false,
        message: "Could not fetch Licensee data",
        errorsList: []
    }
 * 
 * 
 * @apiSuccess {Boolean} success Success Status
 * @apiSuccess {String} message Success Message
 * @apiSuccess {Object} licenseeObj Licensee details
 * 
 * 
 * @apiSuccessExample {String} - Success-Response:
 * HTTP/1.1 200 OK
 * 
    {
        success: true,
        message: "Success",
        licenseeObj: {}
    }
 * 
 * 
 */
async function getLicensee(req, res, next) {

        if (!req.requestFrom || !req.requestFrom.employeeId || !req.requestFrom.licenseeId) {
            throw new ForbiddenError('Unauthorised Access');
        }

        // -----------------------------------------------------------------------------------------

        const licenseeId = mongoose.Types.ObjectId(req.requestFrom.licenseeId);

        let licensee = await Licensee.findOne({ _id: licenseeId });
        if(licensee) {
            licensee = licensee._doc;

            licensee.workingDays = licensee.workingDays.map((day) => {
                return constants.daysMapping[day];
            });

            const workingHoursComp = licensee.workingHours.split("-");
            const formattedStartTime = moment(workingHoursComp[0], "hmm").format("HH:mm");
            const formattedEndTime = moment(workingHoursComp[1], "hmm").format("HH:mm");

            // -----------------------------------------------------------------------------------------

            const licenseeObj = {
                name: licensee.name,
                email : licensee.email,
                mobile: licensee.mobile,
                address: {
                    text: licensee.address.text ? licensee.address.text : "",
                    pincode: licensee.address.pincode ? licensee.address.pincode : "",
                    coordinates: licensee.address.location ? licensee.address.location._doc.coordinates : ""
                },
                logo: licensee.logo,
                proofOfIncorporation: {
                    document: licensee.proofOfIncorporation.data,
                    verified: !!licensee.proofOfIncorporation.verified,
                    accepted: !!licensee.proofOfIncorporation.accepted
                },
                workingDays: licensee.workingDays.join(", "),
                workingHours: `${formattedStartTime}-${formattedEndTime}`,
                payment: {
                    stripeAccountId: licensee.stripeAccountId,
                    accountNumber: licensee.accountNumber,
                    bsbNumber: licensee.bsbNumber
                }
            };
            licenseeObj.address.coordinates = [licenseeObj.address.coordinates[1], licenseeObj.address.coordinates[0]];

            res.status(200).send({
                success: true,
                message: "Success",
                licenseeObj: licenseeObj
            });
        }  else {
            throw new NotFoundError("VALIDATION-No Licensee Found");
        }
}

module.exports = getLicensee;