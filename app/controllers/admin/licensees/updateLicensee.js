const validator = require('validator');
const countriesISO = require('i18n-iso-countries');
const countriesInfo = require('countries-information');

const Licensee = require('../../../models/licensees');
const { BadRequestError } = require('../../../helpers/errors');

/** 
 * 
 * @api {PUT} /admin/licensee Update Licensee Details
 * @apiName TAAL - Update Licensee Details
 * @apiGroup Admin App - Licensee
 *  
 * 
 * @apiHeader {String} Content-Type application/json
 * 
 * 
 * @apiParam {File} licenseeLogo Licensee Business Logo ( File )
 * @apiParam {File} licenseeProofOfIncorporation Licensee Proof of Incorporation of a Business ( File )
 * 
 * 
 * @apiParam {Object} reqBody Request JSON data
 * @apiParam {String} licensee[name] Licensee Name
 * @apiParam {String} licensee[email] Licensee Email
 * @apiParam {String} licensee[country] Licensee Country
 * @apiParam {String} licensee[mobile] Licensee Mobile
 * @apiParam {String} licensee[businessType] Business Type ["individual", "company"]
 * 
 * @apiParam {String} licensee[bsbNumber] BSB Number of thhe Licensee
 * @apiParam {String} licensee[accountNumber] Bank Account Number of Licensee
 * @apiParam {String} licensee[mcc] Merchant Category Code
 * @apiParam {String} licensee[url] URL of Business Website
 * @apiParam {String} licensee[productDescription] Business/Core Product Description
 * @apiParam {String} licensee[taxId] Company Tax ID - Australian Company Number (ACN)
 * 
 * @apiParam {Object} licensee[address] Licensee Address
 * @apiParam {String} licensee[address.text] Licensee Address Text
 * @apiParam {String} licensee[address.pincode] Licensee Address Pincode
 * @apiParam {String} licensee[address.coordinates] Licensee Address Location Coordinates [latitude, longitude]
 * @apiParam {String} licensee[address.city] Licensee City
 * @apiParam {String} licensee[address.state] Licensee State
 * @apiParam {String} licensee[address.country] Licensee Country
 * 
 * @apiParam {Array} licensee[licenseeLocations] Array of Licensee Locations
 * @apiParam {String} licensee[licenseeLocations.0.text] Licensee Address Text
 * @apiParam {String} licensee[licenseeLocations.0.pincode] Licensee Address Pincode
 * @apiParam {String} licensee[licenseeLocations.0.coordinates] Licensee Address Location Coordinates [latitude, longitude]
 * @apiParam {String} licensee[licenseeLocations.0.city] Licensee City
 * @apiParam {String} licensee[licenseeLocations.0.state] Licensee State
 * @apiParam {String} licensee[licenseeLocations.0.country] Licensee Country
 * 
 * 
 * @apiDescription API Endpoint PUT /admin/licensee
 * 
 * 
 * Request Headers
 * - 'Content-Type: application/json'
 * 
 * @apiParamExample {json} Request-Example:
 * 
    curl --location --request PUT 'http://localhost:5000/admin/licensee/' \
    --form 'reqBody={
        "accountNumber": "32463468434",
        "bsbNumber": "AGDG34734343",
        "radius": 200
    }'
 * 
 * 
 * @apiErrorExample {json} Error-Response:
 * HTTP/1.1 400
 *  {
 *      success: false,
 *      message: "Error occurred while updating Licensee data",
 *      errorsList: []
 *  }
 * 
 * 
 * @apiSuccess {Boolean} success Success Status
 * @apiSuccess {String} message Success Message
 * @apiSuccess {Object} licenseeObj Licensee object
 * 
 * 
 * @apiSuccessExample {String} - Success-Response:
 * HTTP/1.1 200 OK
 * 
   {
        success: true,
        message: "Successfully updated Licensee data",
        licenseeObj: {
            isEmailVerified: false,
            businessType: 'individual',
            availability: true,
            _id: '5e61dccae0c80415dd15d6d4',
            name: 'Licensee 1',
            email: 'licensee1@gmail.com',
            mobile: '919876543210',
            address: {
                text: 'NorthBridge, NSW, Australia',
                pincode: '1560',
                coordinates: [43.8477,-111.6932]
            },
            licenseeLocations: [ 
                {
                    text: 'NorthBridge, NSW, Australia',
                    pincode: '1560',
                    coordinates: [43.8477,-111.6932]
                }
            ],
            proofOfIncorporation: 'http://localhost:5000/file/licenseeproof/5e61dccae0c80415dd15d6d4',
            logo: 'http://localhost:5000/file/licenseelogo/5e61dccae0c80415dd15d6d4',
            createdAt: '2020-03-06T05:16:58.146Z',
            updatedAt: '2020-03-06T05:16:58.148Z',
            __v: 0
        }
   }
 * 
 */

