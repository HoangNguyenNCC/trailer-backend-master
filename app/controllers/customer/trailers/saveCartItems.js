const mongoose = require("mongoose");
const rapid = require("eway-rapid");
const admin = require("firebase-admin");
const dotenv = require("dotenv");
const moment = require("moment");

const serviceAccount = require("../../../../trailer2you-7a9da-firebase-adminsdk-yx3og-647dafc3d9.json");

dotenv.config();
const config = process.env;

const User = require("../../../models/users");
const Trailer = require("../../../models/trailers");
const UpsellItem = require("../../../models/upsellItems");
const Cart = require("../../../models/carts");
const CartItem = require("../../../models/cartItems");
const Commission = require("../../../models/commissions");
const Discount = require("../../../models/discounts");
const Notification = require("../../../models/notifications");
const Licensee = require("../../../models/licensees");
const TrailerType = require("../../../models/trailerTypes");
const UpsellItemType = require("../../../models/upsellItemTypes");

const objectSize = require("../../../helpers/objectSize");
const objectMinusKeys = require("../../../helpers/objectMinusKeys");

const rentalChargesData = require("../../../../test/testData/rentalChargesData");
const { UnauthorizedError, BadRequestError } = require('./../../../helpers/errors');
/** 
 * 
 * @api {POST} /rental Save Trailer or Upsell Item Rental or Upsell Item Buy data
 * @apiName CA - Save Trailer or Upsell Item Rental or Upsell Item Buy data
 * @apiGroup Customer App - Trailer Rental Old
 * 
 * 
 * @apiHeader {String} authorization Authorization token sent as a response to signIn request
 * @apiHeader {String} Content-Type application/json
 * 
 * 
 * @apiParam {Object} objRental Object defining Rental data
 * 
    {
        cartId: <String>, // Id of the Cart if it is available,
        transactionType: <String>, // required, rent or buy
        rentedItem: <String>, // required, trailer or upsellitem
        rentedItemId: <String>, // required, trailerId or upsellItemId
    
        bookedByUserId: <String> // required, userId
    
        units: <Number>, // required only if transactionType is 'buy'

        rentalPeriod: { // required only if transactionType is 'rent'
            start: <Date> // required, in format "YYYY-MM-DD HH:MM"
            end: <Date> // required, in format "YYYY-MM-DD HH:MM"
        },

        doChargeDLR: <Boolean> // required
        hireType: <String> // required, regular OR oneway
        isPickUp: <Boolean> // required ( pickup OR door2door )

        pickUpLocation: { // required
            text: <String>,
            pincode: <String>,
            location: { 
                type: "Point",
                coordinates: [<Latitude - Number>, <Longitude - Number>]
            }
        },
        dropOffLocation: { // required
            text: <String>,
            pincode: <String>,
            location: { 
                type: "Point",
                coordinates: [<Latitude - Number>, <Longitude - Number>]
            }
        },

        isDriverLicenseVerified: <Boolean> // required
    }
 * 
 * @apiDescription API Endpoint to be used to save Trailer or Upsell Item Rental or Upsell Item Buy data
 * 
 * 
 * @apiErrorExample {json} Error-Response:
 * HTTP/1.1 400
 *  {
 *      success: false,
 *      message: "Error occurred while saving Trailer Rental record",
 *      errorsList: []
 *  }
 * 
 * 
 * @apiSuccess {Boolean} success Success Status
 * @apiSuccess {String} message Success Message
 * @apiSuccess {Object} cartItemObj Cart Item object
 * @apiSuccess {Object} cartObj Cart object
 * 
 * 
 * @apiSuccessExample {String} - Success-Response:
 * HTTP/1.1 200 OK
 * 
    {
        success: true,
        message: "Successfully saved Trailer Rental record"
        cartItemObj: {
            _id: 5e4fadaa169382447afb27c6,
            transactionType: 'rent',
            rentedItem: 'trailer',
            rentedItemId: 5e4fadaa169382447afb27c1,
            bookedByUserId: 5e4fadaa169382447afb27c1,
            rentalPeriod: {
                start: '2020-06-05T00:00:00.000+00:00',
                end: '2020-06-07T00:00:00.000+00:00'
            },
            totalCharges: {
                rentalCharges: 134,
                dlrCharges: 20.099999999999998,
                t2yCommission: 5.36,
                discount: 2.68,
                lateFees: 0
                total: 162.14
            },
            doChargeDLR: true,
            hireType: 'regular',
            isPickUp: true,
            pickUpLocation: {
                text: 'NorthBridge, NSW, Australia',
                pincode: '1560',
                location: { type: 'Point', coordinates: [43.8477,-111.6932] }
            },
            dropOffLocation: {
                text: 'NorthBridge, NSW, Australia',
                pincode: '1560',
                location: { type: 'Point', coordinates: [43.8477,-111.6932] }
            },
            isDriverLicenseVerified: true,
            rentalCharges: {
                "pickUp": [
                    {
                        "duration": 21600000,
                        "charges": 54
                    },
                    {
                        "duration": 1,
                        "charges": 5
                    }
                ],
                "door2Door": [
                    {
                        "duration": 21600000,
                        "charges": 65
                    },
                    {
                        "duration": 1,
                        "charges": 6
                    }
                ]
            },
            createdAt: 2020-02-21T10:15:06.425Z,
            updatedAt: 2020-02-21T10:15:06.426Z,
            __v: 0
        },
        cartObj: {
            _id: '5e5a5588984b974484c6a0b7',
            cartItems: [{
                _id: "5e5a5588984b974484c6a0b8",
                itemId: "5e5a5588984b974484c6a0b6",
                total: 159.1
            }],
            total: 159.1,
            createdAt: '2020-02-29T12:14:00.391Z',
            updatedAt: '2020-02-29T12:14:00.391Z'
        }
    }
 * 
 */
