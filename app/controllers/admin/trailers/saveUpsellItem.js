const mongoose = require('mongoose');

const UpsellItemType = require('../../../models/upsellItemTypes');

const objectMinusKeys = require('../../../helpers/objectMinusKeys');

const aclSettings = require('../../../helpers/getAccessControlList');
const { BadRequestError } = require('../../../helpers/errors');

/** 
 * 
 * @api {POST} /admin/upsellitem Save Upsell Item data
 * @apiName TAAT - Save Upsell Item data
 * @apiGroup Admin App - Trailer
 *  
 * 
 * @apiHeader {String} Content-Type application/json
 * @apiHeader {String} authorization Authorization token sent as a response to signIn request
 * 
 * 
 * @apiParam {FilesArray} photos Photos of the Upsell Item ( Files )
 * @apiParam {FilesArray} rates Upsell Item Rental Rates based on time period ( File )
 * 
 * @apiParam {String} name Name of the Upsell Item
 * @apiParam {String} type Type of the Upsell Item
 * @apiParam {String} description Description of the Upsell Item
 * @apiParam {Array} availability Make trailer Available to be rented?
 * @apiParam {Array} isFeatured Is this a featured trailer?
 * 
 * @apiParam {Double} rentalCharges Rental Charges of the Upsell Item OR rates file
 * @apiParam {Double} dlrCharges DLR ( Damage Liability Reduction ) Charges of the Upsell Item
 * 
 * 
 * @apiDescription API Endpoint to be used to save Upsell Item
 * 
 * 
 * @apiErrorExample {json} Error-Response:
 * HTTP/1.1 400
 *  {
 *      success: false,
 *      message: "Error while saving Upsell Item",
 *      errorsList: []
 *  }
 * 
 * 
 * @apiSuccessExample {String} - Success-Response:
 * HTTP/1.1 200
 * 
 * {
 *      success: true,
 *      message: "Successfully saved Upsell Item"
 * }
 * 
 * 
 */
