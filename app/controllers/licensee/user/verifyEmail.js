const path = require('path');
const mongoose = require('mongoose');
const dotenv = require('dotenv');

const Licensee = require('../../../models/licensees');
const Employee = require('../../../models/employees');

const {
    BadRequestError,
    ForbiddenError,
    NotFoundError,
    UnauthorizedError,
    ApiError
  } = require("./../../../helpers/errors");

dotenv.config();
const config = process.env;

/** 
 * 
 *  
 * @api {GET} /licensee/email/verify Verify Email Id of the Licensee
 * @apiName LA - Verify Email Id of the Licensee
 * @apiGroup Licensee App - Licensee Authentication
 * 
 * 
 * @apiHeader {String} Content-Type application/json
 * 
 * 
 * @apiParam {String} token Token sent in the Email Link
 * 
 * 
 * @apiDescription API Endpoint GET /licensee/email/verify
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
 * @apiSuccess {File} file HTML File with Email Verification Status Message
 * 
 * 
 */
async function verifyEmail(req, res, next) {
        if (!req.query) {
            throw new BadRequestError("VALIDATION-Token is invalid.");
        }

        const token = req.query.token;
        const verifiedUserObj = Licensee.verifyEmailVerificationToken(token);

        if(verifiedUserObj) {
            await Licensee.updateOne({ _id: mongoose.Types.ObjectId(verifiedUserObj._id) }, { isEmailVerified: true });
            const licensee = await Licensee.findOne({ _id: mongoose.Types.ObjectId(verifiedUserObj._id) }, { email: 1 });
            await Employee.updateOne({ email: licensee.email, licenseeId: licensee._id }, { isEmailVerified: true });

            res.status(200).sendFile(path.join(__dirname, "../../../helpers/templates/email-verified.html"));
        } else {
            res.status(400).sendFile(path.join(__dirname, "../../../helpers/templates/email-verification-failed.html"));
        }
}

module.exports = verifyEmail;