async function updateLicensee(req, res) {

if(!req.requestFrom) {
            throw new BadRequestError('Unauthorised Access')
        }

//         if(!req.requestFrom.isOwner) {
//             throw new BadRequestError("VALIDATION-Request for Updating Licensee is reveived from Unauthorized Source");
//         }

        const existingLicensee = await Licensee.findOne({ _id: req.query.licenseeId }, { email: 1, mobile: 1, country: 1 });
        if(!existingLicensee) {
            throw new BadRequestError("VALIDATION-Licensee not found");
        }

        let licenseeBody = req.body.reqBody;
        if(!licenseeBody) {
            throw new BadRequestError("VALIDATION-Error occurred while parsing Request Data");
        }
        try{
            licenseeBody = JSON.parse(licenseeBody);
        }catch(err){

        }
        delete licenseeBody.logo;
        delete licenseeBody.proofOfIncorporation;
        console.dir({body: licenseeBody, files: req.files}, {depth: 10});
        

        /* if(!licenseeBody.isMobileVerified) {
            throw new BadRequestError("VALIDATION-Licensee Mobile Number is not verified");
        }

        if(!employeeBody.isMobileVerified) {
            throw new BadRequestError("VALIDATION-Employee Mobile Number is not verified");
        } */

        if(licenseeBody.address && licenseeBody.address.coordinates) {
            if(typeof licenseeBody.address.coordinates === "string") {
                licenseeBody.address.coordinates = licenseeBody.address.coordinates.split(",");
            }

            licenseeBody.address.location = {
                type: "Point",
                coordinates: [licenseeBody.address.coordinates[1], licenseeBody.address.coordinates[0]]
            };
            delete licenseeBody.address.coordinates;
        }


        if (licenseeBody.licenseeLocations) {
            licenseeBody.licenseeLocations.forEach((licenseeLocation, licenseeLocationIndex) => {
                const licenseeLocationBody = licenseeLocation;
                if(licenseeLocationBody) {
                    if(typeof licenseeLocationBody.coordinates === "string") {
                        licenseeLocationBody.coordinates = licenseeLocationBody.coordinates.split(",");
                    }

                    licenseeLocationBody.location = {
                        type: "Point",
                        coordinates: [licenseeLocationBody.coordinates[1], licenseeLocationBody.coordinates[0]]
                    }
                }
                licenseeBody.licenseeLocations[licenseeLocationIndex] = licenseeLocationBody;
            });
        }
        // -----------------------------------------------------------------------------------
        
        if(req.files["licenseeLogo"] && req.files["licenseeLogo"].length > 0) {
            let photo = req.files["licenseeLogo"][0];
            const data = photo.location;
            const contentType = photo.mimetype;

            licenseeBody.logo = {
                contentType: contentType,
                data: data
            };
        }

        if(req.files["licenseeProofOfIncorporation"] && req.files["licenseeProofOfIncorporation"].length > 0) {
            let photo = req.files["licenseeProofOfIncorporation"][0];
            const data = photo.location;
            const contentType = photo.mimetype;

            licenseeBody.proofOfIncorporation = {
                contentType: contentType,
                data: data
            };
        }

        //------------------------------------------------------------------------

        if(licenseeBody.mobile) {
            let country = "Australia";
        
            if(licenseeBody.country) {
                country = licenseeBody.country;
            } else if(existingLicensee.country) {
                country = existingLicensee.country;
            }

            let locale = "en-AU";
            let countryCode = "AU";
            if(country) {
                countryCode = countriesISO.getAlpha2Code(country, 'en');
                locale = `en-${countryCode}` || "en-AU";
            }
            const countryInfo = countriesInfo.getCountryInfoByCode(countryCode);
            licenseeBody.mobile = `${countryInfo.countryCallingCodes[0]}${licenseeBody.mobile}`;

            if(licenseeBody.mobile !== existingLicensee.mobile) {
                licenseeBody.isMobileVerified = false;
            }
        }
        if(licenseeBody.email) {
            if(licenseeBody.email !== existingLicensee.email) {
                licenseeBody.isEmailVerified = false;
            }
        }

        /*  licenseeBody.licenseeLocations = licenseeBody.licenseeLocations.forEach((location, locationIndex) => {
             licenseeBody.licenseeLocations[locationIndex] = JSON.parse(licenseeBody.licenseeLocations[locationIndex]);
         }); */
        //  console.log('before updating', {body: JSON.stringify(licenseeBody)});
         console.dir({preUpdateBody: licenseeBody}, {depth: 10});
           await Licensee.updateOne({ _id: req.query.licenseeId }, licenseeBody);

        const licenseeProj = Licensee.getAllFieldsExceptFile();
        let licensee = await Licensee.findOne({ _id: req.query.licenseeId }, licenseeProj);
        licensee = licensee._doc;

    
        if(licensee.proofOfIncorporation) {
            licensee.proofOfIncorporation = licensee.proofOfIncorporation.data; 
        }

        if(licensee.address) {
            licensee.address = licensee.address._doc;
            licensee.address.coordinates = licensee.address.location._doc.coordinates;
            licensee.address.coordinates = [licensee.address.coordinates[1], licensee.address.coordinates[0]];
            delete licensee.address.location;
            delete licensee.address._id;
        }

        if(licensee.licenseeLocations && licensee.licenseeLocations.length > 0 && licensee.licenseeLocations[0] !== null) {
            licensee.licenseeLocations.forEach((licenseeLocation, licenseeLocationIndex) => {
                licenseeLocation = licenseeLocation._doc;
                licensee.licenseeLocations[licenseeLocationIndex] = {
                    ...licenseeLocation,
                    coordinates: licenseeLocation.location._doc.coordinates
                };
                delete licensee.licenseeLocations[licenseeLocationIndex].location;
                delete licensee.licenseeLocations[licenseeLocationIndex]._id;
            });
        }

        // licensee = objectMinusKeys(licensee, ["accountNumber", "bsbNumber"]);

        // -----------------------------------------------------------------------------------

        res.status(200).send({
            success: true,
            message: "Successfully updated Licensee data",
            licenseeObj: licensee
        });
}

module.exports = updateLicensee;
