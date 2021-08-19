const objectSize = require("../../../helpers/objectSize");

const Trailer = require("../../../models/trailers");
const TrailerInsurance = require("../../../models/trailerInsurance");
const TrailerServicing = require("../../../models/trailerServicing");
const Employee = require("../../../models/employees");
const { licenseeNotification } = require("../../../helpers/fcmAdmin");
const { BadRequestError } = require("../../../helpers/errors");

const deleteLicenseeTrailer = async function (req, res) {
  if (!req.requestFrom) {
    throw new BadRequestError("Unauthorised Access");
  }
  const body = req.body;
  if (!body.trailerId) {
    throw new BadRequestError("VALIDATION-Trailer ID not Provided");
  }
  if (objectSize(body.trailerId) < 12) {
    throw new BadRequestError("VALIDATION-Trailer ID is invalid");
  }
  const trailerId = body.trailerId;
  if (!body.licenseeId) {
    throw new BadRequestError("VALIDATION-Licensee ID not Provided");
  }
  if (objectSize(body.licenseeId) < 12) {
    throw new BadRequestError("VALIDATION-Licensee ID is invalid");
  }
  const licenseeId = body.licenseeId;
  await Trailer.deleteOne({ _id: trailerId, licenseeId: licenseeId });
  await TrailerInsurance.deleteMany({
    itemId: trailerId,
    licenseeId: licenseeId,
  });
  await TrailerServicing.deleteMany({
    itemId: trailerId,
    licenseeId: licenseeId,
  });
  const fcmToken = await Employee.findOne(
    { licenseeId: licenseeId, isOwner: true },
    { fcmDeviceToken: 1 }
  );

  await licenseeNotification(
    "Trailer Deleted",
    `Trailer Deleted by ${req.requestFrom}`,
    "Inventory Update",
    trailerId,
    fcmToken.fcmDeviceToken
  );

  res.status(200).send({
    success: true,
    message: "Licensee Trailer Deleted Successfully",
  });
};

module.exports = deleteLicenseeTrailer;
