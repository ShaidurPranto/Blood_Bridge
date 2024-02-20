const express = require('express');
const bankHomeController = require('../controller/bankHomeController');
const upload = require('../multer/multer');

const bankHomeRouter = express.Router();

bankHomeRouter.route('/logout').get(bankHomeController.logout);
bankHomeRouter.route('/pendingDonorAppointments').get(bankHomeController.pendingDonorAppointments);
bankHomeRouter.route('/acceptPendingDonorAppointment').post(bankHomeController.acceptPendingDonorAppointment);
bankHomeRouter.route('/rejectPendingDonorAppointment').post(bankHomeController.rejectPendingDonorAppointment);
bankHomeRouter.route('/scheduledDonorAppointmentsOfToday').get(bankHomeController.scheduledDonorAppointmentsOfToday);
bankHomeRouter.route('/successfulDonorAppointment').post(bankHomeController.successfulBloodDonation);
bankHomeRouter.route('/bankReportsDonor').post(upload.pdfUpload.single('file'),bankHomeController.bankReportsIssueOfDonor);
bankHomeRouter.route('/name').get(bankHomeController.getName);
bankHomeRouter.route('/isDefaultPhoto').get(bankHomeController.isDefaultPhoto);
bankHomeRouter.route('/getPhoto').get(bankHomeController.getProfilePhoto);
bankHomeRouter.route('/getDefaultPhoto').get(bankHomeController.getDefualtPhoto);
bankHomeRouter.route('/updatePhoto').post(upload.photoUpload.single('file'), bankHomeController.updateProfilePhoto);
bankHomeRouter.route('/removePhoto').delete(bankHomeController.removeAvatarPhoto);

module.exports = bankHomeRouter;