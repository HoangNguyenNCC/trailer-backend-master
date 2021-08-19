const moment = require('moment');

const Invoice = require('../../../models/invoices');
const Trailer = require('../../../models/trailers');
const UpsellItem = require('../../../models/upsellItems');

const asyncForEach = require('../../../helpers/asyncForEach');

const aclSettings = require('../../../helpers/getAccessControlList');
const { BadRequestError } = require('../../../helpers/errors');

/**
 * 
 * @api {GET} /admin/financial/trailer Get the Financial Summary of Trailer Rentals
 * @apiName TAAT - Get the Financial Summary of Trailer Rentals
 * @apiGroup Admin App - Financial
 * 
 * 
 * @apiHeader {String} authorization Authorization token sent as a response to signIn request
 * 
 * @apiParam {String} startDate Start Date of the period for which Financial Summary has to be calculated
 * @apiParam {String} endDate End Date of the period for which Financial Summary has to be calculated
 * 
 * 
 * @apiDescription 
 * 
 * API Endpoint GET /admin/financial/trailer
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
 * Sample API Call : GET http://localhost:5000/admin/financial/trailer
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
   if(!req.requestFrom || !req.requestFrom.employeeId || !req.requestFrom.acl || !aclSettings.validateACL(req.requestFrom.acl, "FINANCIALS", "VIEW")) {
            throw new BadRequestError('Unauthorised Access')
        }

        const searchCondition = {};
        const startDate = (req.query && req.query.startDate) ? moment(req.query.startDate).toISOString() : undefined;
        const endDate = (req.query && req.query.endDate) ? moment(req.query.endDate).toISOString() : undefined;

        // searchCondition['licenseeId'] = mongoose.Types.ObjectId(req.requestFrom.licenseeId);

        if(startDate && endDate) {
            searchCondition["revisions.start"] = { $gte: startDate, $lte: endDate };
        }

        let trailerRentalsTotal = await Invoice.aggregate(
            [
                {
                    $match : searchCondition
                },
                { $unwind: "$revisions" }, 
                { 
                    $group: { 
                        _id: null, 
                        total: { $sum: "$revisions.paidAmount" } 
                    } 
                }
            ]
        ).exec();

        // db.invoices.aggregate([{ $unwind: "$revisions" }, { $group: { _id: null, total: { $sum: "$revisions.totalCharges.total" } } }]);

        let trailerRentalsByType = await Invoice.aggregate(
            [
                {
                    $match : searchCondition
                },
                { $unwind: "$rentedItems" },
                { 
                    $group: { 
                        _id: { itemType: "$rentedItems.itemType", itemId: "$rentedItems.itemId" }, 
                        total: { $sum: "$rentedItems.totalCharges.total" } 
                    } 
                }
            ]
        ).exec();
        // db.invoices.aggregate([{ $unwind: "$rentedItems" }, { $group: { _id: { itemType: "$rentedItems.itemType", itemId: "$rentedItems.itemId" }, total: { $sum: "$rentedItems.totalCharges.total" } } }])

        const trailerRentalsTotalByType = [];
        await asyncForEach(trailerRentalsByType, async(rental) => {
            let rentalItem;
            const rentedItemType = rental._id.itemType;
            const rentedItemId = rental._id.itemId;
            if(rentedItemType === "trailer") {
                rentalItem = await Trailer.findOne({ _id: rentedItemId }, { name: 1 });
            } else if(rentedItemType === "upsellitem") {
                rentalItem = await UpsellItem.findOne({ _id: rentedItemId }, { name: 1 });
            }
            rentalItem = rentalItem._doc;

            trailerRentalsTotalByType.push({
                rentedItem: rentedItemType,
                rentedItemId: rentedItemId,
                rentedItemName: rentalItem.name,
                rentedItemPhoto: !!rentalItem.photos ? rentalItem.photos[0].data : null,
                total: rental.total
            });
        });

        const invoices = await Invoice.find(searchCondition, { rentedItems: 1, revisions: 1 });

        return res.status(200).send({
            success: true,
            message: "Successfully fetched Financial Summary",
            financialsObj: {
                total: (trailerRentalsTotal.length > 0) ? trailerRentalsTotal[0].total : 0,
                invoicesList: invoices,
                totalByItemList: trailerRentalsTotalByType
            },
            totalCount: trailerRentalsTotalByType.length
        });
        throw new BadRequestError('Unauthorised Access')
}

module.exports = getFinancials;