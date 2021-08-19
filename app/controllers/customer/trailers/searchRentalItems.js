const mongoose = require('mongoose');
const NodeGeocoder = require('node-geocoder');
const moment = require('moment');

const Licensee = require('../../../models/licensees');
const Trailer = require('../../../models/trailers');
const UpsellItem = require('../../../models/upsellItems');
const TrailerType = require('../../../models/trailerTypes');
const UpsellItemType = require('../../../models/upsellItemTypes');
const TrailerRating = require('../../../models/trailerRatings');
const Invoice = require('../../../models/invoices');
const TrailerBlocking = require('../../../models/trailerBlocking');
const Commission = require('../../../models/commissions');
const Discount = require('../../../models/discounts');
const RentalItemType = require('../../../models/rentalItemTypes');

const asyncForEach = require('../../../helpers/asyncForEach');
const getDistance = require('../../../helpers/getDistance');
const constants = require('../../../helpers/constants');

const rentalChargesData = require('../../../../test/testData/rentalChargesData');
const { UnauthorizedError, BadRequestError } = require('../../../helpers/errors');

/**
 * 
 * @api {POST} /search Search Trailers
 * @apiName CA - Search Trailers
 * @apiGroup Customer App - Trailer
 * 
 * 
 * @apiHeader {String} authorization Authorization token sent as a response to signIn request
 * 
 * 
 * @apiParam {String} count Count of records ( default - 5 )
 * @apiParam {String} skip Number of records ( default - 0 )
 * @apiParam {String} location Address of the location [latitude, longitude]
 * @apiParam {Array} dates Range Array ["Start Date", "End Date"] ( "DD MMM, YYYY" )
 * @apiParam {Array} times Range Array ["Start Time", "End Time"] ( "DD MMM, YYYY" )
 * @apiParam {String} delivery Type of Delivery ( "door2door" || "pickup" ) ( default - "door2door" )
 * @apiParam {Array} type Type of Rental Item
 * 
 * 
 * @apiDescription API Endpoint POST /search
 * 
 * 
 * @apiSuccess {Boolean} success Success Status
 * @apiSuccess {String} message Success Message
 * @apiSuccess {Array} trailers List of Trailer Objects
 * 
 * 
 * @apiSuccessExample {String} - Success-Response:
 * HTTP/1.1 200
    {
        success: true,
        message: "Success",
        trailers: [
            {
                rentalItemId: "",
                name: "Tuffmate",
                type: "cage-trailer",
                price: "120.55 AUD",
                photo: "<Link to Photo>",
                licenseeId: "",
                licenseeName: "Licensee 1",
                rating: 4,
                rentalItemType: "trailer",

                upsellItems: [
                    {
                        rentalItemId: "",
                        name: "Aluminium Folding Ramps",
                        type: "aluminium-ramps",
                        price: "20.55 AUD",
                        photo: "<Link to Photo>",
                        licenseeId: "",
                        licenseeName: "Licensee 1",
                        rating: 3,
                        rentalItemType: "upsellitem",
                    }
                ]
            }
        ]
    }
 * 
 * 
 * @apiErrorExample {json} Error-Response:
 * HTTP/1.1 400
    {
        success: false,
        message: "Could not get trailers"
    }
 * 
 * 
 */
