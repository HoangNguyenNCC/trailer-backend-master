const mongoose = require('mongoose');

const TrailerServicing = require('../../../models/trailerServicing');

const objectSize = require('../../../helpers/objectSize');

const aclSettings = require('../../../helpers/getAccessControlList');
const { BadRequestError } = require('../../../helpers/errors');


/** 
 * 
 * @api {PUT} /admin/licensee/verify/servicing Save Servicing Document Verification details
 * @apiName TAAL - Save Servicing Document Verification details
 * @apiGroup Admin App - LicenseeTrailer
 *  
 * 
 * @apiHeader {String} Content-Type application/json
 * @apiHeader {String} authorization Authorization token sent as a response to signIn request
 * 
 * 
 * @apiParam {String} servicingId Id of the Servicing record, for edit request only
 * @apiParam {String} isAccepted Whether Servicing Document is Accepted
 * 
 * 
 * @apiDescription API Endpoint to be used to save Servicing Document Verification details
 * 
 * 
 * @apiErrorExample {json} Error-Response:
 * HTTP/1.1 400
 *  {
 *      success: false,
 *      message: "Error occurred while saving Servicing Document Verification details",
 *      errorsList: []
 *  }
 * 
 * 
 * @apiSuccessExample {String} - Success-Response:
 * HTTP/1.1 200
 * 
 * {
 *      success: true,
 *      message: "Successfully saved Servicing Document Verification details"
 * }
 * 
 * 
 */
async function verifyServicingDocument(req, res, next) {
   let trailerServicing = req.body;

        // if (!req.requestFrom || !req.requestFrom.acl || !req.requestFrom.acl.includes("UPDATE_SERVICING")) {
        if(!req.requestFrom || !req.requestFrom.employeeId || !req.requestFrom.acl || !aclSettings.validateACL(req.requestFrom.acl, "DOCUMENTS", "UPDATE")) {
            throw new BadRequestError('Unauthorised Access')
        }

        const isUpdating = trailerServicing.servicingId ? true : false;

        if (isUpdating) {
            if (!trailerServicing.servicingId || (trailerServicing.servicingId && objectSize(trailerServicing.servicingId) < 12)) {
                throw new BadRequestError("VALIDATION-Invalid Servicing ID");
            }
            trailerServicing.servicingId = mongoose.Types.ObjectId(trailerServicing.servicingId);
        }

        let trailerServicingDoc = await TrailerServicing.findOne({ _id: trailerServicing.servicingId });

        if (!isUpdating && !trailerServicingDoc.document) {
            throw new BadRequestError("VALIDATION-Invalid Document");
        }
    
        const servicingObj = {};
        if (trailerServicingDoc.document) {
            servicingObj.document = {
                ...trailerServicingDoc.document,
                verified: true,
                accepted: trailerServicing.isAccepted
            };
        }
        
        if(isUpdating) {
            await TrailerServicing.updateOne({ _id: trailerServicing.servicingId }, servicingObj);
            trailerServicingDoc = await TrailerServicing.findOne({ _id: trailerServicing.servicingId }, { "document.accepted": 1 });
            trailerServicingDoc = trailerServicingDoc._doc;
        }
    
        res.status(200).send({
            success: true,
            message: "Successfully saved Servicing Document Verification details",
            servicingObj: {
                _id: trailerServicingDoc._id,
                isAccepted: trailerServicingDoc.document.accepted || false
            }
        });
}

module.exports = verifyServicingDocument;