const express = require('express');
const adminController = require('../controller/adminController');

const adminRouter = express.Router();

adminRouter.route('/getPendingBankRequests').get(adminController.getPendingBankRequests);
adminRouter.route('/acceptBankRequest').post(adminController.acceptBankRequest);
adminRouter.route('/rejectBankRequest').post(adminController.rejectBankRequest);

adminRouter.route('/getAllWarnedDonors').get(adminController.getAllWarnedDonors);
adminRouter.route('/warnDonor').post(adminController.warnDonor);
adminRouter.route('/removeDonorWarning').post(adminController.removeDonorWarning);
adminRouter.route('/banDonor').post(adminController.banDonor);
adminRouter.route('/getChangedWarnedDonors').get(adminController.getChangedWarnedDonors);
adminRouter.route('/reportedDonorsByBloodBank').get(adminController.reportedDonorsByBloodBank);
adminRouter.route('/getDocumentofReportedDonor').get(adminController.getDocumentofReportedDonor);



module.exports = adminRouter;