const mongoose = require('mongoose');
const moment = require('moment');

const User = require('../../../models/users');
const Invoice = require('../../../models/invoices');
const Trailer = require('../../../models/trailers');
const UpsellItem = require('../../../models/upsellItems');
const TrailerInsurance = require('../../../models/trailerInsurance');
const TrailerServicing = require('../../../models/trailerServicing');

const aclSettings = require('../../../helpers/getAccessControlList');
const asyncForEach = require('../../../helpers/asyncForEach');
const constants = require('../../../helpers/constants');
const {
    BadRequestError,
    ForbiddenError,
    NotFoundError,
    UnauthorizedError,
    ApiError
  } = require("./../../../helpers/errors");


 
// const minDate = moment().subtract(30, "days").toDate();
// const maxDate = moment().add(30, "days").toDate();

// const minDate = moment().subtract(30, "days").format('YYYY-MM-DD[T00:00:00.000Z]');
// const maxDate = moment().add(30, "days").format('YYYY-MM-DD[T00:00:00.000Z]');

/**
 * 
 * @api {GET} /reminders Get Reminders List
 * @apiName LA - Get Reminders List
 * @apiGroup Licensee App - Trailer
 * 
 * 
 * @apiHeader {String} authorization Authorization token sent as a response to signIn request
 * 
 * 
 * @apiParam {String} count Count of Reminders to fetch
 * @apiParam {String} skip Number of Reminders to skip
 * 
 * 
 * @apiDescription API Endpoint GET /reminders
 * 
 * 
 * @apiSuccess {Boolean} success Success Status
 * @apiSuccess {String} message Success Message
 * @apiSuccess {Array} remindersList List of Reminders
 * 
 * 
 * @apiSuccessExample {String} - Success-Response:
 * HTTP/1.1 200
    {
        success: true,
        message: "Successfully fetched Reminders data",
        remindersList: [
            {
                "itemId": "5e4132b4603c2159b3e58ac0",
                "itemName": "2020 C&B DMP610-6TA 26\"",
                "itemPhoto": "http://localhost:5000/file/trailer/5e4132b4603c2159b3e58ac0/1",
                "reminderType": "Insurance Deadline",
                "expiringItemId": "5e6a21e450792f3929f89c03",
                "expiryDate": "2020-06-30T18:30:00.000Z",
                "statusText": "48 Days",
                "reminderColor": "#00BE75"
            },
            {
                "itemId": "5e4132b4603c2159b3e58ac0",
                "itemName": "2020 C&B DMP610-6TA 26\"",
                "itemPhoto": "http://localhost:5000/file/trailer/5e4132b4603c2159b3e58ac0/1",
                "reminderType": "Service Deadline",
                "expiringItemId": "5e6a12cf776139306e8bccdb",
                "expiryDate": "2020-06-04T18:30:00.000Z",
                "statusText": "83 Days",
                "reminderColor": "#00BE75"
            },
            {
                "itemId": "5e4132b4603c2159b3e58ac0",
                "itemName": "2020 C&B DMP610-6TA 26\"",
                "itemPhoto": "http://localhost:5000/file/trailer/5e4132b4603c2159b3e58ac0/1",
                "reminderType": "Service Appointment",
                "expiringItemId": "5e6a12f7776139306e8bccdc",
                "expiryDate": "2019-06-04T18:30:00.000Z",
                "statusText": "282 Days",
                "reminderColor": "#FF6C00"
            },
            {
                "itemId": "5e4132b4603c2159b3e58ac3",
                "itemName": "2019 AirTow E-14",
                "itemPhoto": "http://localhost:5000/file/trailer/5e4132b4603c2159b3e58ac3/1",
                "reminderType": "End Of Life",
                "statusText": "2 Years",
                "reminderColor": "#FF6C00"
            },
            {
                "rentalId": "5e734853fd4ae72be8e7719c",
                "itemId": "5e624533d9613b458a36cf24",
                "itemName": "2020 Big 10 BT610SA - 1",
                "itemPhoto": "http://localhost:5000/file/trailer/5e624533d9613b458a36cf24/1",
                "reminderType": "Upcoming Rental",
                "statusText": "In 5 days",
                "reminderColor": "#00BE75"
            }
        ]
    }
 * 
 * Sample API Call : http://localhost:5000/reminders?count=5&skip=0
 * 
 * @apiErrorExample {json} Error-Response:
 * HTTP/1.1 400
    {
        success: false,
        message: "Error occurred while fetching Reminders data",
        errorsList: []
    }
 * 
 * 
 */
