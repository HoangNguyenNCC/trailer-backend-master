const mongoose = require('mongoose');

const RentalItemType = require('../../../models/rentalItemTypes');
const { UnauthorizedError } = require('./../../../helpers/errors');

/**
 * 
 * @api {GET} /rentalitemtypes Get Rental Item Types List
 * @apiName CA - Get Rental Item Types List
 * @apiGroup Customer App - Trailer
 * 
 * 
 * @apiHeader {String} authorization Authorization token sent as a response to signIn request
 * 
 * 
 * @apiDescription API Endpoint GET /rentalitemtypes
 * 
 * 
 * @apiSuccess {Boolean} success Success Status
 * @apiSuccess {String} message Success Message
 * @apiSuccess {Array} rentalItemTypes List of Rental Items
 * 
 * 
 * @apiSuccessExample {String} - Success-Response:
 * HTTP/1.1 200
    {
        success: true,
        message: "Success",
        rentalItemTypes: []
    }
 * 
 * 
 * @apiErrorExample {json} Error-Response:
 * HTTP/1.1 400
    {
        success: false,
        message: "Could not fetch Rental Item Types",
        errorsList: []
    }
 * 
 * 
 */
async function getRentalItemTypes(req, res) {
    if (!req.userId) throw new UnauthorizedError('UnAuthorized Access');

    let rentalItemTypes = await RentalItemType.find({ });

    return res.status(200).send({
        success: true,
        message: "Success",
        rentalItemTypes: rentalItemTypes
    });
}

module.exports = getRentalItemTypes;