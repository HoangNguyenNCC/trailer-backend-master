const RentalItemType = require('../../../models/rentalItemTypes');
const TrailerTypes = require('../../../models/trailerTypes');

const { UnauthorizedError } = require('./../../../helpers/errors');

/**
 * 
 * @api {GET} /rentalitemfilters Get Filters List
 * @apiName CA - Get Filters List
 * @apiGroup Customer App - Trailer
 * 
 * 
 * @apiHeader {String} authorization Authorization token sent as a response to signIn request
 * 
 * 
 * @apiDescription API Endpoint GET /rentalitemfilters
 * 
 * 
 * @apiSuccess {Boolean} success Success Status
 * @apiSuccess {String} message Success Message
 * @apiSuccess {Object} filtersObj Object of Filters
 * @apiSuccess {Array} trailerTypesList List of Trailer Types
 * @apiSuccess {Array} upsellItemTypesList List of Upsell Items Types
 * @apiSuccess {Array} deliveryTypeList List of Delivery Types
 * 
 * 
 * @apiSuccessExample {String} - Success-Response:
 * HTTP/1.1 200
    {
        success: true,
        message: "Success",
        filtersObj: {
            trailerTypesList: [],
            upsellItemTypesList: [],
            deliveryTypeList: []
        }
    }
 * 
 * 
 * @apiErrorExample {json} Error-Response:
 * HTTP/1.1 400
    {
        success: false,
        message: "Could not get Rental Item Filters",
        errorsList: []
    }
 * 
 * 
 */
async function getRentalItemFilters(req, res, next) {
    if (!req.userId) throw new UnauthorizedError('UnAuthorized Access');

    let filters = {
        trailerTypesList: [],
        upsellItemTypesList: [],
        deliveryTypesList: [
            {
                name: "Pickup and Drop",
                code: "pickup"
            },
            {
                name: "Door 2 Door",
                code: "door2Door"
            }
        ],
        trailerModelList: []
    };

    let rentalItemTypes = await RentalItemType.find({}).lean();
    let trailerTypes = await TrailerTypes.find({}).lean();

    rentalItemTypes.forEach((rentalItemType) => {
        if(rentalItemType.itemtype === "trailer") {
            filters.trailerTypesList.push({
                name: rentalItemType.name,
                code: rentalItemType.code                    
            });
        } else if(rentalItemType.itemtype === "upsellitem") {
            filters.upsellItemTypesList.push({
                name: rentalItemType.name,
                code: rentalItemType.code                    
            });
        }
    });

    filters.trailerModelList = trailerTypes.map(trailerType => ({
        name: trailerType.name,
        code: trailerType._id
    }));

    return res.status(200).send({
        success: true,
        message: "Success",
        filtersObj: filters
    });
}

module.exports = getRentalItemFilters;