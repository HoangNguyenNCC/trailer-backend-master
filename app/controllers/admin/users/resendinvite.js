const axios = require('axios');
const sendMail = require('../../../helpers/sendMail');
const AdminEmployee = require('../../../models/adminEmployees');
const dotenv = require('dotenv');
dotenv.config();
const config = process.env;
/** 
 * 
 *  
 * @api {POST} /admin/employee/invite/resend Admin Employee Invite Resend
 * @apiName TAAU - Admin Employee Resend Invite
 * @apiGroup Admin App - AdminUser
 * 
 * 
 * @apiHeader {String} Content-Type application/json
 * 
 * 
 * @apiParam {String} email Email Entered By Employee
 * @apiParam {Array} acl Access Control List
 * 
 * 
 * @apiDescription API Endpoint POST /admin/employee/invite/resend 
 * 
 * 
 * Request Headers
 * - 'Content-Type: application/json'
 * 
 * Request Body ( Example )  ( request.body )
 * 
 *  {
 *      "email": "user1@gmail.com",
 *      "acl": { "TRAILER" : [ "VIEW" ], "UPSELL" : [ "VIEW" ] }
 *  }
 * 
 * @apiErrorExample {json} Error-Response:
 * HTTP/1.1 400
    {
        success: false,
        message: "Error occurred while sending an Invitation to Employee",
        errorsList: []
    }
 * 
 * 
 * @apiSuccessExample {String} - Success-Response:
 * HTTP/1.1 200 OK
 * 
    {
        success: true,
        message: "Successfully sent an Invitation to Employee"
    }
 * 
 * 
 */

const resendinvite = async function(req,res,next){
  let email = req.body.email
       let employee = await AdminEmployee.findOne({email:email})
       if(employee){
        const token = await employee.newEmployeeInviteToken();

        employee = employee._doc;  // Fetching the data of employee whose email id is is DB

        if(config.NODE_ENV !== "test") {
            const data = {
                to: employee.email,
                template: "admin-employee-invitation-email",
                subject: "Trailer2You - Admin Employee Invitation Token",
                context: {
                    url: `${config.ADMIN_PANEL_HOST}/employee/invite/accept?token=${token}`,
                    firstName: "User",
                    token: token
                }
            };
            sendMail(data);
        }

        res.status(200).send({
            success: true,
            message: "Successfully sent an Invitation to an Admin Employee",
            token: token,
            employeeObj: employee
        });
       }
       else{
        const resData = await axios.post('/admin/employee/invite',req.body)
        res.send(resData);
       }
}
module.exports = resendinvite;