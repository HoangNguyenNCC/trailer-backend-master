const mongoose = require('mongoose');

const Licensee = require('../../../models/licensees');
const Trailer = require('../../../models/trailers');
const UpsellItem = require('../../../models/upsellItems');
const TrailerServicing = require('../../../models/trailerServicing');

const asyncForEach = require('../../../helpers/asyncForEach');
const constants = require('../../../helpers/constants');

const aclSettings = require('../../../helpers/getAccessControlList');
const { BadRequestError } = require('../../../helpers/errors');


/**
 * 
 * @api {GET} /admin/licensee/servicing Get Trailer Servicing List
 * @apiName TAAL - Get Trailer Servicing List
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
 * API Endpoint GET /admin/licensee/servicing
 * 
 * 
 * @apiSuccessExample {String} - Success-Response:
 * HTTP/1.1 200
    {
        success: true,
        message: "Successfully fetched Trailer Servicing List",
        servicingList: []
    }
 * 
 * 
 * Sample API Call : http://localhost:5000/admin/licensee/servicing?count=10&skip=0
 * 
 * @apiErrorExample {json} Error-Response:
 * HTTP/1.1 400
    {
        success: false,
        message: "Error occurred while fetching Trailer Servicing List",
        errorsList: []
    }
 * 
 * 
 */
async function getTrailerServicing(req, res, next) {
    if(!req.requestFrom || !req.requestFrom.employeeId || !req.requestFrom.acl || !aclSettings.validateACL(req.requestFrom.acl, "SERVICING", "VIEW")) {
            throw new BadRequestError('Unauthorised Access')
        }

        const pageCount = req.query.count ? parseInt(req.query.count) : constants.pageCount;
        const pageSkip = req.query.skip ? parseInt(req.query.skip) : constants.pageSkip;
        const licenseeId = req.query.licenseeId;

        let trailerServicing;

        if(licenseeId){
            trailerServicing = await TrailerServicing.find({ licenseeId })
            .sort({ updatedAt: -1 })
            .skip(pageSkip)
            .limit(pageCount);
        }else{
            trailerServicing = await TrailerServicing.find({})
            .sort({ updatedAt: -1 })
            .skip(pageSkip)
            .limit(pageCount);
        }
        const trailers = {};
        const upsellItems = {};
        const licensees = {};

        // trailerServicing.forEach(async (servicing, index) => {
        await asyncForEach(trailerServicing, async(servicing, index) => {
            trailerServicing[index] = trailerServicing[index]._doc;
            servicing = trailerServicing[index];

            const itemIdStr = servicing.itemId.toString();

            let itemObj = {
                itemName: "Not Available",
                itemPhoto: "Not Available",
                licenseeId: "Not Available"
            }, itemDoc;
            if(servicing.itemType === "trailer") {
                if(trailers[itemIdStr]) {
                    itemObj = trailers[itemIdStr];
                } else {
                    itemDoc = await Trailer.findOne({ _id: servicing.itemId }, { name: 1, itemType: 1, licenseeId: 1 , vin :1});
                    if(itemDoc) {
                        itemDoc = itemDoc._doc;
                        itemObj = {
                            itemName: itemDoc.name,
                            itemPhoto: (itemDoc.photos && itemDoc.photos[0]) ? itemDoc.photos[0].data : null,
                            vin: itemDoc.vin,
                            licenseeId: itemDoc.licenseeId
                        };
                        trailers[itemIdStr] = itemObj;
                    }
                }
            } else {
                if(upsellItems[itemIdStr]) {
                    itemObj = upsellItems[itemIdStr];
                } else {
                    itemDoc = await UpsellItem.findOne({ _id: servicing.itemId }, { name: 1, itemType: 1, licenseeId: 1 });
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
            
            trailerServicing[index].itemName = itemObj.itemName || "Not Available";
            trailerServicing[index].itemPhoto = itemObj.itemPhoto || "Not Available";
            trailerServicing[index].vin = itemObj.vin|| "Not Available";
            trailerServicing[index].licenseeId = itemObj.licenseeId || "Not Available";
            
            if(!itemObj.licenseeId || itemObj.licenseeId === "Not Available") {
                trailerServicing[index].licenseeName = "Not Available";
            } else {
                const licenseeIdStr = itemObj.licenseeId ? itemObj.licenseeId.toString() : "";
                if(!licensees[licenseeIdStr]) {
                    const licenseeObj = await Licensee.findOne({ _id: itemObj.licenseeId }, { name: 1 });
                    // console.log("licenseeObj", (typeof licenseeObj), licenseeObj);
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
                trailerServicing[index].licenseeName = licensees[licenseeIdStr] ? licensees[licenseeIdStr].licenseeName : "Not Available";
            }

            trailerServicing[index].documentVerified = servicing.document.verified || false;
            trailerServicing[index].documentAccepted = servicing.document.accepted || false;
            /* if(servicing.document.contentType) {
                trailerServicing[index].documentType = servicing.document.contentType.split("/")[1];
            } */
            trailerServicing[index].document = servicing.document.data;
        });

        const totalCount = await TrailerServicing.countDocuments();

        res.status(200).send({
            success: true,
            message: "Successfully fetched Trailer Servicing List",
            servicingList: trailerServicing,
            totalCount: totalCount
        });
}

module.exports = getTrailerServicing;