async function searchTrailers(req, res, next) {

        if (!req.userId) throw new UnauthorizedError('UnAuthorized Access');

        const body = req.body;

        let outputRentalItems = [];
    
        const pageCount = (body && body.count) ? parseInt(body.count) : constants.pageCount;
        const pageSkip = (body && body.skip) ? parseInt(body.skip) : constants.pageSkip;
        const delivery = (body && body.delivery) ? body.delivery : constants.delivery;
        
        const rentalItemTypes = (body && body.type) ? body.type : [];
        const upsellItemTypes = [], trailerTypes = [];

        const rentalItemTypesList = await RentalItemType.find({});
        let totalTrailerTypes = 0, totalUpsellItemTypes = 0;
        rentalItemTypesList.forEach((itemType) => {
            if(itemType.itemtype === "upsellitem") {
                totalUpsellItemTypes += 1;
                if(rentalItemTypes.includes(itemType.code)) {
                    upsellItemTypes.push(itemType.code);
                }
            } else if(itemType.itemtype === "trailer") {
                totalTrailerTypes += 1;
                if(rentalItemTypes.includes(itemType.code)) {
                    trailerTypes.push(itemType.code);
                }
            }
        });

        let location = body.location;
        if (!location) {
            throw new BadRequestError("Location is invalid");
        }

        let dates = body.dates;
        if(!dates || dates.length !== 2) {
            throw new BadRequestError("Dates are invalid");
        }

        let times = body.times;
        if(!times || times.length !== 2) {
            throw new BadRequestError("Times are invalid");
        }

        const startDate = moment(new Date(`${dates[0]} ${times[0]}`));
        const endDate = moment(new Date(`${dates[1]} ${times[1]}`));

        if(!startDate.isValid()) {
            throw new BadRequestError("Start DateTime is invalid");
        }

        if(!endDate.isValid()) {
            throw new BadRequestError("End DateTime is invalid");
        }

        const currentDate = moment();
        const sixMonthsDate = moment().add(6, "months");

        if(startDate.isAfter(endDate)) {
            throw new BadRequestError("Start Date should be prior to End Date");
        }

        if(startDate.isBefore(currentDate)) {
            throw new BadRequestError("You can not book for past dates");
        }

        if(startDate.isAfter(sixMonthsDate)) {
            throw new BadRequestError("You can book upto six months in advance");
        }
        
        let locationPoints;
        if(typeof location === "string") {
            const options = {
                provider: 'google',
            
                // Optional depending on the providers
                // fetch: customFetchImplementation,
                apiKey: 'AIzaSyDiNDCHQ-mHTx3LD_TWdihaMVGQSiF7NQg', // for Mapquest, OpenCage, Google Premier
                formatter: null // 'gpx', 'string', ...
            };

            const geocoder = NodeGeocoder(options);
            const geoCodeRes = await geocoder.geocode(location);
            locationPoints = [ geoCodeRes[0].longitude, geoCodeRes[0].latitude ];
        } else if(location.length === 2) {
            locationPoints = location;
        } else {
            throw new BadRequestError("Location is Invalid Format");
        }

        let licensees = await Licensee.find({}, { name: 1, address: 1, workingDays: 1, workingHours: 1, radius: 1, isEmailVerified: 1, isMobileVerified: 1 });

        const distanceFromLicensee = {};
        let availableLicensees = licensees.filter((licensee, licenseeIndex) => {
        
            licensee = licensee._doc;
            let isAvailable = false;

            if (!licensee.isEmailVerified || !licensee.isMobileVerified) return false;
        
            // distance-based check ------------------------------------------------
        
            const expectedDist = licensee.radius;
            let actualDistance = getDistance(location[0], location[1], licensee.address.location.coordinates[1], licensee.address.location.coordinates[0]);
            actualDistance = Math.round((actualDistance + Number.EPSILON) * 100) / 100;
        
            distanceFromLicensee[licensee._id.toString()] = `${actualDistance} km`;
        
            isAvailable = (actualDistance < expectedDist);
            // console.log({expectedDist, actualDistance, location, isAvailable, id: licensee.__id , name:licensee.name});
        
            // working days & time based check --------------------------------------
        
            if(isAvailable) {
                const startDateDay = startDate.format("dddd").toLowerCase();
                const endDateDay = endDate.format("dddd").toLowerCase();
            
                if(
                    licensee.workingDays.includes(startDateDay) && 
                    licensee.workingDays.includes(endDateDay)
                ) {
                    const startTimeStr = startDate.format("LT");
                    const startTime = standardizeTime(startTimeStr);
                
                    const endTimeStr = endDate.format("LT");
                    const endTime = standardizeTime(endTimeStr);

                    const licenseeWorkingTimeParts = licensee.workingHours.split("-");
                    const licenseeStartTime = parseInt(licenseeWorkingTimeParts[0]);
                    const licenseeEndTime = parseInt(licenseeWorkingTimeParts[1]);
                    console.log(`startTime ${startTime} endTime ${endTime} licenseeStartTime ${licenseeStartTime} licenseeEndTime ${licenseeEndTime}`)
                    if((checkTimeInBetween(licenseeStartTime,licenseeEndTime,startTime) && (checkTimeInBetween(licenseeStartTime,licenseeEndTime,endTime)))) {
                        isAvailable = true;
                    }
                    else{
                        isAvailable = false;
                    }
                } else {
                    isAvailable = false;
                }
            }

            return isAvailable;
        });

        // console.log(`Available for booking${availableLicensees}`);

        if(availableLicensees.length > 0) {
            const availableLicenseeIds = [];
            const licenseeData = {};
            availableLicensees.forEach((licensee) => {
                licensee.distance = distanceFromLicensee[licensee._id.toString()];
                availableLicenseeIds.push(licensee._id);
                licenseeData[licensee._id.toString()] = licensee;
            });
            
            // -----------------------------------------------------------------------

            let bookedRentalItemIds = [];
            let bookedRentalItemData = {};

            const bookedRentalItemSearchCond = {
                $and: [
                    {
                        licenseeId: { $in: availableLicenseeIds }
                    },
                    {
                        "rentalPeriod.start": { $lte: endDate.toISOString() }
                    },
                    {
                        "rentalPeriod.end": { $gte: startDate.toISOString() }
                    }
                ]
            };
        

            const bookedRentalItems = await Invoice.find(bookedRentalItemSearchCond, { rentalPeriod: 1, rentedItems: 1 });
            bookedRentalItems.forEach((bookedRentalItem, bookedRentalItemIndex) => {
                bookedRentalItem = bookedRentalItem._doc;
                bookedRentalItem.rentedItems.forEach(rentedItem => {
                    rentedItem = rentedItem._doc;
                    const itemId = rentedItem.itemId.toString();

                    bookedRentalItemIds.push(itemId);

                    if(rentedItem.itemType === "upsellitem") {
                        if(bookedRentalItemData[itemId]) {
                            bookedRentalItemData[itemId] += rentedItem.units;
                        } else {
                            bookedRentalItemData[itemId] = rentedItem.units;
                        }
                    }
                });
            });
            // -----------------------------------------------------------------------
        
            const blockedRentalItemSearchCond = {
                $and: [
                    {
                        licenseeId: { $in: availableLicenseeIds }
                    },
                    {
                        startDate: { $lte: endDate.toISOString() }
                    },
                    {
                        endDate: { $gte: startDate.toISOString() }
                    },
                    {
                        isDeleted: false
                    }
                ]
            };
        
            const blockedRentalItems = await TrailerBlocking.find(blockedRentalItemSearchCond, { items: 1, startDate: 1 });
            blockedRentalItems.forEach((blockedRentalItem, blockedRentalItemIndex) => {
                blockedRentalItem = blockedRentalItem._doc;

                blockedRentalItem.items.forEach((item, itemIndex) => {
                    const itemId = item.itemId.toString();
                    bookedRentalItemIds.push(itemId);
                    if(item.itemType === "upsellitem") {
                        if(bookedRentalItemData[itemId]) {
                            bookedRentalItemData[itemId] += item.units;
                        } else {
                            bookedRentalItemData[itemId] = item.units;
                        }
                    }
                });
            });

            // -----------------------------------------------------------------------

            let trailers = [], trailerIds = [], trailerIdsStr = [];
            let upsellItems = [], upsellItemIds = [], upsellItemIdsStr = []; 
            

            if(trailerTypes.length === 0 && upsellItemTypes.length > 0) {
                const upsellItemSearchCond = {
                    licenseeId: { $in: availableLicenseeIds },
                    availability: true,
                    trailerId: { $exists: true },
                    isDeleted: false
                };

                if(upsellItemTypes.length > 0) {
                    upsellItemSearchCond.type = { $in: upsellItemTypes };
                }
                
                let upsellItemsTemp = await UpsellItem.find(upsellItemSearchCond, { trailerId: 1, licenseeId: 1, type: 1, name: 1, rentalCharges: 1, quantity: 1, adminRentalItemId: 1, trailerModel: 1 });
                
                upsellItemsTemp = upsellItemsTemp.filter((upsellItem, upsellItemIndex) => {
                    upsellItem = upsellItem._doc;

                    const bookedRentalItem = bookedRentalItemData[upsellItem._id.toString()];
                    if(bookedRentalItem) {
                        return (upsellItem.quantity > bookedRentalItem.units);
                    } else {
                        return true;
                    }
                });

                const upsellItemTrailerIds = upsellItemsTemp.map(upsellItem => {
                    return upsellItem._doc.trailerId;
                });

                const upsellItemTrailerModelIds = upsellItemsTemp.map(upsellItem => upsellItem._doc.trailerModel);

                const trailerSearchCond = {
                    $and: [
                        { trailerModel: { $in: upsellItemTrailerModelIds } },
                        { _id: { $nin: bookedRentalItemIds } },
                        { isDeleted: false }
                    ]
                };

                trailers = await Trailer.find(trailerSearchCond, { licenseeId: 1, type: 1, name: 1, rentalCharges: 1, adminRentalItemId: 1, trailerModel: 1 });

                trailerIds = trailers.map((trailer, trailerIndex) => {
                    return trailer._doc._id;
                });
                trailerIdsStr = trailers.map((trailer, trailerIndex) => {
                    return trailer._doc._id.toString();
                });

                await asyncForEach(trailers, async (trailer, trailerIndex) => {
                    trailer = trailer._doc;
                
                    trailer.rentalItemType = "trailer";

                    trailer.upsellItems = [];
                    trailer.includesAllUpsell = false;
                    trailer.numberOfUpsell = 0;

                    trailers[trailerIndex] = trailer;
                });
                
                await asyncForEach(trailers, async (trailer, trailerIndex) => {
                    
                    trailer.upsellItems = upsellItemsTemp.filter(upsellItem => {
                        return (upsellItem._doc.trailerModel.toString() === trailer._doc.trailerModel.toString());
                    });

                    trailer.upsellItems = trailer.upsellItems.map((upsellItem, upsellItemIndex) => {
                        upsellItem = upsellItem._doc;

                        const bookedRentalItem = bookedRentalItemData[upsellItem._id.toString()];
                        if(bookedRentalItem) {
                            upsellItem.availableQuantity = (upsellItem.quantity - bookedRentalItem.units);
                        } else {
                            upsellItem.availableQuantity = upsellItem.quantity;
                        }
                
                        upsellItem.rentalItemType = "upsellitem";

                        upsellItemIds.push(upsellItem._id);
                        upsellItemIdsStr.push(upsellItem._id.toString());

                        return upsellItem;
                    });
                    
                    const trailerUpsellItemTypes = trailer.upsellItems.map((trailerUpsellItem) => {
                        return trailerUpsellItem.type;
                    });

                    const intersection = upsellItemTypes.filter(itemType => trailerUpsellItemTypes.includes(itemType));
                    trailer.numberOfUpsell = (upsellItemTypes.length > 0) ? intersection.length : trailer.upsellItems.length;
                    if(intersection.length === upsellItemTypes.length) {
                        trailer.includesAllUpsell = false;
                    }

                    trailers[trailerIndex] = trailer;
                });
            } else {
                const trailerSearchCond = {
                    _id: { $nin: bookedRentalItemIds },
                    licenseeId: { $in: availableLicenseeIds },
                    availability: true,
                    isDeleted: false
                };

                if(trailerTypes.length > 0) {
                    trailerSearchCond.type = { $in: trailerTypes };
                }

                if(upsellItemTypes.length > 0) {
                    trailers = await Trailer.find(trailerSearchCond);
                } else{
                    trailers = await Trailer.find(trailerSearchCond).sort({ updatedAt: -1 }).skip(pageSkip).limit(pageCount);
                }
                trailerIds = trailers.map((trailer, trailerIndex) => {
                    return trailer._doc._id;
                });
                trailerIdsStr = trailers.map((trailer, trailerIndex) => {
                    return trailer._doc._id.toString();
                });

                await asyncForEach(trailers, async (trailer, trailerIndex) => {
                    trailer = trailer._doc;
                
                    trailer.rentalItemType = "trailer";

                    trailer.upsellItems = [];
                    trailer.includesAllUpsell = false;
                    trailer.numberOfUpsell = 0;

                    trailers[trailerIndex] = trailer;
                });

                let fetchUpsellItems = false;
                if(trailerTypes.length === 0 && upsellItemTypes.length === 0) {
                    fetchUpsellItems = true;
                }
                if(trailerTypes.length > 0 && upsellItemTypes.length > 0) {
                    fetchUpsellItems = true;
                }
                
                if(fetchUpsellItems) {
                    await asyncForEach(trailers, async (trailer, trailerIndex) => {
                        const upsellItemSearchCond = {
                            // _id: { $nin: bookedRentalItemIds },
                            licenseeId: { $in: availableLicenseeIds },
                            availability: true,
                            // trailerId: trailer._id,
                            trailerModel: trailer.trailerModel,
                            isDeleted: false
                        };

                        if(upsellItemTypes.length > 0) {
                            upsellItemSearchCond.type = { $in: upsellItemTypes };
                        }
                        
                        trailer.upsellItems = await UpsellItem.find(upsellItemSearchCond, { trailerId: 1, licenseeId: 1, type: 1, name: 1, rentalCharges: 1, quantity: 1, adminRentalItemId: 1, trailerModel: 1 });
                        
                        trailer.upsellItems = trailer.upsellItems.filter((upsellItem, upsellItemIndex) => {
                            upsellItem = upsellItem._doc;
        
                            const bookedRentalItem = bookedRentalItemData[upsellItem._id.toString()];
                            if(bookedRentalItem) {
                                return (upsellItem.quantity > bookedRentalItem.units);
                            } else {
                                return true;
                            }
                        });

                        trailer.upsellItems = trailer.upsellItems.map((upsellItem, upsellItemIndex) => {
                            upsellItem = upsellItem._doc;

                            const bookedRentalItem = bookedRentalItemData[upsellItem._id.toString()];
                            if(bookedRentalItem) {
                                upsellItem.availableQuantity = (upsellItem.quantity - bookedRentalItem.units);
                            } else {
                                upsellItem.availableQuantity = upsellItem.quantity;
                            }
                        
                            upsellItem.rentalItemType = "upsellitem";

                            upsellItemIds.push(upsellItem._id);
                            upsellItemIdsStr.push(upsellItem._id.toString());

                            return upsellItem;
                        });
                        
                        const trailerUpsellItemTypes = trailer.upsellItems.map((trailerUpsellItem) => {
                            return trailerUpsellItem.type;
                        });

                        const intersection = upsellItemTypes.filter(itemType => trailerUpsellItemTypes.includes(itemType));
                        trailer.numberOfUpsell = (upsellItemTypes.length > 0) ? intersection.length : trailer.upsellItems.length;
                        if(intersection.length === upsellItemTypes.length) {
                            trailer.includesAllUpsell = false;
                        }

                        trailers[trailerIndex] = trailer;
                    });
                }
            }

            // -----------------------------------------------------------------------

            const adminTrailerIds = [];

            const availableTrailerIdsStr = trailerIdsStr.filter((trailerId) => {
                return !bookedRentalItemIds.includes(trailerId);
            });
            const availableTrailerIds = availableTrailerIdsStr.map((trailerId) => {
                return mongoose.Types.ObjectId(trailerId);
            });

            const availableTrailers = trailers.filter((trailer) => {
                if(availableTrailerIdsStr.includes(trailer._id.toString())) {
                    adminTrailerIds.push(trailer.adminRentalItemId);
                    return true;
                }
                return false;
            });
        
            // -----------------------------------------------------------------------

            const adminUpsellItemIds = [];

            const availableUpsellItemIdsStr = upsellItemIdsStr.filter((upsellItemId) => {
                return !bookedRentalItemIds.includes(upsellItemId);
            });
            const availableUpsellItemIds = availableUpsellItemIdsStr.map((upsellItemId) => {
                return mongoose.Types.ObjectId(upsellItemId);
            });

            const availableUpsellItems = upsellItems.filter((upsellitem) => {
                if(availableUpsellItemIdsStr.includes(upsellitem._id.toString())) {
                    adminUpsellItemIds.push(upsellitem.adminRentalItemId);
                    return true;
                }
                return false;
            });

            // -----------------------------------------------------------------------

            const availableRentalItemIds = [
                ...availableTrailerIds,
                ...availableUpsellItemIds
            ];

            const availableRentalItems = [
                ...availableTrailers,
                ...availableUpsellItems
            ];

            const adminRentalItemIds = [
                ...adminTrailerIds,
                ...adminUpsellItemIds
            ];

            // ----------------------------------------------------------

            const averageRating = await TrailerRating.aggregate(
                [
                    { $match: { itemId: { $in: availableRentalItemIds } } },
                    { $group: { _id: "$itemId", avgRatingValue: { $avg: "$ratingValue" } } }
                ]
            ).exec();

            // ----------------------------------------------------------

            let trailerTypesList = [], upsellItemTypesList = [];
            let discountsList = [], commissionsList = [];
            if(availableRentalItems.length > 0) {
                discountsList = await Discount.find({ itemId: { $in: adminRentalItemIds } }, { chargeType: 1, charge: 1 });
                commissionsList = await Commission.find({ itemId: { $in: adminRentalItemIds } }, { chargeType: 1, charge: 1 });
            }

            const licenseeRentalItems = {};
            await asyncForEach(availableRentalItems, async (availableRentalItem, availableRentalItemIndex) => {
                
                const licenseeId = availableRentalItem.licenseeId ? availableRentalItem.licenseeId.toString() : "NotDefined";
            
                // ----------------------------------------------------------

                const ratingIndex = averageRating.findIndex((rating) => {
                    if(rating && rating._id && availableRentalItem && availableRentalItem._id) {
                        return (rating._id.toString() === availableRentalItem._id.toString())
                    }
                    return false;
                });
                const ratingValue = (ratingIndex === -1) ? 0 : averageRating[ratingIndex].avgRatingValue;
                availableRentalItem.rating = ratingValue;

                availableRentalItem.licenseeDistance = licenseeData[licenseeId.toString()] ? licenseeData[licenseeId.toString()].distance : "0";
                availableRentalItem.licenseeName = licenseeData[licenseeId.toString()] ? licenseeData[licenseeId.toString()].name : "Licensee";

                // ----------------------------------------------------------

                if(!licenseeRentalItems[licenseeId]) {
                    licenseeRentalItems[licenseeId] = {};
                }

                if(!availableRentalItem.rentalCharges) {
                    if(availableRentalItem.adminRentalItemId) {
                        let rentalItemAdminObj;
                        if(availableRentalItem.rentalItemType === "trailer") {
                            rentalItemAdminObj = trailerTypesList[trailerTypesList.findIndex((trailerType, trailerTypeIndex) => { 
                                if(trailerType && trailerType._id && availableRentalItem && availableRentalItem.adminRentalItemId) {
                                    trailerType = trailerType._doc;
                                    return (trailerType._id.toString() === availableRentalItem.adminRentalItemId.toString());
                                }
                                return false;
                            })];
                            if(!rentalItemAdminObj) {
                                rentalItemAdminObj = await TrailerType.findOne({ _id: availableRentalItem.adminRentalItemId }, { rentalCharges: 1 });
                                trailerTypesList.push(rentalItemAdminObj);
                            }
                        } else if(availableRentalItem.rentalItemType === "upsellitem") {
                            rentalItemAdminObj = upsellItemTypesList[upsellItemTypesList.findIndex((upsellItemType, upsellItemTypeIndex) => { 
                                if(upsellItemType && upsellItemType._id && availableRentalItem && availableRentalItem.adminRentalItemId) {
                                    upsellItemType = upsellItemType._doc;
                                    return (upsellItemType._id.toString() === availableRentalItem.adminRentalItemId.toString());
                                }
                                return false;
                            })];
                            if(!rentalItemAdminObj) {
                                rentalItemAdminObj = await UpsellItemType.findOne({ _id: availableRentalItem.adminRentalItemId }, { rentalCharges: 1 });
                                upsellItemTypesList.push(rentalItemAdminObj);
                            }
                        }
                        
                        if(rentalItemAdminObj){
                            availableRentalItem.rentalCharges = rentalItemAdminObj._doc.rentalCharges;
                        }
                    } else {
                        availableRentalItem.rentalCharges = JSON.parse(JSON.stringify(rentalChargesData));
                    }
                } else {
                    // console.log("Cond 3");
                }

                if(availableRentalItem.rentalCharges) {
                    const rental = {
                        isPickUp: (delivery === "pickup"),
                        /* rentalCharges: {
                            pickUp: [...availableRentalItem.rentalCharges.pickUp],
                            door2Door: [...availableRentalItem.rentalCharges.door2Door]
                        }, */
                        rentalCharges: JSON.parse(JSON.stringify(availableRentalItem.rentalCharges)),
                        rentalPeriod: {
                            start: startDate.toISOString(),
                            end: endDate.toISOString()
                        },
                        doChargeDLR: true
                    };

                    const commission = commissionsList[commissionsList.findIndex( commission => { 
                        if(commission && commission.itemId && availableRentalItem && availableRentalItem.adminRentalItemId) {
                            return (commission.itemId.toString() === availableRentalItem.adminRentalItemId.toString())
                        }
                        return false;
                    })];
                    const discount = discountsList[discountsList.findIndex( discount => { 
                        if(discount && discount.itemId && availableRentalItem && availableRentalItem.adminRentalItemId) {
                            return (discount.itemId.toString() === availableRentalItem.adminRentalItemId.toString())
                        }
                        return false;
                    })];

                    const totalCharges = Invoice.calculateCharges(rental, rental.rentalPeriod.start, rental.rentalPeriod.end, commission, discount);

                    availableRentalItem.totalCharges = totalCharges;
                    availableRentalItem.total = totalCharges.total;
                    
                    if(availableRentalItem.upsellItems) {
                        await asyncForEach(availableRentalItem.upsellItems, async(upsellItem, upsellItemIndex) => {
                            if(!upsellItem.rentalCharges) {
                                if(upsellItem.adminRentalItemId) {
                                    let rentalItemAdminObj;
                                    if(upsellItem.rentalItemType === "trailer") {
                                        // rentalItemAdminObj = await TrailerType.findOne({ _id: upsellItem.adminRentalItemId }, { rentalCharges: 1 });
                                        rentalItemAdminObj = trailerTypesList[trailerTypesList.findIndex((trailerType, trailerTypeIndex) => { 
                                            if(trailerType && trailerType._id && upsellItem && upsellItem.adminRentalItemId) {
                                                trailerType = trailerType._doc;
                                                return (trailerType._id.toString() === upsellItem.adminRentalItemId.toString());
                                            }
                                            return false;
                                        })];
                                        if(!rentalItemAdminObj) {
                                            rentalItemAdminObj = await TrailerType.findOne({ _id: upsellItem.adminRentalItemId }, { rentalCharges: 1 });
                                            trailerTypesList.push(rentalItemAdminObj);
                                        }
                                    } else if(upsellItem.rentalItemType === "upsellitem") {
                                        // rentalItemAdminObj = await UpsellItemType.findOne({ _id: upsellItem.adminRentalItemId }, { rentalCharges: 1 });
                                        rentalItemAdminObj = upsellItemTypesList[upsellItemTypesList.findIndex((upsellItemType, upsellItemTypeIndex) => { 
                                            if(upsellItemType && upsellItemType._id && upsellItem && upsellItem.adminRentalItemId) {
                                                upsellItemType = upsellItemType._doc;
                                                return (upsellItemType._id.toString() === upsellItem.adminRentalItemId.toString());
                                            }
                                            return false;
                                        })];
                                        if(!rentalItemAdminObj) {
                                            rentalItemAdminObj = await UpsellItemType.findOne({ _id: upsellItem.adminRentalItemId }, { rentalCharges: 1 });
                                            upsellItemTypesList.push(rentalItemAdminObj);
                                        }
                                    }
                                    upsellItem.rentalCharges = rentalItemAdminObj.rentalCharges;
                                } else {
                                    upsellItem.rentalCharges = JSON.parse(JSON.stringify(rentalChargesData));
                                }
                            }
                         
                            const rental = {
                                // transactionType: "rent",
                                isPickUp: (delivery === "pickup"),
                                rentalCharges: JSON.parse(JSON.stringify(upsellItem.rentalCharges)),
                                rentalPeriod: {
                                    start: startDate.toISOString(),
                                    end: endDate.toISOString()
                                },
                                doChargeDLR: true
                            };
        
                            let commission = commissionsList[commissionsList.findIndex( commission => { 
                                if(commission && commission.itemId && upsellItem && upsellItem.adminRentalItemId) {
                                    return (commission.itemId.toString() === upsellItem.adminRentalItemId.toString())
                                }
                                return false;
                            })];
                            if(!commission) {
                                commission = await Commission.findOne({ itemId: upsellItem.adminRentalItemId }, { chargeType: 1, charge: 1 });
                                commissionsList.push(commission);
                            }
                            let discount = discountsList[discountsList.findIndex( discount => { 
                                if(discount && discount.itemId && upsellItem && upsellItem.adminRentalItemId) {
                                    return (discount.itemId.toString() === upsellItem.adminRentalItemId.toString())
                                }
                                return false;
                            })];
                            if(!discount) {
                                discount = await Discount.findOne({ itemId: upsellItem.adminRentalItemId }, { chargeType: 1, charge: 1 });
                                discountsList.push(discount);
                            }

                            const totalCharges = Invoice.calculateCharges(rental, rental.rentalPeriod.start, rental.rentalPeriod.end, commission, discount);
        
                            upsellItem.totalCharges = totalCharges;
                            upsellItem.total = totalCharges.total;

                            // availableRentalItem.total += upsellItem.total;

                            availableRentalItem.upsellItems[upsellItemIndex] = upsellItem;
                        });
                    }
                    availableRentalItems[availableRentalItemIndex] = availableRentalItem;
                } else {
                    availableRentalItem.totalCharges = {
                        "total": 0.00,
                        "rentalCharges": 0.00,
                        "dlrCharges": 0.00,
                        "t2yCommission": 0.00,
                        "discount": 0.00,
                        "lateFees": 0.00,
                        "cancellationCharges": 0.00,
                        "taxes": 0.00
                    };
                    availableRentalItem.total = 0.00;
                    availableRentalItems[availableRentalItemIndex] = availableRentalItem;
                }
            });

            // ----------------------------------------------------------

            /* if(rentalItemTypes.length > 0) {
                outputRentalItems = [];
            
                if(trailerTypes.length > 0 && upsellItemTypes.length > 0) {
                    for(let i = upsellItemTypes.length; i >= 0; i--) {
                        availableRentalItems.forEach(rentalItem => {
                            if(rentalItem.numberOfUpsell === i) {
                                outputRentalItems.push(rentalItem);
                            }
                        });
                    }
                } else {
                    outputRentalItems = [
                        ...availableRentalItems
                    ];
                }
            } else {
                outputRentalItems = [
                    ...availableTrailers,
                    ...availableUpsellItems
                ];
            } */
            const noOfIter = upsellItemTypes.length > 0 ? upsellItemTypes.length : totalUpsellItemTypes;
            outputRentalItems = [];
            for(let sortIndex = noOfIter; sortIndex >= 0; sortIndex--) {
                availableRentalItems.forEach(rentalItem => {
                    if(rentalItem.numberOfUpsell === sortIndex) {
                        outputRentalItems.push(rentalItem);
                    }
                });
            }

            // ----------------------------------------------------------

            let startIndex = pageSkip;
            startIndex = ((outputRentalItems.length - 1) >= startIndex) ? startIndex : undefined;
            const countRemaining = (startIndex !== undefined) ? (outputRentalItems.length - startIndex) : 0;
            let endIndex = (countRemaining === 0) ? undefined : ((countRemaining > pageCount) ? (pageSkip + pageCount) : (startIndex + countRemaining));

            if(startIndex === undefined || endIndex === undefined) {
                outputRentalItems = [];
            } else {
                let newOutputTrailers = outputRentalItems.slice(startIndex, endIndex);
                outputRentalItems = newOutputTrailers;
            }

            // ----------------------------------------------------------

            outputRentalItems.forEach((outputRentalItem, outputRentalItemIndex) => {
                const data = {
                    rentalItemId: outputRentalItem._id,
                    name: outputRentalItem.name,
                    type: outputRentalItem.type,
                    price: `${outputRentalItem.total ? outputRentalItem.total : 0} AUD`,
                    photo: outputRentalItem.photos,
                    licenseeId: outputRentalItem.licenseeId,
                    licenseeName: outputRentalItem.licenseeName,
                    licenseeDistance: outputRentalItem.licenseeDistance,
                    rating: outputRentalItem.rating,
                    rentalItemType: outputRentalItem.rentalItemType
                };

                if(outputRentalItem.rentalItemType === "upsellitem") {
                    data.availableQuantity = outputRentalItem.availableQuantity ? parseInt(outputRentalItem.availableQuantity) : 0;
                }

                if(outputRentalItem.upsellItems) {
                    data.upsellItems = [];
                    outputRentalItem.upsellItems.forEach((upsellItem) => {
                        data.upsellItems.push({
                            rentalItemId: upsellItem._id,
                            name: upsellItem.name,
                            type: outputRentalItem.type,
                            price: `${upsellItem.total ? upsellItem.total : 0} AUD`,
                            photo: upsellItem.photos,
                            licenseeId: upsellItem.licenseeId,
                            licenseeName: upsellItem.licenseeName,
                            rating: upsellItem.rating,
                            rentalItemTyp: upsellItem.rentalItemType,
                            availableQuantity: upsellItem.availableQuantity ? parseInt(upsellItem.availableQuantity) : 0
                        });
                    });
                }
                outputRentalItems[outputRentalItemIndex] = data;
            });

            // ----------------------------------------------------------
        }

        return res.status(200).send({
            success: true,
            message: "Success",
            trailers: outputRentalItems
        });
}

