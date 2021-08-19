const mongoose = require("mongoose");
const { customerNotification } = require("../../../helpers/fcmAdmin");
const dotenv = require("dotenv");
const moment = require("moment");

const User = require("../../../models/users");
const Trailer = require("../../../models/trailers");
const UpsellItem = require("../../../models/upsellItems");
const TrailerType = require("../../../models/trailerTypes");
const UpsellItemType = require("../../../models/upsellItemTypes");
const Commission = require("../../../models/commissions");
const Discount = require("../../../models/discounts");
const Counter = require("../../../models/counters");
const Invoice = require("../../../models/invoices");

const rentalChargesData = require("../../../../test/testData/rentalChargesData");
const calculateRentalItemCharges = require("../../../helpers/calculateRentalItemCharges");

const asyncForEach = require("../../../helpers/asyncForEach");
const { logger } = require("../../../winston");

const {
  UnauthorizedError,
  BadRequestError,
} = require("../../../helpers/errors");

/** 
 * 
 * @api {POST} /invoice Save Invoice data
 * @apiName CA - Save Invoice data
 * @apiGroup Customer App - Trailer Rental
 * 
 * 
 * @apiHeader {String} authorization Authorization token sent as a response to signIn request
 * @apiHeader {String} Content-Type application/json
 * 
 * 
 * @apiParam {Object} objRental Object defining Rental data
 * 
    {
        description: <String>, 
        licenseeId: <ObjectId>, //  Licensee Id
        rentedItems: [ 
            {
                itemType: <String>, // "trailer", "upsellitem"
                itemId: <String>, // trailerId, upsellItemId,
                units: <Number> // units
            }
        ],
        rentalPeriod: { // required 
            start: <Date> // required, in format "YYYY-MM-DD HH:MM"
            end: <Date> // required, in format "YYYY-MM-DD HH:MM"
        },
        doChargeDLR: <Boolean> // required
        isPickUp: <Boolean> // required ( pickup OR door2door )
        pickUpLocation: { // required
            text: <String>,
            pincode: <String>,
            coordinates: [<Latitude - Number>, <Longitude - Number>]
        },
        dropOffLocation: { // required
            text: <String>,
            pincode: <String>,
            coordinates: [<Latitude - Number>, <Longitude - Number>]
        }
    }
 * 
 * @apiDescription API Endpoint to be used to save Invoice data
 * 
 * 
 * @apiErrorExample {json} Error-Response:
 * HTTP/1.1 400
 *  {
 *      success: false,
 *      message: "Could not save Invoice data",
 *      errorsList: []
 *  }
 * 
 * 
 * @apiSuccess {Boolean} success Success Status
 * @apiSuccess {String} message Success Message
 * @apiSuccess {Object} invoiceObj Invoice object
 * 
 * 
 * @apiSuccessExample {String} - Success-Response:
 * HTTP/1.1 200 OK
 * 
    {
        success: true,
        message: "Success",
        invoiceObj: {}
    }
 * 
 */
