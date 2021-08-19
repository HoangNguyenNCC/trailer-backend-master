const mongoose = require('mongoose');
const moment = require('moment');
const validator = require('validator');
const dotenv = require('dotenv');

const User = require('../../../models/users');

dotenv.config();
const config = process.env;

const aclSettings = require('../../../helpers/getAccessControlList');
const {BadRequestError} = require('./../../../helpers/errors');

/** 
 * 
 * @api {PUT} /admin/customer/password/change Change Customer Password
 * @apiName TAAC - Change Customer Password
 * @apiGroup Admin App - Customer
 * 
 * 
 * @apiHeader {String} Content-Type application/json
 * @apiHeader {String} authorization Authorization token sent as a response to signIn request
 * 
 * @apiParam {String} customerId ID of the Customer
 * @apiParam {String} oldPassword Old Password
 * @apiParam {String} newPassword New Password
 * 
 * 
 * @apiDescription API Endpoint PUT /admin/customer/password/change
 * 
 * 
 * @apiSuccess {Boolean} success Success Status
 * @apiSuccess {String} message Success Message
 * 
 * 
 * @apiErrorExample {json} Error-Response:
 * HTTP/1.1 400
    {
        success: false,
        message: "Could not change password",
        errorsList: []
    }
 * 
 * 
 * @apiSuccessExample {String} - Success-Response:
 * HTTP/1.1 200 OK
 * 
    {
        success: true,
        message: "Success"
    }
 * 
 * 
 */
async function changePassword(req, res, next) {
    let body = req.body;

        if(!req.requestFrom || !req.requestFrom.employeeId || !req.requestFrom.acl || !aclSettings.validateACL(req.requestFrom.acl, "CUSTOMERS", "UPDATE")) {
            throw new BadRequestError('Unauthorised Access')
        }
        const userId = mongoose.Types.ObjectId(body.customerId);

        if(!body.oldPassword) {
            throw new BadRequestError("VALIDATION-Old Password should not be empty");
        }

        if(!body.newPassword) {
            throw new BadRequestError("VALIDATION-New Password should not be empty");
        }

        let user = await User.findOne({ _id: userId }, { email: 1 });
        if(user) {
            user = user._doc;
            let checkResult = await User.checkValidCredentials(user.email, body.oldPassword);
            if (checkResult.errors) {
                throw new BadRequestError("VALIDATION-Old Password is Invalid");
            } else {
                await User.updateOne({ _id: userId }, { password: body.newPassword });
            }
        } else {
            throw new BadRequestError("VALIDATION-Could not find User");
        }

        res.status(200).send({
            success: true,
            message: "Successfully updated password!"
        });
}

module.exports = changePassword;