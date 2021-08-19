const aclSettings = require('../../../helpers/getAccessControlListAdmin');


/**
 * 
 * @api {GET} /admin/employee/acl Get Access Control List for Admin App
 * @apiName TAAU - Get Access Control List for Admin App
 * @apiGroup Admin App - AdminUser
 * 
 * 
 * @apiDescription 
 * 
 * API Endpoint GET /admin/employee/acl
 * 
 * 
 * @apiSuccessExample {String} - Success-Response:
 * HTTP/1.1 200 
    {
        success: true,
        message: "Successfully fetched Access Control List",
        accessControlList: {
            "ADMINEMPLOYEE": ["ADD", "VIEW", "UPDATE", "DELETE"],
            "LICENSEE": ["ADD", "VIEW", "UPDATE", "DELETE"],
            "LICENSEEEMPLOYEE": ["ADD", "VIEW", "UPDATE", "DELETE"],
            "TRAILER": ["ADD", "VIEW", "UPDATE", "DELETE"],
            "UPSELL": ["ADD", "VIEW", "UPDATE", "DELETE"],
            "INSURANCE": ["ADD", "VIEW", "UPDATE", "DELETE"],
            "SERVICING": ["ADD", "VIEW", "UPDATE", "DELETE"],
            "REMINDERS": ["ADD", "VIEW", "UPDATE", "DELETE"],
            "FINANCIALS": ["ADD", "VIEW", "UPDATE", "DELETE"],
            "PAYMENTS": ["ADD", "VIEW", "UPDATE", "DELETE"],
            "DOCUMENTS": ["ADD", "VIEW", "UPDATE", "DELETE"],
            "RENTALSTATUS": ["ADD", "VIEW", "UPDATE", "DELETE"],
            "BLOCK": ["ADD", "VIEW", "UPDATE", "DELETE"],
            "RENTALS": ["ADD", "VIEW", "UPDATE", "DELETE"],
            "CUSTOMERS": ["ADD", "VIEW", "UPDATE", "DELETE"]
        }
 * 
 * @apiErrorExample {json} Error-Response:
 * HTTP/1.1 400
    {
        success: false,
        message: "Error occurred while fetching Access Control List",
        errorsList: []
    }
 * 
 * 
 * 
 */
async function getAccessControlList(req, res, next) {
        return res.status(200).send({
            success: true,
            message: "Successfully fetched Access Control List",
            accessControlList: aclSettings.accessControlListAdminApps
        });
};

module.exports = getAccessControlList;