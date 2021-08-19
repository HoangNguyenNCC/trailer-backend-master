const mongoose = require('mongoose');
const moment = require('moment');

const redisClient = require('../../../dbs').redisClient;

const Invoice = require('../../../models/invoices');
const CartItemLocation = require('../../../models/cartItemLocation');
const {
    BadRequestError,
    ForbiddenError,
    NotFoundError,
    UnauthorizedError,
    ApiError
  } = require("./../../../helpers/errors");

const objectSize = require('../../../helpers/objectSize');


/** 
 * 
 * @api {POST} /rental/location Save Rental Item Location
 * @apiName LA - Save Rental Item Location
 * @apiGroup Licensee App - Trailer Rental
 * 
 * 
 * @apiHeader {String} Content-Type application/json
 * @apiHeader {String} authorization Authorization token sent as a response to signIn request
 * 
 * 
 * @apiParam {String} rentalId Rental/invoice ID
 * @apiParam {String} location Location Coordinates [latitude, longitude]
 * @apiParam {String} type Tracking for "pickup" or "dropoff"
 * 
 * 
 * @apiDescription API Endpoint to be used to save Rental Item Location
 * 
 * 
 * @apiErrorExample {json} Error-Response:
 * HTTP/1.1 400
    {
        success: false,
        message: "Error occurred while updating Rental Item Location",
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
        message: "Successfully updated Rental Item Location"
    }
 * 
 * 
 */
async function saveRentalItemLocation(req, res, next) {
   if (!req.requestFrom || !req.requestFrom.licenseeId || !req.requestFrom.employeeId) {
            throw new ForbiddenError('Unauthorised Access')
        }
    
        let rentalItemLocation = req.body;

        if (!rentalItemLocation.rentalId || (rentalItemLocation.rentalId && objectSize(rentalItemLocation.rentalId) < 12)) {
            throw new BadRequestError("VALIDATION-Rental ID is invalid");
        }

        const rentalId = mongoose.Types.ObjectId(rentalItemLocation.rentalId);
        const licenseeId = (typeof req.requestFrom.licenseeId === 'string') ? mongoose.Types.ObjectId(req.requestFrom.licenseeId) : req.requestFrom.licenseeId;

        const rentalFetchCondition = { _id: rentalId, licenseeId: licenseeId };

        if(rentalItemLocation.type === "pickup") {
            rentalFetchCondition.pickUpEmployeeId = req.requestFrom.employeeId;
        } else if(rentalItemLocation.type === "dropoff") {
            rentalFetchCondition.dropOffEmployeeId = req.requestFrom.employeeId;
        } else {
            rentalFetchCondition.dropOffEmployeeId = req.requestFrom.employeeId;
        }

        let savedRental = await Invoice.findOne(rentalFetchCondition, { isTrackingPickUp: 1, isTrackingDropOff: 1 });

        if(!savedRental) {
            return res.status(403).send({
                success: false,
                message: "Unauthorized Access"
            });
        }
        savedRental = savedRental._doc;

        if(rentalItemLocation.type === "pickup" && !savedRental.isTrackingPickUp) {
            throw new BadRequestError("VALIDATION-Start tracking a Pickup before updating location");
        }
        if(rentalItemLocation.type === "dropoff" && !savedRental.isTrackingDropOff) {
            throw new BadRequestError("VALIDATION-Start tracking a Dropoff before updating location");
        }

        const rentalLocation = new CartItemLocation({
            rentalId: rentalId,
            location: [rentalItemLocation.location[1], rentalItemLocation.location[0]]
        });

        await rentalLocation.save();

        res.status(200).send({
            success: true,
            message: "Successfully updated Rental Item Location",
        });
        
}

module.exports = saveRentalItemLocation;