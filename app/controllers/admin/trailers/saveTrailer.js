const fs = require('fs');
const XLSX = require('xlsx');

const mongoose = require('mongoose');
const validator = require('validator');

const TrailerType = require('../../../models/trailerTypes');

const objectSize = require('../../../helpers/objectSize');
const objectMinusKeys = require('../../../helpers/objectMinusKeys');
const getFilePath = require('../../../helpers/getFilePath');
const embeddedParser = require('../../../helpers/embeddedParser');
const rentalChargesConv = require('../../../helpers/rentalChargesConv');

const constants = require('../../../helpers/constants');

const aclSettings = require('../../../helpers/getAccessControlList');
const { BadRequestError } = require('../../../helpers/errors');

/** 
 * 
 * @api {POST} /admin/trailer Save or Update Trailer Information
 * @apiName TAAT - Save or Update Trailer Information
 * @apiGroup Admin App - Trailer
 *  
 * 
 * @apiHeader {String} Content-Type application/json
 * @apiHeader {String} authorization Authorization token sent as a response to signIn request
 * 
 * 
 * @apiParam {FilesArray} photos Photos of the Trailer ( Files )
 * @apiParam {FilesArray} rates Trailer Rental Rates based on time period ( File )
 * 
 * @apiParam {String} name Name of the Trailer
 * @apiParam {String} type Type of the Trailer
 * @apiParam {String} description Description of the Trailer
 * @apiParam {String} size Size of the Trailer
 * @apiParam {String} capacity Capacity of the Trailer
 * @apiParam {String} tare Tare of the Trailer ( Weight of the Trailer before loading goods )
 * @apiParam {Array} availability Make trailer Available to be rented?
 * @apiParam {Array} isFeatured Is this a featured trailer?
 * 
 * @apiParam {Array} features Features of the Trailer
 * 
 * @apiParam {Double} rentalCharges Rental Charges of the Trailer OR rates file
 * @apiParam {Double} dlrCharges DLR ( Damage Liability Reduction ) Charges of the Trailer
 * 
 * 
 * @apiDescription API Endpoint that can used to save or update Trailer data
 * 
 * 
 * @apiErrorExample {json} Error-Response:
 * HTTP/1.1 400
 * 
   {
        success: false,
        message: "Error while saving Trailer record",
        errorsList: []
   }
 * 
 * 
 * 
 * @apiSuccessExample {String} - Success-Response:
 * HTTP/1.1 200 
 * 
   {
        success: true,
        message: "Successfully saved Trailer record",
        trailerObj: {
            _id: ObjectId("5e4132b4603c2159b3e58ac0"),
            name: "2020 C&B DMP610-6TA 26\"",
            type: "dump",
            description:
                "2 5/16\" ADJUSTABLE COUPLER, 8000# JACK, LOOSE RAMPS, SCISSOR HOIST",
            size: "Length: 10' Width: 6'",
            capacity: "6980 lbs",
            tare: "2920 lbs",

            features: ["2 5/16\" ADJUSTABLE COUPLER","8000# JACK","LOOSE RAMPS","SCISSOR HOIST","26\" SIDES","STAKE POCKETS","LED LIGHTS","HD FENDERS"],

            rentalCharges: {
                pickUp: [
                    {
                        duration: 21600000,
                        charges: 54
                    },
                    {
                        duration: 32400000,
                        charges: 69
                    },
                    {
                        duration: 1,
                        charges: 5
                    }
                ],
                door2Door: [
                    {
                        duration: 21600000,
                        charges: 65
                    },
                    {
                        duration: 32400000,
                        charges: 83
                    },
                    {
                        duration: 1,
                        charges: 6
                    }
                ]
            },
            dlrCharges: 400
        }
    }
 * 
 * 
 */
