const mongoose = require('mongoose');

const User = require('../../../models/users');

const objectSize = require('../../../helpers/objectSize');

const aclSettings = require('../../../helpers/getAccessControlList');
const {BadRequestError} = require('./../../../helpers/errors');

/** 
 * 
 * @api {PUT} /admin/customer/verify/driverlicense Save Customer Driver License Document Verification details
 * @apiName TAAC - Save Customer Driver License Document Verification details
 * @apiGroup Admin App - Customer
 *  
 * 
 * @apiHeader {String} Content-Type application/json
 * @apiHeader {String} authorization Authorization token sent as a response to signIn request
 * 
 * 
 * @apiParam {String} customerId Id of the Customer record, for edit request only
 * @apiParam {String} isAccepted Whether Customer Driver License Document is Accepted
 * 
 * 
 * @apiDescription API Endpoint to be used to save Customer Driver License Document Verification details
 * 
 * 
 * @apiErrorExample {json} Error-Response:
 * HTTP/1.1 400
 *  {
 *      success: false,
 *      message: "Error occurred while saving Customer Driver License Document Verification details",
 *      errorsList: []
 *  }
 * 
 * 
 * @apiSuccessExample {String} - Success-Response:
 * HTTP/1.1 200
 * 
 * {
 *      success: true,
 *      message: "Successfully saved Customer Driver License Document Verification details"
 * }
 * 
 * 
 */
async function verifyCustomerDocument(req, res, next) {
    let customer = req.body;
        // if (!req.requestFrom || !req.requestFrom.acl || !req.requestFrom.acl.includes("UPDATE_CUSTOMERS")) {
        if(!req.requestFrom || !req.requestFrom.employeeId || !req.requestFrom.acl || !aclSettings.validateACL(req.requestFrom.acl, "DOCUMENTS", "UPDATE")) {
            throw new BadRequestError('Unauthorised Access')
        }

        const isUpdating = customer.customerId ? true : false;

        if (isUpdating) {
            if (!customer.customerId || (customer.customerId && objectSize(customer.customerId) < 12)) {
                throw new BadRequestError("VALIDATION-Invalid Customer ID");
            }
            customer.customerId = mongoose.Types.ObjectId(customer.customerId);
        }
        if(customer.isAccepted){
            if(typeof(customer.isAccepted)!="boolean"){
                throw new BadRequestError("VAILDATION-isAccepted can be true or false only")
            }
        }

        let customerDoc = await User.findOneAndUpdate({ _id: customer.customerId },{"driverLicense.verified":true,"driverLicense.accepted":customer.isAccepted},{new:true});
//         customerDoc = customerDoc._doc;
        // console.log("customerDoc", customerDoc);

//         if (!isUpdating && (!customerDoc.driverLicense || !customerDoc.driverLicense.scan)) {
//             throw new BadRequestError("VALIDATION-Invalid Document");
//         }
    
//         const customerObj = {
//             driverLicense: {}
//         };
//         if (customerDoc.driverLicense) {
//             customerObj.driverLicense = {
//                 ...customerDoc.driverLicense,
//                 verified: true,
//                 accepted: customer.isAccepted
//             };
//         }
        
//         if(isUpdating) {
//             await User.updateOne({ _id: customer.customerId }, customerObj);
//             customerDoc = await User.findOne({ _id: customer.customerId }, { "driverLicense.accepted": 1 });
//             customerDoc = customerDoc._doc;
//         }
    
        res.status(200).send({
            success: true,
            message: "Successfully saved Customer Driver License Document Verification details",
            customerObj: customerDoc.driverLicense
        });
}

module.exports = verifyCustomerDocument;
