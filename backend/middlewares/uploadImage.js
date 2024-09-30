const multer = require('multer');
const multerS3 = require('multer-s3');
const { S3Client, GetObjectCommand, DeleteObjectCommand } = require('@aws-sdk/client-s3');
const { getSignedUrl } = require('@aws-sdk/s3-request-presigner');
const path = require('path');
const config = require('../config/config').config();
const dotenv = require('dotenv');

dotenv.config({ path: config });

const s3Client = new S3Client({
  region: process.env.region,
  credentials: {
    accessKeyId: process.env.S3Key,
    secretAccessKey: process.env.S3Secret,
  },
});

const bucketName = process.env.BUCKET_NAME;
const MAX_FILE_SIZE = 5 * 1024 * 1024;

const userFileUpload = multer({
  storage: multerS3({
    s3: s3Client,
    bucket: bucketName,
    contentDisposition: 'inline',
    contentType: multerS3.AUTO_CONTENT_TYPE,
    key: function (req, file, cb) {
      cb(null, file.fieldname + '_' + Date.now() + path.extname(file.originalname));
    },
  }),
  limits: {
    fileSize: MAX_FILE_SIZE,
  },
  fileFilter: function (req, file, callback) {
    let allowedExtension = ['jpg', 'jpeg', 'png', 'pdf'];
    const fileExtension = path.extname(file.originalname).toLowerCase().substring(1);

    if (allowedExtension.includes(fileExtension)) {
      callback(null, true);
    } else {
      callback(new Error('Invalid file type. Only PDF, JPEG, and PNG are allowed.'), false);
    }
  },
}).any();

const getFile = async function (bucketName, file) {
  const params = {
    Bucket: bucketName,
    Key: file,
  };
  try {
    const command = new GetObjectCommand(params);
    const url = await getSignedUrl(s3Client, command, { expiresIn: 3600 });
    return url;
  } catch (err) {
    return '';
  }
};

const deleteFile = async function (bucketName, fileKey) {
  const params = {
    Bucket: bucketName,
    Key: fileKey,
  };

  try {
    const command = new DeleteObjectCommand(params);
    await s3Client.send(command);
    return true;
  } catch (err) {
    console.error('Error deleting file from S3:', err);
    return false;
  }
};

module.exports = { userFileUpload, getFile, deleteFile };
