const path = require('path');
const mongoose = require('mongoose');

const Admin = require('../../../models/adminEmployees');
const { BadRequestError } = require('../../../helpers/errors');


/** 
 * 
 *  
 * @api {GET} /admin/employee/email/verify Verify Email Id of the Customer
 * @apiName Verify Email Id of the Admin Employee
 * @apiGroup Admin App - User
 * 
 * 
 * @apiHeader {String} Content-Type application/json
 * 
 * 
 * @apiParam {String} token Token sent in the Email Link
 * 
 * 
 * @apiDescription API Endpoint GET /admin/employee/email/verify
 * 
 * 
 * @apiErrorExample {json} Error-Response:
 * HTTP/1.1 400
    {
        success: false,
        message: "Token is invalid"
    }
 * 
 * 
 * @apiSuccess {File} file HTML File
 * 
 * 
 * @apiSuccessExample {String} - Success-Response:
 * HTTP/1.1 200 OK with appropriate html file
 * 
 * 
 */
async function verifyEmail(req, res, next) {
    if (!req.query.token) {
            throw new BadRequestError("Token is required.");
        }
        const token = req.query.token;
        const verifiedUserObj = await Admin.verifyEmailVerificationToken(token);

        if(verifiedUserObj) {
            await Admin.updateOne({ _id: mongoose.Types.ObjectId(verifiedUserObj._id) }, { isEmailVerified: true });
            
            res.status(200).sendFile(path.join(__dirname, "../../../helpers/templates/email-verified.html")); //Dont Know What to change.
        } else {
            res.status(400).sendFile(path.join(__dirname, "../../../helpers/templates/email-verification-failed.html"));
        }
}

module.exports = verifyEmail;