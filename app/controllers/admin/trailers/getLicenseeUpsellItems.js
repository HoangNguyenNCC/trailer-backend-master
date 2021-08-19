const mongoose = require("mongoose");
const moment = require("moment");

const Licensee = require("../../../models/licensees");
const TrailerRating = require("../../../models/trailerRatings");
const UpsellItem = require("../../../models/upsellItems");
const UpsellItemType = require("../../../models/upsellItemTypes");
const Invoice = require("../../../models/invoices");

const aclSettings = require("../../../helpers/getAccessControlList");
const objectSize = require("../../../helpers/objectSize");
const getFilePath = require("../../../helpers/getFilePath");
const { getSearchCondition } = require('../../../helpers/getSearchCondition');
const asyncForEach = require("../../../helpers/asyncForEach");
const rentalChargesConv = require("../../../helpers/rentalChargesConv");
const constants = require("../../../helpers/constants");

const rentalChargesData = require("../../../../test/testData/rentalChargesData");
const { BadRequestError } = require("../../../helpers/errors");

/**
 * 
 * @api {GET} /admin/licenseeUpsellItems Get Upsell Items List of licensee
 * @apiName AD - Get Upsell Items List of licensee
 * @apiGroup Admin App - Trailer
 * 
 * 
 * @apiHeader {String} authorization Authorization token sent as a response to signIn request
 * 
 * 
 * @apiParam {String} id Id of the licensee for which Upsell Items have to be fetched
 * @apiParam {String} count Count of Upsell Items to fetch
 * @apiParam {String} skip Number of Upsell Items to skip
 * 
 * 
 * @apiDescription API Endpoint GET /admin/licenseeUpsellItems
 * 
 * 
 * @apiSuccess {Boolean} success Success Status
 * @apiSuccess {String} message Success Message
 * @apiSuccess {Array} upsellItemsList List of Upsell Items
 * 
 * 
 * @apiSuccessExample {String} - Success-Response:
 * HTTP/1.1 200
    {
        success: true,
        message: "Successfully fetched Upsell Items data",
        upsellItemsList: []
    }
 * 
 * Sample API Call : http://localhost:5000/upsellitems?count=5&skip=0&pincode=83448,1560&location=43.8477,-111.6932
 * 
 * @apiErrorExample {json} Error-Response:
 * HTTP/1.1 400
    {
        success: false,
        message: "Error occurred while fetching Upsell Items data",
        errorsList: []
    }
 * 
 * 
 */
