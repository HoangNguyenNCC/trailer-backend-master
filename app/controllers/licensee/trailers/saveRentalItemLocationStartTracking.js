const mongoose = require("mongoose");
const moment = require("moment");
const fs = require("fs");

const Invoice = require("../../../models/invoices");
const Licensee = require("../../../models/licensees");
const Employee = require("../../../models/employees");
const User = require('../../../models/users');

const objectSize = require("../../../helpers/objectSize");
const constants = require("../../../helpers/constants");
const { licenseeNotification , customerNotification } = require("../../../helpers/fcmAdmin");
const {
  BadRequestError,
  ForbiddenError,
  NotFoundError,
  UnauthorizedError,
  ApiError,
} = require("./../../../helpers/errors");

/** 
 * 
 * @api {POST} /rental/location/track Save Rental Item Location Tracking Start data
 * @apiName LA - Save Rental Item Location Tracking Start data
 * @apiGroup Licensee App - Trailer Rental
 * 
 * 
 * @apiHeader {String} Content-Type application/json
 * @apiHeader {String} authorization Authorization token sent as a response to signIn request
 * 
 * 
 * @apiParam {File} driverLicenseScan Scan of Driver License ( File ) [ for type="dropoff" & action="end" only ]
 * 
 * @apiParam {Object} reqBody Request JSON data
 * @apiParam {String} rentalId Rental/invoice ID
 * @apiParam {String} type Tracking for "pickup" or "dropoff"
 * @apiParam {String} action Tracking Action ( "start" or "end" )
 * 
 * 
 * @apiDescription API Endpoint to be used to save Rental Item Location Tracking Start data
 * 
 * 
 * @apiParamExample {json} Request-Example:
 * 
    curl --location --request POST 'http://localhost:5000/rental/location/track' \
    --form 'reqBody={
        "rentalId": "5e6893b03decce1dfd118021",
        "type": "dropoff",
        "action": "start"
    }' \
    --form 'driverLicenseScan=@/home/username/Downloads/driver_license_sample.jpeg'
 * 
 * 
 * @apiErrorExample {json} Error-Response:
 * HTTP/1.1 400
    {
        success: false,
        message: "Error occurred while saving Rental Item Location Tracking Start data",
        errorsList: []
    }
 * 
 * 
 * @apiSuccess {Boolean} success Success Status
 * @apiSuccess {String} message Success Message
 * @apiSuccess {Object} locationObj Location object having pickUpLocation or dropOffLocation
 * 
 * 
 * @apiSuccessExample {String} - Success-Response:
 * HTTP/1.1 200 OK
 * 
    {
        success: true,
        message: "Success",
        locationObj: {}
    }
 * 
 * 
 */
async function saveRentalItemLocationStartTracking(req, res, next) {
  const uploadedFiles = [];
  if (
    !req.requestFrom ||
    !req.requestFrom.licenseeId ||
    !req.requestFrom.employeeId
  ) {
    throw new BadRequestError("Unauthorised Access");
  }

  let rentalItemLocationTracking = req.body.reqBody;

  if (!rentalItemLocationTracking) {
    throw new BadRequestError("VALIDATION-Invalid Request Body");
  }

  // trailer = JSON.parse(JSON.stringify(trailer));
  try {
    rentalItemLocationTracking = JSON.parse(rentalItemLocationTracking);
  } catch (err) {}

  let rentalId = rentalItemLocationTracking.rentalId;
  if (!rentalId || (rentalId && objectSize(rentalId) < 12)) {
    throw new BadRequestError("VALIDATION-Rental ID is invalid");
  }
  rentalId = mongoose.Types.ObjectId(rentalId);

  const trackingFor = rentalItemLocationTracking.type
    ? rentalItemLocationTracking.type
    : "dropoff";
  const action = rentalItemLocationTracking.action
    ? rentalItemLocationTracking.action
    : "start";

  const licenseeId =
    typeof req.requestFrom.licenseeId === "string"
      ? mongoose.Types.ObjectId(req.requestFrom.licenseeId)
      : req.requestFrom.licenseeId;
  let savedRental = await Invoice.findOne(
    { _id: rentalId, licenseeId: licenseeId },
    { pickUpLocation: 1, dropOffLocation: 1 , bookedByUserId : 1}
  );
  const fcmToken = await Employee.findOne(
    { licenseeId, isOwner: true },
    { fcmDeviceToken: 1 }
  );
  const userFcmToken = await User.findOne({_id : savedRental.bookedByUserId},{fcmDeviceToken : 1})
  if (!savedRental) {
    return res.status(403).send({
      success: false,
      message: "Unauthorized Access",
    });
  }
  savedRental = savedRental._doc;

  const invoiceUpdateObj = {};
  const locationObj = {};
  if (trackingFor === "pickup") {
    locationObj.pickUpLocation = savedRental.pickUpLocation;

    invoiceUpdateObj.pickUpEmployeeId = req.requestFrom.employeeId;
    if (action === "start") {
      invoiceUpdateObj.isTrackingPickUp = true;
      await customerNotification(
        "Tracking Info",
        `Tracking Status ${action}`,
        "Tracking",
        rentalId,
        userFcmToken.fcmDeviceToken
      );
    } else if (action === "end") {
      invoiceUpdateObj.isTrackingPickUp = false;
      await customerNotification(
        "Tracking Info",
        `Tracking Status ${action}`,
        "Tracking",
        rentalId,
        userFcmToken.fcmDeviceToken
      );
    }
  } else {
    locationObj.dropOffLocation = savedRental.dropOffLocation;

    invoiceUpdateObj.dropOffEmployeeId = req.requestFrom.employeeId;
    if (action === "start") {
      invoiceUpdateObj.isTrackingDropOff = true;
      await customerNotification(
        "Tracking Info",
        `Tracking Status ${action}`,
        "Tracking",
        rentalId,
        userFcmToken.fcmDeviceToken
      );
    } else if (action === "end") {
      invoiceUpdateObj.isTrackingDropOff = false;
      await customerNotification(
        "Tracking Info",
        `Tracking Status ${action}`,
        "Tracking",
        rentalId,
        userFcmToken.fcmDeviceToken
      );
    }
  }

  if (
    req.files["driverLicenseScan"] &&
    req.files["driverLicenseScan"].length > 0
  ) {
    let doc = req.files["driverLicenseScan"][0];
    const data = doc.location;
    const contentType = doc.mimetype;

    invoiceUpdateObj.driverLicenseScan = {
      contentType: contentType,
      data: data,
    };
  }

  await Invoice.updateOne({ _id: rentalId }, invoiceUpdateObj);

  res.status(200).send({
    success: true,
    message: "Success",
    locationObj: locationObj,
  });
}

module.exports = saveRentalItemLocationStartTracking;
