const moment = require("moment");

const User = require("../../../models/users");
const Trailer = require("../../../models/trailers");
const UpsellItem = require("../../../models/upsellItems");
const Invoice = require("../../../models/invoices");
const Licensee = require("../../../models/licensees");

const objectMinusKeys = require("../../../helpers/objectMinusKeys");
const constants = require("../../../helpers/constants");
const { ForbiddenError, BadRequestError } = require("../../../helpers/errors");

/**
 * 
 * @api {GET} /profile Get User Profile
 * @apiName CA - Get User Profile
 * @apiGroup Customer App - User
 * 
 * 
 * @apiHeader {String} authorization Authorization token sent as a response to signIn request
 * 
 * 
 * @apiDescription API Endpoint that can be used to get Profile data
 * 
 * 
 * @apiErrorExample {json} Error-Response:
 * HTTP/1.1 400
 * 
    {
        success: false,
        message: "Could not fetch Profile data",
        errorsList: []
    }
 * 
 * 
 * @apiSuccess {Boolean} success Success Status
 * @apiSuccess {String} message Success Message
 * @apiSuccess {Object} userObj User object
 * @apiSuccess {Array} rentalsList List of Rentals/Invoices
 * 
 * 
 * @apiSuccessExample {String} - Success-Response:
 * HTTP/1.1 200 
 *
    {
        success: true,
        message: "Success",
        userObj: {},
        rentalsList: []
    }
 * 
 */
async function getProfile(req, res) {
  if (!req.userId) throw new ForbiddenError("UnAuthorized Access");
  const userId = req.userId;

  let user = await User.findOne({ _id: userId }).lean();
  if (!user) throw new BadRequestError("User not found");

  user = objectMinusKeys(user, ["password", "tokens"]);

  if (user.address) {
    user.address.coordinates = user.address.location.coordinates;
    user.address.coordinates = [
      user.address.coordinates[1],
      user.address.coordinates[0],
    ];
    delete user.address.location;
    delete user.address._id;
  }

  if (user.dob) {
    user.dob = moment(user.dob).format("YYYY-MM-DD");
  }

  if (!user.driverLicense) {
    user.driverLicense = {};
  }

  const outputUser = {
    ...user,
    name: user.name,
    address: user.address,
    photo: user.photo && user.photo.data ? user.photo.data : "",
    mobile: user.mobile,
    isMobileVerified: user.isMobileVerified,
    driverLicense: user.driverLicense,
  };

  const rentals = await Invoice.find({ bookedByUserId: userId }).lean();

  const licenseeList = [];
  const rentedItemsList = {
    trailer: {},
    upsellitem: {},
  };
  const outputRentals = [];

  for (let rental of rentals) {
    let statusText = "";
    let statusType;

    const now = moment();
    const rentalPeriodStart = moment(rental.rentalPeriod.start);
    const rentalPeriodEnd = moment(rental.rentalPeriod.end);

    if (now.isBefore(rentalPeriodStart)) {
      statusType = "upcoming";

      const dayDiff = rentalPeriodStart.diff(now, "days");
      const hourDiff = rentalPeriodStart.diff(now, "hours");

      if (dayDiff >= 1 && hourDiff >= 24) {
        statusText = `${dayDiff} days to receive`;
      } else {
        statusText = `${hourDiff} hours to receive`;
      }
    } else if (
      now.isAfter(rentalPeriodStart) &&
      now.isBefore(rentalPeriodEnd)
    ) {
      statusType = "ongoing";

      const dayDiff = rentalPeriodEnd.diff(now, "days");
      const hourDiff = rentalPeriodEnd.diff(now, "hours");

      if (dayDiff >= 1 && hourDiff >= 24) {
        statusText = `${dayDiff} days left to return`;
      } else {
        statusText = `${hourDiff} hours left to return`;
      }
    } else {
      statusType = "past";

      const hourDiff = moment(rental.returnDate).diff(rentalPeriodEnd, "hours");

      if (hourDiff > 1) {
        statusText = `Returned late`;
      } else {
        statusText = `Returned on time`;
      }
    }

    const licenseeIdStr = rental.licenseeId.toString();
    if (licenseeList[licenseeIdStr]) {
      const licenseeObj = await Licensee.findOne(
        { _id: rental.licenseeId },
        { name: 1 }
      );
      licenseeList[licenseeIdStr] = {
        name: `${licenseeObj.name}`,
      };
    }

    const currentRentedItemsList = [];
    if (rental.rentedItems) {
      for (let rentedItem of rental.rentedItems) {
        const rentedItemIdStr = rentedItem.itemId.toString();
        if (rentedItem.itemType === "trailer") {
          if (!rentedItemsList[rentedItem.itemType][rentedItemIdStr]) {
            let rentedItemObj = await Trailer.findOne(
              { _id: rentedItem.itemId },
              { name: 1 }
            ).lean();
            if (rentedItemObj) {
              rentedItemsList[rentedItem.itemType][rentedItemIdStr] = {
                name: rentedItemObj.name,
                photo: !!rentedItemObj.photos ? rentedItemObj.photos[0] : null,
              };
            }
          }
        } else if (rentedItem.itemType === "upsellitem") {
          if (!rentedItemsList[rentedItem.itemType][rentedItemIdStr]) {
            let rentedItemObj = await UpsellItem.findOne(
              { _id: rentedItem.itemId },
              { name: 1 }
            ).lean();
            if (rentedItemObj) {
              rentedItemsList[rentedItem.itemType][rentedItemIdStr] = {
                name: rentedItemObj.name,
                photo: rentedItemObj.photos[0],
              };
            }
          }
        }

        if (rentedItemsList[rentedItem.itemType][rentedItemIdStr]) {
          currentRentedItemsList.push(
            rentedItemsList[rentedItem.itemType][rentedItemIdStr]
          );
        }
      }
    }

    outputRentals.push({
      rentalId: rental._id.toString(),
      rentedItems: currentRentedItemsList,
      licensee: licenseeList[licenseeIdStr]
        ? licenseeList[licenseeIdStr].name
        : "Licensee Deleted",
      status: statusText,
      reminderType: "ongoing",
      reminderColor: constants.colorCodes.ongoing,
    });
  }

  return res.status(200).send({
    success: true,
    message: "Success",
    userObj: outputUser,
    rentalsList: outputRentals,
  });
}

module.exports = getProfile;
