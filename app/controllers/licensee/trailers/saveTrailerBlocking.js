const mongoose = require('mongoose');
const validator = require('validator');
const moment = require('moment');

const Trailer = require('../../../models/trailers');
const UpsellItem = require('../../../models/upsellItems');
const TrailerBlocking = require('../../../models/trailerBlocking');

const aclSettings = require('../../../helpers/getAccessControlList');
const objectMinusKeys = require('../../../helpers/objectMinusKeys');
const objectSize = require('../../../helpers/objectSize');
const asyncForEach = require('../../../helpers/asyncForEach');
const {
    BadRequestError,
    ForbiddenError,
    NotFoundError,
    UnauthorizedError,
    ApiError
  } = require("./../../../helpers/errors");

/** 
 * 
 * @api {POST} /trailer/block Block the Trailer
 * @apiName LA - Block the Trailer
 * @apiGroup Licensee App - Trailer
 *  
 * 
 * @apiHeader {String} Content-Type application/json
 * @apiHeader {String} authorization Authorization token sent as a response to signIn request
 * 
 * 
 * @apiParam {String} _id Id of the Trailer Blocking Time record ( for update requests only )
 * @apiParam {Array} items Array of Items
 * @apiParam {String} items[itemType] Type of Item - Trailer or Upsell Item
 * @apiParam {String} items[itemId] Id of the Trailer or Upsell Item
 * @apiParam {Number} items[units] Number of Units of Upsell Items to be blocked
 * @apiParam {String} startDate Start Date of Blocking Period ( "YYYY-MM-DD HH:mm" )
 * @apiParam {String} endDate End Date of Blocking Period ( "YYYY-MM-DD HH:mm" )
 * @apiParam {Boolean} isDeleted Whether to delete Trailer Blocking Record ( false || true )
 * 
 * 
 * @apiDescription API Endpoint to be used to save Trailer Blocking details
 * 
 * 
 * @apiErrorExample {json} Error-Response:
 * HTTP/1.1 400
 *  {
 *      success: false,
 *      message: "Could not save Trailer Blocking details",
 *      errorsList: []
 *  }
 * 
 * 
 * @apiSuccess {Boolean} success Success Status
 * @apiSuccess {String} message Success Message
 * @apiSuccess {Object} trailerBlockedObj Blocked Trailer details object
 * 
 * 
 * @apiSuccessExample {String} - Success-Response:
 * HTTP/1.1 200
 * 
 * {
 *      success: true,
 *      message: "Success",
 *      trailerBlockedObj: {}
 * }
 * 
 * 
 */
