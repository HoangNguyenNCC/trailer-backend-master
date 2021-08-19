const mongoose = require('mongoose');
const validator = require('validator');

const objectSize = require('../../helpers/objectSize');
const sampleTrailerPhoto = require('../../helpers/sampleTrailerPhoto');
const sampleUserPhoto = require('../../helpers/sampleTrailerPhoto');
const sampleDocPhoto = require('../../helpers/sampleTrailerPhoto');
const sampleBusinessPhoto = require('../../helpers/sampleTrailerPhoto');
const base64MimeType = require('../../helpers/base64MimeType');

const User = require('../../models/users');
const Trailer = require('../../models/trailers');
const UpsellItem = require('../../models/upsellItems');
const TrailerType = require('../../models/trailerTypes');
const UpsellItemType = require('../../models/upsellItemTypes');
const TrailerServicing = require('../../models/trailerServicing');
const TrailerInsurance = require('../../models/trailerInsurance');
const Licensee = require('../../models/licensees');
const Employee = require('../../models/employees');
const Invoice = require('../../models/invoices');


const sourcesList = [
    "trailer", "upsellitem", "trailertype", "upsellitemtype", 
    "trailerservicing", "trailerinsurance", 
    "userphoto", "userdrivinglicense", 
    "licenseelogo", "licenseeproof", 
    "lempl-photo", "lempl-drivinglicense",
    "lempl-additionaldoc",
    "invoice-drivinglicense"
];



/**
 * 
 * @api {GET} /file/:source/:id/:index Get Files stored in the database
 * @apiName Get Files stored in the database
 * @apiGroup Common
 * 
 * 
 * @apiParam {String} source source of a file - trailer, upsellitem, trailertype, upsellitemtype, trailerservicing, trailerinsurance, userphoto, userdrivinglicense, licenseelogo, licenseeproof, lempl-photo, lempl-drivinglicense, lempl-additionaldoc
 * @apiParam {String} id ID of the source document
 * @apiParam {String} index Index of a File
 * 
 * 
 * @apiDescription API Endpoint GET /file/:source/:id/:index
 * 
 * 
 * @apiSuccessExample {String} - Success-Response:
 * HTTP/1.1 200 
 * 
 * 
 * @apiErrorExample {json} Error-Response:
 * HTTP/1.1 400
    {
        success: false,
        message: "Error occurred while fetching a File",
        errorsList: []
    }
 * 
 * 
 * 
 */