async function saveCartItems(req, res, next) {
  if (!req.userId) throw new UnauthorizedError('UnAuthorized Access');

  let customerObj = await User.findOne(
    { _id: req.userId },
    {
      name: 1,
      isEmailVerified: 1,
      "driverLicense.accepted": 1,
      "driverLicense.expiry": 1,
      fcmDeviceToken: 1,
    }
  );
  customerObj = customerObj._doc;

  // Commented to avoid failing tests
  if (!customerObj.isEmailVerified) {
    throw new BadRequestError("Customer Email is not verified");
  }

  const eomDate = moment(customerObj.driverLicense.expiry, "YYYY-MM").endOf(
    "month"
  );
  const currentDate = moment();
  const isLicenseExpired = eomDate.isBefore();
  if (isLicenseExpired) {
    throw new Error("VALIDATION-Customer Driver License is expired");
  }

  if (!customerObj.driverLicense.accepted) {
    throw new BadRequestError("Customer Driver License is not accepted");
  }

  let rental = req.body;
  let rentedItemObj;
  let cart, cartId;
  const cartItemId = rental._id
    ? mongoose.Types.ObjectId(rental._id)
    : undefined;
  const isUpdating = rental._id ? true : false;
  const savedRental = isUpdating
    ? await CartItem.findOne({ _id: cartItemId })
    : undefined;
  let notificationMessage = "",
    notificationType = "";

  const isValid = await cartItemValidator(req, res, next, savedRental);

  if (isValid.valid) {
    if (!rental.cartId) {
      cart = new Cart({ bookedByUserId: req.userId });
      cart = await cart.save();
      rental.cartId = cart._id.toString();
    }

    if (rental._id) {
      rental._id = cartItemId;
    }

    // Convert String to ObjectId - rentedItem
    if (rental.rentedItemId) {
      rental.rentedItemId = mongoose.Types.ObjectId(rental.rentedItemId);
    }
    if (rental.rentedItem === "trailer") {
      rentedItemObj = await Trailer.findOne(
        { _id: rental.rentedItemId },
        { name: 1, licenseeId: 1, adminRentalItemId: 1, rentalCharges: 1 }
      );
    } else if (rental.rentedItem === "upsellitem") {
      rentedItemObj = await UpsellItem.findOne(
        { _id: rental.rentedItemId },
        { name: 1, licenseeId: 1, adminRentalItemId: 1, rentalCharges: 1 }
      );
    }
    rental.licenseeId = rentedItemObj.licenseeId;

    if (rentedItemObj.adminRentalItemId) {
      let rentalItemAdminObj;
      if (rental.rentedItem === "trailer") {
        rentalItemAdminObj = await TrailerType.findOne(
          { _id: rentedItemObj.adminRentalItemId },
          { rentalCharges: 1 }
        );
      } else if (rental.rentedItem === "upsellitem") {
        rentalItemAdminObj = await UpsellItemType.findOne(
          { _id: rentedItemObj.adminRentalItemId },
          { rentalCharges: 1 }
        );
      }
      rental.rentalCharges = rentalItemAdminObj._doc.rentalCharges;
    } else if (rentedItemObj.rentalCharges) {
      rental.rentalCharges = rentedItemObj.rentalCharges;
    } else {
      rental.rentalCharges = JSON.parse(JSON.stringify(rentalChargesData));
    }

    if (isUpdating) {
      if (rental.bookedByUserId === req.userId.toString()) {
        rental.bookedByUserId = req.userId;
      } else {
        return res.status(403).send({
          success: false,
          message: "Unauthorized Access",
        });
      }
    } else {
      rental.bookedByUserId = req.userId;
    }

    const commission = await Commission.findOne({
      itemId: rentedItemObj.adminRentalItemId,
    });
    const discount = await Discount.findOne({
      itemId: rentedItemObj.adminRentalItemId,
    });

    rental.totalCharges = CartItem.calculateCharges(
      rental,
      commission,
      discount
    );

    rental.doChargeDLR = rental.doChargeDLR ? rental.doChargeDLR : true;
    rental.hireType = rental.hireType ? rental.hireType : "regular";
    rental.isPickUp = rental.isPickUp ? rental.isPickUp : true;
    rental.isDriverLicenseVerified = rental.isDriverLicenseVerified
      ? rental.isDriverLicenseVerified
      : false;

    if (typeof rental.pickUpLocation === "string") {
      rental.pickUpLocation = {
        text: rental.pickUpLocation,
      };
    }

    if (typeof rental.dropOffLocation === "string") {
      rental.dropOffLocation = {
        text: rental.dropOffLocation,
      };
    }

    if (isUpdating) {
      rental = objectMinusKeys(rental, [
        "_id",
        "rentedItemId",
        "bookedByUserId",
        "createdAt",
        "updatedAt",
      ]);
    }

    cartId = rental.cartId;

    // ----------------------------------------------------------------

    let transactionId = null;
    let accessCode = null,
      formUrl = null;

    if (isUpdating) {
      await CartItem.updateOne({ _id: cartItemId }, rental);
      rental = await CartItem.findOne({ _id: cartItemId });

      notificationType = "book-rental-update";
      notificationMessage = `${customerObj.name} has updated booking of a ${rentedItemObj.name}`;
    } else {
      rental = new CartItem(rental);
      rental = await rental.save();

      notificationType = "book-rental";
      notificationMessage = `${customerObj.name} has booked a ${rentedItemObj.name}`;
    }
    rental = rental._doc;

    let total = rental.totalCharges.total;
    const cartItem = {
      itemId: rental._id,
      total: rental.totalCharges.total,
      transactionId: transactionId,
      accessCode: accessCode,
      formUrl: formUrl,
    };

    if (cart) {
      cartId = mongoose.Types.ObjectId(cartId);
      cart = await Cart.findOne({ _id: cartId });

      total = cart._doc.total + total;

      await Cart.updateOne(
        { _id: cartId },
        {
          $push: { cartItems: cartItem },
          total: total,
          bookedByUserId: req.userId,
        }
      );
      cart = await Cart.findOne({ _id: cartId });
    } else {
      cart = new Cart({
        cartItems: [cartItem],
        total: total,
        bookedByUserId: req.userId,
      });
      cart = await cart.save();
    }
    cart = cart._doc;

    // Notification ---------------------------------------------------

    const licenseeObj = await Licensee.findOne(
      { _id: mongoose.Types.ObjectId(rentedItemObj.licenseeId) },
      { name: 1 }
    );

    const photo = !!licenseeObj.photos ? licenseeObj.photos[0] : null;

    const notificationObj = {
      notificationType: notificationType,
      message: notificationMessage,
      title: notificationMessage,
      rentalId: rental._id,
      trailerName: rentedItemObj.name,
      image: photo,
      licensee: `${licenseeObj ? licenseeObj.name : ""}`,
      status: notificationMessage,
      licenseeId: rentedItemObj.licenseeId,
      customerId: rental.bookedByUserId,
    };

    const notification = new Notification(notificationObj);
    await notification.save();

    if (customerObj.fcmDeviceToken) {
      const fcmNotificationObj = {
        notificationType: notificationObj.notificationType,
        message: notificationObj.message,
        title: notificationObj.title,
        rentalId: notificationObj.rentalId,
        licenseeId: notificationObj.licenseeId,
        customerId: notificationObj.customerId,
      };

      admin.initializeApp({
        credential: admin.credential.cert(serviceAccount),
        databaseURL: "https://trailer2you-7a9da.firebaseio.com",
      });

      const message = {
        data: fcmNotificationObj,
        tokens: [customerObj.fcmDeviceToken],
      };
      const fcmNotification = await admin.messaging().sendMulticast(message);
    }

    // ----------------------------------------------------------------

    res.status(200).send({
      success: true,
      message: "Successfully saved Trailer Rental record",
      cartItemObj: rental,
      cartObj: cart,
      accessCode: accessCode,
      formUrl: formUrl,
    });
  } else {
    if (isValid.errorCode === 400) {
      throw new BadRequestError(`${isValid.errorsList[0]}`);
    } else {
      throw new BadRequestError(isValid.errorsList[0]);
    }
  }
}

