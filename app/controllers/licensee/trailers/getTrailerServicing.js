const mongoose = require('mongoose');

const Trailer = require('../../../models/trailers');
const UpsellItem = require('../../../models/upsellItems');
const TrailerServicing = require('../../../models/trailerServicing');

const aclSettings = require('../../../helpers/getAccessControlList');
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
 * @api {GET} /servicing Get Trailer Servicing List
 * @apiName LA - Get Trailer Servicing List
 * @apiGroup Licensee App - Trailer
 * 
 * 
 * @apiHeader {String} authorization Authorization token sent as a response to signIn reque
 * 
 * 
 * @apiParam {String} itemId Id of the trailer
 * @apiParam {String} count Count of Trailers to fetch
 * @apiParam {String} skip Number of Trailers to skip
 * 
 * 
 * @apiDescription API Endpoint GET /servicing
 * 
 * 
 * @apiSuccess {Boolean} success Success Status
 * @apiSuccess {String} message Success Message
 * @apiSuccess {Array} servicingList List of Trailer Servicing records
 * 
 * 
 * @apiSuccessExample {String} - Success-Response:
 * HTTP/1.1 200
    {
        success: true,
        message: "Successfully fetched Trailer Servicing List",
        servicingList: []
    }
 * 
 * 
 * Sample API Call : http://localhost:5000/trailers?count=5&skip=0&pincode=83448,1560&location=-111.6932,43.8477
 * 
 * @apiErrorExample {json} Error-Response:
 * HTTP/1.1 400
    {
        success: false,
        message: "Error occurred while fetching Trailer Servicing List",
        errorsList: []
    }
 * 
 * 
 */
async function getTrailerServicing(req, res, next) {
    if (req.query) {
        
            if (!req.requestFrom || !aclSettings.validateACL(req.requestFrom.acl, "SERVICING", "VIEW") || !req.requestFrom.licenseeId) {
                throw new ForbiddenError('Unauthorised Access')
            }

            let itemId = req.query.itemId;
            if (!itemId || (itemId && objectSize(itemId) < 12)) {
                throw new BadRequestError("VALIDATION-Invalid Trailer ID");
            } else {
                itemId = mongoose.Types.ObjectId(itemId);
            }
            const licenseeId = (typeof req.requestFrom.licenseeId === 'string') ? mongoose.Types.ObjectId(req.requestFrom.licenseeId) : req.requestFrom.licenseeId;
        
            let itemObj;
            itemObj = await Trailer.findOne({ _id: itemId, licenseeId: licenseeId }, { _id: 1 });
            if(!itemObj) {
                itemObj = await UpsellItem.findOne({ _id: itemId, licenseeId: licenseeId }, { _id: 1 });
            }
    
            if(!itemObj) {
                throw new UnauthorizedError('Unauthorised Error')
            }

            const pageCount = req.query.count ? parseInt(req.query.count) : constants.pageCount;
            const pageSkip = req.query.skip ? parseInt(req.query.skip) : constants.pageSkip;

            const trailerServicing = await TrailerServicing.find({ itemId: itemId })
                .skip(pageSkip)
                .limit(pageCount);

            trailerServicing.forEach((servicing, index) => {
                servicing = servicing._doc;

                servicing.documentAccepted = servicing.document.accepted;
                servicing.documentVerified = servicing.document.verified;

                trailerServicing[index] = servicing;
            });

            res.status(200).send({
                success: true,
                message: "Successfully fetched Trailer Servicing List",
                servicingList: trailerServicing
            });
        } else {
            throw new NotFoundError("VALIDATION-No Trailer ID specified");
        }
}

module.exports = getTrailerServicing;