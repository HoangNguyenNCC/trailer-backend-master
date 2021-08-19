const mongoose = require("mongoose");

const UpsellItem = require("../../../models/upsellItems");
const Employee = require("../../../models/employees");

const aclSettings = require("../../../helpers/getAccessControlList");
const objectMinusKeys = require("../../../helpers/objectMinusKeys");
const { licenseeNotification } = require("../../../helpers/fcmAdmin");
const { BadRequestError } = require("./../../../helpers/errors");

const addLicenseeUpsellItem = async function (req, res) {
  if (
    !req.requestFrom ||
    !aclSettings.validateACL(req.requestFrom.acl, "UPSELL", ["ADD", "UPDATE"])
  ) {
    throw new BadRequestError("Unauthorised Access");
  }

  let upsellItem = req.body.reqBody;

  if (!upsellItem) {
    throw new BadRequestError("VALIDATION-Invalid Request Body");
  }

  upsellItem = JSON.parse(upsellItem);

  const upsellItemId = upsellItem._id
    ? mongoose.Types.ObjectId(upsellItem._id)
    : undefined;
  const isUpdating = upsellItem._id ? true : false;
  const existingUpsellItem = await UpsellItem.findOne(
    { _id: upsellItemId },
    { licenseeId: 1 }
  );
  if (
    isUpdating &&
    (!existingUpsellItem ||
      existingUpsellItem._doc.licenseeId.toString() !==
        req.body.licenseeId.toString())
  ) {
    throw new BadRequestError("Unauthorised Access");
  }

  if (!upsellItem) {
    throw new BadRequestError("VALIDATION-Data in Invalid Format");
  } else {
    if (typeof upsellItem.address === "string") {
      upsellItem.address = {
        text: upsellItem.address,
      };
    }

    const upsellItemId = upsellItem._id
      ? mongoose.Types.ObjectId(upsellItem._id)
      : undefined;
    const isUpdating = upsellItem._id ? true : false;
    if (isUpdating) {
      upsellItem = objectMinusKeys(upsellItem, [
        "_id",
        "licenseeId",
        "createdAt",
        "updatedAt",
      ]);
    }

    if (upsellItem._id) {
      upsellItem._id = upsellItemId;
    }

    upsellItem.licenseeId =
      typeof req.body.licenseeId === "string"
        ? mongoose.Types.ObjectId(req.body.licenseeId)
        : req.body.licenseeId;
    const fcmToken = await Employee.findOne(
      { licenseeId: upsellItem.licenseeId, isOwner: true },
      { fcmDeviceToken: 1 }
    );
    if (upsellItem.adminRentalItemId) {
      upsellItem.adminRentalItemId =
        typeof upsellItem.adminRentalItemId === "string"
          ? mongoose.Types.ObjectId(upsellItem.adminRentalItemId)
          : upsellItem.adminRentalItemId;
    }

    if (req.files["photos"] && req.files["photos"].length > 0) {
      upsellItem.photos = [];
      let photos = req.files["photos"];

      photos.forEach((photo) => {
        const data = photo.location;
        const contentType = photo.mimetype;

        upsellItem.photos.push({
          contentType: contentType,
          data: data,
        });
      });
    }

    // Save or Update data
    if (isUpdating) {
      await UpsellItem.updateOne({ _id: upsellItemId }, upsellItem);
      upsellItem = await UpsellItem.findOne({ _id: upsellItemId });
    } else {
      upsellItem = new UpsellItem(upsellItem);
      upsellItem = await upsellItem.save();
    }
    upsellItem = upsellItem._doc;

    if (upsellItem.address) {
      upsellItem.address = {
        text: upsellItem.address ? upsellItem.address.text : "",
        pincode: upsellItem.address ? upsellItem.address.pincode : "",
        coordinates:
          upsellItem.address && upsellItem.address.location
            ? upsellItem.address.location.coordinates
            : undefined,
      };
      upsellItem.address.coordinates = [
        upsellItem.address.coordinates[1],
        upsellItem.address.coordinates[0],
      ];
    }
    await licenseeNotification(
      "UpsellItem Added",
      `UpsellItem  Added by ${req.requestFrom}`,
      "Inventory Update",
      upsellItem._id,
      fcmToken.fcmDeviceToken
    );

    res.status(200).send({
      success: true,
      message: "Successfully saved Upsell Item",
      upsellItemObj: upsellItem,
    });
  }
};

module.exports = addLicenseeUpsellItem;
