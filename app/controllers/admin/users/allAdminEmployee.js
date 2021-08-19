const Admin = require('../../../models/adminEmployees')
const{BadRequestError} = require('../../../helpers/errors');
/** 
 * 
 *  
 * @api {GET} /admin/all Get all Admin Employees
 * @apiName TAAU - Get all Admin Employees
 * @apiGroup Admin App - Admin User
 * 
 * 
 * @apiHeader {String} Content-Type application/json
 * @apiHeader {String} Authorization Authorization Token
 * 
 * 
 * @apiDescription API Endpoint GET /admin/all
 * 
 * 
 * @apiErrorExample {json} Error-Response:
 * HTTP/1.1 400
    {
        success: false,
        message: "Error occurred while fetching Admins List",
        errorsList: []
    }
 * 
 * 
 * @apiSuccessExample {String} - Success-Response:
 * HTTP/1.1 200 OK
 * 
    {
        success: true,
        message: "Successfully fetched Admins List",
        employeeList: []
    }
 * 
 * 
 */


const getAllAdmins = async function(req,res,next){
    const employees = await Admin.find({acceptedInvite : true , isMobileVerified : true , isEmailVerified : true, isOwner : true})
        if(!employees){
            throw new BadRequestError('Unauthorised Access')
        }
        else{
            res.status(200).send({
                success : true,
                 message: "Successfully fetched Admins List",
                employeeList : employees
            })
        }
}

module.exports = getAllAdmins