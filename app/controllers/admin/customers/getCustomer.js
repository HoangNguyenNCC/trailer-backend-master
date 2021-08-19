const mongoose = require('mongoose');
const validator = require('validator');
const moment = require('moment');

const User = require('../../../models/users');

const objectMinusKeys = require('../../../helpers/objectMinusKeys');
const objectSize = require('../../../helpers/objectSize');
const constants = require('../../../helpers/constants');

const aclSettings = require('../../../helpers/getAccessControlList');
const dateUtils = require('../../../helpers/dateUtils');
const {BadRequestError} = require('./../../../helpers/errors');

/**
 * 
 * @api {GET} /admin/customer Get Customers Details
 * @apiName TAAC - Get Customers Details
 * @apiGroup Admin App - Customer
 * 
 * 
 * @apiHeader {String} authorization Authorization token sent as a response to signIn request
 * 
 * 
 * @apiParam {String} id Id of the Customer
 * 
 * 
 * @apiDescription 
 * 
 * API Endpoint GET /admin/customer
 * 
 * 
 * @apiSuccessExample {String} - Success-Response:
 * HTTP/1.1 200
    {
        success: true,
        message: "Successfully fetched Customers Details",
        customerList: []
    }
 * 
 * 
 * Sample API Call : http://localhost:5000/admin/customer?id=
 * 
 * @apiErrorExample {json} Error-Response:
 * HTTP/1.1 400
    {
        success: false,
        message: "Error occurred while fetching Customers Details",
        errorsList: []
    }
 * 
 * 
 */
async function getCustomers(req, res, next) {
    if(!req.requestFrom || !req.requestFrom.employeeId || !req.requestFrom.acl || !aclSettings.validateACL(req.requestFrom.acl, "CUSTOMERS", "VIEW")) {
            throw new BadRequestError('Unauthorised Access')
        }

        let customerId = req.query ? req.query.id : undefined;
        if(!customerId || validator.isEmpty(customerId)) {
            throw new BadRequestError("VALIDATION-Customer ID is undefined");
        } else if (objectSize(customerId) < 12) {
            throw new BadRequestError("VALIDATION-Customer ID is invalid");
        }
        customerId = mongoose.Types.ObjectId(customerId);

        let customer = await User.findOne({ _id: customerId },{token:0,password:0});
        customer = customer._doc;
        
        if (customer.photo) {
            customer.photo = customer.photo.data;
        }

        if(customer.address) {
            customer.address = customer.address._doc;
            customer.address.coordinates = customer.address.location._doc.coordinates;
            // customer.address.coordinates = customer.address.location.coordinates;
            customer.address.coordinates = [customer.address.coordinates[1], customer.address.coordinates[0]];
            delete customer.address.location;
            delete customer.address._id;
        }
    
        if (customer.driverLicense && customer.driverLicense.scan) {
            // customer.driverLicense = customer.driverLicense._doc;
            customer.driverLicense.verified = customer.driverLicense.verified ? customer.driverLicense.verified : false;
            customer.driverLicense.accepted = customer.driverLicense.accepted ? customer.driverLicense.accepted : false;
        
            customer.driverLicense.expiry = moment(customer.driverLicense.expiry).format("YYYY-MM");
            customer.driverLicense.scan = customer.driverLicense.scan.data;
        }

        customer.dob = moment(customer.dob).format("YYYY-MM-DD");
    
        customer = objectMinusKeys(customer, ['password', 'tokens']);

        res.status(200).send({
            success: true,
            message: "Successfully fetched Customers Details",
            customerObj: customer
        });
}

module.exports = getCustomers;