async function saveTrailerType(req, res, next) {
    if(!req.requestFrom || !req.requestFrom.employeeId || !req.requestFrom.acl || !aclSettings.validateACL(req.requestFrom.acl, "TRAILER", "ADD")) {
        throw new BadRequestError('Unauthorised Access')
        }

        let body = req.body;
        body = JSON.parse(JSON.stringify(body));
        let trailer = body;
        if(req.files) {
    
            //#region Rates file upload - Currently disabled in favor of rates object
            if(req.files["rates"]) {
                req.files["rates"].forEach(file => {
                    if(!constants.allowedfiles.excelDocuments.includes(file.mimetype)) {
                        throw new BadRequestError(`VALIDATION-Upload files with allowed file types - ${file.filename}`);
                    }
                    if(file.size > constants.maxPictureSize) {
                        throw new BadRequestError(`VALIDATION-Document Exceeded Size Limit - ${file.filename}`);
                    }
                });
            
                //----------------------------------------------------------------

                // Multer gives us file info in req.file object
                let ratesFile = req.files["rates"];

                if((!ratesFile || ratesFile.length < 0) && !body.rentalCharges){
                    throw new BadRequestError("VALIDATION-Please Upload Rental Charges File or Add Rental Charges");
                }

                if(ratesFile && ratesFile.length > 0) {
                    ratesFile = ratesFile[0];

                    if(ratesFile) {
                        const wb = XLSX.readFile(ratesFile.path);
                        // generate array of arrays
                        sheetData = XLSX.utils.sheet_to_json(wb.Sheets[wb.SheetNames[0]], {header:1});
                
                        const charges = {
                            pickUp: [],
                            door2Door: []
                        };
                        // duration, charges
                
                        const sheetColumnsArray = sheetData[0];
                
                        const sheetColumns = {
                            pickUpHirePeriod: sheetColumnsArray.indexOf("PHP"),
                            pickUpHireRate: sheetColumnsArray.indexOf("PHR"),
                            door2DoorHirePeriod: sheetColumnsArray.indexOf("DHP"),
                            door2DoorHireRate: sheetColumnsArray.indexOf("DHR")
                        };
                
                        sheetData.forEach((sheetDataRow, sheetDataRowIndex) => {
                            if(sheetDataRowIndex !== 0) {
                                
                                const pickUp = {
                                    duration: rentalChargesConv.parseHirePeriod(sheetDataRow[sheetColumns.pickUpHirePeriod]),
                                    charges: rentalChargesConv.parseCharges(sheetDataRow[sheetColumns.pickUpHireRate])
                                };
                                charges.pickUp.push(pickUp);
                
                                const door2Door = {
                                    duration: rentalChargesConv.parseHirePeriod(sheetDataRow[sheetColumns.door2DoorHirePeriod]),
                                    charges: rentalChargesConv.parseCharges(sheetDataRow[sheetColumns.door2DoorHireRate])
                                };
                                charges.door2Door.push(door2Door);
                            }
                        });

                        trailer.rentalCharges = charges;
                    }
                }
            }
            //#endregion
     
            if(req.files["photos"] && req.files["photos"].length > 0) {
                let photos = req.files["photos"];
                trailer.photos = [];

                photos.forEach((photo) => {
                    const data = photo.location;
                    const contentType = photo.mimetype;

                    trailer.photos.push({
                        contentType: contentType,
                        data: data
                    });
                });
            }
        }

        //TODO: VALIDATE RATES LATER........
        const rates = JSON.parse(body.rates);
        !!rates && (trailer.rentalCharges =  {
            pickUp: rates.pickUp,
            door2Door: rates.door2Door
        });
   
        if(trailer.features && (typeof trailer.features === "string")) {
            trailer.features = trailer.features.split(",");
        }
        
        const trailerId = trailer._id ? mongoose.Types.ObjectId(trailer._id) : undefined;
        const isUpdating = trailer._id ? true : false;
        const existingTrailer = await TrailerType.findOne({ _id: trailerId });
        if(isUpdating && !existingTrailer) {
            return res.status(403).send({
                success: false,
                message: "Unauthorized Access"
            });
        }

        if(!trailer) {
            throw new BadRequestError("VALIDATION-Error occurred while parsing Trailer record");
        } else {
            if(isUpdating) {
                trailer = objectMinusKeys(trailer, ['_id', 'createdAt', 'updatedAt']);
            }

            if(isUpdating) {
                await TrailerType.updateOne({ _id: trailerId }, trailer);
                trailer = await TrailerType.findOne({ _id: trailerId });
            } else {
                trailer = new TrailerType(trailer);
                trailer = await trailer.save();
            }
            trailer = trailer._doc;

            // NOT REQUIRED BECAUSE OF S3
            // const photos = trailer.photos.map((photo, photoIndex) => {
            //     return getFilePath("trailertype", trailer._id.toString(), (photoIndex + 1));
            // });
            // trailer.photos = photos;

            // delete trailer.rentalCharges;

            res.status(200).send({
                success: true,
                message: "Successfully saved Trailer record",
                trailerObj: trailer
            });
        }

}

module.exports = saveTrailerType;