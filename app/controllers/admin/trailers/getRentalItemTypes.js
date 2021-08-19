const RentalItemType = require('../../../models/rentalItemTypes');

const aclSettings = require('../../../helpers/getAccessControlList');
const { getSearchCondition} = require('../../../helpers/getSearchCondition');
const { BadRequestError } = require('../../../helpers/errors');

/**
 * 
 * @api {GET} /rentalitemtypes Get Rental Item Types List
 * @apiName TAAT - Get Rental Item Types List
 * @apiGroup Admin App - Trailer
 * 
 * 
 * @apiHeader {String} authorization Authorization token sent as a response to signIn request
 * 
 * 
 * @apiDescription API Endpoint GET /rentalitemtypes
 * 
 * 
 * @apiSuccessExample {String} - Success-Response:
 * HTTP/1.1 200
    {
        success: true,
        message: "Success",
        rentalItemTypes: []
    }
 * 
 * 
 * @apiErrorExample {json} Error-Response:
 * HTTP/1.1 400
    {
        success: false,
        message: "Couldn't get Rental Item Types",
        errorsList: []
    }
 * 
 * 
 */
async function getRentalItemTypes(req, res, next) {
    if(!req.requestFrom || !req.requestFrom.employeeId || !req.requestFrom.acl || !aclSettings.validateACL(req.requestFrom.acl, "TRAILER", "VIEW")) {
            throw new BadRequestError('Unauthorised Access')
        }
        let searchCondition = {}
        if(req.query && Object.keys(req.query).length >0 ){
            const filters = [{filter:"itemType", search:"itemtype"}]
            const search = [{condition:"name", search:"name"}]
            searchCondition = await getSearchCondition(req.query,search,filters)
        }
        let rentalItemTypes = await RentalItemType.find(searchCondition);

        return res.status(200).send({
            success: true,
            message: "Success",
            rentalItemTypes: rentalItemTypes
        });
}

module.exports = getRentalItemTypes;