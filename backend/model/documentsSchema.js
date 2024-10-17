const mongoose = require('mongoose');

const documentsSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.ObjectId,
      ref: 'users',
      required: true,
    },
    section: {
      type: String,
      required: true,
      trim: true,
    },
    subsection: {
      type: String,
      required: true,
      trim: true,
    },
    metadata: {
      type: String,
      required: true,
    },
    media_key: {
      type: String,
      required: true,
      trim: true,
    },
    media_size: {
      type: String,
      required: true,
      trim: true,
    },
    media_type: {
      type: String,
      enum: ['IMAGE', 'GIF', 'VIDEO', 'PDF', 'DOCUMENT', 'OTHER'],
      required: true,
    },
    mime_type: {
      type: String,
      required: true,
    },
    documentDate: {
      type: Date,
      required: true,
    },
  },
  { timestamps: true },
);

const documentsModel = mongoose.model('documents', documentsSchema);

module.exports = documentsModel;
