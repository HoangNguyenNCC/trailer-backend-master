const mongoose = require('mongoose');
const validator = require('validator');
const countriesISO = require('i18n-iso-countries');
const countriesInfo = require('countries-information');
const fs = require('fs');

const Licensee = require('../../../models/licensees');

const objectMinusKeys = require('../../../helpers/objectMinusKeys');

const constants = require('../../../helpers/constants');

const aclSettings = require('../../../helpers/getAccessControlList');
const {
    BadRequestError,
    ForbiddenError,
    NotFoundError,
    UnauthorizedError,
    ApiError
  } = require("./../../../helpers/errors");
const dotify = require('../../../helpers/dotify');

/** 
 * 
 * @api {PUT} /licensee Update Licensee Details
 * @apiName LA - Update Licensee Details
 * @apiGroup Licensee App - Licensee
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
 * @apiParam {Array} licensee[workingDays] Working Days - ["monday","tuesday","wednesday","thursday","friday", "saturday", "sunday"]
 * @apiParam {String} licensee[workingHours] Working Hours - "1000-1900"
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
 * @apiDescription API Endpoint PUT /licensee
 * 
 * 
 * Request Headers
 * - 'Content-Type: application/json'
 * 
 * @apiParamExample {json} Request-Example:
 * 
    curl --location --request PUT 'http://localhost:5000/licensee/' \
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

async function updateLicensee(req, res, next) {
        if(!req.requestFrom) {
            throw new ForbiddenError('Unauthorised Access')
        }

        if(!req.requestFrom.isOwner) {
            throw new BadRequestError("VALIDATION-Request for Updating Licensee is reveived from Unauthorized Source");
        }

        const licenseeId = mongoose.Types.ObjectId(req.requestFrom.licenseeId);

        const existingLicensee = await Licensee.findOne({ _id: licenseeId }, { email: 1, mobile: 1, country: 1 });
        if(!existingLicensee) {
            throw new BadRequestError("VALIDATION-Licensee not found");
        }

        let licenseeBody = req.body.reqBody;

        if(!licenseeBody) {
            throw new BadRequestError("VALIDATION-Error occurred while parsing Request Data");
        }

        try {
            licenseeBody = JSON.parse(licenseeBody);
        } catch(err) {
            
        }

        if(licenseeBody.address && licenseeBody.address.coordinates) {
            licenseeBody.address.location = {
                type: "Point",
                coordinates: [licenseeBody.address.coordinates[1], licenseeBody.address.coordinates[0]]
            };
            delete licenseeBody.address.coordinates;
        }

        if (licenseeBody.licenseeLocations && licenseeBody.licenseeLocations.length) {
            licenseeBody.licenseeLocations.forEach((licenseeLocation, licenseeLocationIndex) => {
                const licenseeLocationBody = licenseeLocation;
                if(licenseeLocationBody) {
                    licenseeLocationBody.location = {
                        type: "Point",
                        coordinates: [licenseeLocationBody.coordinates[1], licenseeLocationBody.coordinates[0]]
                    }
                }
                licenseeBody.licenseeLocations[licenseeLocationIndex] = licenseeLocationBody;
            });
        }

        // -----------------------------------------------------------------------------------
        // UPDATE NESTED DOCS WITH DOT NOTATION OR MONGO WILL OVERRIDE NESTED DOCUMENT AND YOU'LL NAVE NULL FOR PROPS YOU DIDN'T SEND
        // ALSO DO IT BEFORE FILES OR BUFFER WOULD ALSO GET DOTIFY WHICH IS UGLYYY
        // GOD LET'S REMOVE THE BUFFER SHIT ASAP..
        licenseeBody = dotify(licenseeBody);
        
        // console.log('after dotify', {licenseeBody});
        
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

        // licenseeBody = objectMinusKeys(licenseeBody, ["_id"]);

        /*  licenseeBody.licenseeLocations = licenseeBody.licenseeLocations.forEach((location, locationIndex) => {
             licenseeBody.licenseeLocations[locationIndex] = JSON.parse(licenseeBody.licenseeLocations[locationIndex]);
         }); */

        // const updatedLicensee = await Licensee.updateOne({ _id: licenseeId }, licenseeBody);
        let licensee = await Licensee.findByIdAndUpdate(licenseeId, {
            $set: licenseeBody
        }, {new: true});
    
        licensee = licensee._doc;

        if(licensee.address) {
            licensee.address = licensee.address._doc;
            if (licensee.address.location && licensee.address.location._doc) {
                licensee.address.coordinates = licensee.address.location._doc.coordinates;
                licensee.address.coordinates = [licensee.address.coordinates[1], licensee.address.coordinates[0]];
                delete licensee.address.location;
                delete licensee.address._id;
            }
        }

        if(licensee.licenseeLocations && licensee.licenseeLocations.length > 0 && licensee.licenseeLocations[0] !== null) {
            licensee.licenseeLocations.forEach((licenseeLocation, licenseeLocationIndex) => {
                licenseeLocation = licenseeLocation._doc;
                licensee.licenseeLocations[licenseeLocationIndex] = {
                    ...licenseeLocation,
                };
                if (licenseeLocation.location && licenseeLocation.location._doc) {
                    licensee.licenseeLocations[licenseeLocationIndex].coordinates = licenseeLocation.location._doc.coordinates
                }
                delete licensee.licenseeLocations[licenseeLocationIndex].location;
                delete licensee.licenseeLocations[licenseeLocationIndex]._id;
            });
        } else {
            licensee.licenseeLocations = [licensee.address];
        }

        licensee = objectMinusKeys(licensee, ["accountNumber", "bsbNumber"]);

        // -----------------------------------------------------------------------------------

        res.status(200).json({
            success: true,
            message: "Successfully updated Licensee data",
            licenseeObj: licensee
        });
        next();
}

module.exports = updateLicensee;