async function getFiles(req, res, next) {
    try {
        if(!req.params) {
            throw new Error("VALIDATION-Parameters are not specified");
        }
        const source = req.params.source;
        const id = req.params.id;
        const fileIndex = req.params.index || 1;

        if(!source || !sourcesList.includes(source)) {
            throw new Error("VALIDATION-Invalid Source");
        }

        if(!id || validator.isEmpty(id) || objectSize(id) < 12) {
            throw new Error("VALIDATION-Invalid ID");
        }

        if(fileIndex && fileIndex < 1) {
            throw new Error("VALIDATION-Invalid Index");
        }

        let contentType, bufferData, photos, photo, document, picture, logo;

        if(source === "trailer") {
            let trailer = await Trailer.findOne({ _id: mongoose.Types.ObjectId(id) }, { photos: 1 });
            if(trailer) {
                photos = trailer._doc.photos;
                photo = photos[fileIndex - 1];
            }
            if(!photo) {
                photo = sampleTrailerPhoto;
            }
            contentType = photo.contentType;
            bufferData = Buffer.from(photo.data.buffer, 'binary');
        } else if(source === "upsellitem") {
            let upsellItem = await UpsellItem.findOne({ _id: mongoose.Types.ObjectId(id) }, { photos: 1 });
            if(upsellItem) {
                photos = upsellItem._doc.photos;
                photo = photos[fileIndex - 1];
            }
            if(!photo) {
                photo = sampleTrailerPhoto;
            }
            contentType = photo.contentType;
            bufferData = Buffer.from(photo.data.buffer, 'binary');
        } else if(source === "trailertype") {
            let trailer = await TrailerType.findOne({ _id: mongoose.Types.ObjectId(id) }, { photos: 1 });
            if(trailer) {
                photos = trailer._doc.photos;
                photo = photos[fileIndex - 1];
            }
            if(!photo) {
                photo = sampleTrailerPhoto;
            }
            contentType = photo.contentType;
            bufferData = Buffer.from(photo.data.buffer, 'binary');
        } else if(source === "upsellitemtype") {
            let upsellItem = await UpsellItemType.findOne({ _id: mongoose.Types.ObjectId(id) }, { photos: 1 });
            if(upsellItem) {
                photos = upsellItem._doc.photos;
                photo = photos[fileIndex - 1];
            }
            if(!photo) {
                photo = sampleTrailerPhoto;
            }
            contentType = photo.contentType;
            bufferData = Buffer.from(photo.data.buffer, 'binary');
        } else if(source === "trailerinsurance") {
            let trailerInsurance = await TrailerInsurance.findOne({ _id: mongoose.Types.ObjectId(id) }, { document: 1 });
            if(trailerInsurance) {
                document = trailerInsurance._doc.document;
            }
            if(!document) {
                document = sampleDocPhoto;
            }
            contentType = document.contentType;
            bufferData = Buffer.from(document.data.buffer, 'binary');
        } else if(source === "trailerservicing") {
            let trailerServicing = await TrailerServicing.findOne({ _id: mongoose.Types.ObjectId(id) }, { document: 1 });
            if(trailerServicing) {
                document = trailerServicing._doc.document;
            }
            if(!document) {
                document = sampleDocPhoto;
            }
            contentType = document.contentType;
            bufferData = Buffer.from(document.data.buffer, 'binary');
        } else if(source === "userdrivinglicense") {
            let user = await User.findOne({ _id: mongoose.Types.ObjectId(id) }, { "driverLicense.scan": 1 });
            if(user) {
                document = user._doc.driverLicense.scan;
            }
            if(!document) {
                document = sampleDocPhoto;
            }
            contentType = document.contentType;
            bufferData = Buffer.from(document.data.buffer, 'binary');
        } else if(source === "userphoto") {
            let user = await User.findOne({ _id: mongoose.Types.ObjectId(id) }, { "photo": 1 });
            if(user) {
                photo = user._doc.photo;
            }
            if(!photo) {
                photo = sampleUserPhoto;
            }
            contentType = photo.contentType;
            bufferData = Buffer.from(photo.data.buffer, 'binary');
        } else if(source === "licenseelogo") {
            let licensee = await Licensee.findOne({ _id: mongoose.Types.ObjectId(id) }, { "logo": 1 });
            if(licensee) {
                logo = licensee._doc.logo;
            }
            if(!logo) {
                logo = sampleBusinessPhoto;
            }
            contentType = logo.contentType;
            bufferData = Buffer.from(logo.data.buffer, 'binary');
        } else if(source === "licenseeproof") {
            let licensee = await Licensee.findOne({ _id: mongoose.Types.ObjectId(id) }, { "proofOfIncorporation": 1 });
            if(licensee) {
                document = licensee._doc.proofOfIncorporation;
            }
            if(!document) {
                document = sampleDocPhoto;
            }
            contentType = document.contentType;
            bufferData = Buffer.from(document.data.buffer, 'binary');
        } else if(source === "lempl-photo") {
            let employee = await Employee.findOne({ _id: mongoose.Types.ObjectId(id) }, { "photo": 1 });
            if(employee) {
                photo = employee._doc.photo;
            }
            if(!photo) {
                photo = sampleUserPhoto;
            }
            contentType = photo.contentType;
            bufferData = Buffer.from(photo.data.buffer, 'binary');
        } else if(source === "lempl-drivinglicense") {
            let employee = await Employee.findOne({ _id: mongoose.Types.ObjectId(id) }, { "driverLicense": 1 });
            if(employee) {
                document = employee._doc.driverLicense.scan;
            }
            if(!document) {
                document = sampleDocPhoto;
            }
            contentType = document.contentType;
            bufferData = Buffer.from(document.data.buffer, 'binary');
        } else if(source === "lempl-additionaldoc") {
            let employee = await Employee.findOne({ _id: mongoose.Types.ObjectId(id) }, { "additionalDocument": 1 });
            if(employee && employee._doc.additionalDocument.scan) {
                document = employee._doc.additionalDocument.scan;
            }
            if(!document) {
                document = sampleDocPhoto;
            }
            contentType = document.contentType;
            bufferData = Buffer.from(document.data.buffer, 'binary');
        } else if(source === "invoice-drivinglicense") {
            let invoice = await Invoice.findOne({ _id: mongoose.Types.ObjectId(id) }, { "driverLicenseScan": 1 });
            if(invoice) {
                document = invoice._doc.driverLicenseScan;
            }
            if(!document) {
                document = sampleDocPhoto;
            }
            contentType = document.contentType;
            bufferData = Buffer.from(document.data.buffer, 'binary');
        }
    
        res.setHeader('content-type', contentType);
        res.end(bufferData);
    } catch (err) {
        console.error("getFiles Error", err);

        let errorCode = 500;
        let errors = [];
        let errorMessage = "Error occurred while fetching a file";

        if(err && err.name && ["MongoError", "ValidationError"].includes(err.name) && err.message) {
            errorCode = 400;
            if(err.code && err.code === 11000 && err.keyValue) {
                const keys = Object.keys(err.keyValue);
                const values = Object.values(err.keyValue);
                errorMessage = `Duplicate Key Error on { ${keys[0]}: ${values[0]} }`;
                errors.push(errorMessage);
            } else {
                errorMessage = err.message;
                errors.push(errorMessage);
            }
        } else if(err && err.message) {
            errorCode = err.message.startsWith("VALIDATION-") ? 400 : 500;
            const errorComp = err.message.split("VALIDATION-");
            errorMessage = errorComp.length > 1 ? errorComp[1] : errorComp[0];
            errors.push(errorMessage);
        } else if(err && err.errors) {
            errorCode = 400;
            const fieldKeys = Object.keys(err.errors);
            fieldKeys.forEach((fieldKey) => {
                if(fieldKey.split(".").length === 1) {
                    errors.push(err.errors[fieldKey].message);
                    if(err.errors[fieldKey].message) {
                        errorMessage = err.errors[fieldKey].message;
                    }
                }
            });
        } else {
            if(err) {
                errorMessage = err;
            }
            errors.push(err);
        }

        return res.status(errorCode).send({
            success: false,
            message: errorMessage,
            errorsList: errors
        });
    }
}

module.exports = getFiles;