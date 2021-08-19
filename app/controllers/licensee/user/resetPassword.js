const mongoose = require('mongoose');

const Employee = require('../../../models/employees');
const {
    BadRequestError,
    ForbiddenError,
    NotFoundError,
    UnauthorizedError,
  } = require("./../../../helpers/errors");


/**
 * 
 * @api {PUT} /employee/resetpassword Reset Password
 * @apiName LA - Reset Password
 * @apiGroup Licensee App - Employee Authentication
 * 
 * 
 * @apiHeader {String} Content-Type application/json
 * 
 * 
 * @apiParam {String} token Password Reset Token
 * @apiParam {String} password Password Entered by User
 * 
 * 
 * @apiDescription API Endpoint PUT /employee/resetpassword
 * 
 * 
 * @apiSuccess {Boolean} success Success Status
 * @apiSuccess {String} message Success Message
 * 
 * 
 * @apiSuccessExample {String} - Success-Response:
 * HTTP/1.1 200 OK
 * {
 *      success: true,
 *      message: "Password is reset successfully"
 * }
 * 
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

        const savedPassword = await Employee.verifyPasswordResetTokenAndSavePassword(token, password);

        if (savedPassword) {
            if (savedPassword.errors && savedPassword.errors.length > 0) {
                throw new BadRequestError(`VALIDATION-${savedPassword.errors[0]}`);
            }
        } else {
            throw new BadRequestError("VALIDATION-Error occurred while resetting a password");
        }

        res.status(200).send({
            success: true,
            message: "Password is reset successfully"
        });
}

module.exports = resetPassword;