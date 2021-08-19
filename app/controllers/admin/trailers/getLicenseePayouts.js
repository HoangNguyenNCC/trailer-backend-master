const Licensee = require('../../../models/licensees');
const LicenseePayouts = require('../../../models/licenseePayouts');
const Invoice = require('../../../models/invoices');
const User = require('../../../models/users');
const Trailer = require('../../../models/trailers');
const Upsell = require('../../../models/upsellItems');

const asyncForEach = require('../../../helpers/asyncForEach');
const constants = require('../../../helpers/constants');
const mongoose = require('mongoose');

const aclSettings = require('../../../helpers/getAccessControlList');
const{BadRequestError} = require('../../../helpers/errors');
/**
 * 
 * @api {GET} /admin/licensee/payouts Get Licensee Payout List
 * @apiName TAAT - Get Licensee Payout List
 * @apiGroup Admin App - Payments
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
 * API Endpoint GET /admin/licensee/payouts
 * 
 * 
 * @apiSuccessExample {String} - Success-Response:
 * HTTP/1.1 200
    {
        success: true,
        message: "Successfully fetched Licensee Payout List",
        licenseeList: []
    }
 * 
 * 
 * Sample API Call : http://localhost:5000/admin/licensee/payouts?count=10&skip=0
 * 
 * @apiErrorExample {json} Error-Response:
 * HTTP/1.1 400
    {
        success: false,
        message: "Error occurred while fetching Licensee Payout List",
        errorsList: []
    }
 * 
 * 
 */
async function getLicenseePayouts(req, res, next) {
   if(!req.requestFrom || !req.requestFrom.employeeId || !req.requestFrom.acl || !aclSettings.validateACL(req.requestFrom.acl, "PAYMENTS", "VIEW")) {
    throw new BadRequestError('Unauthorised Access')
    }
        let searchCondition = {}
        const pageCount = req.query.count ? parseInt(req.query.count) : constants.pageCount;
        const pageSkip = req.query.skip ? parseInt(req.query.skip) : constants.pageSkip;
        let licenseeD

        if(req.query.licenseeEmail){
            licenseeD = await Licensee.findOne({email : req.query.licenseeEmail},{_id:1,name:1})
            if(!licenseeD){
                throw new BadRequestError('No Licensee with this Email Found')
            }else{
                searchCondition['licenseeId'] = mongoose.Types.ObjectId(licenseeD._id)
            }
        }
        const licenseePayouts = await LicenseePayouts.find(searchCondition)
                                                    .sort({ updatedAt: -1 })
                                                    .skip(pageSkip)
                                                    .limit(pageCount);

        const licensees = {};
        await asyncForEach(licenseePayouts, async (licenseePayout, licenseeIndex) => {
            licenseePayout = licenseePayout._doc;

            const licenseeIdStr = licenseePayout.licenseeId.toString();
            if(!licensees[licenseeIdStr]) {
                let licensee = await Licensee.findOne({ _id: licenseePayout.licenseeId }, { name: 1 });
                licensee = licensee._doc;
                licensees[licenseeIdStr] = licensee;
            }
            let rental = await Invoice.findById({_id:mongoose.Types.ObjectId(licenseePayout.rentalId)})
            licenseePayout.trailerDetails = []
            licenseePayout.upsellDetails = []
            await asyncForEach(rental.rentedItems , async(item) => {
                if(item.itemType == "trailer"){
                    itemName = await Trailer.findOne({_id : item.itemId},{name : 1})
                    licenseePayout.trailerDetails.push({itemName,...item._doc})
                }else{
                    itemName = await Upsell.findOne({_id : item.itemId},{name : 1})
                    licenseePayout.upsellDetails.push({itemName,...item._doc})
                }
            })
            let customerName = await User.findById({_id:mongoose.Types.ObjectId(rental.bookedByUserId)},{name:1})
            licenseePayout.rentalObject = {
                licenseeName : licenseeD ? licenseeD.name : licensees[licenseeIdStr].name,
                customerName,
                rental ,
            }
            licenseePayouts[licenseeIndex] = licenseePayout;
        });

        const totalCount = await LicenseePayouts.countDocuments();

        res.status(200).send({
            success: true,
            message: "Successfully fetched Licensee Payout List",
            licenseePayoutsList: licenseePayouts,
            totalCount: totalCount
        });
}

module.exports = getLicenseePayouts;