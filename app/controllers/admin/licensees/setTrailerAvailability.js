const mongoose = require('mongoose');
const validator = require('validator');

const Trailer = require('../../../models/trailers');
const Employee =  require('../../../models/employees');

const aclSettings = require('../../../helpers/getAccessControlList');
const objectSize = require('../../../helpers/objectSize');
const { licenseeNotification } = require('../../../helpers/fcmAdmin');

const setTrailerAvailability = async function(req,res){
   if(!req.requestFrom || !aclSettings.validateACL(req.requestFrom.acl, "BLOCK", ["ADD", "UPDATE"])) {
            throw new BadRequestError('Unauthorised Access')
        }
        req.body = JSON.parse(req.body);
       
        let trailerId = req.body.trailerId;
        if (!trailerId || validator.isEmpty(trailerId)) {
            throw new BadRequestError("VALIDATION-Trailer ID is undefined");
        } else if (objectSize(trailerId) < 12) {
            throw new BadRequestError("VALIDATION-Trailer ID is invalid");
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
        trailerId = mongoose.Types.ObjectId(trailerId);
        licenseeId = mongoose.Types.ObjectId(req.body.licenseeId);
        const fcmToken = await Employee.findOne({licenseeId : licenseeId , isOwner:true},{fcmDeviceToken:1})

        const trailer = await Trailer.findOneAndUpdate({_id:trailerId,licenseeId:licenseeId},{availability:req.body.availability},{new:true})
        await licenseeNotification('Trailer Updated',`Trailer Availability changed to ${req.body.availability} for trailer ${trailerId}`,'Inventory Update',trailerId,fcmToken.fcmDeviceToken)
        res.status(200).send({
            success:true,
            message: "Trailer Availability Set Successfully",
            trailer : trailer
        })
}

module.exports = setTrailerAvailability