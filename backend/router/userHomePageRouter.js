const express = require('express');
const userHomePageController = require('../controller/userHomePageController');

const userHomePageRouter = express.Router();

userHomePageRouter.route('/isDonor/:email').get(userHomePageController.isDonor);
userHomePageRouter.route('/donorSignup').post(userHomePageController.donorSignup);
userHomePageRouter.route('/getName/:userid').get(userHomePageController.getName);
userHomePageRouter.route('/getBloodBanks/:userid').get(userHomePageController.getBloodBanks);
userHomePageRouter.route('/getBloodBank/:userid').get(userHomePageController.getBloodBank);
userHomePageRouter.route('/getBloodBankOnRequest/:Division/:Area/:BloodGroup/:Rh/:Quantity').get(userHomePageController.getBloodBankOnRequest);
userHomePageRouter.route('/getBankID/:requestid').get(userHomePageController.getBankId);
userHomePageRouter.route('/getDonorID/:userid').get(userHomePageController.getDonorID);
userHomePageRouter.route('/getUserData/:userid').get(userHomePageController.getUserData);
userHomePageRouter.route('/donationDonorAppointment').post(userHomePageController.donationDonorAppointment);
userHomePageRouter.route('/donorProfileUpdate').post(userHomePageController.donorProfileUpdate);
userHomePageRouter.route('/getAppointmentData/:userid').get(userHomePageController.getAppointmentData);
userHomePageRouter.route('/getBloodBankInfos/:requestId').get(userHomePageController.bloodBankInfos);
module.exports = userHomePageRouter;