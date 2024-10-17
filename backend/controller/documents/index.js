const documentsModel = require('../../model/documentsSchema');
const utils = require('../../utils/utils');
const { StatusCodes } = require('http-status-codes');
const { fileUploadValidator, deleteMediaValidator, updatingMediaValidator } = require('./documentUploadValidation');
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
    const { section, subsection, metadata, documentDate } = value;

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
      media_type: getMediaType(media_data.mimetype),
      mime_type: media_data.mimetype,
      documentDate,
    };

    // Create a new document
    const newDoc = await documentsModel.create(documentData);

    const fileUrl = await getFile(process.env.BUCKET_NAME, media_data.key, media_data.mimetype);
    const responseData = {
      ...newDoc.toObject(),
      readAbleFileUrl: fileUrl.readAbleFileUrl,
      downloadAbleFileUrl: fileUrl.downloadAbleFileUrl,
    };

    return utils.sendResponse(res, StatusCodes.OK, messages.fileUploadedSuccessfully, responseData);
  } catch (error) {
    console.error('🚀 ~ fileUploading ~ error:', error);
    await cleanupFile(media_data);
    return utils.sendResponse(res, StatusCodes.INTERNAL_SERVER_ERROR, messages.errorFileUpload);
  }
};

// Get file
const getFiles = async (req, res) => {
  try {
    const { user } = req;

    // Fetch files from the database
    const files = await documentsModel.find().sort({ createdAt: -1 }).lean().exec();

    // Fetch file URLs for each file
    const filesWithUrls = await Promise.all(
      files.map(async (file) => {
        const fileUrl = await getFile(process.env.BUCKET_NAME, file.media_key, file.mime_type);
        return { ...file, readAbleFileUrl: fileUrl.readAbleFileUrl, downloadAbleFileUrl: fileUrl.downloadAbleFileUrl };
      }),
    );

    return utils.sendResponse(res, StatusCodes.OK, '', filesWithUrls);
    // return utils.sendResponse(res, StatusCodes.OK, messages.filesRetrievedSuccessfully, filesWithUrls);
  } catch (error) {
    console.error('🚀 ~ getFiles ~ error:', error);
    return utils.sendResponse(res, StatusCodes.INTERNAL_SERVER_ERROR, messages.errorRetrievingFiles);
  }
};

// Delete file
const deleteMedia = async (req, res) => {
  try {
    const { user } = req;

    const { error, value } = deleteMediaValidator.validate(req.body);
    if (error) {
      await cleanupFile(media_data);
      return utils.sendResponse(res, StatusCodes.BAD_REQUEST, error.details[0].message);
    }

    const { id } = value;

    const document = await documentsModel.findOne({ _id: id });

    if (!document) {
      return utils.sendResponse(res, StatusCodes.NOT_FOUND, messages.mediaNotFound);
    }

    const deleteResult = await deleteFile(process.env.BUCKET_NAME, document.media_key);

    if (!deleteResult) {
      return utils.sendResponse(res, StatusCodes.INTERNAL_SERVER_ERROR, messages.errorDeletingFile);
    }

    await documentsModel.findByIdAndDelete(id);

    return utils.sendResponse(res, StatusCodes.OK, messages.mediaDeletedSuccessfully);
  } catch (error) {
    console.error('🚀 ~ deleteMedia ~ error:', error);
    return utils.sendResponse(res, StatusCodes.INTERNAL_SERVER_ERROR, messages.errorDeletingMedia);
  }
};

// Update file
const updateMedia = async (req, res) => {
  const media_data = req.files ? find(req.files, { fieldname: 'doc' }) : null;

  try {
    const { user } = req;
    const { error, value } = updatingMediaValidator.validate({ ...req.body, file: media_data });
    if (error) {
      if (media_data) await cleanupFile(media_data);
      return utils.sendResponse(res, StatusCodes.BAD_REQUEST, error.details[0].message);
    }
    const { section, subsection, metadata, id, documentDate } = value;

    const document = await documentsModel.findOne({ _id: id });

    if (!document) {
      return utils.sendResponse(res, StatusCodes.NOT_FOUND, messages.mediaNotFound);
    }

    const updateData = {
      section,
      subsection,
      metadata,
      documentDate,
    };

    if (media_data?.key) {
      await cleanupFile({ key: document.media_key });
      updateData.media_key = media_data.key;
      updateData.media_size = media_data.size;
      updateData.media_type = getMediaType(media_data.mimetype);
      updateData.mime_type = media_data.mimetype;
    }

    const updatedDoc = await documentsModel.findByIdAndUpdate(id, updateData, { new: true }).lean();

    const fileUrl = await getFile(process.env.BUCKET_NAME, updatedDoc.media_key, updatedDoc.mime_type);
    const responseData = {
      ...updatedDoc,
      readAbleFileUrl: fileUrl.readAbleFileUrl,
      downloadAbleFileUrl: fileUrl.downloadAbleFileUrl,
    };

    return utils.sendResponse(res, StatusCodes.OK, messages.mediaUpdatedSuccessfully, responseData);
  } catch (error) {
    console.error('🚀 ~ updateMedia ~ error:', error);
    if (media_data?.key) {
      await cleanupFile(media_data);
    }
    return utils.sendResponse(res, StatusCodes.INTERNAL_SERVER_ERROR, messages.errorUpdatingMedia);
  }
};

const cleanupFile = async (media_data) => {
  if (media_data?.key) {
    await deleteFile(process.env.BUCKET_NAME, media_data.key);
  }
};

const getMediaType = (mimeType) => {
  if (mimeType.startsWith('image/')) return mimeType === 'image/gif' ? 'GIF' : 'IMAGE';
  if (mimeType.startsWith('video/')) return 'VIDEO';
  if (mimeType === 'application/pdf') return 'PDF';
  if (
    mimeType === 'application/msword' ||
    mimeType === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
  )
    return 'DOCUMENT';
  return 'OTHER';
};

module.exports = {
  fileUploading,
  getFiles,
  deleteMedia,
  updateMedia,
};