async function getReminders(req, res, next) {
    if (!req.requestFrom || !aclSettings.validateACL(req.requestFrom.acl, "REMINDERS", "VIEW") || !req.requestFrom.licenseeId) {
           throw new ForbiddenError('Unauthorised Error');
        }

        //----------------------------------------------------------------------------------

        const minDate = moment().subtract(constants.dayDiff.min, "days");
        const maxDate = moment().add(constants.dayDiff.max, "days");

        const todayStartDate = moment().startOf("day").toISOString();
        const todayEndDate = moment().endOf("day").toISOString();

        const rangeStartDate = moment().toISOString();
        const rangeEndDate = moment().add(700, "days").toISOString();

        const rentalEndRangeStartDate = moment().toISOString();
        const rentalEndRangeEndDate = moment().add(2, "days").toISOString();

        //----------------------------------------------------------------------------------

        const licenseeId = req.requestFrom.licenseeId;

        const pageCount = (req.query && req.query.count) ? parseInt(req.query.count) : constants.pageCount;
        const pageSkip = (req.query && req.query.skip) ? parseInt(req.query.skip) : constants.pageSkip;
        const insuranceReminders = await TrailerInsurance.aggregate(
            [
                {
                    $sort: {
                        expiryDate: -1
                    }
                },
                {
                    $group: {
                        _id: "$itemId",
                        reminder: {
                            $first: {
                                itemType: "$itemType",
                                reminderType: "Insurance",
                                expiringItemId: "$_id",
                                expiryDate: "$expiryDate"
                            }
                        }
                    }
                }
                /* ,
                {
                    $match: {
                        "reminder.expiryDate": {
                            $gte: new Date(minDate),
                            $lte: new Date(maxDate)
                        }
                    }
                } */
            ]
        ).exec();

        const serviceReminders = await TrailerServicing.aggregate(
            [
                {
                    $sort: {
                        nextDueDate: -1
                    }
                },
                {
                    $group: {
                        _id: "$itemId",
                        reminder: {
                            $first: {
                                itemType: "$itemType",
                                reminderType: "Service",
                                expiringItemId: "$_id",
                                expiryDate: "$nextDueDate"
                            }
                        }
                    }
                },
            ]
        ).exec();

        const allReminders = [
            ...insuranceReminders,
            ...serviceReminders
        ];

        //----------------------------------------------------------------------------------

        const trailers = {};
        const upsellitems = {};
        await asyncForEach(allReminders, async(reminder) => {
            if (reminder.reminder.itemType === "trailer") {
                if (!trailers[reminder._id]) {
                    const trailer = await Trailer.findOne({ _id: reminder._id });
                    trailers[reminder._id] = trailer;
                }
            } else if (reminder.reminder.itemType === "upsellitem") {
                if (!upsellitems[reminder._id]) {
                    const upsellitem = await UpsellItem.findOne({ _id: mongoose.Types.ObjectId(reminder._id) });
                    upsellitems[reminder._id] = upsellitem;
                }
            }
        });

        //----------------------------------------------------------------------------------

        const reminders = [];

        allReminders.forEach((reminder, reminderIndex) => {
            const remId = reminder._id.toString();
            const itemType = reminder.reminder.itemType;
            const expiringItemId = reminder.reminder.expiringItemId;
            const expiryDate = reminder.reminder.expiryDate;
            const remDayDiff = moment(expiryDate).diff(moment(), "days");

            const remColor = (remDayDiff < 0) ? constants.colorCodes.expired : constants.colorCodes.willExpire;
            const remType = (remDayDiff < 0) ? `${reminder.reminder.reminderType} Appointment` : `${reminder.reminder.reminderType} Deadline`;

            if (remDayDiff >= -constants.dayDiff.min && remDayDiff <= constants.dayDiff.max) {
                const item = (itemType === "trailer") ? trailers[remId] : upsellitems[remId];
                if(item && item.licenseeId && licenseeId && item.licenseeId.toString() === licenseeId.toString()) {
                    console.log({item});
                    reminders.push({
                        itemType: itemType,
                        itemId: remId,
                        rentedItemType: item.type,
                        adminRentalItemId: item.adminRentalItemId,
                        itemName: item.name,
                        itemPhoto: item.photos[0],
                    
                        reminderType: remType,
                        expiringItemId: expiringItemId.toString(),
                        expiryDate: expiryDate,
                        statusText: `${Math.abs(remDayDiff)} Days`,
                        reminderColor: remColor
                    });
                }
            }
        });

        //----------------------------------------------------------------------------------

        const agedTrailers = await Trailer.find({ age: { $gt: constants.maxAge }, licenseeId: licenseeId, isDeleted: false }, { age: 1, name: 1, licenseeId: 1, type: 1, adminRentalItemId: 1, photos: 1 });

        agedTrailers.forEach((trailer, trailerIndex) => {
            reminders.push({
                itemId: trailer._id.toString(),
                itemType: trailer.type,
                adminRentalItemId: trailer.adminRentalItemId,
                itemName: trailer.name,
                itemPhoto: trailer.photos[0],

                reminderType: "End Of Life",
                statusText: `${(trailer.age - constants.maxAge)} Years`,
                reminderColor: constants.colorCodes.expired
            });
        });

        //-----------------------------------------------------------------------------------

        const upcomingRentals = await Invoice.find(
            { 
                "rentalPeriod.start": { $gt: new Date(rangeStartDate), $lte: new Date(rangeEndDate) },
                "licenseeId": licenseeId
            }, 
            { 
                rentedItems: 1, 
                rentalPeriod: 1,
                isPickUp: 1,
                pickUpLocation: 1,
                dropOffLocation: 1,
                bookedByUserId: 1,
                totalCharges: 1,
                rentalStatus: 1
            }
        ).sort({updatedAt: 'desc'});
        
        await asyncForEach(upcomingRentals, async(rental, rentalIndex) => {
            const reminder = await createRentalReminder("upcoming", rental);
            reminders.push(reminder);
        });

        //-----------------------------------------------------------------------------------

        const ongoingRentals = await Invoice.find(
            { 
                "rentalPeriod.end": { $gt: new Date(rentalEndRangeStartDate), $lte: new Date(rentalEndRangeEndDate) },
                "licenseeId": licenseeId,
                "revisions.isApproved": { $eq: 1, $ne: 2 }, 
                "revisions.revisionType": { $ne: "cancellation" },
                "revisions": { $ne: [] }
            }, 
            { 
                rentedItems: 1, 
                rentalPeriod: 1,
                isPickUp: 1,
                pickUpLocation: 1,
                dropOffLocation: 1,
                bookedByUserId: 1,
                totalCharges: 1,
                rentalStatus: 1
            }
        );

        await asyncForEach(ongoingRentals, async(rental, rentalIndex) => {
            const reminder = await createRentalReminder("ongoing", rental);
            reminders.push(reminder);
        });

        //-----------------------------------------------------------------------------------

        const todayDropOffReminders = [];
        const todayDropoffs = await Invoice.find(
            { 
                "rentalPeriod.start": { $gt: new Date(todayStartDate), $lte: new Date(todayEndDate) },
                "licenseeId": licenseeId,
                "revisions.isApproved": { $eq: 1, $ne: 2 }, 
                "revisions.revisionType": { $ne: "cancellation" },
                "revisions": { $ne: [] }
            }, 
            { 
                rentedItems: 1, 
                rentalPeriod: 1,
                isPickUp: 1,
                pickUpLocation: 1,
                dropOffLocation: 1,
                bookedByUserId: 1,
                totalCharges: 1,
                rentalStatus: 1
            }
        );
        
        await asyncForEach(todayDropoffs, async(rental, rentalIndex) => {
            const reminder = await createRentalReminder("dropoff", rental);
            todayDropOffReminders.push(reminder);
        });

        //-----------------------------------------------------------------------------------

        const todayPickupsReminders = [];
        const todayPickups = await Invoice.find(
            { 
                "rentalPeriod.end": { $gt: new Date(todayStartDate), $lte: new Date(todayEndDate) },
                "licenseeId": licenseeId,
                "revisions.isApproved": { $eq: 1, $ne: 2 }, 
                "revisions.revisionType": { $ne: "cancellation" },
                "revisions": { $ne: [] }
            }, 
            { 
                rentedItems: 1, 
                rentalPeriod: 1,
                isPickUp: 1,
                pickUpLocation: 1,
                dropOffLocation: 1,
                bookedByUserId: 1,
                totalCharges: 1,
                rentalStatus: 1
            }
        );

        await asyncForEach(todayPickups, async(rental, rentalIndex) => {
            const reminder = await createRentalReminder("pickup", rental);
            todayPickupsReminders.push(reminder);
        });

        //-----------------------------------------------------------------------------------

        return res.status(200).send({
            success: true,
            message: "Successfully fetched Reminders data",
            remindersList: reminders,
            todayDropOffsList: todayDropOffReminders,
            todayPickupsList: todayPickupsReminders,
        });
}

