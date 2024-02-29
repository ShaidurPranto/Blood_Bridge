const express = require('express');
const adminController = require('../controller/adminController');

const adminRouter = express.Router();

adminRouter.route('/getPendingBankRequests').get(adminController.getPendingBankRequests);
adminRouter.route('/acceptBankRequest').post(adminController.acceptBankRequest);
adminRouter.route('/rejectBankRequest').post(adminController.rejectBankRequest);

module.exports = adminRouter;