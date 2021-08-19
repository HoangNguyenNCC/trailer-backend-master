const UpsellItemType = require('../../../models/upsellItemTypes');

const constants = require('../../../helpers/constants');
const { getSearchCondition } = require('../../../helpers/getSearchCondition');


const aclSettings = require('../../../helpers/getAccessControlList');
const{BadRequestError} = require('../../../helpers/errors');
/**
 * 
 * @api {GET} /admin/upsellitems Get Upsell Item Type List
 * @apiName TAAT - Get Upsell Item Type List
 * @apiGroup Admin App - Trailer
 * 
 * 
 * @apiHeader {String} authorization Authorization token sent as a response to signIn request
 * 
 * 
 * @apiParam {String} count Count of Trailers to fetch
 * @apiParam {String} skip Number of Trailers to skip
 * 
 * 
 * @apiDescription 
 * 
 * API Endpoint GET /admin/upsellitems
 * 
 * 
 * @apiSuccessExample {String} - Success-Response:
 * HTTP/1.1 200
    {
        success: true,
        message: "Success",
        upsellItemsList: []
    }
 * 
 * Sample API Call : http://localhost:5000/admin/upsellitems?count=5&skip=0
 * 
 * @apiErrorExample {json} Error-Response:
 * HTTP/1.1 400
    {
        success: false,
        message: "Error occurred while fetching Upsell Item Types data",
        errorsList: []
    }
 * 
 * 
 */
async function getUpsellItemTypes(req, res, next) {
    if(!req.requestFrom || !req.requestFrom.employeeId || !req.requestFrom.acl || !aclSettings.validateACL(req.requestFrom.acl, "UPSELL", "VIEW")) {
        throw new BadRequestError('Unauthorised Access')
        }
        let searchCondition = {}
        const pageCount = (req.query && req.query.count) ? parseInt(req.query.count) : constants.pageCount;
        const pageSkip = (req.query && req.query.skip) ? parseInt(req.query.skip) : constants.pageSkip;
        if(req.query && Object.keys(req.query).length > 0){
            const filters = [{filter:"availability", search:"availability"}]
            const search = [{condition:"type", search:"type"}]
            searchCondition = await getSearchCondition(req.query,search,filters)
            console.log(searchCondition)
        }

        const upsellItems = await UpsellItemType.find(searchCondition).skip(pageSkip).limit(pageCount);;
        const totalCount = await UpsellItemType.countDocuments({});

        return res.status(200).send({
            success: true,
            message: "Success",
            upsellItemsList: upsellItems,
            totalCount: totalCount
        });
    
}

module.exports = getUpsellItemTypes;