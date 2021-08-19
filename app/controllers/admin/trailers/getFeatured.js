const TrailerType = require('../../../models/trailerTypes');
const UpsellItemType = require('../../../models/upsellItemTypes');

const aclSettings = require('../../../helpers/getAccessControlList');
const { BadRequestError } = require('../../../helpers/errors');

/**
 * 
 * @api {GET} /featured Get Featured Trailers and Upsell Items
 * @apiName TAAT - Get Featured Trailers and Upsell Items
 * @apiGroup Admin App - Trailer
 * 
 * 
 * @apiHeader {String} authorization Authorization token sent as a response to signIn request
 * 
 * 
 * @apiDescription API Endpoint GET /featured
 * 
 * 
 * @apiSuccessExample {String} - Success-Response:
 * HTTP/1.1 200
    {
        success: true,
        message: "Success",
        trailers: []
    }
 * 
 * 
 * @apiErrorExample {json} Error-Response:
 * HTTP/1.1 400
    {
        success: false,
        message: "Couldn't get trailers",
        errorsList: []
    }
 * 
 * 
 */
async function getFeatured(req, res, next) {
    if(!req.requestFrom || !req.requestFrom.employeeId || !req.requestFrom.acl || !aclSettings.validateACL(req.requestFrom.acl, "TRAILER", "VIEW")) {
            throw new BadRequestError('Unauthorised Access')
        }

        let trailers = await TrailerType.find({isFeatured: true}).exec();
 
        let upsellItems = await UpsellItemType.find({isFeatured: true}).exec();

        const rentalItems = [
            ...trailers,
            ...upsellItems
        ]

        return res.status(200).send({
            success: true,
            message: "Success",
            trailers: rentalItems
        });
    
}

module.exports = getFeatured;