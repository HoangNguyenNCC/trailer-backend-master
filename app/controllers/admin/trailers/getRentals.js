const mongoose = require('mongoose');

const User = require('../../../models/users');
const Invoice = require('../../../models/invoices');
const Trailer = require('../../../models/trailers');
const UpsellItem = require('../../../models/upsellItems');
const Licensee = require('../../../models/licensees');

const asyncForEach = require('../../../helpers/asyncForEach');
const constants = require('../../../helpers/constants');
const aclSettings = require('../../../helpers/getAccessControlList');
const { BadRequestError } = require('../../../helpers/errors');

/**
 * 
 * @api {GET} /admin/rentals Get Trailer or Upsell Item Rental or Upsell Item Buy Request data
 * @apiName TAAT - Get Trailer or Upsell Item Rental or Upsell Item Buy Request data
 * @apiGroup Admin App - Trailer Rental
 * 
 * 
 * @apiHeader {String} authorization Authorization Token sent as a response to signIn request
 * 
 * 
 * @apiParam {String} bookedByUserId Booked by User Id
 * @apiParam {String} count Count of Rentals data to fetch
 * @apiParam {String} skip Number of Rentals data to skip
 * @apiParam {Boolean} upcoming Do fetch Upcoming data or Past data
 * @apiParam {String} type Type of Rental Request - "rental", "extension", "reschedule"
 * @apiParam {Boolean} approved Whether to fetch approved Rental, Extension, Rescheduling requests
 * 
 * 
 * @apiDescription Get Trailer or Upsell Item Rental or Upsell Item Buy Requests
 * 
 * 
 * @apiSuccessExample {String} - Success-Response:
 * HTTP/1.1 200
    {
        success: true,
        message: "Successfully fetched Rental Request",
        requestList: [{
            
            // For Rentals, Extension and Reschedule Requests
            rentalId: <String>, // ID of the Rental
            rentedItem: <String>, // Rented Item - trailer or upsellitem
            rentedItemId: <String>, // ID of the Rented Item
            rentedItemName: <String>, // Name of the Rented Item
            rentedItemPhoto: <String>, // Link
            licenseeName: <String>,
            customerId: <String>,
            customerName: <String>,

            // For Extension Requests
            extendTill: <Date>,
            isApproved: <Integer>, // 0 - Pending, 1 - Approved, 2 - Rejected
            requestOn: <Date>,
            requestUpdatedOn: <Date>

            // For Reschedule Requests
            scheduleStart: <Date>,
            scheduleEnd: <Date>,
            isApproved: <Integer>, // 0 - Pending, 1 - Approved, 2 - Rejected
            requestOn: <Date>,
            requestUpdatedOn: <Date>
        }]
    }
 * 
 * Sample API Call : http://localhost:5000/rentals?count=5&skip=0
 * 
 * 
 * @apiErrorExample {json} Error-Response:
 * 
    HTTP/1.1 500
    {
        success: false,
        message: "Error occurred while fetching Rental Requests",
        errorsList: ["Error occurred while fetching Rental Requests"]
    }

    HTTP/1.1 400
    {
        success: false,
        message: "Missing Licensee ID"
    }
 * 
 * 
 */
