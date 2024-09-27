const mongoose = require("mongoose");

const usersSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
      unique: true,
    },
    firstName: {
      type: String,
      required: true,
      trim: true,
    },
    lastName: {
      type: String,
      required: true,
      trim: true,
    },
    password: {
      type: String,
      required: true,
      trim: true,
    },
    role: {
      type: [String],
      enum: ["ADMIN", "ENDUSER"],
      required: true,
      default: ["ENDUSER"],
    },
    isActive: {
      type: String,
      enum: ["ACTIVE", "DISABLED"],
      required: true,
      default: "ACTIVE",
    },
  },
  { timestamps: true }
);

const usersModel = mongoose.model("users", usersSchema);

module.exports = usersModel;
