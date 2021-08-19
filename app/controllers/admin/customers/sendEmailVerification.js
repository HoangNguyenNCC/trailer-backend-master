const mongoose = require('mongoose');
const validator = require('validator');
const dotenv = require('dotenv');

dotenv.config();
const config = process.env;

const User = require('../../../models/users');

const sendMail = require('../../../helpers/sendMail');
const aclSettings = require('../../../helpers/getAccessControlList');
const {BadRequestError} = require('./../../../helpers/errors');

/** 
 * 
 *  
 * @api {POST} /admin/customer/email/verify/resend Send Email Verification Link
 * @apiName TAAC - Send Email Verification Link
 * @apiGroup Admin App - Customer
 * 
 * 
 * @apiHeader {String} Content-Type application/json
 * 
 * 
 * @apiParam {String} customerId ID of the Customer 
 * 
 * 
 * @apiDescription API Endpoint POST /admin/customer/email/verify/resend
 * 
 * 
 * @apiErrorExample {json} Error-Response:
 * HTTP/1.1 400
    {
        success: false,
        message: "Token is invalid.""
    }
 * 
 * 
 * @apiSuccess {Boolean} success Success Status
 * @apiSuccess {String} message Success Message
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
async function sendEmailVerification(req, res, next) {
        const body = req.body;
        
        if(!body || !body.customerId) {
            throw new BadRequestError("VALIDATION-Invalid Customer Id")
        }

        let user = await User.findOne({ _id: mongoose.Types.ObjectId(body.customerId) }, { name: 1, email: 1 });
        if(user) {
            const token = await user.newEmailVerificationToken();
            user = user._doc;
            if(config.NODE_ENV !== "test") {
                const data = {
                    to: user.email,
                    template: "customer-verification-email",
                    subject: "Trailer2You - Customer Email Verification",
                    context: {
                        url: `${config.HOST}/customer/email/verify?token=${token}`,
                        name: user.name,
                        token: token
                    }
                };
                sendMail(data);
            }
        }

        res.status(200).send({
            success: true,
            message: "Success"
        });
}

module.exports = sendEmailVerification;