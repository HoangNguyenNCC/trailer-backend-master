const csrf = require('csrf');

const Licensee = require('../../../models/licensees');
const Employee = require('../../../models/employees');

const redisClient = require('../../../dbs').redisClient;

const {
    BadRequestError,
    ForbiddenError,
    NotFoundError,
    UnauthorizedError,
  } = require("./../../../helpers/errors");

const stripeTokenExpirationTime = 15 * 60;


/** 
 * 
 *  
 * @api {GET} /licensee/stripe Save Stripe Account Details for Licensee
 * @apiName LA - Save Stripe Account Details for Licensee
 * @apiGroup Licensee App - Licensee Authentication
 * 
 * 
 * @apiDescription API Endpoint POST /licensee/stripe
 * 
 * 
 * @apiErrorExample {json} Error-Response:
 * HTTP/1.1 400
    {
        success: false,
        message: "Could not save Stripe Details",
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
async function saveLicenseeStripe(req, res, next) {
        const { code, state } = req.query;

        let stateMatches = false;
        if(state) {
            
        }

        // Assert the state matches the state you provided in the OAuth link (optional).
        if(!stateMatches(state)) {
            return res.status(403).json({ error: 'Incorrect state parameter: ' + state });
        }

        let error;

        // Send the authorization code to Stripe's API.
        stripe.oauth.token({
            grant_type: 'authorization_code',
            code
        }).then(
            (response) => {
                const connected_account_id = response.stripe_user_id;
                // Save connected_account_id
                

                // Render some HTML or redirect to a different page.
                return res.status(200).json({success: true});
            },
            (err) => {
                if (err.type === 'StripeInvalidGrantError') {
                    throw new ForbiddenError(`VALIDATION-Invalid authorization code : ${code}`);
                } else {
                    throw new BadRequestError("VALIDATION-An unknown error occurred");
                }
            }
        );
}

module.exports = saveLicenseeStripe;