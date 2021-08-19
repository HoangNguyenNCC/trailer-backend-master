const objectSize = require("../../../helpers/objectSize");

const Upsell = require("../../../models/upsellItems");
const Employee = require("../../../models/employees");

const { licenseeNotification } = require("../../../helpers/fcmAdmin");
const { BadRequestError } = require("../../../helpers/errors");

const deleteLicenseeUpsellItem = async function (req, res) {
  if (!req.requestFrom) {
    throw new BadRequestError("Unauthorised Access");
  }
  const body = req.body;
  if (!body.upsellId) {
    throw new BadRequestError("VALIDATION-UpsellItem ID not Provided");
  }
  if (objectSize(body.upsellId) < 12) {
    throw new BadRequestError("VALIDATION-UpsellItem ID is invalid");
  }
  const upsellId = body.upsellId;
  if (!body.licenseeId) {
    throw new BadRequestError("VALIDATION-Licensee ID not Provided");
  }
  if (objectSize(body.licenseeId) < 12) {
    throw new BadRequestError("VALIDATION-Licensee ID is invalid");
  }
  const licenseeId = body.licenseeId;
  const fcmToken = await Employee.findOne(
    { licenseeId: licenseeId, isOwner: true },
    { fcmDeviceToken: 1 }
  );

  await Upsell.deleteOne({ _id: upsellId, licenseeId: licenseeId });
  await licenseeNotification(
    "UpsellItem Deleted",
    `UpsellItem Deleted by ${req.requestFrom}`,
    "Inventory Update",
    upsellId,
    fcmToken.fcmDeviceToken
  );

  res.status(200).send({
    success: true,
    message: "Licensee Upsell Item Deleted Successfully",
  });
};

module.exports = deleteLicenseeUpsellItem;
