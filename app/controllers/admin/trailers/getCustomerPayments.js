const User = require('../../../models/users');
const Licensee = require('../../../models/licensees');
const Invoice = require('../../../models/invoices');

const asyncForEach = require('../../../helpers/asyncForEach');
const constants = require('../../../helpers/constants');

const aclSettings = require('../../../helpers/getAccessControlList');
const{BadRequestError} = require('../../../helpers/errors')
/**
 * 
 * @api {GET} /admin/customer/payments Get Customer Payment List
 * @apiName TAAT - Get Customer Payment List
 * @apiGroup Admin App - Payments
 * 
 * 
 * @apiHeader {String} authorization Authorization token sent as a response to signIn request
 * 
 * 
 * @apiParam {String} count Count of Trailers to fetch
 * @apiParam {String} skip Number of Trailers to skip
 * 
 * 
 * @apiDescription 
 * 
 * API Endpoint GET /admin/customer/payments
 * 
 * 
 * @apiSuccessExample {String} - Success-Response:
 * HTTP/1.1 200
    {
        success: true,
        message: "Successfully fetched Customer Payments List",
        licenseeList: []
    }
 * 
 * 
 * Sample API Call : http://localhost:5000/admin/customer/payments?count=10&skip=0
 * 
 * @apiErrorExample {json} Error-Response:
 * HTTP/1.1 400
    {
        success: false,
        message: "Error occurred while fetching Customer Payment List",
        errorsList: []
    }
 * 
 * 
 */
async function getCustomerPayments(req, res, next) {
    if(!req.requestFrom || !req.requestFrom.employeeId || !req.requestFrom.acl || !aclSettings.validateACL(req.requestFrom.acl, "PAYMENTS", "VIEW")) {
            throw new BadRequestError('Unauthorised Access')
        }

        const pageCount = req.query.count ? parseInt(req.query.count) : constants.pageCount;
        const pageSkip = req.query.skip ? parseInt(req.query.skip) : constants.pageSkip;

        const searchCondition = { 
            "revisions.paidAmount": { $gt: 0 }, 
            "revisions.revisionType": { $in: ["rental", "reschedule", "extension", "cancellation"] }
        };

        const rentals = await Invoice.find(searchCondition)
            .sort({ updatedAt: -1 })
            .skip(pageSkip)
            .limit(pageCount);

        const licensees = {};
        const customers = {};
        await asyncForEach(rentals, async (rental, rentalIndex) => {
            rental = rental._doc;

            const licenseeIdStr = rental.licenseeId.toString();
            if(!licensees[licenseeIdStr]) {
                let licensee = await Licensee.findOne({ _id: rental.licenseeId }, { name: 1 });
                licensee = licensee._doc;
                licensees[licenseeIdStr] = licensee;
            }
            rental.licenseeName = licensees[licenseeIdStr].name;

            const bookedByUserIdStr = rental.bookedByUserId.toString();
            if(!customers[bookedByUserIdStr]) {
                let customer = await User.findOne({ _id: rental.bookedByUserId }, { name: 1 });
                customer = customer._doc;
                customers[bookedByUserIdStr] = customer;
            }
            rental.customerName = `${customers[bookedByUserIdStr].name}`;

            rental.paymentStatus = "complete";
            /* if(rental.authTransactionAction) {
                rental.paymentStatus = "complete";
            } else {
                rental.paymentStatus = "authorized";
            } */

            rentals[rentalIndex] = rental;
        });

        const totalCount = await Invoice.countDocuments(searchCondition);

        res.status(200).send({
            success: true,
            message: "Successfully fetched Customer Payments List",
            customerPaymentsList: rentals,
            totalCount: totalCount
        });
}

module.exports = getCustomerPayments;