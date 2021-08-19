const mongoose = require('mongoose');
const { BadRequestError } = require('../../../helpers/errors');

const AdminEmployee = require('../../../models/adminEmployees');
/**
 * 
 * @api {PUT} /admin/employee/resetpassword Reset Password of Admin Employee
 * @apiName TAAU - Reset Password of Admin Employee
 * @apiGroup Admin App - AdminUser
 * 
 * @apiHeader {String} Content-Type application/json
 * 
 * @apiParam {String} token Password Reset Token
 * @apiParam {String} password Password Entered by Employee
 * 
 * @apiDescription 
 * 
 * API Endpoint PUT /admin/employee/resetpassword
 * 
 * 
 * @apiSuccessExample {String} - Success-Response:
 * HTTP/1.1 200 OK
 * {
 *      success: true,
 *      message: "Password is reset successfully"
 * }
 * 
 * @apiErrorExample {json} Error-Response:
 * HTTP/1.1 400
 *  {
 *      success: false,
 *      message: "Error occurred while resetting a password",
 *      errorsList: []
 *  }
 * 
 * 
 */
async function resetPassword(req, res, next) {
    const token = req.body.token;
        const password = req.body.password;

        const savedPassword = await AdminEmployee.verifyPasswordResetTokenAndSavePassword(token, password);

        if (savedPassword) {
            if (savedPassword.errors && savedPassword.errors.length > 0) {
                throw new BadRequestError(`VALIDATION-${savedPassword.errors[0]}`);
            }
        } else {
            throw new BadRequestError("Error occurred while resetting a password");
        }

        res.status(200).send({
            success: true,
            message: "Password is reset successfully"
        });
}

module.exports = resetPassword;