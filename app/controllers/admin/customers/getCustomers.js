const User = require('../../../models/users');

const objectMinusKeys = require('../../../helpers/objectMinusKeys');
const constants = require('../../../helpers/constants');
const { getSearchCondition } = require('../../../helpers/getSearchCondition');
const aclSettings = require('../../../helpers/getAccessControlList');
const {BadRequestError} = require('./../../../helpers/errors');

/**
 * 
 * @api {GET} /admin/customers Get Customers List
 * @apiName TAAC - Get Customers List
 * @apiGroup Admin App - Customer
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
 * API Endpoint GET /admin/customers
 * 
 * 
 * @apiSuccessExample {String} - Success-Response:
 * HTTP/1.1 200
    {
        success: true,
        message: "Successfully fetched Customers List",
        customerList: []
    }
 * 
 * 
 * Sample API Call : http://localhost:5000/admin/customers?count=10&skip=0
 * 
 * @apiErrorExample {json} Error-Response:
 * HTTP/1.1 400
    {
        success: false,
        message: "Error occurred while fetching Customers List",
        errorsList: []
    }
 * 
 * 
 */
async function getCustomers(req, res, next) {

        // if (!req.requestFrom || !req.requestFrom.acl || !req.requestFrom.acl.includes("VIEW_CUSTOMERS") || !req.requestFrom.employeeId) {
        if(!req.requestFrom || !req.requestFrom.employeeId || !req.requestFrom.acl || !aclSettings.validateACL(req.requestFrom.acl, "CUSTOMERS", "VIEW")) {
            throw new BadRequestError('Unauthorised Access')
        }
        
        let searchCondition = {}
        if(req.query && Object.keys(req.query).length > 0){
            const filters = [{filter:"emailVerified", search:"isEmailVerified"},{filter:"mobileVerified", search:"isMobileVerified"},{filter:"dlAccepted", search:"driverLicense.accpeted"},{filter:"state", search:"driverLicense.state"}]
            const search = [{condition:"email", search:"email"},{condition:"mobile", search:"mobile"}]
            searchCondition = await getSearchCondition(req.query,search,filters)
            if(searchCondition.mobile){
                searchCondition['mobile']  = `+${searchCondition.mobile}` 
            }
        }

        const pageCount = req.query.count ? parseInt(req.query.count) : constants.pageCount;
        const pageSkip = req.query.skip ? parseInt(req.query.skip) : constants.pageSkip;

        const customers = await User.find(searchCondition).skip(pageSkip).limit(pageCount).exec();


        customers.forEach((customer, customerIndex) => {
            customer = customer._doc;
        
            if (customer.photo) {
                customer.photo = customer.photo.data;
            }

            if(customer.address) {
                // customer.address = customer.address._doc;
                // customer.address.coordinates = customer.address.location._doc.coordinates;
                customer.address.coordinates = customer.address.location.coordinates;
                customer.address.coordinates = [customer.address.coordinates[1], customer.address.coordinates[0]];
                delete customer.address.location;
                delete customer.address._id;
            }
        
            if (customer.driverLicense && customer.driverLicense.scan) {
                // customer.driverLicense = customer.driverLicense._doc;
                customer.driverLicense.verified = customer.driverLicense.verified ? customer.driverLicense.verified : false;
                customer.driverLicense.accepted = customer.driverLicense.accepted ? customer.driverLicense.accepted : false;
                
                // customer.driverLicense.documentType = customer.driverLicense.documentType.split("/")[1];
            
                customer.driverLicense.scan = customer.driverLicense.scan.data;
            
                /* customer.driverLicense = {
                    ...customer.driverLicense,
                    verified: true,
                    accepted: false
                }; */
            }
        
            customer = objectMinusKeys(customer, ['password', 'tokens']);
        
            customers[customerIndex] = customer;
        });

        const customersCount = await User.countDocuments({});

        res.status(200).send({
            success: true,
            message: "Successfully fetched Customers List",
            customerList: customers,
            totalCount: customersCount
        });
}

module.exports = getCustomers;