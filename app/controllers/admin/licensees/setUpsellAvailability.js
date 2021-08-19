const mongoose = require('mongoose');
const validator = require('validator');

const Upsell = require('../../../models/upsellItems');
const Employee =  require('../../../models/employees');

const { licenseeNotification } = require('../../../helpers/fcmAdmin');

const aclSettings = require('../../../helpers/getAccessControlList');
const objectSize = require('../../../helpers/objectSize');
const { BadRequestError } = require('../../../helpers/errors');


const setUpsellAvailability = async function(req,res){
    if (!req.requestFrom || !aclSettings.validateACL(req.requestFrom.acl, "UPSELL", ["ADD", "UPDATE"])) {
            throw new BadRequestError('Unauthorised Access')
        }
        let upsellItem = req.body;
        if(!upsellItem) {
            throw new BadRequestError("VALIDATION-Invalid Request Body");
        }
        let upsellId = req.body.upsellId;
        if (!upsellId || validator.isEmpty(upsellId)) {
            throw new BadRequestError("VALIDATION-Upsell Item ID is undefined");
        } else if (objectSize(upsellId) < 12) {
            throw new BadRequestError("VALIDATION-Upsell Item ID is invalid");
        }
        let licenseeId = req.body.licenseeId;
        if (!licenseeId || validator.isEmpty(licenseeId)) {
            throw new BadRequestError("VALIDATION-Licensee ID is undefined");
        } else if (objectSize(licenseeId) < 12) {
            throw new BadRequestError("VALIDATION-Licensee ID is invalid");
        }
        let availability = req.body.availability
        if(typeof(availability) != "boolean"){
            throw new BadRequestError("Validation-Availability can only be true or false")
        }
        upsellId = mongoose.Types.ObjectId(upsellId);
        licenseeId = mongoose.Types.ObjectId(req.body.licenseeId);
        const fcmToken = await Employee.findOne({licenseeId : licenseeId , isOwner:true},{fcmDeviceToken:1})
         
        const upsell = await Upsell.findOneAndUpdate({_id:upsellId,licenseeId:licenseeId},{availability:upsellItem.availability},{new:true})
        await licenseeNotification('UpsellItem Updated',`UpsellItem Availability changed to ${req.body.availability} for upsell ${upsellId}`,'Inventory Update',upsellId,fcmToken.fcmDeviceToken)

        res.status(200).send({
            success: true,
            message : "UpsellItem Availabilty Modified",
            upsell : upsell
        })
}

module.exports = setUpsellAvailability