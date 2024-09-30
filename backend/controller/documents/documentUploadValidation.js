const Joi = require('joi');

const fileUploadValidator = Joi.object({
  metadata: Joi.string().required(),
  section: Joi.string().required(),
  subsection: Joi.string().required(),
  file: Joi.object().required(),
  // file: Joi.object({
  //   fieldname: Joi.string().required(),
  //   originalname: Joi.string().required(),
  //   encoding: Joi.string().required(),
  //   mimetype: Joi.string().valid('application/pdf', 'image/jpeg', 'image/png').required(),
  //   size: Joi.number().max(5 * 1024 * 1024).required(), // 5MB max file size
  //   bucket: Joi.string().required(),
  //   key: Joi.string().required(),
  //   acl: Joi.string().required(),
  //   contentType: Joi.string().required(),
  //   contentDisposition: Joi.string().optional(),
  //   storageClass: Joi.string().required(),
  //   serverSideEncryption: Joi.string().required(),
  //   location: Joi.string().uri().required(),
  //   etag: Joi.string().required()
  // }).required()
});

module.exports = {
  fileUploadValidator,
};
