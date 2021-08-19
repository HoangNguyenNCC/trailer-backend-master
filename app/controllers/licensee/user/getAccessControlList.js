const aclSettings = require('../../../helpers/getAccessControlList');


/**
 * 
 * @api {GET} /licensee/employee/acl Get Access Control List
 * @apiName LA - Get Access Control List
 * @apiGroup Licensee App - Employee
 * 
 * 
 * @apiDescription API Endpoint GET /licensee/employee/acl
 * 
 * 
 * @apiSuccess {Boolean} success Success Status
 * @apiSuccess {String} message Success Message
 * @apiSuccess {Object} accessControlList Object with Access Control details of logged in employee
 * 
 * 
 * @apiSuccessExample {String} - Success-Response:
 * HTTP/1.1 200 
    {
        success: true,
        message: "Success",
        accessControlList: {
            "TRAILER": ["ADD", "VIEW", "UPDATE"],
            "UPSELL": ["ADD", "VIEW", "UPDATE"],
            "INSURANCE": ["ADD", "VIEW", "UPDATE"],
            "SERVICING": ["ADD", "VIEW", "UPDATE"],
            "REMINDERS": ["VIEW"],
            "FINANCIALS": ["VIEW"],
            "DOCUMENTS": ["VIEW"]
        }
    }
 * 
 * @apiErrorExample {json} Error-Response:
 * HTTP/1.1 400
    {
        success: false,
        message: "Could not fetch Access Control List",
        errorsList: []
    }
 * 
 * 
 */
async function getAccessControlList(req, res, next) {

        return res.status(200).send({
            success: true,
            message: "Success",
            accessControlList: aclSettings.accessControlListApps
        });
    
};

module.exports = getAccessControlList;