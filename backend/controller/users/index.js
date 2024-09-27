const usersModel = require('../../model/usersSchema');
const utils = require('../../utils/utils');
const { StatusCodes } = require('http-status-codes');
const { registrationUserSchema, loginUserSchema } = require('./userValidation');
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

    console.log('🚀 ~ registerNewUser ~ plainUser:', plainUser);

    delete plainUser.password;
    return utils.sendResponse(res, StatusCodes.CREATED, messages.userRegisteredSuccessfully, plainUser);
  } catch (error) {
    console.error('🚀 ~ registerNewUser ~ error:', error);
    return utils.sendResponse(res, StatusCodes.INTERNAL_SERVER_ERROR, messages.errorUserRegistered);
  }
};

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
    if (!isUserExist) {
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
};
