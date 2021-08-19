const mongoose = require("mongoose");
const validator = require("validator");
const moment = require("moment");

const Trailer = require("../../../models/trailers");
const UpsellItem = require("../../../models/upsellItems");
const TrailerInsurance = require("../../../models/trailerInsurance");
const TrailerServicing = require("../../../models/trailerServicing");
const Employee = require("../../../models/employees");

const objectMinusKeys = require("../../../helpers/objectMinusKeys");
const asyncForEach = require("../../../helpers/asyncForEach");
const { licenseeNotification } = require("../../../helpers/fcmAdmin");
const { BadRequestError } = require("../../../helpers/errors");

const addLicenseeTrailer = async function (req, res) {
  if (!req.requestFrom) {
    throw new BadRequestError("Unauthorised Access");
  }

  let trailer = req.body.reqBody;

  try {
    trailer = JSON.parse(trailer);
  } catch (err) {}

  if (!trailer) {
    throw new BadRequestError("VALIDATION-Invalid Request Body");
  }

  //         trailer = JSON.parse(trailer);
  let licenseeId;
  if (req.body.reqBody.licenseeId) {
    licenseeId = req.body.reqBody.licenseeId;
  } else if (req.body.licenseeId) {
    licenseeId = req.body.licenseeId;
  }

  console.log(licenseeId, req.body);

  //#region Deprecated in favour of S3
  // if(req.files) {

  // if(req.files["photos"]) {
  //     req.files["photos"].forEach(file => {
  //         uploadedFiles.push(file.path);
  //     });
  // }
  // if(req.files["insuranceDocument"]) {
  //     req.files["insuranceDocument"].forEach(file => {
  //         uploadedFiles.push(file.path);
  //     });
  // }
  // if(req.files["servicingDocument"]) {
  //     req.files["servicingDocument"].forEach(file => {
  //         uploadedFiles.push(file.path);
  //     });
  // }

  //     if(req.files["photos"]) {
  //         req.files["photos"].forEach(file => {
  //             if(!constants.allowedfiles.documents.includes(file.mimetype)) {
  //                 throw new BadRequestError(`VALIDATION-Upload files with allowed file types - ${file.filename}`);
  //             }
  //             if(file.size > constants.maxPictureSize) {
  //                 throw new BadRequestError(`VALIDATION-Document Exceeded Size Limit - ${file.filename}`);
  //             }
  //         });
  //     }
  //     if(req.files["insuranceDocument"]) {
  //         req.files["insuranceDocument"].forEach(file => {
  //             if(!constants.allowedfiles.documents.includes(file.mimetype)) {
  //                 throw new BadRequestError(`VALIDATION-Upload files with allowed file types - ${file.filename}`);
  //             }
  //             if(file.size > constants.maxPictureSize) {
  //                 throw new BadRequestError(`VALIDATION-Document Exceeded Size Limit - ${file.filename}`);
  //             }
  //         });
  //     }
  //     if(req.files["servicingDocument"]) {
  //         req.files["servicingDocument"].forEach(file => {
  //             if(!constants.allowedfiles.documents.includes(file.mimetype)) {
  //                 throw new BadRequestError(`VALIDATION-Upload files with allowed file types - ${file.filename}`);
  //             }
  //             if(file.size > constants.maxPictureSize) {
  //                 throw new BadRequestError(`VALIDATION-Document Exceeded Size Limit - ${file.filename}`);
  //             }
  //         });
  //     }
  // }
  //#endregion Deprecated in favor of S3

  const trailerId = trailer._id
    ? mongoose.Types.ObjectId(trailer._id)
    : undefined;
  const isUpdating = trailer._id ? true : false;
  const existingTrailer = await Trailer.findOne(
    { _id: trailerId },
    { licenseeId: 1 }
  );
  const fcmToken = await Employee.findOne(
    { licenseeId, isOwner: true },
    { fcmDeviceToken: 1 }
  );
  if (isUpdating && !existingTrailer) {
    throw new BadRequestError("Unauthorised Access");
  }

  if (!trailer) {
    throw new BadRequestError(
      "VALIDATION-Error occurred while parsing Trailer record"
    );
  } else {
    if (typeof trailer.address === "string") {
      trailer.address = {
        text: trailer.address,
      };
    }

    if (isUpdating) {
      trailer = objectMinusKeys(trailer, [
        "_id",
        "licenseeId",
        "createdAt",
        "updatedAt",
      ]);
    }

    if (req.files && req.files["photos"] && req.files["photos"].length > 0) {
      trailer.photos = [];
      let photos = req.files["photos"];

      photos.forEach((photo) => {
        const data = photo.location;
        const contentType = photo.mimetype;

        trailer.photos.push({
          contentType: contentType,
          data: data,
        });
      });
    }

    if (
      trailer.insurance &&
      req.files["insuranceDocument"] &&
      req.files["insuranceDocument"].length > 0
    ) {
      let photo = req.files["insuranceDocument"][0];
      const data = photo.location;
      const contentType = photo.mimetype;

      trailer.insurance.document = {
        contentType: contentType,
        data: data,
      };
    }

    if (
      trailer.servicing &&
      req.files["servicingDocument"] &&
      req.files["servicingDocument"].length > 0
    ) {
      let photo = req.files["servicingDocument"][0];
      const data = photo.location;
      const contentType = photo.mimetype;

      trailer.servicing.document = {
        contentType: contentType,
        data: data,
      };
    }

    if (trailer._id) {
      trailer._id = trailerId;
    }
    trailer.licenseeId = licenseeId;
    trailer.adminRentalItemId =
      typeof trailer.adminRentalItemId === "string"
        ? mongoose.Types.ObjectId(trailer.adminRentalItemId)
        : trailer.adminRentalItemId;

    let upsellItems;
    if (trailer.upsellitems) {
      upsellItems = [...trailer.upsellitems];
      delete trailer.upsellitems;
    }

    let insuranceObj;
    if (trailer.insurance) {
      insuranceObj = { ...trailer.insurance };
      delete trailer.insurance;
    }

    let servicingObj;
    if (trailer.servicing) {
      servicingObj = { ...trailer.servicing };
      delete trailer.servicing;
    }

    if (isUpdating) {
      trailer = await Trailer.findOneAndUpdate({ _id: trailerId }, trailer, {
        new: true,
      });
    } else {
      trailer = new Trailer(trailer);
      trailer = await trailer.save();
    }
    trailer = trailer._doc;

    //#region Deprecated in favor of S3
    // let photos = [];
    // for(let photoIndex = 0; photoIndex < trailer.photos.length; photoIndex++) {
    //     photos.push(
    //         getFilePath("trailer", trailer._id.toString(), (photoIndex + 1))
    //     );
    // }
    // trailer.photos = photos;
    //#endregion

    if (trailer.address) {
      trailer.address = {
        text: trailer.address ? trailer.address.text : "",
        pincode: trailer.address ? trailer.address.pincode : "",
        coordinates:
          trailer.address && trailer.address.location
            ? trailer.address.location.coordinates
            : undefined,
      };

      trailer.address.coordinates = [
        trailer.address.coordinates[1],
        trailer.address.coordinates[0],
      ];
    }

    if (upsellItems) {
      await asyncForEach(upsellItems, async (upsellItemId) => {
        await UpsellItem.updateOne(
          { _id: mongoose.Types.ObjectId(upsellItemId) },
          { trailerId: trailer._id }
        );
      });
    }

    let trailerInsuranceDoc;
    if (insuranceObj) {
      if (
        !insuranceObj.issueDate ||
        validator.isEmpty(insuranceObj.issueDate)
      ) {
        throw new BadRequestError("VALIDATION-Invalid Issue Date");
      }
      if (insuranceObj.issueDate) {
        insuranceObj.issueDate = moment(insuranceObj.issueDate).toISOString();
      }

      if (
        !insuranceObj.expiryDate ||
        validator.isEmpty(insuranceObj.expiryDate)
      ) {
        throw new BadRequestError("VALIDATION-Invalid Expiry Date");
      }
      if (insuranceObj.expiryDate) {
        insuranceObj.expiryDate = moment(insuranceObj.expiryDate).toISOString();
      }

      if (!insuranceObj.document) {
        throw new BadRequestError("VALIDATION-Invalid Document");
      }

      insuranceObj.licenseeId = licenseeId;
      insuranceObj.itemType = "trailer";
      insuranceObj.itemId = trailer._id;

      let insurance = new TrailerInsurance(insuranceObj);
      trailerInsuranceDoc = await insurance.save();

      trailerInsuranceDoc = trailerInsuranceDoc._doc;
      trailerInsuranceDoc.document = trailerInsuranceDoc.document.data;

      trailerInsuranceDoc.issueDate = moment(
        trailerInsuranceDoc.issueDate
      ).format("YYYY-MM-DD");
      trailerInsuranceDoc.expiryDate = moment(
        trailerInsuranceDoc.expiryDate
      ).format("YYYY-MM-DD");
    }
    console.log(trailerInsuranceDoc);

    let trailerServicingDoc;
    if (servicingObj) {
      if (!servicingObj.name || validator.isEmpty(servicingObj.name)) {
        throw new BadRequestError("VALIDATION-Invalid Service Name");
      }

      if (
        !servicingObj.serviceDate ||
        validator.isEmpty(servicingObj.serviceDate)
      ) {
        throw new BadRequestError("VALIDATION-Invalid Service Date");
      }
      if (servicingObj.serviceDate) {
        servicingObj.serviceDate = moment(
          servicingObj.serviceDate
        ).toISOString();
      }

      if (
        !servicingObj.nextDueDate ||
        validator.isEmpty(servicingObj.nextDueDate)
      ) {
        throw new BadRequestError("VALIDATION-Invalid Next Due Date");
      }
      if (servicingObj.nextDueDate) {
        servicingObj.nextDueDate = moment(
          servicingObj.nextDueDate
        ).toISOString();
      }

      if (!servicingObj.document) {
        throw new BadRequestError("VALIDATION-Invalid Document");
      }

      servicingObj.licenseeId = licenseeId;
      servicingObj.itemType = "trailer";
      servicingObj.itemId = trailer._id;

      let servicing = new TrailerServicing(servicingObj);
      trailerServicingDoc = await servicing.save();

      trailerServicingDoc = trailerServicingDoc._doc;
      trailerServicingDoc.document = trailerServicingDoc.document.data;

      trailerServicingDoc.serviceDate = moment(
        trailerServicingDoc.serviceDate
      ).format("YYYY-MM-DD");
      trailerServicingDoc.nextDueDate = moment(
        trailerServicingDoc.nextDueDate
      ).format("YYYY-MM-DD");
    }
    await licenseeNotification(
      "Trailer Added",
      `Trailer Added by ${req.requestFrom}`,
      "Inventory Update",
      trailer._id,
      fcmToken.fcmDeviceToken
    );
    res.status(200).send({
      success: true,
      message: "Successfully saved Trailer record",
      trailerObj: trailer,
      upsellItemsList: upsellItems,
      insuranceObj: trailerInsuranceDoc,
      servicing: trailerServicingDoc,
    });
  }
};

module.exports = addLicenseeTrailer;
