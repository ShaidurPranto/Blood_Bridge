const express = require('express');
const userHomePageController = require('../controller/userHomePageController');
const upload = require('../multer/multer');

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
userHomePageRouter.route('/appoinmentEnded').post(userHomePageController.appoinmentEnded);
userHomePageRouter.route('/appoinmentCancel').post(userHomePageController.appoinmentCancel);
userHomePageRouter.route('/appoinmentCancelAccepted').post(userHomePageController.appoinmentCancelAccepted);
userHomePageRouter.route('/appoinmentDonorUser').post(userHomePageController.donorUserAppointment);
userHomePageRouter.route('/getRequestAppointmentData/:requestid/:donorid').get(userHomePageController.getDonorOnRequest);
userHomePageRouter.route('/appoinmentCanceled').post(userHomePageController.appoinmentCanceled);
userHomePageRouter.route('/appoinmentCancelFromUserAccepted').post(userHomePageController.appoinmentCancelFromUserAccepted);
userHomePageRouter.route('/giveSuccessfulUpdate/:requestid/:donorid').get(userHomePageController.giveSuccessfulUpdate);
userHomePageRouter.route('/appoinmentEndedByUser').post(userHomePageController.appoinmentEndedByUser);
userHomePageRouter.route('/userReportDonor/:requestid/:donorid').get(userHomePageController.userReportDonor);
userHomePageRouter.route('/getDonorsIf/:userid').get(userHomePageController.getDonorsIf);
userHomePageRouter.route('/getDonorsIfAccepted/:userid').get(userHomePageController.getDonorsIfAccepted);
userHomePageRouter.route('/getQuanitiyCount/:firstRequestId').get(userHomePageController.getQuantity);
userHomePageRouter.route('/getCurrentQuanitiyCount/:firstRequestId').get(userHomePageController.getQuantityCount);
userHomePageRouter.route('/getRequestBankFromUser/:userid').get(userHomePageController.getAppointmentBankData);
userHomePageRouter.route('/bankAppCancelByUser').post(userHomePageController.bankAppCancelByUser);
userHomePageRouter.route('/getstillLeft/:userid').get(userHomePageController.getstillLeft);
userHomePageRouter.route('/getBloodBankHistory/:userid').get(userHomePageController.getBankHistory);
userHomePageRouter.route('/getUserHistory/:userid').get(userHomePageController.getUserHistory);
userHomePageRouter.route('/uploadDonorPhoto').post(upload.photoUpload.single('file'),userHomePageController.updateProfilePhoto);
userHomePageRouter.route('/getProfilePhoto/:userid').get(userHomePageController.getProfilePhoto);
userHomePageRouter.route('/ifAnyOngoingWithBank/:userid').get(userHomePageController.ifAnyOngoingWithBank);
userHomePageRouter.route('/userBankAppoinment').post(upload.pdfUpload.single('file'),userHomePageController.userBankAppointment);
userHomePageRouter.route('/ifEligible/:userid').get(userHomePageController.ifEligibleToRequestToDonor);
userHomePageRouter.route('/uv/:requestid/:donorid').get(userHomePageController.donorProfileVisit);
userHomePageRouter.route(`/gid/:donorid`).get(userHomePageController.getUserid);;


module.exports = userHomePageRouter;