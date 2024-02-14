const express = require('express');
const userHomePageController = require('../controller/userHomePageController');

const userHomePageRouter = express.Router();

userHomePageRouter.route('/isDonor/:email').get(userHomePageController.isDonor);
userHomePageRouter.route('/donorSignup').post(userHomePageController.donorSignup);
userHomePageRouter.route('/getName/:userid').get(userHomePageController.getName);
userHomePageRouter.route('/getBloodBanks/:userid').get(userHomePageController.getBloodBanks);
//userHomePageRouter.route('/donationForm').get(userHomePageController.getBloodBanks);
userHomePageRouter.route('/getBankID/:requestid').get(userHomePageController.getBankId);
userHomePageRouter.route('/getDonorID/:userid').get(userHomePageController.getDonorID);
userHomePageRouter.route('/getUserData/:userid').get(userHomePageController.getUserData);
userHomePageRouter.route('/donationDonorAppointment').post(userHomePageController.donationDonorAppointment);




module.exports = userHomePageRouter;