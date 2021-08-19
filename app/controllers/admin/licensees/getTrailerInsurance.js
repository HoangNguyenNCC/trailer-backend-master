const mongoose = require('mongoose');

const Licensee = require('../../../models/licensees');
const Trailer = require('../../../models/trailers');
const UpsellItem = require('../../../models/upsellItems');
const TrailerInsurance = require('../../../models/trailerInsurance');

const asyncForEach = require('../../../helpers/asyncForEach');
const constants = require('../../../helpers/constants');

const aclSettings = require('../../../helpers/getAccessControlList');
const { BadRequestError } = require('../../../helpers/errors');


/**
 *
 * @api {GET} /admin/licensee/insurance Get Trailer Insurance List
 * @apiName TAAL - Get Trailer Insurance List
 * @apiGroup Admin App - LicenseeTrailer
 *
 *
 * @apiHeader {String} authorization Authorization token sent as a response to signIn reque
 *
 *
 * @apiParam {String} count Count of Trailers to fetch
 * @apiParam {String} skip Number of Trailers to skip
 *
 *
 * @apiDescription
 *
 * API Endpoint GET admin/licensee/insurance
 *
 *
 * @apiSuccessExample {String} - Success-Response:
 * HTTP/1.1 200
    {
        success: true,
        message: "Successfully fetched Trailer Insurance List",
        insuranceList: []
    }
 *
 *
 * Sample API Call : http://localhost:5000/admin/licensee/insurance?count=10&skip=0
 *
 * @apiErrorExample {json} Error-Response:
 * HTTP/1.1 400
    {
        success: false,
        message: "Error occurred while fetching Trailer Insurance List",
        errorsList: []
    }
 *
 *
 */
async function getTrailerInsurance(req, res, next) {
   if(!req.requestFrom || !req.requestFrom.employeeId || !req.requestFrom.acl || !aclSettings.validateACL(req.requestFrom.acl, "INSURANCE", "VIEW")) {
            throw new BadRequestError('Unauthorised Access')
        }

        const pageCount = req.query.count ? parseInt(req.query.count) : constants.pageCount;
        const pageSkip = req.query.skip ? parseInt(req.query.skip) : constants.pageSkip;
        const licenseeId = req.query.licenseeId;

        let trailerInsurance;

        if(licenseeId){
          trailerInsurance = await TrailerInsurance.find({ licenseeId })
              .sort({ updatedAt: -1 })
              .skip(pageSkip)
              .limit(pageCount);
        }else{
          trailerInsurance = await TrailerInsurance.find({})
              .sort({ updatedAt: -1 })
              .skip(pageSkip)
              .limit(pageCount);
        }
        const trailers = {};
        const upsellItems = {};
        const licensees = {};

        await asyncForEach(trailerInsurance, async(insurance, index) => {
        // trailerInsurance.forEach(async (insurance, index) => {
            trailerInsurance[index] = trailerInsurance[index]._doc;
            insurance = trailerInsurance[index];

            const itemIdStr = insurance.itemId.toString();
            let itemObj = {
                itemName: "Not Available",
                itemPhoto: "Not Available",
                vin:"Not Available",
                licenseeId: "Not Available"
            }, itemDoc;
            if(insurance.itemType === "trailer") {
                if(trailers[itemIdStr]) {
                    itemObj = trailers[itemIdStr];
                } else {
                    itemDoc = await Trailer.findOne({ _id: insurance.itemId }, { name: 1, itemType: 1, licenseeId: 1 , vin:1 });
                    if(itemDoc) {
                        itemDoc = itemDoc._doc;
                        itemObj = {
                            itemName: itemDoc.name,
                            itemPhoto: (itemDoc.photos && itemDoc.photos[0]) ? itemDoc.photos[0].data : null,
                            vin : itemDoc.vin,
                            licenseeId: itemDoc.licenseeId
                        };
                        trailers[itemIdStr] = itemObj;
                    }
                }
            } else {
                if(upsellItems[itemIdStr]) {
                    itemObj = upsellItems[itemIdStr];
                } else {
                    itemDoc = await UpsellItem.findOne({ _id: insurance.itemId }, { name: 1, itemType: 1, licenseeId: 1 });
                    if(itemDoc) {
                        itemDoc = itemDoc._doc;
                        itemObj = {
                            itemName: itemDoc.name,
                            itemPhoto: (itemDoc.photos && itemDoc.photos[0]) ? itemDoc.photos[0].data : null,
                            licenseeId: itemDoc.licenseeId
                        };
                        upsellItems[itemIdStr] = itemObj;
                    }
                }
            }

            trailerInsurance[index].itemName = itemObj.itemName || "Not Available";
            trailerInsurance[index].itemPhoto = itemObj.itemPhoto || "Not Available";
            trailerInsurance[index].vin = itemObj.vin || "Not Available";
            trailerInsurance[index].licenseeId = itemObj.licenseeId || "Not Available";

            if(!itemObj.licenseeId || itemObj.licenseeId === "Not Available") {
                trailerInsurance[index].licenseeName = "Not Available";
            } else {
                const licenseeIdStr = itemObj.licenseeId ? itemObj.licenseeId.toString() : "";
                if(!licensees[licenseeIdStr]) {
                    const licenseeObj = await Licensee.findOne({ _id: itemObj.licenseeId }, { name: 1 });
                    if(licenseeObj) {
                        licensees[licenseeIdStr] = {
                            licenseeName: licenseeObj._doc.name
                        };
                    } else {
                        licensees[licenseeIdStr] = {
                            licenseeName: "Licensee"
                        };
                    }
                }
                trailerInsurance[index].licenseeName = licensees[licenseeIdStr] ? licensees[licenseeIdStr].licenseeName : "Not Available";
            }
            // insurance.document = insurance.document._doc;

            trailerInsurance[index].verified = insurance.document.verified || false;
            trailerInsurance[index].accepted = insurance.document.accepted || false;
            /* if(insurance.document.contentType) {
                trailerInsurance[index].documentType = insurance.document.contentType.split("/")[1];
            } */
            trailerInsurance[index].document = insurance.document.data;
        });

        const totalCount = await TrailerInsurance.countDocuments();

        res.status(200).send({
            success: true,
            message: "Successfully fetched Trailer Insurance List",
            insuranceList: trailerInsurance,
            totalCount: totalCount
        });
    
}

module.exports = getTrailerInsurance;
