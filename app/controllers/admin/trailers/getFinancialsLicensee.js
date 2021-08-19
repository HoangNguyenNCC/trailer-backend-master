const mongoose = require('mongoose');
const moment = require('moment');

const LicenseePayout = require('../../../models/licenseePayouts');
const Licensee = require('../../../models/licensees');

const asyncForEach = require('../../../helpers/asyncForEach');
const aclSettings = require('../../../helpers/getAccessControlList');
const { BadRequestError } = require('../../../helpers/errors');

/**
 * 
 * @api {GET} /admin/financial/licensee Get the Financial Summary of Trailer Rentals
 * @apiName TAAT - Get the Financial Summary of Trailer Rentals
 * @apiGroup Admin App - Financial
 * 
 * 
 * @apiHeader {String} authorization Authorization token sent as a response to signIn request
 * 
 * @apiParam {String} startDate Start Date of the period for which Financial Summary has to be calculated
 * @apiParam {String} endDate End Date of the period for which Financial Summary has to be calculated
 * 
 * 
 * @apiDescription 
 * 
 * API Endpoint GET /admin/financial/licensee
 * 
 * @apiSuccessExample {String} - Success-Response:
 * HTTP/1.1 200
    {
        success: true,
        message: "Successfully fetched Financial Summary",
        financialsObj: {
            total: 250,
            invoicesList: [ ],
            totalByTypeList: [ ]
        }
    }
 * 
 * Sample API Call : GET http://localhost:5000/admin/financial/licensee
 * 
 * @apiErrorExample {json} Error-Response:
 * HTTP/1.1 400
    {
        success: false,
        message: "Error occurred while fetching Financial Summary",
        errorsList: []
    }
 * 
 * 
 */
async function getFinancials(req, res, next) {
    // if (!req.requestFrom || !req.requestFrom.acl || !req.requestFrom.acl.includes("VIEW_FINANCIALS") || !req.requestFrom.employeeId) {
        if(!req.requestFrom || !req.requestFrom.employeeId || !req.requestFrom.acl || !aclSettings.validateACL(req.requestFrom.acl, "FINANCIALS", "VIEW")) {
            throw new BadRequestError('Unauthorised Access')
        }

        const searchCondition = {};
        const startDate = (req.query && req.query.startDate) ? moment(req.query.startDate).toISOString() : undefined;
        const endDate = (req.query && req.query.endDate) ? moment(req.query.endDate).toISOString() : undefined;

        // searchCondition['licenseeId'] = mongoose.Types.ObjectId(req.requestFrom.licenseeId);

        if(startDate && endDate) {
            searchCondition['rentalPeriod.start'] = { $gte: startDate, $lte: endDate };
        }

        let licenseePayoutTotal = await LicenseePayout.aggregate(
            [
                {
                    $match : searchCondition
                },
                {
                  $group:
                    {
                        _id: null,
                        total: { $sum: "$totalAmount" }
                    }
                }
            ]
        ).exec();

        let licenseePayoutByLicensee = await LicenseePayout.aggregate(
            [
                {
                    $match : searchCondition
                },
                {
                  $group:
                    {
                        _id: "$licenseeId",
                        total: { $sum: "$totalAmount" }
                    }
                }
            ]
        ).exec();
        const licenseePayoutTotalByLicensee = [];
        await asyncForEach(licenseePayoutByLicensee, async(licenseePayout) => {
            let licensee = await Licensee.findOne({ _id: licenseePayout._id }, { name: 1 });
            licensee = licensee._doc;

            licenseePayoutTotalByLicensee.push({
                licenseeId: licenseePayout._id,
                licenseeName: licensee.name,
                total: licenseePayout.total
            });
        });

        
        const invoices = await LicenseePayout.find(searchCondition, { totalAmount: 1 });
        /* const rentals = await Invoice.find(searchCondition).sort({ "rentalPeriod.start": 1 });
        if(rentals.length > 0) {
            const firstRentalStart = moment(rentals[0].rentalPeriod.start);
            const lastRentalEnd = moment(rentals[rentals.length - 1].end);

            const totalPeriod = lastRentalEnd.diff(firstRentalStart, 'minutes');
            const periodDiff = Math.floor(totalPeriod / 10);


        } */

        return res.status(200).send({
            success: true,
            message: "Successfully fetched Financial Summary",
            financialsObj: {
                total: (licenseePayoutTotal.length > 0) ? licenseePayoutTotal[0].total : 0,
                invoicesList: invoices,
                totalByLicenseeList: licenseePayoutTotalByLicensee
            },
            totalCount: licenseePayoutTotalByLicensee.length
        });
}

module.exports = getFinancials;