async function getRentalRequests(req, res, next) {
    if(!req.requestFrom || !req.requestFrom.employeeId || !req.requestFrom.acl || !aclSettings.validateACL(req.requestFrom.acl, "RENTALS", "VIEW")) {
        throw new BadRequestError('Unauthorised Access')
        }

        const searchCondition = {};
        const pageCount = (req.query && req.query.count) ? parseInt(req.query.count) : constants.pageCount;
        const pageSkip = (req.query && req.query.skip) ? parseInt(req.query.skip) : constants.pageSkip;
        const isUpcoming = (req.query && req.query.upcoming) ? (req.query.upcoming === "true") : true;
        const queryType = (req.query && req.query.type) ? req.query.type : "rental";
        const isApproved = (req.query && req.query.approved) ? (req.query.approved === "true") : false;
        const bookedByUserId = (req.query && req.query.bookedByUserId) ? mongoose.Types.ObjectId(req.query.bookedByUserId) : undefined;

        if (bookedByUserId) {
            searchCondition["bookedByUserId"] = bookedByUserId;
        }
        if(req.query.customerEmail){
            let userId = await User.findOne({email:req.query.customerEmail},{_id:1})
            if(!userId){
                throw new BadRequestError('No Customer with Provided Email Registered')
            }
            searchCondition['bookedByUserId'] = mongoose.Types.ObjectId(userId._id)
        }else if(req.query.licenseeEmail){
            let userId = await Licensee.findOne({email:req.query.licenseeEmail},{_id:1})
            if(!userId){
                throw new BadRequestError('No Licensee with Provided Email Registered')
            }
            searchCondition['licenseeId'] = mongoose.Types.ObjectId(userId._id)
        }

        const currentDate = new Date();

        // searchCondition["transactionType"] = "rent";
        // searchCondition["rentalPeriod.start"] = { $gt: currentDate };
        /* if (isUpcoming) {
            searchCondition["rentalPeriod.start"] = { $gt: currentDate };
        } else {
            searchCondition["rentalPeriod.end"] = { $lte: currentDate };
        } */

        searchCondition["revisions.isApproved"] = isApproved;
        const trailerRentals = await Invoice.find(searchCondition).skip(pageSkip).limit(pageCount);
    

        let requestList = [];
        const licenseeList = {};
        const rentalItemsList = {};
        const customersList = {};

        await asyncForEach(trailerRentals, async(rental) => {
            rental = rental._doc;
         
            const customerIdStr = rental.bookedByUserId.toString();
            if (!Object.keys(customersList).includes(customerIdStr)) {
                customerObj = await User.findById({ _id: rental.bookedByUserId }, { name: 1 });
                if(customerObj === null){
                    return
                }
                customerObj = customerObj._doc;
                customersList[customerIdStr] = {
                    name: `${customerObj.name}`
                };
            }
            let rentalData = {
                rentalId: rental._id,
                customerId: customerIdStr,
                customerName: customersList[customerIdStr].name,
                ...rental
            };
           
            const rentedItems = []

            if(rental.rentedItems && rental.rentedItems.length > 0) {
                await asyncForEach(rental.rentedItems, async(rentedItem) => {
                    rentedItem = rentedItem._doc;
                    const rentedItemIdStr = rentedItem.itemId.toString();
                    if (!Object.keys(rentalItemsList).includes(rentedItemIdStr)) {
                        let rentedItemObj;
                        if (rentedItem.itemType === "trailer") {
                            rentedItemObj = await Trailer.findOne({ _id: rentedItem.itemId }, { name: 1 });
                        } else if (rentedItem.itemType === "upsellitem") {
                            rentedItemObj = await UpsellItem.findOne({ _id: rentedItem.itemId }, { name: 1 });
                        }
                        rentedItemObj = rentedItemObj._doc;
                        const licenseeIdStr = rental.licenseeId.toString();
                        const licensee = await Licensee.findOne({ _id: rental.licenseeId }, { name: 1 });
                        licenseeList[licenseeIdStr] = licensee._doc;
                        const licenseeName = licenseeList[licenseeIdStr].name;

                        rentalItemsList[rentedItemIdStr] = {
                            name: rentedItemObj.name,
                            photo: !!rentedItemObj.photos ? rentedItemObj.photos[0] : null,
                            licenseeName: licenseeName,
                            licenseeId: licenseeIdStr
                        };
                        rentedItems.push({
                            ...rentedItem,
                            itemName: rentedItemObj.name
                        });
                    }

                    rentalData = {
                        ...rentalData,
                        rentalItemsList: rentalItemsList,
                        licenseeId: rentalItemsList[rentedItemIdStr].licenseeId,
                        licenseeName: rentalItemsList[rentedItemIdStr].licenseeName,
                        rentedItems
                    };
                });
            }

            // console.log('trailer rentals', {});
            if(rental.revisions && rental.revisions.length > 0) {
                rental.revisions.forEach((revision) => {
                    revision = revision._doc;
                    console.log('revision' , {revision});
                    if(revision.revisionType === queryType) {
                        rentalData = {
                            ...rentalData,
                            isApproved: revision.approvedOn ? (revision.isApproved ? constants.approvalEnum["approved"] : constants.approvalEnum["rejected"]) : constants.approvalEnum["pending"],
                            rentalPeriodStart: revision.start,
                            rentalPeriodEnd: revision.end,
                            requestType: revision.revisionType,
                        };
                        requestList.push(rentalData);
                    }
                });
            }
        });

        return res.status(200).send({
            success: true,
            message: "Successfully fetched Rental Requests",
            requestList: requestList,
            totalCount: requestList.length
        });
}

module.exports = getRentalRequests;