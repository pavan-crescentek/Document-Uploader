const utils = require('../utils/utils');
const { messages } = require('../utils/en');
const _ = require('lodash');
const jwt = require('jsonwebtoken');
const secret = process.env.Secret;
const userController = require('../controller/users');
const { StatusCodes } = require('http-status-codes');

const endUserAuthCheckMiddleware = async function authFetchChecker(req, res, next) {
  try {
    const header = req.headers.authorization;
    if (!_.isUndefined(header)) {
      const token = header.replace('Bearer ', '');
      const user = await jwt.verify(token, secret);
      const fetchedUser = await userController.getUserByEmail(user.email);

      if (!fetchedUser || !fetchedUser.role || !fetchedUser.role.includes('ENDUSER') || !fetchedUser.isActive) {
        return utils.sendResponse(res, StatusCodes.UNAUTHORIZED, messages.unauthorized);
      }
      req.user = fetchedUser;
      next();
    } else {
      return utils.sendResponse(res, StatusCodes.UNAUTHORIZED, messages.pleaseCheckAuth);
    }
  } catch (error) {
    return utils.sendResponse(res, StatusCodes.INTERNAL_SERVER_ERROR, messages.internalError, error);
  }
};

module.exports = { endUserAuthCheckMiddleware };
