const Joi = require('joi');

const fileUploadValidator = Joi.object({
  metadata: Joi.string().required(),
  section: Joi.string().required(),
  subsection: Joi.string().required(),
  file: Joi.object().required(),
  documentDate: Joi.date().required(),
});

const deleteMediaValidator = Joi.object({
  id: Joi.string().required(),
});

const updatingMediaValidator = Joi.object({
  id: Joi.string().required(),
  metadata: Joi.string().required(),
  section: Joi.string().required(),
  subsection: Joi.string().required(),
  file: Joi.object().optional(),
  doc: Joi.string().optional(),
  documentDate: Joi.date().required(),
});

module.exports = {
  fileUploadValidator,
  deleteMediaValidator,
  updatingMediaValidator,
};
