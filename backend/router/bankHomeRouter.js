const express = require('express');
const bankHomeController = require('../controller/bankHomeController');

const bankHomeRouter = express.Router();

bankHomeRouter.route('/pendingDonorAppointments').get(bankHomeController.pendingDonorAppointments);
bankHomeRouter.route('/acceptedDonorAppointments').get(bankHomeController.acceptedDonorAppointments);
bankHomeRouter.route('/declinedDonorAppointments').get(bankHomeController.declinedDonorAppointments);
bankHomeRouter.route('/canceledDonorAppointments').get(bankHomeController.canceledDonorAppointments);
// bankLoginRouter.route('/pendingUserAppointments').get(bankLoginController.pendingUserAppointments);
// bankLoginRouter.route('/acceptedUserAppointments').get(bankLoginController.acceptedUserAppointments);
// bankLoginRouter.route('/declinedUserAppointments').get(bankLoginController.declinedUserAppointments);
// bankLoginRouter.route('/canceledUserAppointments').get(bankLoginController.canceledUserAppointments);


module.exports = bankHomeRouter;