async function saveUpsellItemType(req, res, next) {
    if(!req.requestFrom || !req.requestFrom.employeeId || !req.requestFrom.acl || !aclSettings.validateACL(req.requestFrom.acl, "UPSELL", "ADD")) {
        throw new BadRequestError('Unauthorised Access')
        }

        let body = req.body;
        body = JSON.parse(JSON.stringify(body));
        let upsellItem = body;

        if(req.files) {
            
            // if(req.files["rates"]) {
            //     req.files["rates"].forEach(file => {
            //         uploadedFiles.push(file.path);
            //     });
            // }

            // Validations -------------------------------------------------------
        
            //#region Rates file - Deprecated in favor of rates object in body
            // if(req.files["rates"]) {
            //     req.files["rates"].forEach(file => {
            //         if(!constants.allowedfiles.excelDocuments.includes(file.mimetype)) {
            //             throw new BadRequestError(`VALIDATION-Upload files with allowed file types - ${file.filename}`);
            //         }
            //         if(file.size > constants.maxPictureSize) {
            //             throw new BadRequestError(`VALIDATION-Document Exceeded Size Limit - ${file.filename}`);
            //         }
            //     });
            
            //     //----------------------------------------------------------------

            //     /** Multer gives us file info in req.file object */
            //     let ratesFile = req.files["rates"];

            //     if((!ratesFile || ratesFile.length < 0) && !body.rentalCharges){
            //         throw new BadRequestError("VALIDATION-Please Upload Rental Charges File or Add Rental Charges");
            //     }

            //     if(ratesFile && ratesFile.length > 0) {
            //         ratesFile = ratesFile[0];

            //         if(ratesFile) {
            //             const wb = XLSX.readFile(ratesFile.path);
            //             /* generate array of arrays */
            //             sheetData = XLSX.utils.sheet_to_json(wb.Sheets[wb.SheetNames[0]], {header:1});
                
            //             const charges = {
            //                 pickUp: [],
            //                 door2Door: []
            //             };
            //             // duration, charges
                
            //             const sheetColumnsArray = sheetData[0];
                
            //             const sheetColumns = {
            //                 pickUpHirePeriod: sheetColumnsArray.indexOf("PHP"),
            //                 pickUpHireRate: sheetColumnsArray.indexOf("PHR"),
            //                 door2DoorHirePeriod: sheetColumnsArray.indexOf("DHP"),
            //                 door2DoorHireRate: sheetColumnsArray.indexOf("DHR")
            //             };
                
            //             sheetData.forEach((sheetDataRow, sheetDataRowIndex) => {
            //                 if(sheetDataRowIndex !== 0) {

            //                     const pickUp = {
            //                         duration: rentalChargesConv.parseHirePeriod(sheetDataRow[sheetColumns.pickUpHirePeriod]),
            //                         charges: rentalChargesConv.parseCharges(sheetDataRow[sheetColumns.pickUpHireRate])
            //                     };
            //                     charges.pickUp.push(pickUp);
                
            //                     const door2Door = {
            //                         duration: rentalChargesConv.parseHirePeriod(sheetDataRow[sheetColumns.door2DoorHirePeriod]),
            //                         charges: rentalChargesConv.parseCharges(sheetDataRow[sheetColumns.door2DoorHireRate])
            //                     };
            //                     charges.door2Door.push(door2Door);
            //                 }
            //             });

            //             upsellItem.rentalCharges = charges;
            //         }
            //     }
            // }
            //#endregion

            if(req.files["photos"] && req.files["photos"].length > 0) {
                let photos = req.files["photos"];
                upsellItem.photos = [];

                photos.forEach((photo) => {
                    const data = photo.location;
                    const contentType = photo.mimetype;

                    upsellItem.photos.push({
                        contentType: contentType,
                        data: data
                    });
                });

            }
        }

     
        if(upsellItem.features && (typeof upsellItem.features === "string")) {
            upsellItem.features = upsellItem.features.split(",");
        }

        const upsellItemId = upsellItem._id ? mongoose.Types.ObjectId(upsellItem._id) : undefined;
        const isUpdating = upsellItem._id ? true : false;
        const existingUpsellItem = await UpsellItemType.findOne({ _id: upsellItemId }, { _id: 1 });
        if(isUpdating && !existingUpsellItem) {
            return res.status(400).send({
                success: false,
                message: "Upsell item not found"
            });
        }

        if (!upsellItem) {
            throw new BadRequestError("VALIDATION-Data in Invalid Format");
        } else {
            const upsellItemId = upsellItem._id ? mongoose.Types.ObjectId(upsellItem._id) : undefined;
            const isUpdating = upsellItem._id ? true : false;
            if (isUpdating) {
                upsellItem = objectMinusKeys(upsellItem, ['_id', 'createdAt', 'updatedAt']);
            }

            if (upsellItem._id) {
                upsellItem._id = upsellItemId;
            }
            upsellItem.trailerType = (typeof upsellItem.trailerType === 'string') ? mongoose.Types.ObjectId(upsellItem.trailerType) : upsellItem.trailerType;
        
            if (body.rentalCharges) {
                upsellItem.rentalCharges = JSON.parse(body.rentalCharges);
            }
            // Save or Update data
            if (isUpdating) {
                await UpsellItemType.updateOne({ _id: upsellItemId }, upsellItem);
                upsellItem = await UpsellItemType.findOne({ _id: upsellItemId });
            } else {
                upsellItem = new UpsellItemType(upsellItem);
                upsellItem = await upsellItem.save();
            }
            upsellItem = upsellItem._doc;

            // Convert Buffer to Base64 String
            //#region Not needed in favor of S3
            // photos = [];
            // for(let photoIndex = 0; photoIndex < upsellItem.photos.length; photoIndex++) {
            //     photos.push(
            //         getFilePath("upsellitem", upsellItem._id.toString(), (photoIndex + 1))
            //     );
            // }
            // upsellItem.photos = photos;
            //#endregion

            // delete trailer.rentalCharges;

            res.status(200).send({
                success: true,
                message: "Successfully saved Upsell Item",
                upsellItemObj: upsellItem
            })
        }
}

module.exports = saveUpsellItemType;