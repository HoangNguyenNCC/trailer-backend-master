const moment = require("moment");

const Invoice = require("../../../models/invoices");
const Trailer = require("../../../models/trailers");
const UpsellItem = require("../../../models/upsellItems");
const Licensee = require("../../../models/licensees");

const asyncForEach = require("../../../helpers/asyncForEach");
const constants = require("../../../helpers/constants");
const { UnauthorizedError } = require("../../../helpers/errors");

/**
 * 
 * @api {GET} /user/reminders Get Booking Reminders for a User
 * @apiName CA - Get Booking Reminders for a User
 * @apiGroup Customer App - Trailer
 * 
 * 
 * @apiHeader {String} authorization Authorization token sent as a response to signIn request
 * 
 * 
 * @apiDescription API Endpoint that can used to get Booking Reminders for a User
 * 
 * 
 * @apiErrorExample {json} Error-Response:
 * HTTP/1.1 400
 * 
    {
        success: false,
        message: "Error occurred while fetching Booking Reminders for a User",
        errorsList: []
    }
 * 
 * 
 * @apiSuccess {Boolean} success Success Status
 * @apiSuccess {String} message Success Message
 * @apiSuccess {Array} remindersList List of Reminders 
 * 
 * 
 * @apiSuccessExample {String} - Success-Response:
 * HTTP/1.1 200 
 *
    {
        success: true,
        message: "Success",
        remindersList: [
            {
                "name": "Painted Tandem",
                "photo": "url",
                "licenseeName": "Licensee One",
                "reminderType": "upcoming",
                "reminderText": "4 days to receive",
                "reminderColor": "#00BE75"
            }
        ]
    }
 * 
 */
async function getReminders(req, res) {
  if (!req.userId) throw new UnauthorizedError("UnAuthorized Access");
  const now = moment();
  const userId = req.userId;

  const remindersList = [];

  const licenseeList = [];

  const type = req.query.type || "all";

  const searchCondition = {
    bookedByUserId: userId,
  };

  if (type === "reminders") {
    searchCondition.rentalStatus = {
      $ne: "returned",
    };
    searchCondition["revisions.revisionType"] = {
      $ne: "cancellation",
    };
    searchCondition["revisions.isApproved"] = {
      $ne: 2,
    };
  }

  const rentals = await Invoice.find(searchCondition).sort({
    updatedAt: "desc",
  });

  await asyncForEach(rentals, async (rental, index) => {
    rental = rental._doc;
    let reminderText = "";
    let reminderType;

    let rentalPeriodStart = moment(rental.rentalPeriod.start);
    let rentalPeriodEnd = moment(rental.rentalPeriod.end);

    let isApproved = 0;
    if (rental.revisions.length >= 1) {
      let latestRevision = rental.revisions[rental.revisions.length - 1];
      if (latestRevision.isApproved === 1) {
        isApproved = 1;
      }
      rentalPeriodStart = moment(latestRevision.start);
      rentalPeriodEnd = moment(latestRevision.end);
    }
  
    if (now.isBefore(rentalPeriodStart)) {
      reminderType = "upcoming";

      const dayDiff = rentalPeriodStart.diff(now, "days");
      const hourDiff = rentalPeriodStart.diff(now, "hours");

      if (dayDiff >= 1 && hourDiff >= 24) {
        reminderText = `${dayDiff} days to receive`;
      } else {
        reminderText = `${hourDiff} hours to receive`;
      }
    } else if (
      now.isAfter(rentalPeriodStart) &&
      now.isBefore(rentalPeriodEnd)
    ) {
      reminderType = "ongoing";

      const dayDiff = rentalPeriodEnd.diff(now, "days");
      const hourDiff = rentalPeriodEnd.diff(now, "hours");

      if (dayDiff >= 1 && hourDiff >= 24) {
        reminderText = `${dayDiff} days left to return`;
      } else {
        reminderText = `${hourDiff} hours left to return`;
      }
    } else {
      reminderType = "past";
    }

    if (reminderType !== "past") {
      const licenseeIdStr = rental.licenseeId.toString();
      if (!licenseeList[licenseeIdStr]) {
        const licenseeObj = await Licensee.findOne(
          { _id: rental.licenseeId },
          { name: 1 }
        );
        if (licenseeObj) {
          licenseeList[licenseeIdStr] = {
            name: `${licenseeObj.name}`,
          };
        }
      }

      const rentedItemsList = [];
      if (rental.rentedItems && rental.rentedItems.length > 0) {
        await asyncForEach(
          rental.rentedItems,
          async (rentedItem, rentedItemIndex) => {
            if (rentedItem) {
              rentedItem = rentedItem._doc;

              const itemIdStr = rentedItem.itemId.toString();
              let rentedItemObj;

              if (rentedItem.itemType === "trailer") {
                rentedItemObj = await Trailer.findOne(
                  { _id: rentedItem.itemId },
                  {
                    name: 1,
                    type: 1,
                    licenseeId: 1,
                    adminRentalItemId: 1,
                    photos: 1,
                  }
                );
                // trailers[itemIdStr] = rentedItemObj;
              } else if (rentedItem.itemType === "upsellitem") {
                rentedItemObj = await UpsellItem.findOne(
                  { _id: rentedItem.itemId },
                  {
                    name: 1,
                    type: 1,
                    licenseeId: 1,
                    adminRentalItemId: 1,
                    photos: 1,
                  }
                );
                // upsellitems[itemIdStr] = rentedItemObj;
              }

              if (rentedItemObj) {
                rentedItemsList.push({
                  itemType: rentedItem.itemType,
                  itemId: rentedItem.itemId.toString(),
                  rentedItemType: rentedItemObj.type,
                  adminRentalItemId: rentedItemObj.adminRentalItemId,
                  itemName: rentedItemObj.name,
                  itemPhoto: rentedItemObj.photos[0], //TODO: Don't we need all photos?
                });
              }
            }
          }
        );
      }

      let isCancelled = false;
      if (rental.revisions) {
        rental.revisions.forEach((revision) => {
          if (revision) {
            revision = revision._doc;

            if (
              (revision.revisionType &&
                revision.revisionType === "cancellation") ||
              (revision.revisionType &&
                revision.revisionType === "rental" &&
                revision.isApproved === 2) // if licensee cancels, revision type stays rental but isApproved changes to 2
            ) {
              isCancelled = true;
              isApproved = 2;
            }
          }
        });
      }

      let isTracking = false;
      if (rental.isTrackingPickUp) {
        isTracking = true;
      }
      if (rental.isTrackingDropOff) {
        isTracking = true;
      }

      const reminder = {
        invoiceId: rental._id.toString(),
        start: rentalPeriodStart.format("YYYY-MM-DD hh:mm A"),
        end: rentalPeriodEnd.format("YYYY-MM-DD hh:mm A"),
        isApproved: isApproved,
        isTracking: isTracking,
        rentedItems: rentedItemsList,
        licenseeName:
          licenseeList[licenseeIdStr] && licenseeList[licenseeIdStr].name,
        reminderType: reminderType,
        reminderText: reminderText,
        status: rental.rentalStatus,
        reminderColor: constants.colorCodes[reminderType],
      };

      if (licenseeList[licenseeIdStr]) {
        remindersList.push(reminder);
      }
    }
  });

  return res.status(200).send({
    success: true,
    message: "Successfully fetched Reminders",
    remindersList: remindersList,
  });
}

module.exports = getReminders;
