const mongoose = require('mongoose');

const Invoice = require('../../../models/invoices');
const CartItemLocation = require('../../../models/cartItemLocation');

const objectSize = require('../../../helpers/objectSize');
const { UnauthorizedError, BadRequestError } = require('../../../helpers/errors');

/** 
 * 
 * @api {POST} /user/rental/location Save Rental Item Location
 * @apiName CA - Save Rental Item Location
 * @apiGroup Customer App - Trailer Rental
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
        if(!req.userId) throw new UnauthorizedError('UnAuthorized Access');
    
        let rentalItemLocation = req.body;

        if (!rentalItemLocation.rentalId || (rentalItemLocation.rentalId && objectSize(rentalItemLocation.rentalId) < 12)) {
            throw new BadRequestError("Rental ID is invalid");
        }

        const rentalId = mongoose.Types.ObjectId(rentalItemLocation.rentalId);

        const rentalFetchCondition = { _id: rentalId, bookedByUserId: req.userId };
    
        let savedRental = await Invoice.findOne(rentalFetchCondition, { isTrackingPickUp: 1, isTrackingDropOff: 1 });

        if(!savedRental) throw new UnauthorizedError('UnAuthorized Access');
        savedRental = savedRental._doc;

        if(rentalItemLocation.type === "pickup" && !savedRental.isTrackingPickUp) {
            throw new BadRequestError("Start tracking a Pickup before updating location");
        }
        if(rentalItemLocation.type === "dropoff" && !savedRental.isTrackingDropOff) {
            throw new BadRequestError("Start tracking a Dropoff before updating location");
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