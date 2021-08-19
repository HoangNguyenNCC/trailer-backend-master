const validator = require("validator");
const Employee = require("../../../models/employees");

const objectSize = require("../../../helpers/objectSize");
const objectMinusKeys = require("../../../helpers/objectMinusKeys");
const{BadRequestError} = require('../../../helpers/errors')

const getLicenseeSingleEmployee = async function(req,res){
    if (!req.requestFrom) {
            throw new BadRequestError('Unauthorised Access')
        }
        const employeeId = req.query.id;
        if(!employeeId){
            throw new BadRequestError("VALIDATION-EmployeeId not found");
        } else if (objectSize(employeeId) < 12) {
            throw new BadRequestError("VALIDATION-EmployeeID is invalid");
        }
        let licenseeId = req.query.licenseeId;
        if (!licenseeId || validator.isEmpty(licenseeId)) {
            throw new BadRequestError("VALIDATION-Licensee ID is undefined");
        } else if (objectSize(licenseeId) < 12) {
            throw new BadRequestError("VALIDATION-Licensee ID is invalid");
        }
        let employeeObj =  await Employee.findOne({_id:employeeId,licenseeId:licenseeId,isDeleted:false})
        employeeObj = await employeeObj._doc
        if(employeeObj) {
            employeeObj = objectMinusKeys(employeeObj,['password'])
            employeeObj.photo = employeeObj.photo.data;

            if(employeeObj.driverLicense) {
                employeeObj.driverLicense.scan = employeeObj.driverLicense.scan.data;
            }

            if(employeeObj.additionalDocument) {
                employeeObj.additionalDocument.scan = employeeObj.additionalDocument.scan.data;
            }

            // -----------------------------------------------------------------------------------------
        }else{
            throw new BadRequestError("VALIDATION-No Employee Found")
        }
        res.status(200).send({
            success:true,
            message:"Successfully Fetched Employee Data",
            employeeData : employeeObj
        })
    
}

module.exports = getLicenseeSingleEmployee