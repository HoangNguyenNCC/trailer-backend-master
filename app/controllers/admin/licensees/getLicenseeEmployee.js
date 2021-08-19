const moment = require('moment');

const Licensee = require('../../../models/licensees');
const constants = require('../../../helpers/constants');
const { BadRequestError } = require('../../../helpers/errors');


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
    const licenseeId = req.query.id;

        if (!licenseeId || !licenseeId.length) {
            throw new BadRequestError('Unauthorised Access')
        }

        let licensee = await Licensee.findOne({ _id: licenseeId });
        if(licensee) {
            licensee = licensee._doc;

            // if (licensee.proofOfIncorporation) {
            //     licensee.proofOfIncorporation.scan = licensee.proofOfIncorporation.scan.data;
            //     licensee.proofOfIncorporation.doc = licensee.proofOfIncorporation.scan;
            // }

            // licensee.workingDays = licensee.workingDays.map((day) => {
            //     return constants.daysMapping[day];
            // });

            const workingHoursComp = licensee.workingHours.split("-");
            const formattedStartTime = moment(workingHoursComp[0], "hmm").format("HH:mm");
            const formattedEndTime = moment(workingHoursComp[1], "hmm").format("HH:mm");

            // -----------------------------------------------------------------------------------------

            const licenseeObj = {
                ...licensee,
                address: {
                    text: licensee.address.text ? licensee.address.text : "",
                    pincode: licensee.address.pincode ? licensee.address.pincode : "",
                    coordinates: licensee.address.location ? licensee.address.location._doc.coordinates : ""
                },
                workingHours: `${formattedStartTime}-${formattedEndTime}`,
            };
            licenseeObj.address.coordinates = [licenseeObj.address.coordinates[1], licenseeObj.address.coordinates[0]];

            res.status(200).send({
                success: true,
                message: "Success",
                licenseeObj: licenseeObj
            });
        }  else {
            throw new BadRequestError("VALIDATION-No Licensee Found");
        }
}

module.exports = getLicensee;