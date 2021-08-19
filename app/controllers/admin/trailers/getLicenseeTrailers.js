const moment = require('moment');

const Trailer = require('../../../models/trailers');
const TrailerRating = require('../../../models/trailerRatings');
const TrailerType = require('../../../models/trailerTypes');
const Invoice = require('../../../models/invoices');

const asyncForEach = require('../../../helpers/asyncForEach');
const constants = require('../../../helpers/constants');
// const { validateLicenseeTrailerFilter } = require('../../../helpers/yupValidations');
const { getSearchCondition } = require('../../../helpers/getSearchCondition');

const rentalChargesData = require('../../../../test/testData/rentalChargesData');
const { BadRequestError } = require('../../../helpers/errors');

/**
 * 
 * @api {GET} /admin/licenseeTrailers Get Trailers of a Licensee
 * @apiName Admin - Get Trailers List
 * @apiGroup Admin App - Trailer
 * 
 * 
 * @apiHeader {String} authorization Authorization token sent as a response to signIn request
 * 
 * 
 * @apiParam {String} count Count of Trailers to fetch
 * @apiParam {String} skip Number of Trailers to skip
 * @apiParam {String} id Id of the licensee
 * 
 * 
 * @apiDescription API Endpoint GET /admin/licenseeTrailers
 * 
 * 
 * @apiSuccess {Boolean} success Success Status
 * @apiSuccess {String} message Success Message
 * @apiSuccess {Array} trailersList List of Trailers
 * 
 * 
 * @apiSuccessExample {String} - Success-Response:
 * HTTP/1.1 200
    {
        success: true,
        message: "Successfully fetched Trailer data",
        trailersList: []
    }
 * 
 * Sample API Call : http://localhost:5000/trailers?count=5&skip=0&pincode=83448,1560&location=43.8477,-111.6932
 * 
 * @apiErrorExample {json} Error-Response:
 * HTTP/1.1 400
    {
        success: false,
        message: "Error occurred while fetching Trailers data",
        errorsList: []
    }
 * 
 * 
 */
