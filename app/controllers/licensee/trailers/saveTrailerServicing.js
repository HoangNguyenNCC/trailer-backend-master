const mongoose = require('mongoose');
const moment = require('moment');
const validator = require('validator');
const fs = require('fs');

const Trailer = require('../../../models/trailers');
const UpsellItem = require('../../../models/upsellItems');
const TrailerServicing = require('../../../models/trailerServicing');

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
 * @api {POST} /servicing Save Trailer Servicing details
 * @apiName LA - Save Trailer Servicing details
 * @apiGroup Licensee App - Trailer
 *  
 * 
 * @apiHeader {String} Content-Type application/json
 * @apiHeader {String} authorization Authorization token sent as a response to signIn request
 * 
 * 
 * @apiParam {File} servicingDocument Servicing Certificate ( File )
 * 
 * @apiParam {Object} reqBody Request JSON data
 * @apiParam {String} _id Id of the Servicing record ( application to update requests only )
 * @apiParam {String} itemType Type of Item - Trailer or Upsell Item
 * @apiParam {String} itemId Id of the Trailer or Upsell Item
 * @apiParam {String} name Name of the Service
 * @apiParam {String} serviceDate Date of Servicing ( "YYYY-MM-DD" format )
 * @apiParam {String} nextDueDate Next Due Date of Servicing ( "YYYY-MM-DD" format )
 * 
 * 
 * @apiDescription API Endpoint to be used to save Trailer or Upsell Item Servicing details
 * 
 * 
 * @apiParamExample {json} Request-Example:
 * 
    curl --location --request POST 'http://trailer2you.herokuapp.com/servicing' \
    --form 'reqBody={
        "itemId": "5e58914c9d61b40017de39f8",
        "name": "Tyres-Check Tread Wear",
        "serviceDate": "2018-06-05",
        "nextDueDate": "2020-06-05"
    }' \
    --form 'servicingDocument=@/home/username/Downloads/automobile-servicing.jpg'
 * 
 * 
 * @apiErrorExample {json} Error-Response:
 * HTTP/1.1 400
 *  {
 *      success: false,
 *      message: "Error occurred while saving Trailer or Upsell Item Servicing details",
 *      errorsList: []
 *  }
 * 
 * 
 * @apiSuccess {Boolean} success Success Status
 * @apiSuccess {String} message Success Message
 * @apiSuccess {Object} servicingObj Trailer Servicing details object
 * 
 * 
 * @apiSuccessExample {String} - Success-Response:
 * HTTP/1.1 200
 * 
 * {
 *      success: true,
 *      message: "Successfully saved Trailer Servicing details",
 *      servicingObj: {
 *          _id: "", // String
 *          itemId: "", // String
 *          name: "", // String
 *          serviceDate: "", // String
 *          nextDueDate: "", // String
 *          document: "" // String, URL of the document
 *      }
 * }
 * 
 * 
 */
