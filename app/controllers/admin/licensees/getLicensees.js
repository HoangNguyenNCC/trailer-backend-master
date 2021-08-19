const Licensee = require('../../../models/licensees');
// const { validatePersonSchema , validateLicenseeFilter } = require('../../../helpers/yupValidations');
const { getSearchCondition } = require('../../../helpers/getSearchCondition');
const constants = require('../../../helpers/constants');

const aclSettings = require('../../../helpers/getAccessControlList');
const { BadRequestError } = require('../../../helpers/errors');

/**
 * 
 * @api {GET} /admin/licensees Get Licensees List
 * @apiName TAAL - Get Licensees List
 * @apiGroup Admin App - Licensee
 * 
 * 
 * @apiHeader {String} authorization Authorization token sent as a response to signIn reque
 * 
 * 
 * @apiParam {String} count Count of Trailers to fetch
 * @apiParam {String} skip Number of Trailers to skip
 * 
 * 
 * @apiDescription 
 * 
 * API Endpoint GET /admin/licensees
 * 
 * 
 * @apiSuccessExample {String} - Success-Response:
 * HTTP/1.1 200
    {
        success: true,
        message: "Successfully fetched Licensee List",
        licenseeList: []
    }
 * 
 * 
 * Sample API Call : http://localhost:5000/admin/licensees?count=10&skip=0
 * 
 * @apiErrorExample {json} Error-Response:
 * HTTP/1.1 400
    {
        success: false,
        message: "Error occurred while fetching Licensee List",
        errorsList: []
    }
 * 
 * 
 */
async function getLicensee(req, res, next) {
   if(!req.requestFrom || !req.requestFrom.employeeId || !req.requestFrom.acl || !aclSettings.validateACL(req.requestFrom.acl, "LICENSEE", "VIEW")) {
            throw new BadRequestError('Unauthorised Access')
        }
        let searchCondition = {}
        if(req.query && Object.keys(req.query).length > 0){
            const filters = [{filter:"emailVerified", search:"isEmailVerified"},{filter:"mobileVerified", search:"isMobileVerified"},{filter:"state", search:"driverLicense.state"},{filter:"businessType", search:"businessType"},{filter:"proofOfIncorporationValid", search:"proofOfIncorporation.accepted"}]
            const search = [{condition:"email", search:"email"},{condition:"mobile", search:"mobile"}]
            searchCondition = await getSearchCondition(req.query,search,filters)
            if(searchCondition.mobile){
                searchCondition['mobile']  = `+${searchCondition.mobile}` 
             }
        }
        const pageCount = req.query.count ? parseInt(req.query.count) : constants.pageCount;
        const pageSkip = req.query.skip ? parseInt(req.query.skip) : constants.pageSkip;


        /* const licensees = await Licensee.find({}, licenseeProj)
            .sort({ updatedAt: -1 })
            .skip(pageSkip)
            .limit(pageCount); */
        // const licensees = await Licensee.aggregate([
        //     { $match: {} },
        //     { $skip: pageSkip },
        //     { $limit: pageCount }
        // ]).exec();
        const licensees = await Licensee.find(searchCondition).skip(pageSkip).limit(pageCount).lean();

        // licensees.forEach((licensee, licenseeIndex) => {
        //     // licensee = licensee._doc;
    
        //     if(licensee.proofOfIncorporation) {
        //         licensee.proofOfIncorporation.verified = licensee.proofOfIncorporation.verified || false;
        //         licensee.proofOfIncorporation.accepted = licensee.proofOfIncorporation.accepted || false;
        //         if(licensee.proofOfIncorporation.documentType) {
        //             licensee.proofOfIncorporation.documentType = licensee.proofOfIncorporation.documentType.split("/")[1];
        //         }
        //         licensee.proofOfIncorporation.scan = licensee.proofOfIncorporation.data;
        //     }

        //     licensees[licenseeIndex] = licensee;
        // });

        const totalCount = await Licensee.countDocuments();

        res.status(200).send({
            success: true,
            message: "Successfully fetched Licensee List",
            licenseeList: licensees,
            totalCount: totalCount
        });
    
}

module.exports = getLicensee;
