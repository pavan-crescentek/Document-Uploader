const express = require('express');
const utils = require('../utils/utils');
const router = express.Router();

const UsersController = require('../controller/users');
const { adminAuthCheckMiddleware } = require('../middlewares/adminAuthMiddleware');

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

module.exports = router;
