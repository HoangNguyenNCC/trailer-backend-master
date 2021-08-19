const mongoose = require('mongoose');

const TrailerInsurance = require('../../../models/trailerInsurance');

const objectSize = require('../../../helpers/objectSize');

const aclSettings = require('../../../helpers/getAccessControlList');
const { BadRequestError } = require('../../../helpers/errors');

/** 
 * 
 * @api {PUT} /admin/licensee/verify/insurance Save Insurance Document Verification details
 * @apiName TAAL - Save Insurance Document Verification details
 * @apiGroup Admin App - LicenseeTrailer
 *  
 * 
 * @apiHeader {String} Content-Type application/json
 * @apiHeader {String} authorization Authorization token sent as a response to signIn request
 * 
 * 
 * @apiParam {String} insuranceId Id of the Insurance record, for edit request only
 * @apiParam {String} isAccepted Whether Insurance Document is Accepted
 * 
 * 
 * @apiDescription API Endpoint to be used to save Insurance Document Verification details
 * 
 * 
 * @apiErrorExample {json} Error-Response:
 * HTTP/1.1 400
 *  {
 *      success: false,
 *      message: "Error occurred while saving Insurance Document Verification details",
 *      errorsList: []
 *  }
 * 
 * 
 * @apiSuccessExample {String} - Success-Response:
 * HTTP/1.1 200
 * 
 * {
 *      success: true,
 *      message: "Successfully saved Insurance Document Verification details"
 * }
 * 
 * 
 */
async function verifyInsuranceDocument(req, res, next) {
    let trailerInsurance = req.body;
        // if (!req.requestFrom || !req.requestFrom.acl || !req.requestFrom.acl.includes("UPDATE_INSURANCE")) {
        if(!req.requestFrom || !req.requestFrom.employeeId || !req.requestFrom.acl || !aclSettings.validateACL(req.requestFrom.acl, "DOCUMENTS", "UPDATE")) {
            throw new BadRequestError('Unauthorised Access')
        }

        const isUpdating = trailerInsurance.insuranceId ? true : false;

        if (isUpdating) {
            if (!trailerInsurance.insuranceId || (trailerInsurance.insuranceId && objectSize(trailerInsurance.insuranceId) < 12)) {
                throw new BadRequestError("VALIDATION-Invalid Insurance ID");
            }
            trailerInsurance.insuranceId = mongoose.Types.ObjectId(trailerInsurance.insuranceId);
        }

        let trailerInsuranceDoc = await TrailerInsurance.findOne({ _id: trailerInsurance.insuranceId });

        if (!isUpdating && !trailerInsuranceDoc.document) {
            throw new BadRequestError("VALIDATION-Invalid Document");
        }
    
        const insuranceObj = {};
        if (trailerInsuranceDoc.document) {
            insuranceObj.document = {
                ...trailerInsuranceDoc.document,
                verified: true,
                accepted: trailerInsurance.isAccepted
            };
        }
        
        if(isUpdating) {
            await TrailerInsurance.updateOne({ _id: trailerInsurance.insuranceId }, insuranceObj);
            trailerInsuranceDoc = await TrailerInsurance.findOne({ _id: trailerInsurance.insuranceId }, { "document.accepted": 1 });
            trailerInsuranceDoc = trailerInsuranceDoc._doc;
        }
    
        res.status(200).send({
            success: true,
            message: "Successfully saved Insurance Document Verification details",
            insuranceObj: {
                insuranceId: trailerInsuranceDoc._id,
                isAccepted: trailerInsuranceDoc.document.accepted || false
            }
        });
}

module.exports = verifyInsuranceDocument;