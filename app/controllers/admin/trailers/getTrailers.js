const mongoose = require('mongoose');

const TrailerType = require('../../../models/trailerTypes');

const getFilePath = require('../../../helpers/getFilePath');
const constants = require('../../../helpers/constants');

const aclSettings = require('../../../helpers/getAccessControlList');
const { getSearchCondition } = require('../../../helpers/getSearchCondition');
const { BadRequestError } = require('../../../helpers/errors');

/**
 * 
 * @api {GET} /admin/trailers Get Trailer Type List
 * @apiName TAAT - Get Trailer Type List
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
 * API Endpoint GET /admin/trailers
 * 
 * 
 * @apiSuccessExample {String} - Success-Response:
 * HTTP/1.1 200
    {
        success: true,
        message: "Success",
        trailersList: []
    }
 * 
 * Sample API Call : http://localhost:5000/admin/trailers?count=5&skip=0
 * 
 * @apiErrorExample {json} Error-Response:
 * HTTP/1.1 400
    {
        success: false,
        message: "Error occurred while fetching Trailer Types data",
        errorsList: []
    }
 * 
 * 
 */
async function getTrailers(req, res, next) {
    if(!req.requestFrom || !req.requestFrom.employeeId || !req.requestFrom.acl || !aclSettings.validateACL(req.requestFrom.acl, "TRAILER", "VIEW")) {
        throw new BadRequestError('Unauthorised Access')
        }
        let searchCondition = {};
        if(req.query && Object.keys(req.query).length > 0){
            const search = [{condition:"type", search:"type"},{condition:"trailerModel", search:"name"}]
            const filters = [{filter:"availability", search:"availability"}]
            searchCondition = await getSearchCondition(req.query,search,filters)
        }
        
        const pageCount = (req.query && req.query.count) ? parseInt(req.query.count) : constants.pageCount;
        const pageSkip = (req.query && req.query.skip) ? parseInt(req.query.skip) : constants.pageSkip;

        // const projectFields = TrailerType.getAllFieldsWithExistsFile();
        // let trailers = await TrailerType.aggregate([
        //     { $match:  searchCondition }, 
        //     { $project: projectFields },
        //     { $skip: pageSkip },
        //     { $limit: pageCount }
        // ]);

        const trailers = await TrailerType.find(searchCondition).skip(pageSkip).limit(pageCount);
        const totalCount = await TrailerType.countDocuments({});

        // trailers.forEach((trailer, trailerIndex) => {
        //     if(!trailer) {
        //         throw new BadRequestError("VALIDATION-Could not find Trailer Type");
        //     }

        //     let photos = [];
        //     for(let photoIndex = 0; photoIndex < trailer.photos; photoIndex++) {
        //         photos.push(
        //             getFilePath("trailertype", trailer._id.toString(), (photoIndex + 1))
        //         );
        //     }
        //     trailers[trailerIndex].photos = photos;
        // });

        return res.status(200).send({
            success: true,
            message: "Success",
            trailersList: trailers,
            totalCount: totalCount
        });
}

module.exports = getTrailers;