const usersModel = require('../../model/usersSchema');
const utils = require('../../utils/utils');
const { StatusCodes } = require('http-status-codes');
const { registrationUserSchema, loginUserSchema } = require('./userValidation');
const { messages } = require('../../utils/en');
const { getFile } = require('../../middlewares/uploadImage');

// Create a new user
const fileUploading = async (req, res) => {
  try {
    console.log("🚀 ~ fileUploading ~ req.files:", req.files)
    const fileData = await getFile(
      process.env.BUCKET_NAME,
      req.files[0].key
    );
    console.log("🚀 ~ fileUploading ~ req.files:", fileData)
    return utils.sendResponse(res, StatusCodes.CREATED, messages.userRegisteredSuccessfully, fileData);
    // // Validate the request body
    // const { error, value } = registrationUserSchema.validate(req.body);
    // if (error) {
    //   return utils.sendResponse(res, StatusCodes.BAD_REQUEST, error.details[0].message);
    // }

    // // Extract the user data from the request body
    // const { email, firstName, lastName, password } = value;

    // // Check if the user already exists
    // const isUserExist = await getUserByEmail(email);
    // if (isUserExist) {
    //   return utils.sendResponse(res, StatusCodes.BAD_REQUEST, messages.userAlreadyExist);
    // }

    // // Generate a hashed password
    // const hashedPassword = await generatePassword(password);

    // const userData = {
    //   email,
    //   firstName,
    //   lastName,
    //   password: hashedPassword,
    // };

    // if (value.role) {
    //   userData.role = value.role;
    // }

    // // Create a new user
    // const newUser = await usersModel.create(userData);
    // const plainUser = await usersModel.findById(newUser._id).lean().exec();

    // console.log('🚀 ~ registerNewUser ~ plainUser:', plainUser);

    // delete plainUser.password;
    // return utils.sendResponse(res, StatusCodes.CREATED, messages.userRegisteredSuccessfully, plainUser);
  } catch (error) {
    console.error('🚀 ~ registerNewUser ~ error:', error);
    return utils.sendResponse(res, StatusCodes.INTERNAL_SERVER_ERROR, messages.errorUserRegistered);
  }
};

module.exports = {
  fileUploading,
};