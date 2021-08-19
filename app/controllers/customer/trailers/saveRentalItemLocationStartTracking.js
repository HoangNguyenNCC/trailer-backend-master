const mongoose = require('mongoose');

const Invoice = require('../../../models/invoices');

const objectSize = require('../../../helpers/objectSize');
const { UnauthorizedError, BadRequestError } = require('../../../helpers/errors');

/** 
 * 
 * @api {POST} /user/rental/location/track Save Rental Item Location Tracking Start data
 * @apiName CA - Save Rental Item Location Tracking Start data
 * @apiGroup Customer App - Trailer Rental
 * 
 * 
 * @apiHeader {String} Content-Type application/json
 * @apiHeader {String} authorization Authorization token sent as a response to signIn request
 * 
 * 
 * @apiParam {String} rentalId Rental/invoice ID
 * @apiParam {String} type Tracking for "pickup" or "dropoff"
 * @apiParam {String} action Tracking Action ( "start" or "end" )
 * 
 * 
 * @apiDescription API Endpoint to be used to save Rental Item Location Tracking Start data
 * 
 * 
 * @apiErrorExample {json} Error-Response:
 * HTTP/1.1 400
    {
        success: false,
        message: "Error occurred while saving Rental Item Location Tracking Start data",
        errorsList: []
    }
 * 
 * 
 * @apiSuccess {Boolean} success Success Status
 * @apiSuccess {String} message Success Message
 * @apiSuccess {Object} locationObj Location object having pickUpLocation or dropOffLocation
 * 
 * 
 * @apiSuccessExample {String} - Success-Response:
 * HTTP/1.1 200 OK
 * 
    {
        success: true,
        message: "Success",
        locationObj: {}
    }
 * 
 * 
 */
async function saveRentalItemLocationStartTracking(req, res, next) {

        if(!req.userId) throw new UnauthorizedError('UnAuthorized Access');
    
        let rentalItemLocationTracking = req.body;

        if (!rentalItemLocationTracking.rentalId || (rentalItemLocationTracking.rentalId && objectSize(rentalItemLocationTracking.rentalId) < 12)) {
            throw new BadRequestError("Rental ID is invalid");
        }

        const action = rentalItemLocationTracking.action ? rentalItemLocationTracking.action : "start";
        const rentalId = mongoose.Types.ObjectId(rentalItemLocationTracking.rentalId);
        let savedRental = await Invoice.findOne({ _id: rentalId, bookedByUserId: req.userId }, { pickUpLocation:1, dropOffLocation: 1 });

        if(!savedRental) throw new UnauthorizedError('UnAuthorized Access');
        savedRental = savedRental._doc;

        const cartItemUpdateObj = {};
        const locationObj = {};
        if(rentalItemLocationTracking.type === "pickup") {
            locationObj.pickUpLocation = savedRental.pickUpLocation;
        } else if(rentalItemLocationTracking.type === "dropoff") {
            locationObj.dropOffLocation = savedRental.dropOffLocation;
        } else {
            locationObj.dropOffLocation = savedRental.dropOffLocation;
        }

        if(rentalItemLocationTracking.type === "pickup") {
            if(action === "start") {
                cartItemUpdateObj.isTrackingPickUp = true;
            } else if(action === "end") {
                cartItemUpdateObj.isTrackingPickUp = false;
            }
        } else {
            if(action === "start") {
                cartItemUpdateObj.isTrackingDropOff = true;
            } else if(action === "end") {
                cartItemUpdateObj.isTrackingDropOff = false;
            }
        }

        await Invoice.updateOne({ _id: rentalId }, cartItemUpdateObj);

        res.status(200).send({
            success: true,
            message: "Success",
            locationObj: locationObj
        });
}

module.exports = saveRentalItemLocationStartTracking;