const mongoose = require('mongoose');

const redisClient = require('../../../dbs').redisClient;

const Invoice = require('../../../models/invoices');
const CartItemLocation = require('../../../models/cartItemLocation');

const objectSize = require('../../../helpers/objectSize');
const {
    BadRequestError,
    ForbiddenError,
    NotFoundError,
    UnauthorizedError,
    ApiError
  } = require("./../../../helpers/errors");


/** 
 * 
 * @api {GET} /rental/locations Get Rental Item Locations
 * @apiName LA - Get Rental Item Locations
 * @apiGroup Licensee App - Trailer Rental
 * 
 * 
 * @apiHeader {String} authorization Authorization token sent as a response to signIn reque
 * 
 * 
 * @apiParam {String} rentalId ID of the Rental Record for which Rental has to be tracked
 * @apiParam {String} type Tracking for "pickup" or "dropoff"
 * 
 * 
 * @apiDescription API Endpoint to be used to get Rental Item Locations
 * 
 * 
 * @apiErrorExample {json} Error-Response:
 * HTTP/1.1 400
    {
        success: false,
        message: "Error occurred while fetching Rental Item Location",
        errorsList: []
    }
 * 
 * 
 * @apiSuccess {Boolean} success Success Status
 * @apiSuccess {String} message Success Message
 * @apiSuccess {Array} locationsList List of Locations
 * 
 * 
 * @apiSuccessExample {String} - Success-Response:
 * HTTP/1.1 200 OK
 * 
    {
        success: true,
        message: "Successfully fetched Rental Item Location",
        "locationsList": [
            {
                "location": [151.2172, 33.8131],
                "_id": "5e6f799914cad8421359187b",
                "rentalId": "5e6893b03decce1dfd118021",
                "createdAt": "2020-03-16T13:05:29.121Z",
                "__v": 0
            },
            {
                "location": [150.2172, 32.8131],
                "_id": "5e6f7acfeed91842de605e9e",
                "rentalId": "5e6893b03decce1dfd118021",
                "createdAt": "2020-03-16T13:10:39.934Z",
                "__v": 0
            }
        ]
    }
 * 
 */
async function getRentalItemLocation(req, res, next) {
    let rentalItemLocation = req.query;

        if (!req.requestFrom || !req.requestFrom.licenseeId) {
            throw new ForbiddenError('Unauthorised Access')
        }

        if (!rentalItemLocation.rentalId || (rentalItemLocation.rentalId && objectSize(rentalItemLocation.rentalId) < 12)) {
            throw new BadRequestError("VALIDATION-Rental ID is invalid");
        }

        const type = rentalItemLocation.type ? rentalItemLocation.type : "dropoff";
        const licenseeId = (typeof req.requestFrom.licenseeId === 'string') ? mongoose.Types.ObjectId(req.requestFrom.licenseeId) : req.requestFrom.licenseeId;
        const rentalId = mongoose.Types.ObjectId(rentalItemLocation.rentalId);

        let existingRental = await Invoice.findOne({ _id: rentalId, licenseeId: licenseeId }, { isTrackingPickUp: 1, isTrackingDropOff: 1 });

        if(!existingRental) {
            return res.status(403).send({
                success: false,
                message: "Unauthorized Access"
            });
        }
        existingRental = existingRental._doc;

        let isTracking = false;
        if(type === "pickup") {
            isTracking = existingRental.isTrackingPickUp;
        } else if(type === "dropoff") {
            isTracking = existingRental.isTrackingDropOff;
        }

        const locationsArray = await CartItemLocation.find({ rentalId: rentalId }).sort({ createdAt: 1 });

        // ----------------------------------------------------------------

        return res.status(200).send({
            success: true,
            message: "Successfully fetched Rental Item Locations",
            isTracking: isTracking,
            locationsList: locationsArray
        });
    
}

module.exports = getRentalItemLocation;