const mongoose = require('mongoose');

const Licensee = require('../../../models/licensees');
const Trailer = require('../../../models/trailers');
const TrailerRating = require('../../../models/trailerRatings');
const TrailerType = require('../../../models/trailerTypes');

const constants = require('../../../helpers/constants');
const rentalChargesData = require('../../../../test/testData/rentalChargesData');

/**
 * 
 * @api {GET} /trailers Get Trailers List
 * @apiName CA - Get Trailers List
 * @apiGroup Customer App - Trailer
 * 
 * 
 * @apiHeader {String} authorization Authorization token sent as a response to signIn request
 * 
 * 
 * @apiParam {String} count Count of Trailers to fetch
 * @apiParam {String} skip Number of Trailers to skip
 * @apiParam {String} pincode Pincodes separated by comma
 * @apiParam {String} address Address of the location
 * @apiParam {String} location Location in the format "latitude,longitude" ( e.g. location=43.8477,-111.6932 )
 * @apiParam {String} isFeatured Boolean representing whether a trailer is featured
 * @apiParam {String} isAvailable Boolean representing whether a trailer is available
 * @apiParam {String} name String to search for in name field
 * @apiParam {String} description String to search for in description field
 * @apiParam {String} size String to search for in size field
 * @apiParam {String} capacity String to search for in capacity field
 * @apiParam {String} features String to search for in features field
 * @apiParam {String} licenseeId String to search for in features field
 * 
 * 
 * @apiDescription API Endpoint GET /trailers
 * 
 * 
 * @apiSuccess {Boolean} success Success Status
 * @apiSuccess {String} message Success Message
 * @apiSuccess {Array} trailersList List of Trailer objects
 * 
 * 
 * @apiSuccessExample {String} - Success-Response:
 * HTTP/1.1 200
    {
        success: true,
        message: "Success",
        trailersList: []
    }
 * 
 * Sample API Call : http://localhost:5000/trailers?count=5&skip=0&pincode=83448,1560&location=43.8477,-111.6932
 * 
 * @apiErrorExample {json} Error-Response:
 * HTTP/1.1 400
    {
        success: false,
        message: "Could not fetch Trailers data",
        errorsList: []
    }
 * 
 * 
 */