async function getTrailers(req, res, next) {
    let searchCondition = {}
        if (!req.query.id) {
            throw new BadRequestError('Unauthorised Access')
          }
        if(req.query && Object.keys(req.query).length > 0){
            const filters = [{filter:"type", search:"type"},{filter:"availability", search:"availability"},{filter:"trailerModel", search:"trailerModel"},{filter:"isFeatured", search:"isFeatured"}]
            const search = [{condition:"vin", search:"vin"}]
            searchCondition = await getSearchCondition(req.query,search,filters) 
            searchCondition['licenseeId'] = req.query.id
            searchCondition['isDeleted'] = false
        }
       let {
          count: pageCount = 10,
          skip: pageSkip = 0
        } = req.query;

        if (typeof pageCount !== 'number') pageCount = parseInt(pageCount);
        if (typeof pageSkip !== 'number') pageSkip = parseInt(pageSkip);

        let trailers = await Trailer.find(searchCondition).skip(pageSkip).limit(pageCount);
        
        const currentDate = moment().toISOString();

        const trailerIds = [];
        const trailerIdsStr = [];

        trailers.forEach((trailer, trailerIndex) => {
            trailer = trailer._doc;

            const trailerId = trailer._id;
            trailerIds.push(trailerId);
            trailerIdsStr.push(trailerId.toString());

            // trailer.photos = [ getFilePath("trailer", trailerId.toString(), 1) ];
        
            trailers[trailerIndex] = trailer;
        });

        const averageRating = await TrailerRating.aggregate(
            [
                { $match: { itemId: { $in: trailerIds } } },
                { $group: { _id: "$itemId", avgRatingValue: { $avg: "$ratingValue" } } }
            ]
        ).exec();
        const outputTrailers = [];

        let ongoingInvoices = undefined;
        let upcomingInvoices = undefined;

        if(trailerIdsStr.length > 0) {

            ongoingInvoices = await Invoice.find({
                "rentedItems.itemType": "trailer",
                "rentedItems.itemId":  { $in: trailerIdsStr },
                "rentalPeriod.start": { $lte: currentDate },
                "rentalPeriod.end": { $gte: currentDate }
            }, { rentalPeriod: 1 }).sort({ "rentalPeriod.start": 1, "rentalPeriod.end": 1 });
    
            upcomingInvoices = await Invoice.find({
                "rentedItems.itemType": "trailer",
                "rentedItems.itemId":  { $in: trailerIdsStr },
                "rentalPeriod.start": { $gt: currentDate }
            }, { rentalPeriod: 1 }).sort({ "rentalPeriod.start": 1, "rentalPeriod.end": 1 }).limit(1);
        }

        await asyncForEach(trailers, async (trailer, trailerIndex) => {
            const trailerId = trailer._id.toString();
            const ratingIndex = averageRating.findIndex((rating) => {
                return (rating._id.toString() === trailerId)
            });
            const ratingValue = (ratingIndex === -1) ? 0 : averageRating[ratingIndex].avgRatingValue;
            trailer.rating = ratingValue;

            if(trailer.adminRentalItemId) {
                let rentalItemAdminObj = await TrailerType.findOne({ _id: trailer.adminRentalItemId }, { rentalCharges: 1 });
                trailer.rentalCharges = rentalItemAdminObj._doc.rentalCharges;
            } else if(!trailer.rentalCharges) {
                trailer.rentalCharges = JSON.parse(JSON.stringify(rentalChargesData));
            }
            const price = trailer.rentalCharges.door2Door.find((charges) => {
                return (charges.duration === constants.hirePeriod);
            });

            const trailerAvailability = {
                availability: true,
                ongoing: undefined,
                upcoming: undefined
            };

            if(ongoingInvoices && ongoingInvoices.length > 0) {
                ongoingInvoices.forEach((ongoingInvoice) => {
                    ongoingInvoice = ongoingInvoice._doc;
                    if(ongoingInvoice.rentedItems) {
                        ongoingInvoice.rentedItems.forEach((rentedItem) => {
                            rentedItem = rentedItem._doc;
                            if(rentedItem.itemType === "trailer" && trailerId === rentedItem.itemId.toString()) {
                                trailerAvailability.ongoing = {
                                    rentalItemId: trailerId,
                                    invoiceId: ongoingInvoice._id.toString(),
                                    startDate: moment(ongoingInvoice.rentalPeriod.start).format("YYYY-MM-DD HH:MM"),
                                    endDate: moment(ongoingInvoice.rentalPeriod.end).format("YYYY-MM-DD HH:MM")
                                };

                                trailerAvailability.availability = false;
                            }
                        });
                    }
                });
            }

            if(upcomingInvoices && upcomingInvoices.length > 0) {
                upcomingInvoices.forEach((upcomingInvoice) => {
                    upcomingInvoice = upcomingInvoice._doc;
                    if(upcomingInvoice.rentedItems) {
                        upcomingInvoice.rentedItems.forEach((rentedItem) => {
                            rentedItem = rentedItem._doc;
                            if(rentedItem.itemType === "trailer" && trailerId === rentedItem.itemId.toString()) {
                                trailerAvailability.upcoming = {
                                    rentalItemId: trailerId,
                                    invoiceId: upcomingInvoice._id.toString(),
                                    startDate: moment(upcomingInvoice.rentalPeriod.start).format("YYYY-MM-DD HH:MM"),
                                    endDate: moment(upcomingInvoice.rentalPeriod.end).format("YYYY-MM-DD HH:MM")
                                };
                            }
                        });
                    }
                });
            }

            trailer.trailerAvailability = trailerAvailability;

            outputTrailers.push(trailer);
        });

        return res.status(200).send({
            success: true,
            message: "Successfully fetched Trailers data",
            trailersList: outputTrailers
        });
    
}

module.exports = getTrailers;
