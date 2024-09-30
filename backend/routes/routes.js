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
router.get('/users-list', adminAuthCheckMiddleware, UsersController.getUsersList);
// router.post('/user-change-status', adminAuthCheckMiddleware, UsersController.changeUserStatus);
router.post('/user-update', adminAuthCheckMiddleware, UsersController.updateUserByAdmin);

// File upload
router.post('/file-upload', [endUserAuthCheckMiddleware, userFileUpload], DocumentsController.fileUploading);
router.get('/get-files', endUserAuthCheckMiddleware, DocumentsController.getFiles);
router.post('/delete-files', endUserAuthCheckMiddleware, DocumentsController.deleteMedia);

module.exports = router;
