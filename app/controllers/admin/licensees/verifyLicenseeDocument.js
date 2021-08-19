const mongoose = require('mongoose');

const Licensee = require('../../../models/licensees');

const objectSize = require('../../../helpers/objectSize');

const aclSettings = require('../../../helpers/getAccessControlList');
const { BadRequestError } = require('../../../helpers/errors');


/** 
 * 
 * @api {PUT} /admin/licensee/verify/proofofincorporation Save Licensee Proof Of Incorporation Document Verification details
 * @apiName TAAL - Save Licensee Proof Of Incorporation Document Verification details
 * @apiGroup Admin App - Licensee
 * 
 * 
 * @apiHeader {String} Content-Type application/json
 * @apiHeader {String} authorization Authorization token sent as a response to signIn request
 * 
 * 
 * @apiParam {String} licenseeId Id of the Licensee record, for edit request only
 * @apiParam {String} isAccepted Whether Licensee Document is Accepted
 * 
 * 
 * @apiDescription API Endpoint to be used to save Licensee Document Verification details
 * 
 * 
 * @apiErrorExample {json} Error-Response:
 * HTTP/1.1 400
 *  {
 *      success: false,
 *      message: "Error occurred while saving Licensee Document Verification details",
 *      errorsList: []
 *  }
 * 
 * 
 * @apiSuccessExample {String} - Success-Response:
 * HTTP/1.1 200
 * 
 * {
 *      success: true,
 *      message: "Successfully saved Licensee Document Verification details"
 * }
 * 
 * 
 */
async function verifyLicenseeDocument(req, res, next) {
   let licensee = req.body;
        // if (!req.requestFrom || !req.requestFrom.acl || !req.requestFrom.acl.includes("UPDATE_SERVICING")) {
        if(!req.requestFrom || !req.requestFrom.employeeId || !req.requestFrom.acl || !aclSettings.validateACL(req.requestFrom.acl, "DOCUMENTS", "UPDATE")) {
            throw new BadRequestError('Unauthorised Access')
        }

        const isUpdating = licensee.licenseeId ? true : false;

        if (isUpdating) {
            if (!licensee.licenseeId || (licensee.licenseeId && objectSize(licensee.licenseeId) < 12)) {
                throw new BadRequestError("VALIDATION-Invalid Licensee ID");
            }
            licensee.licenseeId = mongoose.Types.ObjectId(licensee.licenseeId);
        }

        let licenseeDoc = await Licensee.findOne({ _id: licensee.licenseeId }, { proofOfIncorporation: 1 });

        if (!isUpdating && !licenseeDoc.proofOfIncorporation) {
            throw new BadRequestError("VALIDATION-Invalid Document");
        }
    
        const licenseeObj = {};
        if(licenseeDoc.proofOfIncorporation) {
            licenseeObj.proofOfIncorporation = {
                ...licenseeDoc.proofOfIncorporation,
                verified: true,
                accepted: licensee.isAccepted
            };
        }    
        if(isUpdating) {
            await Licensee.updateOne({ _id: licensee.licenseeId }, licenseeObj);
            licenseeDoc = await Licensee.findOne({ _id: licensee.licenseeId }, { proofOfIncorporation: 1 });
            licenseeDoc = licenseeDoc._doc;
        }
    
        res.status(200).send({
            success: true,
            message: "Successfully saved Licensee Document Verification details",
            licenseeObj: {
                _id: licenseeDoc._id,
                isAccepted: licenseeDoc.proofOfIncorporation.accepted
            }
        });
}

module.exports = verifyLicenseeDocument;