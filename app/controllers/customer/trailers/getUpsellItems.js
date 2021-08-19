const mongoose = require('mongoose');

const Licensee = require('../../../models/licensees');
const UpsellItem = require('../../../models/upsellItems');
const TrailerRating = require('../../../models/trailerRatings');
const UpsellItemType = require('../../../models/upsellItemTypes');

const objectSize = require('../../../helpers/objectSize');
const constants = require('../../../helpers/constants');

const rentalChargesData = require('../../../../test/testData/rentalChargesData');
const { BadRequestError } = require('./../../../helpers/errors');
/**
 * 
 * @api {GET} /upsellitems Get Upsell Items List
 * @apiName CA - Get Upsell Items List
 * @apiGroup Customer App - Trailer
 * 
 * 
 * @apiHeader {String} authorization Authorization token sent as a response to signIn request
 * 
 * 
 * @apiParam {String} trailerId Id of the Trailer for which Upsell Items have to be fetched
 * @apiParam {String} count Count of Upsell Items to fetch
 * @apiParam {String} skip Number of Upsell Items to skip
 * @apiParam {String} address Address of the location
 * @apiParam {String} pincode Pincodes separated by comma
 * @apiParam {String} location Location in the format "latitude,longitude" ( e.g. location=43.8477,-111.6932 )
 * 
 * 
 * @apiDescription API Endpoint GET /upsellitems
 * 
 * 
 * @apiSuccess {Boolean} success Success Status
 * @apiSuccess {String} message Success Message
 * @apiSuccess {Array} upsellItemsList List of Upsell Item objects
 * 
 * 
 * @apiSuccessExample {String} - Success-Response:
 * HTTP/1.1 200
    {
        success: true,
        message: "Success",
        upsellItemsList: []
    }
 * 
 * Sample API Call : http://localhost:5000/upsellitems?count=5&skip=0&pincode=83448,1560&location=-111.6932,43.8477
 * 
 * @apiErrorExample {json} Error-Response:
 * HTTP/1.1 400
    {
        success: false,
        message: "Could not fetch Upsell Items data",
        errorsList: []
    }
 * 
 * 
 */
