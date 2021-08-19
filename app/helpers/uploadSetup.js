const multer = require("multer");
const multerS3 = require('multer-s3');
const aws = require('aws-sdk');

const constants = require("../helpers/constants");

const s3 = new aws.S3({
  accessKeyId: process.env.AWS_ACCESS_KEY,
  secretAccessKey: process.env.AWS_SECRET_KEY,
  region: 'ap-south-1'
});

const s3Storage =  multerS3({
  s3: s3,
  acl: "public-read",
  bucket: process.env.AWS_S3_BUCKET_NAME,
  metadata: function (req, file, cb) {
    cb(null, {fieldName: file.fieldname});
  },
  key: function (req, file, cb) {
    const fileName = Date.now().toString();
    const fileExtension = file.mimetype ? file.mimetype.split('/')[1] : 'png';
    cb(null, `${fileName}.${fileExtension}`)
  }
})

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    // cb(null, '../../../../uploads/')
    cb(null, "./uploads/");
  },
  filename: function (req, file, cb) {
    console.log("Setting File" + file.fieldname);
    const datetimestamp = Date.now();
    cb(
      null,
      file.fieldname +
        "-" +
        datetimestamp +
        "." +
        file.originalname.split(".")[file.originalname.split(".").length - 1]
    );
  },
});

const uploadSetup = multer({
  storage: s3Storage,
  limits: {
    fileSize: constants.maxPictureSize,
  },
});

/* 
multer({
    storage: storage,
    fileFilter : function(req, file, callback) { //file filter
        if (['xls', 'xlsx'].indexOf(file.originalname.split('.')[file.originalname.split('.').length-1]) === -1) {
            return callback(new Error('Wrong extension type'));
        }
        callback(null, true);
    }
}).single('file'); 
*/

module.exports = uploadSetup;
