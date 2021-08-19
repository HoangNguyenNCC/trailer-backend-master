const mongoose = require('mongoose');
const validator = require('validator');
const dotenv = require('dotenv');

const Employee = require('../../../models/employees');

const objectMinusKeys = require('../../../helpers/objectMinusKeys');
const embeddedParser = require('../../../helpers/embeddedParser');
const base64MimeType = require('../../../helpers/base64MimeType');
const getFilePath = require('../../../helpers/getFilePath');

const aclSettings = require('../../../helpers/getAccessControlListAdmin');
const {BadRequestError} = require('../../../helpers/errors')

dotenv.config();
const config = process.env;

const licenseeEmployeeDetailUpdate = async function(req,res,next){
    if (!req.requestFrom) {
            throw new BadRequestError('Unauthorised Access')
        }
        let body, embeddedKeys;
        body = req.body;
        body = embeddedParser(body, ["name"]);
        if (validator.isEmpty(body.mobile)) {
            throw new BadRequestError("VALIDATION-Invalid Mobile");
        }
        if (!body.name) {
            throw new BadRequestError("VALIDATION-Invalid Name");
        }
        let licenseeData = {
            mobile: body.mobile,
            name: body.name
        };
        if (body.photo) {
            const contentType = base64MimeType(body.photo);
            const data = body.photo.split(",")[1];
            licenseeData.photo = {
                contentType: contentType,
                data: Buffer.from(data, 'base64')
            };
        }
        await Employee.updateOne({ _id: req.requestFrom.licenseeId }, licenseeData);
        let licensee = await Employee.findOne({ _id: req.requestFrom.licenseeId });
        licensee.password = body.password;
        await licensee.save();
        licenseee = employee._doc;
        licensee = objectMinusKeys(licensee, ["password"]);
        licensee.photo = getFilePath("LicenseeEmployeephoto", licensee._id.toString());
        res.status(200).send({
            success: true,
            message: "Successfully saved Licensee account data",
            licenseeObj: licensee
        });
}

module.exports = licenseeEmployeeDetailUpdate
