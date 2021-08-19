const mongoose = require('mongoose');
const validator = require('validator');

const Trailer = require('../../../models/trailers');
const TrailerType = require('../../../models/trailerTypes');

const objectSize = require('../../../helpers/objectSize');
const rentalChargesConv = require('../../../helpers/rentalChargesConv');

const rentalChargesData = require('../../../../test/testData/rentalChargesData');
const {BadRequestError} = require('./../../../helpers/errors');

/**
 * 
 * @api {GET} /trailer/:id/rentalcharges Get Trailer Rental Charges
 * @apiName CA - Get Trailer Rental Charges
 * @apiGroup Customer App - Trailer Rental
 * 
 * 
 * @apiHeader {String} authorization Authorization token sent as a response to signIn request
 * 
 * 
 * @apiParam {String} id Trailer Id
 * 
 * 
 * @apiSuccess {Boolean} success Success Status
 * @apiSuccess {String} message Success Message
 * @apiSuccess {Object} trailerObj Object of Trailer
 * 
 * 
 * @apiDescription API Endpoint GET /trailer/{id}/rentalcharges
 * 
 * 
 * @apiSuccess {Boolean} success Success Status
 * @apiSuccess {String} message Success Message
 * @apiSuccess {Object} rentalCharges Rental Charges for a Trailer
 * 
 * 
 * @apiSuccessExample {String} - Success-Response:
 * HTTP/1.1 200 
 * 
    {
        success: true,
        message: "Success",
        rentalCharges: {
            pickUp: [ {
                duration: <Number>, // Duration in milliseconds
                charges: <Number> // Charges
            } ],
            door2Door: [ {
                duration: <Number>, // Duration in milliseconds
                charges: <Number> // Charges
            } ]
        }
    }
 * 
 * 
 * @apiErrorExample {json} Error-Response:
 * HTTP/1.1 400
    {
        success: false,
        message: "Could not fetch Trailer Rental Charges",
        errorsList: []
    }
 * 
 * 
 */
async function getTrailerRentalCharges(req, res, next) {
    const trailerId = req.params ? req.params.id : undefined;

    if (!trailerId || validator.isEmpty(trailerId) || objectSize(trailerId) < 12)
        throw new BadRequestError("Trailer ID is invalid");

    let trailer = await Trailer.findOne({ _id: mongoose.Types.ObjectId(trailerId) }).lean();

    if(trailer.adminRentalItemId) {
        let rentalItemAdminObj = await TrailerType.findOne({ _id: trailer.adminRentalItemId }, { rentalCharges: 1 });
        trailer.rentalCharges = rentalItemAdminObj._doc.rentalCharges;
    } else if(!trailer.rentalCharges) {
        trailer.rentalCharges = JSON.parse(JSON.stringify(rentalChargesData));
    }

    if (!trailer || !trailer.rentalCharges) throw new BadRequestError('Trailer not found')

    if(trailer.rentalCharges.pickUp) {
        trailer.rentalCharges.pickUp = trailer.rentalCharges.pickUp.map(charge => {
            return {
                duration: rentalChargesConv.getDurationForCalculation(charge.duration),
                charges: charge.charges
            };
        });
    }

    if(trailer.rentalCharges.door2Door) {
        trailer.rentalCharges.door2Door = trailer.rentalCharges.door2Door.map(charge => {
            return {
                duration: rentalChargesConv.getDurationForCalculation(charge.duration),
                charges: charge.charges
            };
        });
    }

    res.status(200).send({
        success: true,
        message: "Success",
        rentalCharges: trailer.rentalCharges
    });

}

module.exports = getTrailerRentalCharges;