var multer = require('multer');
var multerS3 = require('multer-s3');
let config = require('../config/config').config();
let dotenv = require('dotenv');
dotenv.config({ path: config });
var AWS = require('aws-sdk');
const path = require('path');

AWS.config.update({
  accessKeyId: process.env.S3Id,
  secretAccessKey: process.env.S3Secret,
  region: process.env.region,
});

const s3 = new AWS.S3({
  accessKeyId: process.env.S3Id,
  secretAccessKey: process.env.S3Secret,
  region: process.env.region,
});

var bucketName = process.env.BUCKET_NAME;

const userFileUpload = multer({
  storage: multerS3({
    s3: s3,
    bucket: bucketName,
    contentDisposition: 'inline',
    contentType: multerS3.AUTO_CONTENT_TYPE,
    key: function (req, file, cb) {
      cb(null, file.fieldname + '_' + Date.now() + path.extname(file.originalname));
    },
  }),
  fileFilter: function (req, file, callback) {
    let allowedExtension = [
      'jpg',
      'jpeg',
      'png',
      'jpe',
      'bmp',
      'pdf',
      'doc',
      'docx',
      'gif',
      'csv',
      'xlsx',
      'xls',
      'pdf',
    ];
    callback(null, true);
  },
}).any();

const getFile = async function (bucketName, file) {
  var params = {
    Bucket: bucketName,
    Key: file,
  };
  try {
    const url = await s3.getSignedUrl('getObject', params);
    return url;
  } catch (err) {
    return '';
  }
};

module.exports = { userFileUpload, getFile };