async function cartItemValidator(req, res, next, savedRental) {
  try {
    let messagesObj = [];

    let rental = req.body;
    const cartItemId = rental._id
      ? mongoose.Types.ObjectId(rental._id)
      : undefined;
    const isUpdating = rental._id ? true : false;

    if (
      (!isUpdating &&
        (!rental.transactionType ||
          (rental.transactionType &&
            rental.transactionType !== "rent" &&
            rental.transactionType !== "buy"))) ||
      (isUpdating &&
        rental.transactionType &&
        rental.transactionType !== "rent" &&
        rental.transactionType !== "buy")
    ) {
      throw new Error("VALIDATION-Invalid Transaction Type");
    }

    if (
      (!isUpdating &&
        (!rental.rentedItem ||
          (rental.rentedItem &&
            rental.rentedItem !== "trailer" &&
            rental.rentedItem !== "upsellitem"))) ||
      (isUpdating &&
        rental.rentedItem &&
        rental.rentedItem !== "trailer" &&
        rental.rentedItem !== "upsellitem")
    ) {
      throw new Error("VALIDATION-Invalid Transaction Type");
    }

    if (
      rental.rentedItemId &&
      rental.rentedItem &&
      rental.transactionType === "buy" &&
      rental.rentedItem === "trailer"
    ) {
      throw new Error(
        "VALIDATION-Invalid Transaction - Trailer can not be bought"
      );
    }

    if (
      (!isUpdating &&
        (!rental.rentedItemId ||
          (rental.rentedItemId && objectSize(rental.rentedItemId) < 12))) ||
      (!isUpdating &&
        rental.rentedItemId &&
        objectSize(rental.rentedItemId) < 12)
    ) {
      throw new Error("VALIDATION-Invalid Rented Item ID");
    }

    if (rental.transactionType === "rent") {
      if (rental.rentalPeriod) {
        if (rental.rentalPeriod.start && rental.rentalPeriod.end) {
          const nowTimeMS = new Date().getTime();
          const rentalPeriodStartMS = new Date(
            rental.rentalPeriod.start
          ).getTime();
          const savedRentalPeriodStartMS = savedRental
            ? new Date(savedRental.rentalPeriod.start).getTime()
            : 0;

          const rentalPeriodEndMS = new Date(rental.rentalPeriod.end).getTime();
          const savedRentalPeriodEndMS = savedRental
            ? new Date(savedRental.rentalPeriod.end).getTime()
            : 0;

          if (
            nowTimeMS > rentalPeriodStartMS &&
            (!savedRental || rentalPeriodStartMS !== savedRentalPeriodStartMS)
          ) {
            throw new Error("VALIDATION-Invalid Rental Period Start Date");
          }

          if (
            nowTimeMS > rentalPeriodEndMS &&
            (!savedRental || rentalPeriodEndMS !== savedRentalPeriodEndMS)
          ) {
            throw new Error("VALIDATION-Invalid Rental Period End Date");
          }

          if (rentalPeriodStartMS > rentalPeriodEndMS) {
            throw new Error(
              "VALIDATION-Rental Period Start Date should be earlier than Rental Period End Date"
            );
          }
        } else {
          if (!rental.rentalPeriod.start) {
            throw new Error("VALIDATION-Invalid Rental Period Start Date");
          }
          if (!rental.rentalPeriod.end) {
            throw new Error("VALIDATION-Invalid Rental Period End Date");
          }
        }
      } else if (!isUpdating) {
        throw new Error("VALIDATION-Invalid Rental Period");
      }
    } else if (rental.transactionType === "buy") {
      if (
        (!isUpdating && (!rental.units || rental.units < 0)) ||
        (isUpdating && rental.units && rental.units < 0)
      ) {
        throw new Error("VALIDATION-Invalid Number of Units");
      }
    }

    return {
      valid: true,
    };
  } catch (err) {
    console.error("cartItemValidator Error", err);

    let errorCode = 500;
    let errors = [];
    let errorMessage =
      "Error occurred in saving Trailer Rentals. Please enter data in valid format";

    if (
      err &&
      err.name &&
      ["MongoError", "ValidationError"].includes(err.name) &&
      err.message
    ) {
      errorCode = 400;
      if (err.code && err.code === 11000 && err.keyValue) {
        const keys = Object.keys(err.keyValue);
        const values = Object.values(err.keyValue);
        errorMessage = `Duplicate Key Error on { ${keys[0]}: ${values[0]} }`;
        errors.push(errorMessage);
      } else {
        errorMessage = err.message;
        errors.push(errorMessage);
      }
    } else if (err && err.message) {
      errorCode = err.message.startsWith("VALIDATION-") ? 400 : 500;
      const errorComp = err.message.split("VALIDATION-");
      errorMessage = errorComp.length > 1 ? errorComp[1] : errorComp[0];
      errors.push(errorMessage);
    } else if (err && err.errors) {
      errorCode = 400;
      const fieldKeys = Object.keys(err.errors);
      fieldKeys.forEach((fieldKey) => {
        if (fieldKey.split(".").length === 1) {
          errors.push(err.errors[fieldKey].message);
          if (err.errors[fieldKey].message) {
            errorMessage = err.errors[fieldKey].message;
          }
        }
      });
    } else {
      if (err) {
        errorMessage = err;
      }
      errors.push(err);
    }

    return {
      valid: false,
      errorCode: errorCode,
      message: errorMessage,
      errorsList: errors,
    };
  }
}

module.exports = saveCartItems;
