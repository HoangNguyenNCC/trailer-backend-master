const mongoose = require('mongoose');
const moment = require('moment');
const validator = require('validator');
const fs = require('fs');

const Trailer = require('../../../models/trailers');
const UpsellItem = require('../../../models/upsellItems');
const TrailerInsurance = require('../../../models/trailerInsurance');

const aclSettings = require('../../../helpers/getAccessControlList');
const objectMinusKeys = require('../../../helpers/objectMinusKeys');
const objectSize = require('../../../helpers/objectSize');
const constants = require('../../../helpers/constants');
const {
    BadRequestError,
    ForbiddenError,
    NotFoundError,
    UnauthorizedError,
    ApiError
  } = require("./../../../helpers/errors");

/** 
 * 
 * @api {POST} /insurance Save Trailer Insurance details
 * @apiName LA - Save Trailer Insurance details
 * @apiGroup Licensee App - Trailer
 *  
 * 
 * @apiHeader {String} Content-Type application/json
 * @apiHeader {String} authorization Authorization token sent as a response to signIn request
 * 
 * 
 * @apiParam {File} insuranceDocument Insurance Certificate ( File )
 * 
 * @apiParam {Object} reqBody Request JSON data
 * @apiParam {String} _id Id of the Insurance record ( application to update requests only )
 * @apiParam {String} itemType Type of Item - Trailer or Upsell Item
 * @apiParam {String} itemId Id of the Trailer or Upsell Item
 * @apiParam {String} issueDate Date of Insurance Issue ( "YYYY-MM-DD" format )
 * @apiParam {String} expiryDate Date of Insurance Expiry ( "YYYY-MM-DD" format )
 * 
 * 
 * @apiDescription API Endpoint to be used to save Trailer Insurance details
 * 
 * 
 * @apiParamExample {json} Request-Example:
 * 
    curl --location --request POST 'http://trailer2you.herokuapp.com/insurance' \
    --form 'reqBody={
        "itemId": "5e58914c9d61b40017de39f8",
        "name": "Vehicle Insurance",
        "issueDate": "2019-05-01",
        "expiryDate": "2020-05-01"
    }' \
    --form 'insuranceDocument=@/home/username/Downloads/automobile-insurance.jpg'
 * 
 * 
 * @apiErrorExample {json} Error-Response:
 * HTTP/1.1 400
 *  {
 *      success: false,
 *      message: "Error occurred while saving Trailer Insurance details",
 *      errorsList: []
 *  }
 * 
 * 
 * @apiSuccess {Boolean} success Success Status
 * @apiSuccess {String} message Success Message
 * @apiSuccess {Object} insuranceObj Trailer Insurance details object
 * 
 * 
 * @apiSuccessExample {String} - Success-Response:
 * HTTP/1.1 200
 * 
 * {
 *      success: true,
 *      message: "Successfully saved Trailer Insurance details",
 *      insuranceObj: {
 *          _id: "", // String
 *          itemId: "", // String
 *          name: "", // String
 *          issueDate: "", // String
 *          expiryDate: "", // String
 *          document: "" // String, URL of the document
 *      }
 * }
 * 
 * 
 */
