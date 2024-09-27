const express = require('express');
const utils = require('../utils/utils');
const router = express.Router();

const UsersController = require('../controller/users');
const DocumentsController = require('../controller/documents');
const { adminAuthCheckMiddleware } = require('../middlewares/adminAuthMiddleware');
const { userFileUpload } = require('../middlewares/uploadImage');
const { endUserAuthCheckMiddleware } = require('../middlewares/endUserAuthCheckMiddleware');

// middleware to use application type
router.all('*', (req, res, next) => {
  res.setHeader('Content-Type', 'application/json');
  next();
});

router.get('/', (req, res, next) => {
  return utils.sendResponse(res, 200, 'Welcome');
});

// Users routes
router.post('/registration', adminAuthCheckMiddleware, UsersController.registerNewUser);
router.post('/login', UsersController.loginUser);

// File upload
router.post('/file-upload', [endUserAuthCheckMiddleware, userFileUpload], DocumentsController.fileUploading);

module.exports = router;