async function getLicenseeUpsellItems(req, res, next) {
  let {
      skip: pageSkip = 0,
      count: pageCount = 10,
    } = req.query;

    if (typeof pageSkip !== 'number') pageSkip = parseInt(pageSkip);
    if (typeof pageCount !== 'number') pageCount = parseInt(pageCount);

    if (!req.query.id) {
      throw new BadRequestError('Unauthorised Access')
    }
    let searchCondition = {}
    if(req.query && Object.keys(req.query).length >0){
      const filters = [{filter:"type", search:"type"},{filter:"availability", search:"availability"},{filter:"trailerModel", search:"trailerModel"}]
      const search = [{condition:"name", search:"name"}]
      searchCondition = await getSearchCondition(req.query,search,filters)
      searchCondition['licenseeId'] = req.query.id
    }
    let upsellitems = await UpsellItem.find(searchCondition)
      .skip(pageSkip)
      .limit(pageCount);

    const currentDate = moment().toISOString();

    const upsellitemIds = [];
    const upsellItemIdsStr = [];

    upsellitems.forEach((upsellitem, upsellitemsIndex) => {
      upsellitem = upsellitem._doc;
      const upsellitemId = upsellitem._id;
      upsellitemIds.push(upsellitemId);
      upsellItemIdsStr.push(upsellitemId.toString());

      upsellitem.photo =
        upsellitem.photos && upsellitem.photos[0]
          ? upsellitem.photos[0].data
          : null;

      upsellitems[upsellitemsIndex] = upsellitem;
    });

    const averageRating = await TrailerRating.aggregate([
      { $match: { itemId: { $in: upsellitemIds } } },
      { $group: { _id: "$itemId", avgRatingValue: { $avg: "$ratingValue" } } },
    ]).exec();

    let ongoingInvoices = undefined;
    let upcomingInvoices = undefined;

    if (upsellItemIdsStr.length > 0) {
      ongoingInvoices = await Invoice.find(
        {
          "rentedItems.itemType": "upsellitem",
          "rentedItems.itemId": { $in: upsellItemIdsStr },
          "rentalPeriod.start": { $lte: currentDate },
          "rentalPeriod.end": { $gte: currentDate },
        },
        { rentalPeriod: 1 }
      ).sort({ "rentalPeriod.start": 1, "rentalPeriod.end": 1 });

      upcomingInvoices = await Invoice.find(
        {
          "rentedItems.itemType": "upsellitem",
          "rentedItems.itemId": { $in: upsellItemIdsStr },
          "rentalPeriod.start": { $gt: currentDate },
        },
        { rentalPeriod: 1 }
      )
        .sort({ "rentalPeriod.start": 1, "rentalPeriod.end": 1 })
        .limit(1);
    }

    const outputUpsellItems = [];

    await asyncForEach(upsellitems, async (upsellitem, upsellItemIndex) => {
      const upsellitemId = upsellitem._id.toString();
      const ratingIndex = averageRating.findIndex((rating) => {
        return rating._id.toString() === upsellitemId;
      });
      const ratingValue =
        ratingIndex === -1 ? 0 : averageRating[ratingIndex].avgRatingValue;
      upsellitem.rating = ratingValue;

      if (upsellitem.adminRentalItemId) {
        let rentalItemAdminObj = await UpsellItemType.findOne(
          { _id: upsellitem.adminRentalItemId },
          { rentalCharges: 1 }
        );
        upsellitem.rentalCharges = rentalItemAdminObj._doc.rentalCharges;
      } else if (!upsellitem.rentalCharges) {
        upsellitem.rentalCharges = JSON.parse(
          JSON.stringify(rentalChargesData)
        );
      }

      const price = upsellitem.rentalCharges.door2Door.find((charges) => {
        return charges.duration === constants.hirePeriod;
      });

      //-------------------------------------------------------------------------

      const upsellItemAvailability = {
        availability: true,
        ongoing: undefined,
        upcoming: undefined,
      };

      if (ongoingInvoices && ongoingInvoices.length > 0) {
        ongoingInvoices.forEach((ongoingInvoice) => {
          ongoingInvoice = ongoingInvoice._doc;
          if (ongoingInvoice.rentedItems) {
            ongoingInvoice.rentedItems.forEach((rentedItem) => {
              rentedItem = rentedItem._doc;
              if (
                rentedItem.itemType === "upsellitem" &&
                upsellitemId === rentedItem.itemId.toString()
              ) {
                upsellItemAvailability.ongoing = {
                  rentalItemId: upsellitemId,
                  invoiceId: ongoingInvoice._id.toString(),
                  startDate: moment(ongoingInvoice.rentalPeriod.start).format(
                    "YYYY-MM-DD HH:MM"
                  ),
                  endDate: moment(ongoingInvoice.rentalPeriod.end).format(
                    "YYYY-MM-DD HH:MM"
                  ),
                };

                upsellItemAvailability.availability = false;
              }
            });
          }
        });
      }

      if (upcomingInvoices && upcomingInvoices.length > 0) {
        upcomingInvoices.forEach((upcomingInvoice) => {
          upcomingInvoice = upcomingInvoice._doc;
          if (upcomingInvoice.rentedItems) {
            upcomingInvoice.rentedItems.forEach((rentedItem) => {
              rentedItem = rentedItem._doc;
              if (
                rentedItem.itemType === "upsellitem" &&
                upsellitemId === rentedItem.itemId.toString()
              ) {
                upsellItemAvailability.upcoming = {
                  rentalItemId: upsellitemId,
                  invoiceId: upcomingInvoice._id.toString(),
                  startDate: moment(upcomingInvoice.rentalPeriod.start).format(
                    "YYYY-MM-DD HH:MM"
                  ),
                  endDate: moment(upcomingInvoice.rentalPeriod.end).format(
                    "YYYY-MM-DD HH:MM"
                  ),
                };
              }
            });
          }
        });
      }

      //-------------------------------------------------------------------------
      outputUpsellItems.push(upsellitem);
    });

    return res.status(200).send({
      success: true,
      message: "Successfully fetched Upsell Items data",
      upsellItemsList: outputUpsellItems,
    });
}

module.exports = getLicenseeUpsellItems;