async function getUpsellItems(req, res, next) {
    const searchCondition = {},
        searchConditionVendor = {};
    let validLicensees = [],
        licenseeIds = [];
    const pageCount = (req.query && req.query.count) ? parseInt(req.query.count) : constants.pageCount;
    const pageSkip = (req.query && req.query.skip) ? parseInt(req.query.skip) : constants.pageSkip;

    const projectionObj = {
        name: 1,
        licenseeId: 1,
        rentalCharges: 1,
        adminRentalItemId: 1
    };

    if(req.query && req.query.trailerType) {
        if (req.query.trailerType && objectSize(req.query.trailerType) < 12) {
            throw new BadRequestError("Invalid Trailer Type");
        }
        searchCondition.trailerType = mongoose.Types.ObjectId(req.query.trailerType);
    }

    searchCondition.isDeleted = false;

    let upsellitems = [];

    const isSeachByPincode = req.query.pincode ? true : false;
    const isSeachByLocation = req.query.location ? true : false;
    const isSeachByAddress = req.query.address ? true : false;
    if(isSeachByPincode || isSeachByLocation || isSeachByAddress) {
        let licensees = [];
        let pincodes = [],
            locationPoints = [];

        if(isSeachByPincode) {
            pincodes = req.query.pincode.split(",");

            searchCondition["address.pincode"] = { $in: pincodes };
            searchConditionVendor["address.pincode"] = searchCondition["address.pincode"];
        }
        if(isSeachByAddress) {
            searchCondition["address.text"] = {
                $elemMatch: {
                    $regex: new RegExp(req.query.address, "i")
                }
            };
            searchConditionVendor["address.text"] = searchCondition["address.text"];
        }
        if(isSeachByLocation) {
            const locationElems = req.query.location.split(",");
            if (locationElems.length >= 2) {
                locationPoints = [parseFloat(locationElems[1]), parseFloat(locationElems[0])];

                searchCondition["address.location"] = {
                    $near: {
                        $maxDistance: constants.maxDistance,
                        $geometry: {
                            type: "Point",
                            coordinates: locationPoints
                        }
                    }
                };
                searchConditionVendor["address.location"] = searchCondition["address.location"];
            }
        }

        upsellitems = await UpsellItem.find(searchCondition, projectionObj)
            .skip(pageSkip)
            .limit(pageCount);


        if(upsellitems.length < pageCount) {
            const pageCountBalance = pageCount - upsellitems.length;
            const pageSkipBalance = pageSkip + upsellitems.length;

            licensees = await Licensee.find(searchConditionVendor, { "_id": 1 });

            if(licensees && licensees.length > 0) {
                validLicensees = licensees.filter((licensee) => {
                    return (licensee && licensee._id)
                });
                licenseeIds = validLicensees.map((licensee) => {
                    return licensee._id;
                });
                if(licenseeIds.length > 0) {
                    const upsellitemsBalance = await UpsellItems.find({ licenseeId: { $in: licenseeIds } }, projectionObj)
                        .skip(pageSkipBalance)
                        .limit(pageCountBalance);

                    if(upsellitemsBalance && upsellitemsBalance.length > 0) {
                        upsellitems = [...upsellitems, ...upsellitemsBalance];
                    }
                }
            }
        }
    } else {
        upsellitems = await UpsellItem.find(searchCondition, projectionObj).skip(pageSkip).limit(pageCount);
    }

    const upsellitemIds = [];

    upsellitems.forEach((upsellitem, index) => {
        const upsellitemId = upsellitem._id;
        upsellitemIds.push(upsellitemId);

        if(!licenseeIds.includes(upsellitem.licenseeId)) {
            licenseeIds.push(upsellitem.licenseeId);
        }
    });

    const licensees = await Licensee.find({ _id: { $in: licenseeIds } }, { name: 1 });

    const averageRating = await TrailerRating.aggregate(
        [
            { $match: { itemId: { $in: upsellitemIds } } },
            { $group: { _id: "$itemId", avgRatingValue: { $avg: "$ratingValue" } } }
        ]
    ).exec();

    const outputUpsellItems = [];

    upsellitems.forEach(async (upsellitem, index) => {
        const upsellitemId = upsellitem._id.toString();
        const ratingIndex = averageRating.findIndex((rating) => {
            return (rating._id.toString() === upsellitemId)
        });
        const ratingValue = (ratingIndex === -1) ? 0 : averageRating[ratingIndex].avgRatingValue;
        upsellitems[index]._doc.rating = `${ratingValue}/5`;

        const licenseeObj = licensees.find((licensee) => {
            return (licensee._id.toString() === upsellitem.licenseeId.toString());
        });

        if(upsellitem.adminRentalItemId) {
            let rentalItemAdminObj = await UpsellItemType.findOne({ _id: upsellitem.adminRentalItemId }, { rentalCharges: 1 });
            upsellitem.rentalCharges = rentalItemAdminObj._doc.rentalCharges;
        } else if(!upsellitem.rentalCharges) {
            upsellitem.rentalCharges = JSON.parse(JSON.stringify(rentalChargesData));
        }

        const price = upsellitem.rentalCharges.door2Door.find((charges) => {
            return (charges.duration === constants.hirePeriod);
        });

        outputUpsellItems.push({
            _id: upsellitemId,
            name: upsellitem.name,
            licensee: licenseeObj ? `${licenseeObj.name}` : "",
            photo: upsellitem.photos[0],
            rating: ratingValue,
            price: `${price.charges} AUD`
        });
    });

    return res.status(200).send({
        success: true,
        message: "Success",
        upsellItemsList: outputUpsellItems
    });
}

module.exports = getUpsellItems;