function standardizeTime(timeIn) {
    // 11:00 AM
    const timeParts = timeIn.split(" ");
    const timePartComps = timeParts[0].split(":");
    timePartComps[0] = parseInt(timePartComps[0]);
    timePartComps[1] = parseInt(timePartComps[1]);

    if(timePartComps.length === 2) {
        if(timeParts.length === 2) {
            if(timeParts[1].toLowerCase() === "am") {
                if(timePartComps[0] === 12) {
                    timePartComps[0] = 0;
                }
            } else if(timeParts[1].toLowerCase() === "pm") {
                if(timePartComps[0] < 12) {
                    timePartComps[0] += 12;
                }
            }

            return (timePartComps[0] * 100) + timePartComps[1];
        } else {
            return (timePartComps[0] * 100) + timePartComps[1];
        }
    } else {
        return parseInt(timeIn);
    }
}

const checkTimeInBetween = (startTime , endTime , checkTime) => {
    if(startTime < endTime){
        if((checkTime > startTime) && (checkTime < endTime)){
            return true ;
        }
        else{
            return false ;
        }
    }
    else{
        if(startTime <= checkTime){
            return true ;
        }
        else if((checkTime <=endTime)){
            return true ;
        }
        else{
            return false ;
        }
    }
}

module.exports = searchTrailers;
