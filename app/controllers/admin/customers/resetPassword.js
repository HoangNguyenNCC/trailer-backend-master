const mongoose = require('mongoose');

const User = require('../../../models/users');

const aclSettings = require('../../../helpers/getAccessControlList');
const {BadRequestError} = require('./../../../helpers/errors');

/**
 * 
 * @api {PUT} /admin/customer/password/reset Reset Password
 * @apiName TAAC - Reset Password
 * @apiGroup Admin App - Customer
 * 
 * 
 * @apiHeader {String} Content-Type application/json
 * 
 * 
 * @apiParam {String} token Password Reset Token
 * @apiParam {String} password Password Entered by User
 * 
 * 
 * @apiDescription API Endpoint PUT /admin/customer/password/reset
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

        const savedPassword = await User.verifyPasswordResetTokenAndSavePassword(token, password);
        if (savedPassword) {
            if (savedPassword.errors && savedPassword.errors.length > 0) {
                throw new BadRequestError(`VALIDATION-${savedPassword.errors}`);
            } else {
                res.status(200).send({
                    success: true,
                    message: "Password is reset successfully"
                });
            }
        } else {
            throw new BadRequestError("VALIDATION-Error occurred while resetting a password");
        }
}

module.exports = resetPassword;