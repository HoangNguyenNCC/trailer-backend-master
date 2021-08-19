const mongoose = require('mongoose');
const moment = require('moment');

const Invoice = require('../../../models/invoices')
const LicenseePayout = require('../../../models/licenseePayouts');
const Trailer = require('../../../models/trailers');
const getFinanceStats = require('../../../helpers/getFinancials');

const aclSettings = require('../../../helpers/getAccessControlList');
const asyncForEach = require('../../../helpers/asyncForEach');
const {
    BadRequestError,
    ForbiddenError,
    NotFoundError,
    UnauthorizedError,
    ApiError
  } = require("./../../../helpers/errors");


/**
 * 
 * @api {GET} /licensee/financial Get the Financial Summary of Trailer Rentals
 * @apiName LA - Get the Financial Summary of Trailer Rentals
 * @apiGroup Licensee App - Trailer
 * 
 * 
 * @apiHeader {String} authorization Authorization token sent as a response to signIn request
 * 
 * @apiParam {String} startDate Start Date of the period for which Financial Summary has to be calculated
 * @apiParam {String} endDate End Date of the period for which Financial Summary has to be calculated
 * 
 * 
 * @apiDescription API Endpoint GET /licensee/financial data
 * 
 * 
 * @apiSuccess {Boolean} success Success Status
 * @apiSuccess {String} message Success Message
 * @apiSuccess {Array} financialsObj Object containing Financials Data
 * @apiSuccess {Array} financialsObj[total] Total Amount of Rentals
 * @apiSuccess {Array} financialsObj[invoicesList] List of Documents
 * @apiSuccess {Array} financialsObj[totalByTypeList] Total Amount of Rentals by Type
 * 
 * @apiSuccessExample {String} - Success-Response:
 * HTTP/1.1 200
    {
        success: true,
        message: "Successfully fetched Financial Summary",
        financialsObj: {
            total: 250,
            invoicesList: [ ],
            totalByTypeList: [ ]
        }
    }
 * 
 * Sample API Call : GET http://localhost:5000/licensee/financial
 * 
 * @apiErrorExample {json} Error-Response:
 * HTTP/1.1 400
    {
        success: false,
        message: "Error occurred while fetching Financial Summary",
        errorsList: []
    }
 * 
 * 
 */
async function getFinancials(req, res, next) {
        if (!req.requestFrom || !aclSettings.validateACL(req.requestFrom.acl, "FINANCIALS", "VIEW") || !req.requestFrom.licenseeId) {
            throw new ForbiddenError('Unauthorised Error')
        }

        let requestObject = {
            id : req.requestFrom.licenseeId,
            userType : req.query.userType
        }
        const finances = await getFinanceStats(requestObject);

        const outputFinances = [];

        await asyncForEach(finances , (async (finance) =>{
            let outputFinance = finance;
            outputFinance.rentalObject = await Invoice.findOne({_id:mongoose.Types.ObjectId(finance.rentalId)}, {rentedItems: 1, charges: 1});

            if (outputFinance.isLicenseePaid) {
                outputFinance.adminPayment = await LicenseePayout.findOne({rentalId: outputFinance.rentalId}).lean();
            }

            if (outputFinance.rentalObject.rentedItems && outputFinance.rentalObject.rentedItems.length) {
                for (let rentedItem of outputFinance.rentalObject.rentedItems) {
                    if (rentedItem.itemType === 'trailer') {
                        outputFinance.trailerDetails = await Trailer.findById(rentedItem.itemId, {name: 1, photos: 1}).lean();
                    }
                }
            }

            delete outputFinance.rentalObject;

            outputFinances.push(outputFinance);
        }))

        res.status(200).send({
            success : true,
            message : 'Fetched All Finances',
            finances :outputFinances
        })
        // const searchCondition = {};
        // const startDate = (req.query && req.query.startDate) ? moment(req.query.startDate).toISOString() : undefined;
        // const endDate = (req.query && req.query.endDate) ? moment(req.query.endDate).toISOString() : undefined;

        // searchCondition['licenseeId'] = mongoose.Types.ObjectId(req.requestFrom.licenseeId);

        // if(startDate && endDate) {
        //     searchCondition['rentalPeriod.start'] = { $gte: startDate, $lte: endDate };
        // }

        // let trailerRentalsTotal = await CartItem.aggregate(
        //     [
        //         {
        //             $match : searchCondition
        //         },
        //         {
        //           $group:
        //             {
        //                 _id: null,
        //                 total: { $sum: "$totalCharges.total" }
        //             }
        //         }
        //     ]
        // ).exec();

        // let trailerRentalsByType = await CartItem.aggregate(
        //     [
        //         {
        //             $match : searchCondition
        //         },
        //         {
        //           $group:
        //             {
        //                 _id: { rentedItem: "$rentedItem", rentedItemId: "$rentedItemId" },
        //                 total: { $sum: "$totalCharges.total" }
        //             }
        //         }
        //     ]
        // ).exec();

        // const trailerRentalsTotalByType = [];
        // await asyncForEach(trailerRentalsByType, async(rental) => {
        //     let rentalItem;
        //     const rentedItemType = rental._id.rentedItem;
        //     const rentedItemId = rental._id.rentedItemId;
        //     if(rentedItemType === "trailer") {
        //         rentalItem = await Trailer.findOne({ _id: rentedItemId }, { name: 1 });
        //     } else if(rentedItemType === "upsellitem") {
        //         rentalItem = await UpsellItem.findOne({ _id: rentedItemId }, { name: 1 });
        //     }
        //     rentalItem = rentalItem._doc;

        //     trailerRentalsTotalByType.push({
        //         rentedItem: rentedItemType,
        //         rentedItemId: rentedItemId,
        //         rentedItemName: rentalItem.name,
        //         rentedItemPhoto: rentalItem.photos,
        //         total: rental.total
        //     });
        // });

        
        // const invoices = await CartItem.find(searchCondition, { totalCharges: 1 });
        // /* const rentals = await CartItem.find(searchCondition).sort({ "rentalPeriod.start": 1 });
        // if(rentals.length > 0) {
        //     const firstRentalStart = moment(rentals[0].rentalPeriod.start);
        //     const lastRentalEnd = moment(rentals[rentals.length - 1].end);

        //     const totalPeriod = lastRentalEnd.diff(firstRentalStart, 'minutes');
        //     const periodDiff = Math.floor(totalPeriod / 10);


        // } */

        // return res.status(200).send({
        //     success: true,
        //     message: "Successfully fetched Financial Summary",
        //     financialsObj: {
        //         total: (trailerRentalsTotal.length > 0) ? trailerRentalsTotal[0].total : 0,
        //         invoicesList: invoices,
        //         totalByTypeList: trailerRentalsTotalByType
        //     }
        // });
}

module.exports = getFinancials;