async function saveTrailerInsurance(req, res, next) {

    const uploadedFiles = [];

    if(!req.requestFrom || !aclSettings.validateACL(req.requestFrom.acl, "INSURANCE", ["ADD", "UPDATE"])) {
        throw new BadRequestError('Unauthorise Access')
        }

        let trailerInsurance = req.body.reqBody;

        if(!trailerInsurance) {
            throw new BadRequestError("VALIDATION-Invalid Request Body");
        }

        // trailer = JSON.parse(JSON.stringify(trailer));
        try{
            trailerInsurance = JSON.parse(trailerInsurance);
        }catch(err){

        }

        const insuranceObj = {};

        const isUpdating = trailerInsurance._id ? true : false;

        if (isUpdating) {
            if (!trailerInsurance._id || (trailerInsurance._id && objectSize(trailerInsurance._id) < 12)) {
                throw new BadRequestError("VALIDATION-Invalid Insurance ID");
            }
            insuranceObj._id = mongoose.Types.ObjectId(trailerInsurance._id);
        }

        if (
            (isUpdating && (trailerInsurance.itemId && objectSize(trailerInsurance.itemId) < 12)) ||
            (!isUpdating && (!trailerInsurance.itemId || (trailerInsurance.itemId && objectSize(trailerInsurance.itemId) < 12)))
        ) {
            throw new BadRequestError("VALIDATION-Invalid Item ID");
        }
        if (trailerInsurance.itemId) {
            insuranceObj.itemId = mongoose.Types.ObjectId(trailerInsurance.itemId);
        }

        const licenseeId = req.requestFrom.licenseeId;
        let existingInsuranceObj;
        if(isUpdating) {
            existingInsuranceObj = await TrailerInsurance.findOne({ _id: insuranceObj._id }, { licenseeId: 1, itemType: 1 });
            existingInsuranceObj = existingInsuranceObj._doc;
            if(existingInsuranceObj.licenseeId) {
                if(existingInsuranceObj.licenseeId.toString() !== licenseeId.toString()) {
                    throw new BadRequestError('Unauthorise Access')
                }
            } else{
                insuranceObj.licenseeId = licenseeId;
            }
        } else{
            insuranceObj.licenseeId = licenseeId;
        }
        
        if(!trailerInsurance.itemType || !["trailer", "upsellitem"].includes(trailerInsurance.itemType)) {
            if(isUpdating) {
                trailerInsurance.itemType = existingInsuranceObj.itemType; 
                console.log('type', {existingInsuranceObj});
            } else {
                trailerInsurance.itemType = "trailer";
            }
        }

        console.log({type: trailerInsurance.itemType});

        let itemObj;
        if(trailerInsurance.itemType === "trailer") {
            itemObj = await Trailer.findOne({ _id: insuranceObj.itemId, licenseeId: licenseeId }, { _id: 1 });
        } else if(trailerInsurance.itemType === "upsellitem") {
            itemObj = await UpsellItem.findOne({ _id: insuranceObj.itemId, licenseeId: licenseeId }, { _id: 1 });
        }

        console.log({itemObj});

        if(!itemObj) {
            return res.status(403).send({
                success: false,
                message: "Unauthorized Access"
            });
        }

        if (
            (isUpdating && (trailerInsurance.issueDate && validator.isEmpty(trailerInsurance.issueDate))) ||
            (!isUpdating && (!trailerInsurance.issueDate || validator.isEmpty(trailerInsurance.issueDate)))
        ) {
            throw new BadRequestError("VALIDATION-Invalid Issue Date");
        }
        if (trailerInsurance.issueDate) {
            insuranceObj.issueDate = moment(trailerInsurance.issueDate).toISOString();
        }

        if (
            (isUpdating && (!trailerInsurance.expiryDate && validator.isEmpty(trailerInsurance.expiryDate) || !validator.isAfter(trailerInsurance.expiryDate))) ||
            (!isUpdating && (!trailerInsurance.expiryDate || validator.isEmpty(trailerInsurance.expiryDate) || !validator.isAfter(trailerInsurance.expiryDate)))
        ) {
            throw new BadRequestError("VALIDATION-Invalid Expiry Date");
        }
        if (trailerInsurance.expiryDate) {
            insuranceObj.expiryDate = moment(trailerInsurance.expiryDate).toISOString();
        }

        if(!isUpdating && !(req.files["insuranceDocument"] && req.files["insuranceDocument"].length > 0)) {
            throw new BadRequestError("VALIDATION-Invalid Document");
        }

        if(req.files["insuranceDocument"] && req.files["insuranceDocument"].length > 0) {
            let doc = req.files["insuranceDocument"][0];
            const data = doc.location;
            const contentType = doc.mimetype;

            insuranceObj.document = {
                contentType: contentType,
                data: data
            };
        }

        uploadedFiles.forEach((filePath) => {
            if(fs.existsSync(filePath)) {
                fs.unlinkSync(filePath);
            }
        });

        let trailerInsuranceDoc;
        if(isUpdating) {
            await TrailerInsurance.updateOne({ _id: insuranceObj._id }, insuranceObj);

            const insuranceProj = TrailerInsurance.getAllFieldsExceptFile();
            trailerInsuranceDoc = await TrailerInsurance.findOne({ _id: insuranceObj._id }, insuranceProj);
        } else {
            trailerInsurance = new TrailerInsurance(insuranceObj);
            trailerInsuranceDoc = await trailerInsurance.save();
        }
        trailerInsuranceDoc = trailerInsuranceDoc._doc;
        trailerInsuranceDoc.issueDate = moment(trailerInsuranceDoc.issueDate).format("YYYY-MM-DD");
        trailerInsuranceDoc.expiryDate = moment(trailerInsuranceDoc.expiryDate).format("YYYY-MM-DD");
        trailerInsurance.documentAccepted = trailerInsuranceDoc.document.accepted;
        trailerInsurance.documentVerified = trailerInsuranceDoc.document.verified;

        res.status(200).send({
            success: true,
            message: "Successfully saved Trailer Insurance details",
            insuranceObj: trailerInsuranceDoc
        });
}

module.exports = saveTrailerInsurance;