function createRentalReminder(rentalType, rental) {
    return new Promise(async (resolve, reject) => {
            rental = rental._doc;
        
            const remDayDiff = moment(rental.rentalPeriod.start).diff(moment(), "days");


            if(rental.pickUpLocation) {
                rental.pickUpLocation = {
                    text: rental.pickUpLocation ? rental.pickUpLocation.text : "",
                    pincode: rental.pickUpLocation ? rental.pickUpLocation.pincode : "",
                    coordinates: (rental.pickUpLocation && rental.pickUpLocation.location) ? rental.pickUpLocation.location.coordinates : undefined
                };

                rental.pickUpLocation.coordinates = [rental.pickUpLocation.coordinates[1], rental.pickUpLocation.coordinates[0]];
            }

            if(rental.dropOffLocation) {
                rental.dropOffLocation = {
                    text: rental.dropOffLocation ? rental.dropOffLocation.text : "",
                    pincode: rental.dropOffLocation ? rental.dropOffLocation.pincode : "",
                    coordinates: (rental.dropOffLocation && rental.dropOffLocation.location) ? rental.dropOffLocation.location.coordinates : undefined
                };

                rental.dropOffLocation.coordinates = [rental.dropOffLocation.coordinates[1], rental.dropOffLocation.coordinates[0]];
            }

            const reminder = {
                invoiceId: rental._id.toString(),

                isPickUp: rental.isPickUp,
                pickUpLocation: rental.pickUpLocation,
                dropOffLocation: rental.dropOffLocation,
                status: rental.rentalStatus,
                rentedItems: []
            };

            if(rentalType === "upcoming") {
                reminder.reminderType = "Upcoming Rental";
                reminder.statusText = `In ${Math.abs(remDayDiff)} days`;
                reminder.reminderColor = constants.colorCodes.willExpire;
            } else if(rentalType === "ongoing") {
                reminder.reminderType = "Ending Rental";
                reminder.statusText = `In ${Math.abs(remDayDiff)} days`;
                reminder.reminderColor = constants.colorCodes.willExpire;
            } else if(rentalType === "dropoff") {
                const remHourDiff = moment(rental.rentalPeriod.start).diff(moment(), "hours");

                reminder.reminderType = "Today's DropOff";
                reminder.statusText = (remHourDiff > 0) ? `In ${Math.abs(remHourDiff)} hours` : `Before ${Math.abs(remHourDiff)} hours`;
                reminder.rentalPeriodStart = moment(rental.rentalPeriod.start).format('YYYY-MM-DD HH:mm');
                reminder.rentalPeriodEnd = moment(rental.rentalPeriod.end).format('YYYY-MM-DD HH:mm');
                reminder.reminderColor = constants.colorCodes.willExpire;
            } else if(rentalType === "pickup") {
                const remHourDiff = moment(rental.rentalPeriod.end).diff(moment(), "hours");

                reminder.reminderType = "Today's Pickup";
                reminder.statusText = (remHourDiff > 0) ? `In ${Math.abs(remHourDiff)} hours` : `Before ${Math.abs(remHourDiff)} hours`;
                reminder.rentalPeriodStart = moment(rental.rentalPeriod.start).format('YYYY-MM-DD HH:mm');
                reminder.rentalPeriodEnd = moment(rental.rentalPeriod.end).format('YYYY-MM-DD HH:mm');
                reminder.reminderColor = constants.colorCodes.willExpire;
            }

            let customer = await User.findOne({ _id: rental.bookedByUserId }, { name: 1, mobile: 1, address: 1 });
            if(customer) {
                customer = customer._doc;

                reminder.customerName = customer.name ? customer.name : "";
                reminder.customerMobile = customer.mobile ? customer.mobile : "";
                reminder.customerPhoto = customer.photo;
                reminder.customerAddress = {
                    text: (customer.address && customer.address.text) ? customer.address.text : "",
                    pincode: (customer.address && customer.address.pincode) ? customer.address.pincode : "",
                    coordinates: (customer.address && customer.address.location) ? customer.address.location._doc.coordinates : ""
                };

                reminder.customerAddress.coordinates = [reminder.customerAddress.coordinates[1], reminder.customerAddress.coordinates[0]];
            }

            if(rental.rentedItems && rental.rentedItems.length > 0) {

                await asyncForEach(rental.rentedItems, async(rentedItem, rentedItemIndex) => {
                    const itemIdStr = rentedItem.itemId.toString();
                    let rentedItemObj;

                    if (rentedItem.itemType === "trailer") {
                        rentedItemObj = await Trailer.findOne({ _id: rentedItem.itemId }, { name: 1, type: 1, licenseeId: 1, adminRentalItemId: 1, photos: 1 });
                        // trailers[itemIdStr] = rentedItemObj;
                    } else if (rentedItem.itemType === "upsellitem") {
                        rentedItemObj= await UpsellItem.findOne({ _id: rentedItem.itemId }, { name: 1, type: 1, licenseeId: 1, adminRentalItemId: 1, photos: 1 });
                        // upsellitems[itemIdStr] = rentedItemObj;
                    }
                    console.log({rentedItemObj});
                    if(rentedItemObj) {
                        reminder.rentedItems.push({
                            itemType: rentedItem.itemType,
                            itemId: rentedItem.itemId.toString(),
                            rentedItemType: rentedItemObj.type,
                            adminRentalItemId: rentedItemObj.adminRentalItemId,
                            itemName: rentedItemObj.name,
                            itemPhoto: rentedItemObj.photos[0]
                        });
                    }
                });
            }

            resolve(reminder);
    });
}

module.exports = getReminders;