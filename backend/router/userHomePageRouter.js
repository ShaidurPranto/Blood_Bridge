const express = require('express');
const userHomePageController = require('../controller/userHomePageController');

const userHomePageRouter = express.Router();

userHomePageRouter.route('/isDonor/:email').get(userHomePageController.isDonor);
userHomePageRouter.route('/donorSignup').post(userHomePageController.donorSignup);
userHomePageRouter.route('/getName/:userid').get(userHomePageController.getName);

module.exports = userHomePageRouter;