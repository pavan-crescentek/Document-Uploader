const multer = require('multer');
const multerS3 = require('multer-s3');
const { S3Client, GetObjectCommand, DeleteObjectCommand } = require('@aws-sdk/client-s3');
const { getSignedUrl } = require('@aws-sdk/s3-request-presigner');
const path = require('path');
const config = require('../config/config').config();
const dotenv = require('dotenv');
const utils = require('../utils/utils');
const { messages } = require('../utils/en');
const { StatusCodes } = require('http-status-codes');

dotenv.config({ path: config });

const s3Client = new S3Client({
  region: process.env.region,
  credentials: {
    accessKeyId: process.env.S3Key,
    secretAccessKey: process.env.S3Secret,
  },
});

const bucketName = process.env.BUCKET_NAME;
const MAX_FILE_SIZE = 100 * 1024 * 1024;

const userFileUpload = multer({
  storage: multerS3({
    s3: s3Client,
    bucket: bucketName,
    contentDisposition: 'inline',
    contentType: multerS3.AUTO_CONTENT_TYPE,
    key: function (req, file, cb) {
      cb(
        null,
        (req?.body?.metadata?.slice(0, 20) || 'metadata') +
          '_' +
          (req?.body?.section || 'section') +
          '_' +
          (req?.body?.subsection || 'subsection') +
          '_' +
          Date.now() +
          path.extname(file.originalname),
      );
    },
  }),
  limits: {
    fileSize: MAX_FILE_SIZE,
  },
  fileFilter: function (req, file, callback) {
    let allowedExtension = ['jpg', 'jpeg', 'png', 'pdf', 'doc', 'docx'];
    const fileExtension = path.extname(file.originalname).toLowerCase().substring(1);

    if (allowedExtension.includes(fileExtension)) {
      callback(null, true);
    } else {
      callback(new Error('Invalid file type. Only PDF, JPEG, PNG, DOC and DOCX are allowed.'), false);
    }
  },
}).any();

const handleFileUpload = (req, res, next) => {
  userFileUpload(req, res, (err) => {
    if (err instanceof multer.MulterError) {
      if (err.code === 'LIMIT_FILE_SIZE') {
        return utils.sendResponse(
          res,
          StatusCodes.BAD_REQUEST,
          `File size exceeds the limit of ${MAX_FILE_SIZE / (1024 * 1024)} MB.`,
        );
      }
      return utils.sendResponse(res, StatusCodes.BAD_REQUEST, err.message);
    } else if (err) {
      return utils.sendResponse(
        res,
        StatusCodes.BAD_REQUEST,
        'Invalid file type. Only PDF, JPEG, and PNG are allowed.',
      );
    }
    next();
  });
};

const getFile = async function (bucketName, file, mime_type) {
  const readAbleFileParams = {
    Bucket: bucketName,
    Key: file,
    ResponseContentType: mime_type,
    ResponseContentDisposition: 'inline; filename="' + file + '"',
  };
  const downloadAbleFileParams = {
    Bucket: bucketName,
    Key: file,
    ResponseContentType: mime_type,
    ResponseContentDisposition: 'attachment; filename="' + file + '"',
  };

  try {
    const command1 = new GetObjectCommand(readAbleFileParams);
    const command2 = new GetObjectCommand(downloadAbleFileParams);
    const readAbleFileUrl = await getSignedUrl(s3Client, command1, { expiresIn: 3600 });
    const downloadAbleFileUrl = await getSignedUrl(s3Client, command2, { expiresIn: 3600 });
    return { readAbleFileUrl, downloadAbleFileUrl };
  } catch (err) {
    console.error('Error getting file from S3:', err);
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

module.exports = { userFileUpload, getFile, deleteFile, handleFileUpload };