async function getTrailers(req, res, next) {
    const searchCondition = {},
        searchConditionVendor = {};
    let validLicensees = [],
        licenseeIds = [];
    const pageCount = (req.query && req.query.count) ? parseInt(req.query.count) : constants.pageCount;
    const pageSkip = (req.query && req.query.skip) ? parseInt(req.query.skip) : constants.pageSkip;

    const projectionObj = {
        name: 1,
        vin:1,
        licenseeId: 1,
        rentalCharges: 1,
        adminRentalItemId: 1
    };

    let trailers = [];

    searchCondition.isDeleted = false;

    if(req.query.licenseeId) {
        searchCondition.licenseeId = mongoose.Types.ObjectId(req.query.licenseeId);
    }

    if (req.query.isFeatured && (req.query.isFeatured === "true")) {
        searchCondition.isFeatured = true;
    }

    if (req.query.name) {
        searchCondition.name = {
            $regex: new RegExp(req.query.name, "i")
        };
    }

    if (req.query.description) {
        searchCondition.description = {
            $regex: new RegExp(req.query.description, "i")
        };
    }

    if (req.query.size) {
        searchCondition.size = {
            $regex: new RegExp(req.query.size, "i")
        };
    }

    if (req.query.capacity) {
        searchCondition.capacity = {
            $regex: new RegExp(req.query.capacity, "i")
        };
    }

    if (req.query.tare) {
        searchCondition.tare = {
            $regex: new RegExp(req.query.tare, "i")
        };
    }

    if (req.query.age) {
        searchCondition.age = {
            $eq: parseInt(req.query.age)
        };
    }

    if (req.query.features) {
        searchCondition.features = {
            $elemMatch: {
                $regex: new RegExp(req.query.features, "i")
            }
        };
    }

    if (req.query.isAvailable && req.query.isAvailable === "true") {
        searchCondition.availability = req.query.isAvailable === "true";
    }

    const isSeachByPincode = req.query.pincode ? true : false;
    const isSeachByLocation = req.query.location ? true : false;
    const isSeachByAddress = req.query.address ? true : false;
    if (isSeachByPincode || isSeachByLocation || isSeachByAddress) {
        let licensees = [],
            pincodes = [],
            locationPoints = [];

        if (isSeachByPincode) {
            pincodes = req.query.pincode.split(",");
            searchCondition["address.pincode"] = { $in: pincodes };
            searchConditionVendor["address.pincode"] = searchCondition["address.pincode"];
        }
        if (isSeachByAddress) {
            searchCondition["address.text"] = {
                $elemMatch: {
                    $regex: new RegExp(req.query.address, "i")
                }
            };
            searchConditionVendor["address.text"] = searchCondition["address.text"];
        }
        if (isSeachByLocation) {
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

        trailers = await Trailer.find(searchCondition, projectionObj)
            .skip(pageSkip)
            .limit(pageCount);


        if (trailers.length < pageCount) {
            const pageCountBalance = pageCount - trailers.length;
            const pageSkipBalance = pageSkip + trailers.length;

            licensees = await Licensee.find(searchConditionVendor, { "_id": 1 });

            if (licensees && licensees.length > 0) {
                validLicensees = licensees.filter((licensee) => {
                    return (licensee && licensee._id)
                });
                licenseeIds = validLicensees.map((licensee) => {
                    return licensee._id;
                });
                if (licenseeIds.length > 0) {
                    const trailersBalance = await Trailer.find({ licenseeId: { $in: licenseeIds }, isDeleted: false }, projectionObj)
                        .skip(pageSkipBalance)
                        .limit(pageCountBalance);

                    if (trailersBalance && trailersBalance.length > 0) {
                        trailers = [...trailers, ...trailersBalance];
                    }
                }
            }
        }
    } else {
        trailers = await Trailer.find(searchCondition, projectionObj).skip(pageSkip).limit(pageCount);
    }

    const trailerIds = [];

    trailers.forEach((trailer, index) => {
        trailer = trailer._doc;
        const trailerId = trailer._id;
        trailerIds.push(trailerId);

        trailers[index] = trailer;

        if (!licenseeIds.includes(trailer.licenseeId)) {
            licenseeIds.push(trailer.licenseeId);
        }
    });
    const licensees = await Licensee.find({ _id: { $in: licenseeIds } }, { name: 1 });

    const averageRating = await TrailerRating.aggregate(
        [
            { $match: { itemId: { $in: trailerIds } } },
            { $group: { _id: "$itemId", avgRatingValue: { $avg: "$ratingValue" } } }
        ]
    ).exec();

    const outputTrailers = [];

    trailers.forEach(async (trailer, index) => {
        const trailerId = trailer._id.toString();
        const ratingIndex = averageRating.findIndex((rating) => {
            return (rating._id.toString() === trailerId)
        });
        const ratingValue = (ratingIndex === -1) ? 0 : averageRating[ratingIndex].avgRatingValue;
        trailers[index].rating = `${ratingValue}/5`;

        const licenseeObj = licensees.find((licensee) => {
            return (licensee._id.toString() === trailer.licenseeId.toString());
        });

        if(trailer.adminRentalItemId) {
            let rentalItemAdminObj = await TrailerType.findOne({ _id: trailer.adminRentalItemId }, { rentalCharges: 1 });
            trailer.rentalCharges = rentalItemAdminObj._doc.rentalCharges;
        } else if(!trailer.rentalCharges) {
            trailer.rentalCharges = JSON.parse(JSON.stringify(rentalChargesData));
        }
        const price = trailer.rentalCharges.door2Door.find((charges) => {
            return (charges.duration === constants.hirePeriod);
        });

        outputTrailers.push({
            _id: trailerId,
            name: trailer.name,
            licensee: licenseeObj ? `${licenseeObj.name}` : "",
            photo: trailer.photo,
            rating: ratingValue,
            price: `${price.charges} AUD`
        });
    });

    return res.status(200).send({
        success: true,
        message: "Success",
        trailersList: outputTrailers
    });
}

module.exports = getTrailers;
