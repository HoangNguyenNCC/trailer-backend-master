const mongoose = require('mongoose');
const validator = require('validator');

const Employee = require('../../../models/employees');

const { licenseeNotification } = require('../../../helpers/fcmAdmin');

const aclSettings = require('../../../helpers/getAccessControlList');
const {BadRequestError} = require('../../../helpers/errors')

const deleteLicenseeEmployee = async function(req,res){
    if (!req.requestFrom || !aclSettings.validateACL(req.requestFrom.acl, "LICENSEEEMPLOYEE", ["DELETE"])) {
            throw new BadRequestError('Unauthorised Access')
        }
        const employeeId = req.body.id ? mongoose.Types.ObjectId(req.body.id) : undefined;
        const employee = await Employee.findOne({ _id: employeeId }, { _id: 1, isDeleted: 1,fcmDeviceToken:1 });
        if(employee) {
            await Employee.updateOne({_id: employeeId},{isDeleted:true})
        } else {
            throw new BadRequestError("VALIDATION-Employee not found");
        }

        await licenseeNotification('Employee Deleted',`Employee Deleted by ${req.requestFrom}`,'Employee',employeeId,employee.fcmDeviceToken)
        res.status(200).send({
            success: true,
            message: "Success"
        });
}

module.exports = deleteLicenseeEmployee