async function saveTrailerBlockingData(req, res, next) {
    let trailerBlocking = req.body;

        if(!req.requestFrom || !aclSettings.validateACL(req.requestFrom.acl, "BLOCK", ["ADD", "UPDATE"])) {
            throw new BadRequestError('Unauthorise Access')
        }

        if(trailerBlocking.isDeleted && (!req.requestFrom || !aclSettings.validateACL(req.requestFrom.acl, "BLOCK", ["DELETE"]))) {
            throw new BadRequestError('Unauthorise Access')
        }

        const blockingObj = {};

        const isUpdating = trailerBlocking._id ? true : false;

        if (isUpdating) {
            if (!trailerBlocking._id || (trailerBlocking._id && objectSize(trailerBlocking._id) < 12)) {
                throw new BadRequestError("VALIDATION-Invalid Trailer Blocking ID");
            }
            blockingObj._id = mongoose.Types.ObjectId(trailerBlocking._id);
        }

        const licenseeId = req.requestFrom.licenseeId;
        let existingBlockingObj;
        if(isUpdating) {
            existingBlockingObj = await TrailerBlocking.findOne({ _id: blockingObj._id }, { licenseeId: 1 });
            existingBlockingObj = existingBlockingObj._doc;
            if(existingBlockingObj.licenseeId) {
                if(existingBlockingObj.licenseeId.toString() !== licenseeId.toString()) {
                    throw new BadRequestError('Unauthorise Access')
                }
            } else{
                blockingObj.licenseeId = licenseeId;
            }
        } else{
            blockingObj.licenseeId = licenseeId;
        }

        await asyncForEach(trailerBlocking.items, async(trailerBlockingItem, itemIndex) => {
            if (
                (isUpdating && (trailerBlockingItem.itemId && objectSize(trailerBlockingItem.itemId) < 12)) ||
                (!isUpdating && (!trailerBlockingItem.itemId || (trailerBlockingItem.itemId && objectSize(trailerBlockingItem.itemId) < 12)))
            ) {
                throw new BadRequestError("VALIDATION-Invalid Item ID");
            }
            if (trailerBlockingItem.itemId) {
                trailerBlockingItem.itemId = mongoose.Types.ObjectId(trailerBlockingItem.itemId);
            }
        
            if(!trailerBlockingItem.itemType || !["trailer", "upsellitem"].includes(trailerBlockingItem.itemType)) {
                if(isUpdating) {
                    trailerBlockingItem.itemType = existingBlockingObj.itemType; 
                } else {
                    trailerBlockingItem.itemType = "trailer";
                }
            }

            let itemObj;
            if(trailerBlockingItem.itemType === "trailer") {
                itemObj = await Trailer.findOne({ _id: trailerBlockingItem.itemId, licenseeId: licenseeId }, { _id: 1 });
            } else if(trailerBlockingItem.itemType === "upsellitem") {
                itemObj = await UpsellItem.findOne({ _id: trailerBlockingItem.itemId, licenseeId: licenseeId }, { _id: 1 });
            }

            trailerBlocking.items[itemIndex] = trailerBlockingItem;

            if(!itemObj) {
                return res.status(403).send({
                    success: false,
                    message: "Unauthorized Access"
                });
            }
        });

        blockingObj.items = [...trailerBlocking.items];

        if(trailerBlocking.startDate && trailerBlocking.endDate) {
            const nowTimeMS = (moment()).valueOf();
            const blockingPeriodStartMS = (moment(trailerBlocking.startDate)).valueOf();
            const savedBlockingPeriodStartMS = existingBlockingObj ? (moment(savedtrailerBlocking.startDate)).valueOf() : 0;

            const blockingPeriodEndMS = (moment(trailerBlocking.endDate)).valueOf();
            const savedBlockingPeriodEndMS = existingBlockingObj ? (moment(savedtrailerBlocking.endDate)).valueOf() : 0;

            if (nowTimeMS > blockingPeriodStartMS && (!existingBlockingObj || (blockingPeriodStartMS !== savedBlockingPeriodStartMS))) {
                throw new BadRequestError("VALIDATION-Invalid Blocking Period Start Date");
            }

            if (nowTimeMS > blockingPeriodEndMS && (!existingBlockingObj || (blockingPeriodEndMS !== savedBlockingPeriodEndMS))) {
                throw new BadRequestError("VALIDATION-Invalid Blocking Period End Date");
            }

            if (blockingPeriodStartMS > blockingPeriodEndMS) {
                throw new BadRequestError("VALIDATION-Blocking Period Start Date should be earlier than Blocking Period End Date");
            }

            blockingObj.startDate = trailerBlocking.startDate;
            blockingObj.endDate = trailerBlocking.endDate;
        } else if(!isUpdating) {
            if (!trailerBlocking.startDate) {
                throw new BadRequestError("VALIDATION-Invalid Blocking Period Start Date");
            }
            if (!trailerBlocking.endDate) {
                throw new BadRequestError("VALIDATION-Invalid Blocking Period End Date");
            }
        }

        if(trailerBlocking.isDeleted) {
            blockingObj.isDeleted = true;
        }

        let trailerBlockingDoc;
        if(isUpdating) {
            await TrailerBlocking.updateOne({ _id: blockingObj._id }, blockingObj);
            trailerBlockingDoc = await TrailerBlocking.findOne({ _id: blockingObj._id });
        } else {
            trailerBlocking = new TrailerBlocking(blockingObj);
            trailerBlockingDoc = await trailerBlocking.save();
        }
        trailerBlockingDoc = trailerBlockingDoc._doc;

        trailerBlockingDoc.startDate = moment(trailerBlockingDoc.startDate).format("YYYY-MM-DD HH:mm");
        trailerBlockingDoc.endDate = moment(trailerBlockingDoc.endDate).format("YYYY-MM-DD HH:mm");

        res.status(200).send({
            success: true,
            message: "Success",
            blockingObj: trailerBlockingDoc
        });
}

module.exports = saveTrailerBlockingData;