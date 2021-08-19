const Commission = require('../../../models/commissions');

const constants = require('../../../helpers/constants');


/**
 * 
 * @api {GET} /commissions Get Trailer or Upsell Item Commission data
 * @apiName TAAT - Get Trailer or Upsell Item Commission data
 * @apiGroup Admin App - Trailer
 * 
 * 
 * @apiParam {String} type Type of Item - "trailer" or "upsellitem"
 * @apiParam {String} count Count of Commission data to fetch
 * @apiParam {String} skip Number of Commission data to skip
 * 
 * @apiDescription 
 * 
 * API Endpoint GET /commissions data
 * 
 * 
 * @apiSuccessExample {String} - Success-Response:
 * HTTP/1.1 200
    {
        success: true,
        message: "Successfully fetched Commission data",
        commissionsList: [
            {
                _id: '5e4fa796c6091d40ee15aa91',
                itemId: '5e4fa796c6091d40ee15aa8f',
                itemType: 'trailer',
                chargeType: 'flat',
                charge: 10
            },
            {
                _id: '5e4fa796c6091d40ee15aa91',
                itemId: '5e4fa796c6091d40ee15aa8f',
                itemType: 'trailer',
                chargeType: 'percentage',
                charge: 10
            }
        ]
    }
 * 
 * Sample API Call : http://localhost:5000/commissions?type=trailer&count=5&skip=0
 * 
 * @apiErrorExample {json} Error-Response:
 * HTTP/1.1 400
    {
        success: false,
        message: "Error occurred while fetching Commission data",
        errorsList: []
    }
 * 
 * 
 */
async function getCommissions(req, res, next) {
    const errors = [];
    const searchCondition = {};
        const pageCount = (req.query && req.query.count) ? parseInt(req.query.count) : constants.pageCount;
        const pageSkip = (req.query && req.query.skip) ? parseInt(req.query.skip) : constants.pageSkip;
        const itemType = (req.query && req.query.type) ? req.query.type.toLowerCase() : "trailer";

        const currentDate = new Date();

        searchCondition['itemType'] = itemType;

        let commissions = await Commission.find(searchCondition)
            .skip(pageSkip)
            .limit(pageCount);

        return res.status(200).send({
            success: true,
            message: "Successfully fetched Commission data",
            commissionsList: commissions
        });
}

module.exports = getCommissions;