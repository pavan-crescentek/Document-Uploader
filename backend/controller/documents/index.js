const documentsModel = require('../../model/documentsSchema');
const utils = require('../../utils/utils');
const { StatusCodes } = require('http-status-codes');
const { fileUploadValidator } = require('./documentUploadValidation');
const { messages } = require('../../utils/en');
const { getFile, deleteFile } = require('../../middlewares/uploadImage');
const { find } = require('lodash');

// Upload file
const fileUploading = async (req, res) => {
  const media_data = find(req.files, { fieldname: 'doc' });

  try {
    // Validate the request body
    const { error, value } = fileUploadValidator.validate({ ...req.body, file: media_data });
    if (error) {
      await cleanupFile(media_data);
      return utils.sendResponse(res, StatusCodes.BAD_REQUEST, error.details[0].message);
    }

    const { user } = req;
    const { section, subsection, metadata } = value;

    if (!media_data?.key) {
      await cleanupFile(media_data);
      return utils.sendResponse(res, StatusCodes.BAD_REQUEST, messages.fileUploadFailed);
    }

    const documentData = {
      userId: user._id,
      metadata,
      section,
      subsection,
      media_key: media_data.key,
      media_size: media_data.size,
    };

    // Create a new document
    const newDoc = await documentsModel.create(documentData);

    const fileUrl = await getFile(process.env.BUCKET_NAME, media_data.key);
    const responseData = { ...newDoc.toObject(), fileUrl };

    return utils.sendResponse(res, StatusCodes.CREATED, messages.fileUploadedSuccessfully, responseData);
  } catch (error) {
    console.error('🚀 ~ fileUploading ~ error:', error);
    await cleanupFile(media_data);
    return utils.sendResponse(res, StatusCodes.INTERNAL_SERVER_ERROR, messages.errorFileUpload);
  }
};

const cleanupFile = async (media_data) => {
  if (media_data?.key) {
    await deleteFile(process.env.BUCKET_NAME, media_data.key);
  }
};

module.exports = {
  fileUploading,
};
