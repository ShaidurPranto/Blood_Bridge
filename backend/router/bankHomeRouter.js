const express = require('express');
const bankHomeController = require('../controller/bankHomeController');

const bankHomeRouter = express.Router();

bankHomeRouter.route('/logout').get(bankHomeController.logout);
bankHomeRouter.route('/pendingDonorAppointments').get(bankHomeController.pendingDonorAppointments);
bankHomeRouter.route('/acceptPendingDonorAppointment').post(bankHomeController.acceptPendingDonorAppointment);
bankHomeRouter.route('/rejectPendingDonorAppointment').post(bankHomeController.rejectPendingDonorAppointment);


module.exports = bankHomeRouter;