async function saveCartItems(req, res, next) {
  if (!req.body.userId) throw new UnauthorizedError("UnAuthorized Access");

  let customerObj = await User.findOne(
    { _id: req.body.userId },
    {
      name: 1,
      isEmailVerified: 1,
      "driverLicense.accepted": 1,
      "driverLicense.expiry": 1,
      fcmDeviceToken: 1,
    }
  );
  customerObj = customerObj._doc;

  if (!customerObj.isEmailVerified) {
    throw new BadRequestError("Customer Email is not verified");
  }

  const eomDate = moment(customerObj.driverLicense.expiry, "MM/YY").endOf(
    "month"
  );
  const currentDate = moment();
  const isLicenseExpired = eomDate.isBefore();
  if (isLicenseExpired) {
    throw new BadRequestError("Customer Driver License is expired");
  }

  let rentalBody = req.body.objRental;
  console.log("save invoice rental body", JSON.stringify(rentalBody));

  let savedRental = undefined;

  if (rentalBody.rentalPeriod) {
    if (rentalBody.rentalPeriod.start && rentalBody.rentalPeriod.end) {
      const nowTimeMS = moment().valueOf();
      const rentalPeriodStart = moment(rentalBody.rentalPeriod.start);
      rentalBody.rentalPeriod.start = rentalPeriodStart.toISOString();
      const rentalPeriodStartMS = rentalPeriodStart.valueOf();
      const savedRentalPeriodStartMS = savedRental
        ? moment(savedrentalBody.rentalPeriod.start).valueOf()
        : 0;

      const rentalPeriodEnd = moment(rentalBody.rentalPeriod.end);
      rentalBody.rentalPeriod.end = rentalPeriodEnd.toISOString();
      const rentalPeriodEndMS = rentalPeriodEnd.valueOf();
      const savedRentalPeriodEndMS = savedRental
        ? moment(savedrentalBody.rentalPeriod.end).valueOf()
        : 0;

      if (
        nowTimeMS > rentalPeriodStartMS &&
        (!savedRental || rentalPeriodStartMS !== savedRentalPeriodStartMS)
      ) {
        throw new BadRequestError(
          "VALIDATION-Invalid Rental Period Start Date"
        );
      }

      if (
        nowTimeMS > rentalPeriodEndMS &&
        (!savedRental || rentalPeriodEndMS !== savedRentalPeriodEndMS)
      ) {
        throw new BadRequestError("VALIDATION-Invalid Rental Period End Date");
      }

      if (rentalPeriodStartMS > rentalPeriodEndMS) {
        throw new BadRequestError(
          "VALIDATION-Rental Period Start Date should be earlier than Rental Period End Date"
        );
      }
    } else {
      if (!rentalBody.rentalPeriod.start) {
        throw new BadRequestError(
          "VALIDATION-Invalid Rental Period Start Date"
        );
      }
      if (!rentalBody.rentalPeriod.end) {
        throw new BadRequestError("VALIDATION-Invalid Rental Period End Date");
      }
    }
  } else {
    throw new BadRequestError("VALIDATION-Invalid Rental Period");
  }

  rentalBody.bookedByUserId = req.body.userId;
  rentalBody.licenseeId = mongoose.Types.ObjectId(rentalBody.licenseeId);

  rentalBody.doChargeDLR = rentalBody.doChargeDLR
    ? rentalBody.doChargeDLR
    : true;
  rentalBody.isPickUp = rentalBody.isPickUp ? rentalBody.isPickUp : true;

  rentalBody.total = 0;
  rentalBody.totalCharges = {
    total: 0,
    rentalCharges: 0,
    dlrCharges: 0,
    t2yCommission: 0,
    discount: 0,
    lateFees: 0,
    cancellationCharges: 0,
    taxes: 0,
  };

  await asyncForEach(
    rentalBody.rentedItems,
    async (rentedItemBody, rentedItemIndex) => {
      const rentalItemId = mongoose.Types.ObjectId(rentedItemBody.itemId);
      let rentedItemObj, rentalItemAdminObj;
      if (rentedItemBody.itemType === "trailer") {
        rentedItemObj = await Trailer.findOne(
          { _id: rentalItemId, isDeleted: false },
          { name: 1, licenseeId: 1, adminRentalItemId: 1, rentalCharges: 1 }
        );
      } else if (rentedItemBody.itemType === "upsellitem") {
        rentedItemObj = await UpsellItem.findOne(
          { _id: rentalItemId, isDeleted: false },
          { name: 1, licenseeId: 1, adminRentalItemId: 1, rentalCharges: 1 }
        );
      }

      if (rentedItemObj) {
        rentedItemObj = rentedItemObj._doc;

        rentalBody.itemId = rentalItemId;

        if (rentedItemObj.adminRentalItemId) {
          if (rentedItemBody.itemType === "trailer") {
            rentalItemAdminObj = await TrailerType.findOne(
              { _id: rentedItemObj.adminRentalItemId },
              { rentalCharges: 1 }
            );
          } else if (rentedItemBody.itemType === "upsellitem") {
            rentalItemAdminObj = await UpsellItemType.findOne(
              { _id: rentedItemObj.adminRentalItemId },
              { rentalCharges: 1 }
            );
          }
          rentedItemBody.rentalCharges = rentalItemAdminObj
            ? rentalItemAdminObj._doc.rentalCharges
            : undefined;
        } else if (rentedItemObj.rentalCharges) {
          rentedItemBody.rentalCharges = rentedItemObj.rentalCharges;
        } else {
          rentedItemBody.rentalCharges = JSON.parse(
            JSON.stringify(rentalChargesData)
          );
        }

        rentalBody.rentedItems[rentedItemIndex] = rentedItemBody;

        const commission = await Commission.findOne({
          itemId: rentedItemObj.adminRentalItemId,
        });
        const discount = await Discount.findOne({
          itemId: rentedItemObj.adminRentalItemId,
        });

        const rentalItemObjForCalc = {
          isPickUp: rentalBody.isPickUp,
          rentalPeriod: rentalBody.rentalPeriod,
          doChargeDLR: rentalBody.doChargeDLR,
          rentalCharges: JSON.parse(
            JSON.stringify(rentedItemBody.rentalCharges)
          ),
        };

        const { totalCharges } = await calculateRentalItemCharges(
          "trailer",
          rentalItemObjForCalc,
          rentalBody.isPickup ? "pickup" : "door2door",
          new Date(rentalBody.rentalPeriod.start),
          new Date(rentalBody.rentalPeriod.end)
        );

        console.log("invoice charges", { totalCharges });
        // rentedItemBody.totalCharges = Invoice.calculateCharges(rentalItemObjForCalc, rentalBody.rentalPeriod.start, rentalBody.rentalPeriod.end, commission, discount);
        rentedItemBody.totalCharges = totalCharges;
        rentalBody.total += rentedItemBody.totalCharges.total;

        rentalBody.totalCharges = {
          total:
            Math.round(
              (rentalBody.totalCharges.total +
                rentedItemBody.totalCharges.total +
                Number.EPSILON) *
                100
            ) / 100,
          rentalCharges:
            Math.round(
              (rentalBody.totalCharges.rentalCharges +
                rentedItemBody.totalCharges.rentalCharges +
                Number.EPSILON) *
                100
            ) / 100,
          dlrCharges:
            Math.round(
              (rentalBody.totalCharges.dlrCharges +
                rentedItemBody.totalCharges.dlrCharges +
                Number.EPSILON) *
                100
            ) / 100,
          t2yCommission:
            Math.round(
              (rentalBody.totalCharges.t2yCommission +
                rentedItemBody.totalCharges.t2yCommission +
                Number.EPSILON) *
                100
            ) / 100,
          discount:
            Math.round(
              (rentalBody.totalCharges.discount +
                rentedItemBody.totalCharges.discount +
                Number.EPSILON) *
                100
            ) / 100,
          lateFees:
            Math.round(
              (rentalBody.totalCharges.lateFees +
                rentedItemBody.totalCharges.lateFees +
                Number.EPSILON) *
                100
            ) / 100,
          cancellationCharges:
            Math.round(
              (rentalBody.totalCharges.cancellationCharges +
                rentedItemBody.totalCharges.cancellationCharges +
                Number.EPSILON) *
                100
            ) / 100,
          taxes:
            Math.round(
              (rentalBody.totalCharges.taxes +
                parseFloat(rentedItemBody.totalCharges.taxes) +
                Number.EPSILON) *
                100
            ) / 100,
        };

        rentalBody.rentedItems[rentedItemIndex] = rentedItemBody;
      } else {
        throw new BadRequestError("Invalid Rental Item");
      }
    }
  );

  if (!rentalBody.pickUpLocation) {
    throw new BadRequestError("Rental Pickup Location is not specified");
  }

  rentalBody.pickUpLocation = {
    ...rentalBody.pickUpLocation, // brings in text and pincode
    location: {
      type: "Point",
      coordinates: [
        rentalBody.pickUpLocation.coordinates[1],
        rentalBody.pickUpLocation.coordinates[0],
      ],
    },
  };
  delete rentalBody.pickUpLocation.coordinates;
  console.log("save invoice pickup", rentalBody.pickUpLocation);

  if (!rentalBody.dropOffLocation) {
    rentalBody.dropOffLocation = { ...rentalBody.pickUpLocation };
  } else {
    rentalBody.dropOffLocation = {
      ...rentalBody.dropOffLocation,
      location: {
        type: "Point",
        coordinates: [
          rentalBody.dropOffLocation.coordinates[1],
          rentalBody.dropOffLocation.coordinates[0],
        ],
      },
    };
    delete rentalBody.dropOffLocation.coordinates;
  }

  const invoiceNumber = await Counter.getNextSequence("invoiceNumber");
  rentalBody.invoiceNumber = invoiceNumber;
  rentalBody.invoiceReference = `INV${invoiceNumber
    .toString()
    .padStart(10, "0")}`;
  // -----------------------------------------------------------------

  if (!savedRental || !savedRental.revisions) {
    rentalBody.revisions = [];
    rentalBody.revisions.push({
      revisionType: "rental",

      start: rentalBody.rentalPeriod.start,
      end: rentalBody.rentalPeriod.end,

      requestOn: currentDate.toISOString(),
      requestUpdatedOn: currentDate.toISOString(),

      totalCharges: { ...rentalBody.totalCharges },
    });
  }
  // -----------------------------------------------------------------
  let newInvoice = new Invoice(rentalBody);
  newInvoice = await newInvoice.save();
  newInvoice = newInvoice._doc;
  logger.info("new invoice", newInvoice);

  newInvoice.pickUpLocation = {
    text: newInvoice.pickUpLocation ? newInvoice.pickUpLocation.text : "",
    pincode: newInvoice.pickUpLocation ? newInvoice.pickUpLocation.pincode : "",
    coordinates:
      newInvoice.pickUpLocation && newInvoice.pickUpLocation.location
        ? newInvoice.pickUpLocation.location.coordinates
        : undefined,
  };
  newInvoice.pickUpLocation.coordinates = [
    newInvoice.pickUpLocation.coordinates[1],
    newInvoice.pickUpLocation.coordinates[0],
  ];

  newInvoice.dropOffLocation = {
    text: newInvoice.dropOffLocation ? newInvoice.dropOffLocation.text : "",
    pincode: newInvoice.dropOffLocation
      ? newInvoice.dropOffLocation.pincode
      : "",
    coordinates:
      newInvoice.dropOffLocation && newInvoice.dropOffLocation.location
        ? newInvoice.dropOffLocation.location.coordinates
        : undefined,
  };
  newInvoice.dropOffLocation.coordinates = [
    newInvoice.dropOffLocation.coordinates[1],
    newInvoice.dropOffLocation.coordinates[0],
  ];

  newInvoice.rentedItems = newInvoice.rentedItems.map((rentalItem) => {
    rentalItem = rentalItem._doc;

    delete rentalItem.rentalCharges;

    return rentalItem;
  });

  newInvoice.rentalPeriod.start = moment(newInvoice.rentalPeriod.start).format(
    "YYYY-MM-DD HH:mm"
  );
  newInvoice.rentalPeriod.end = moment(newInvoice.rentalPeriod.end).format(
    "YYYY-MM-DD HH:mm"
  );

  if (newInvoice.revisions) {
    newInvoice.revisions.forEach((revision, revisionIndex) => {
      revision.revisionId = revision._id;
      revision.start = moment(revision.start).format("YYYY-MM-DD HH:mm");
      revision.end = moment(revision.end).format("YYYY-MM-DD HH:mm");

      delete revision._id;

      newInvoice.revisions[revisionIndex] = revision;
    });
  }

  //------------------------------------------------------------------------------
  // Notification ----------------------------------------------------------------

  const licenseeObj = await Licensee.findOne(
    { _id: rentalBody.licenseeId },
    { name: 1 }
  );

  const photos = rentedItemObj.photos.map((photo, photoIndex) => {
    return getFilePath(
      rental.rentedItem,
      rentedItemObj._id.toString(),
      photoIndex + 1
    );
  });

  const notificationObj = {
    notificationType: notificationType,
    message: notificationMessage,
    title: notificationMessage,
    rentalId: rental._id,
    trailerName: rentedItemObj.name,
    image: photos ? photos[0] : "",
    licensee: `${licenseeObj ? licenseeObj.name : ""}`,
    status: notificationMessage,
    licenseeId: rentedItemObj.licenseeId,
    customerId: rental.bookedByUserId,
  };

  // const notification = new Notification(notificationObj);
  // await notification.save();

  // const notification = new Notification(notificationObj);
  // await notification.save();

  if (customerObj.fcmDeviceToken) {
    const fcmNotificationObj = {
      notificationType: notificationObj.notificationType,
      message: notificationObj.message,
      title: notificationObj.title,
      rentalId: notificationObj.rentalId,
      licenseeId: notificationObj.licenseeId,
      customerId: notificationObj.customerId,
    };
    await customerNotification(
      notificationObj.title,
      notificationObj.message,
      "Booking",
      notificationObj.rentalId,
      customerObj.fcmDeviceToken
    );
  }

  //------------------------------------------------------------------------------
  res.status(200).send({
    success: true,
    message: "Success",
    invoiceObj: newInvoice,
  });
}

module.exports = saveCartItems;