async function saveTrailerServicing(req, res, next) {

    const uploadedFiles = [];
    if (!req.requestFrom || !aclSettings.validateACL(req.requestFrom.acl, "SERVICING", ["ADD", "UPDATE"])) {
            throw new BadRequestError('Unauthorise Access')
        }

        let trailerServicing = req.body.reqBody;

        if(!trailerServicing) {
            throw new BadRequestError("VALIDATION-Invalid Request Body");
        }
        try{
            trailerServicing = JSON.parse(trailerServicing);
        }catch(err){

        }
        
        const servicingObj = {};

        const isUpdating = trailerServicing._id ? true : false;

        if (isUpdating) {
            if (!trailerServicing._id || (trailerServicing._id && objectSize(trailerServicing._id) < 12)) {
                throw new BadRequestError("VALIDATION-Invalid Servicing ID");
            }
            servicingObj._id = mongoose.Types.ObjectId(trailerServicing._id);
        }

        if (
            (isUpdating && (trailerServicing.itemId && objectSize(trailerServicing.itemId) < 12)) ||
            (!isUpdating && (!trailerServicing.itemId || (trailerServicing.itemId && objectSize(trailerServicing.itemId) < 12)))
        ) {
            throw new BadRequestError("VALIDATION-Invalid Item ID");
        }
        if (trailerServicing.itemId) {
            servicingObj.itemId = mongoose.Types.ObjectId(trailerServicing.itemId);
        }

        const licenseeId = req.requestFrom.licenseeId;
        let existingServicingObj;
        if(isUpdating) {
            existingServicingObj = await TrailerServicing.findOne({ _id: servicingObj._id }, { licenseeId: 1, itemType: 1 });
            existingServicingObj = existingServicingObj._doc;
            if(existingServicingObj.licenseeId) {
                if(existingServicingObj.licenseeId.toString() !== licenseeId.toString()) {
                    throw new BadRequestError('Unauthorise Access')
                }
            } else {
                servicingObj.licenseeId = licenseeId;
            }
        } else{
            servicingObj.licenseeId = licenseeId;
        }
        
        if(!trailerServicing.itemType || !["trailer", "upsellitem"].includes(trailerServicing.itemType)) {
            if(isUpdating) {
                trailerServicing.itemType = existingServicingObj.itemType; 
            } else {
                trailerServicing.itemType = "trailer";
            }
        }

        let itemObj;
        if(trailerServicing.itemType === "trailer") {
            itemObj = await Trailer.findOne({ _id: servicingObj.itemId, licenseeId: licenseeId }, { _id: 1 });
        } else if(trailerServicing.itemType === "upsellitem") {
            itemObj = await UpsellItem.findOne({ _id: servicingObj.itemId, licenseeId: licenseeId }, { _id: 1 });
        }

        if(!itemObj) {
            throw new BadRequestError('Unauthorise Access')
        }

        if (
            (isUpdating && (trailerServicing.name && validator.isEmpty(trailerServicing.name.trim()))) ||
            (!isUpdating && (!trailerServicing.name || validator.isEmpty(trailerServicing.name.trim())))
        ) {
            throw new BadRequestError("VALIDATION-Invalid Trailer or Upsell Item Name");
        }
        if (trailerServicing.name) {
            servicingObj.name = trailerServicing.name;
        }

        if (
            (isUpdating && (trailerServicing.serviceDate && validator.isEmpty(trailerServicing.serviceDate))) ||
            (!isUpdating && (!trailerServicing.serviceDate || validator.isEmpty(trailerServicing.serviceDate)))
        ) {
            throw new BadRequestError("VALIDATION-Invalid Service Date");
        }
        if (trailerServicing.serviceDate) {
            servicingObj.serviceDate = moment(trailerServicing.serviceDate).toISOString();
        }

        if (
            (isUpdating && (!trailerServicing.nextDueDate && validator.isEmpty(trailerServicing.nextDueDate) || !validator.isAfter(trailerServicing.nextDueDate))) ||
            (!isUpdating && (!trailerServicing.nextDueDate || validator.isEmpty(trailerServicing.nextDueDate) || !validator.isAfter(trailerServicing.nextDueDate)))
        ) {
            throw new BadRequestError("VALIDATION-Invalid Next Due Date");
        }
        if (trailerServicing.nextDueDate) {
            servicingObj.nextDueDate = moment(trailerServicing.nextDueDate).toISOString();
        }

        if(!isUpdating && !(req.files["servicingDocument"] && req.files["servicingDocument"].length > 0)) {
            throw new BadRequestError("VALIDATION-Invalid Document");
        }

        if(req.files["servicingDocument"] && req.files["servicingDocument"].length > 0) {
            let doc = req.files["servicingDocument"][0];
            const data = doc.location;
            const contentType = doc.mimetype;

            servicingObj.document = {
                contentType: contentType,
                data: data
            };
        }

        let trailerServicingDoc;
        if(isUpdating) {
            await TrailerServicing.updateOne({ _id: servicingObj._id }, servicingObj);
            trailerServicingDoc = await TrailerServicing.findOne({ _id: servicingObj._id });
        } else {
            trailerServicing = new TrailerServicing(servicingObj);
            trailerServicingDoc = await trailerServicing.save();
        }
        trailerServicingDoc = trailerServicingDoc._doc;
        trailerServicingDoc.serviceDate = moment(trailerServicingDoc.serviceDate).format("YYYY-MM-DD");
        trailerServicingDoc.nextDueDate = moment(trailerServicingDoc.nextDueDate).format("YYYY-MM-DD");
        trailerServicingDoc.documentAccepted = trailerServicingDoc.document.accepted;
        trailerServicingDoc.documentVerified = trailerServicingDoc.document.verified;

        res.status(200).send({
            success: true,
            message: "Successfully saved Trailer Servicing details",
            servicingObj: trailerServicingDoc
        });
}

module.exports = saveTrailerServicing;