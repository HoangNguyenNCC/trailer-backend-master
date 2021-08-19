const csrf = require('csrf');

const Licensee = require('../../../models/licensees');
const Employee = require('../../../models/employees');

const redisClient = require('../../../dbs').redisClient;

const stripeTokenExpirationTime = 15 * 60;


/** 
 * 
 *  
 * @api {GET} /licensee/state GET CSRF Token for Licensee
 * @apiName LA - GET CSRF Token for Licensee
 * @apiGroup Licensee App - Licensee Authentication
 * 
 * 
 * @apiHeader {String} Content-Type application/json
 * @apiHeader {String} authorization Licensee Auth Token
 * 
 * 
 * @apiDescription API Endpoint POST /licensee/state
 * 
 * 
 * @apiErrorExample {json} Error-Response:
 * HTTP/1.1 400
    {
        success: false,
        message: "Error occurred while generating State",
        errorsList: []
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
        message: "Successfully fetched generated State",
        state: ""
    }
 * 
 * 
 */
async function getLicenseeState() {
    try {
        if (!req.requestFrom) {
            return res.status(403).send({
                success: false,
                message: "Unauthorized Access"
            });
        }

        if (!req.requestFrom.isOwner) {
            throw new Error("VALIDATION-Request for Inviting Employee is received from Unauthorized source");
        }

        const licenseeIdStr = req.requestFrom.licenseeId.toString();
        // const licenseeIdStr = "5e623885b14a033dee5beb5a";

        const secret = await csrf.secret();
        const token = csrf.create(secret);

        redisClient.hgetall(`licensee-stripe-${token}`, function(err, licenseeToken) {

            redisClient.hmset(`licensee-stripe-${token}`, "licenseeId", licenseeIdStr, function(err, savedLicenseeToken) {
            });
            redisClient.expire(`licensee-stripe-${token}`, stripeTokenExpirationTime);
        });
    } catch (err) {

        let errorCode = 500;
        let errors = [];
        let errorMessage = "Error occurred while generating State";

        if (err && err.name && ["MongoError", "ValidationError"].includes(err.name) && err.message) {
            errorCode = 400;
            if(err.code && err.code === 11000 && err.keyValue) {
                const keys = Object.keys(err.keyValue);
                const values = Object.values(err.keyValue);
                errorMessage = `Duplicate Key Error on { ${keys[0]}: ${values[0]} }`;
                errors.push(errorMessage);
            } else {
                errorMessage = err.message;
                errors.push(errorMessage);
            }
        } else if (err && err.message) {
            errorCode = err.message.startsWith("VALIDATION-") ? 400 : 500;
            const errorComp = err.message.split("VALIDATION-");
            errorMessage = errorComp.length > 1 ? errorComp[1] : errorComp[0];
            errors.push(errorMessage);
        } else if (err && err.errors) {
            errorCode = 400;
            const fieldKeys = Object.keys(err.errors);
            fieldKeys.forEach((fieldKey) => {
                if (fieldKey.split(".").length === 1) {
                    errors.push(err.errors[fieldKey].message);
                    if(err.errors[fieldKey].message) {
                        errorMessage = err.errors[fieldKey].message;
                    }
                }
            });
        } else {
            if(err) {
                errorMessage = err;
            }
            errors.push(err);
        }

        return res.status(errorCode).send({
            success: false,
            message: errorMessage,
            errorsList: errors
        });
    }
}

module.exports = getLicenseeState;