const usersModel = require('../../model/usersSchema');
const utils = require('../../utils/utils');
const { StatusCodes } = require('http-status-codes');
const {
  registrationUserSchema,
  loginUserSchema,
  statusChange,
  updateUserByAdminValidation,
} = require('./userValidation');
const bcrypt = require('bcrypt');
const { messages } = require('../../utils/en');
const moment = require('moment');
const jwt = require('jsonwebtoken');
const jwtSecret = process.env.Secret;

// Create a new user
const registerNewUser = async (req, res) => {
  try {
    // Validate the request body
    const { error, value } = registrationUserSchema.validate(req.body);
    if (error) {
      return utils.sendResponse(res, StatusCodes.BAD_REQUEST, error.details[0].message);
    }

    // Extract the user data from the request body
    const { email, firstName, lastName, password } = value;

    // Check if the user already exists
    const isUserExist = await getUserByEmail(email);
    if (isUserExist) {
      return utils.sendResponse(res, StatusCodes.BAD_REQUEST, messages.userAlreadyExist);
    }

    // Generate a hashed password
    const hashedPassword = await generatePassword(password);

    const userData = {
      email,
      firstName,
      lastName,
      password: hashedPassword,
    };

    if (value.role) {
      userData.role = value.role;
    }

    // Create a new user
    const newUser = await usersModel.create(userData);
    const plainUser = await usersModel.findById(newUser._id).lean().exec();

    delete plainUser.password;
    return utils.sendResponse(res, StatusCodes.OK, messages.userRegisteredSuccessfully, plainUser);
  } catch (error) {
    console.error('🚀 ~ registerNewUser ~ error:', error);
    return utils.sendResponse(res, StatusCodes.INTERNAL_SERVER_ERROR, messages.errorUserRegistered);
  }
};

// Login a user
const loginUser = async (req, res) => {
  try {
    // Validate the request body
    const { error, value } = loginUserSchema.validate(req.body);
    if (error) {
      return utils.sendResponse(res, StatusCodes.BAD_REQUEST, error.details[0].message);
    }

    // Extract the user data from the request body
    const { email, password } = value;

    // Check if the user already exists
    const isUserExist = await getUserByEmail(email);
    if (!isUserExist || !isUserExist.isActive) {
      return utils.sendResponse(res, StatusCodes.UNAUTHORIZED, messages.userNotExistOrDeactivated);
    }

    // Compare the provided password with the hashed password
    const compare = await bcrypt.compare(password, isUserExist.password);
    if (!compare) {
      return utils.sendResponse(res, StatusCodes.UNAUTHORIZED, messages.passwordOrEmailIsWrong);
    }

    // Generate a JWT token
    var payload = {
      iat: moment().unix(),
      email: isUserExist.email,
      id: isUserExist.id,
    };
    isUserExist.token = jwt.sign(payload, jwtSecret);
    delete isUserExist.password;

    return utils.sendResponse(res, StatusCodes.OK, messages.loginSuccessFul, isUserExist);
  } catch (error) {
    console.error('🚀 ~ loginUser ~ error:', error);
    return utils.sendResponse(res, StatusCodes.INTERNAL_SERVER_ERROR, messages.errorInLogin);
  }
};

// Get users list
const getUsersList = async (req, res) => {
  try {
    const { user } = req;

    // Find all users except the current user
    const allUsers = await usersModel
      .find({ _id: { $ne: user._id } })
      .select('-password')
      .lean()
      .exec();
    return utils.sendResponse(res, StatusCodes.OK, messages.allUsersFound, allUsers);
  } catch (error) {
    console.error('🚀 ~ getUsersList ~ error:', error);
    return utils.sendResponse(res, StatusCodes.INTERNAL_SERVER_ERROR, messages.errorInUsersList);
  }
};

// Make a user's status disabled
const changeUserStatus = async (req, res) => {
  try {
    const { error, value } = statusChange.validate(req.body);
    if (error) {
      return utils.sendResponse(res, StatusCodes.BAD_REQUEST, error.details[0].message);
    }

    // Extract the user data from the request body
    const { id } = value;

    // Change user's status
    const targetedUser = await usersModel.findById(id);

    if (!targetedUser) {
      return utils.sendResponse(res, StatusCodes.NOT_FOUND, messages.userNotFound);
    }

    // Update the user's status
    const newStatus = !targetedUser.isActive;

    const updatedUser = await usersModel
      .findByIdAndUpdate(id, { isActive: newStatus }, { new: true, select: '-password' })
      .lean();

    return utils.sendResponse(res, StatusCodes.OK, messages.userStatusUpdated, updatedUser);
  } catch (error) {
    console.error('🚀 ~ changeUserStatus ~ error:', error);
    return utils.sendResponse(res, StatusCodes.INTERNAL_SERVER_ERROR, messages.errorInUsersStatusChange);
  }
};

// user update by admin
const updateUserByAdmin = async (req, res) => {
  try {
    const { error, value } = updateUserByAdminValidation.validate(req.body);
    if (error) {
      return utils.sendResponse(res, StatusCodes.BAD_REQUEST, error.details[0].message);
    }

    // Extract the user data from the request body
    const { id, firstName, lastName, password, isActive } = value;

    // Prepare the update object
    const updateData = {};
    if (firstName) updateData.firstName = firstName;
    if (lastName) updateData.lastName = lastName;
    if (isActive !== undefined) updateData.isActive = isActive === 'true';
    if (password) {
      const hashedPassword = await generatePassword(password);
      updateData.password = hashedPassword;
    }
    

    // Update the user
    const updatedUser = await usersModel.findByIdAndUpdate(id, updateData, { new: true, select: '-password' }).lean();

    if (!updatedUser) {
      return utils.sendResponse(res, StatusCodes.NOT_FOUND, messages.userNotFound);
    }

    return utils.sendResponse(res, StatusCodes.OK, messages.userUpdatedSuccessfully, updatedUser);
  } catch (error) {
    console.error('🚀 ~ updateUserByAdmin ~ error:', error);
    return utils.sendResponse(res, StatusCodes.INTERNAL_SERVER_ERROR, messages.errorInUserUpdate);
  }
};

// Get a user by email
const getUserByEmail = async (email) => {
  try {
    // Find the user by email
    return await usersModel.findOne({ email }).lean().exec();
  } catch (error) {
    console.error('🚀 ~ getUserByEmail ~ error:', error);
    throw error;
  }
};

// Generate a hashed password
const generatePassword = async (password) => {
  try {
    // Generate a hashed password
    const salt = await bcrypt.genSalt(10);
    return await bcrypt.hash(password, salt);
  } catch (error) {
    console.error('🚀 ~ generatePassword ~ error:', error);
    throw error;
  }
};

module.exports = {
  getUserByEmail,
  registerNewUser,
  loginUser,
  getUsersList,
  changeUserStatus,
  updateUserByAdmin,
};
