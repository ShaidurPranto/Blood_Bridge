const express = require('express');
const donorPRcontroller = require('../controller/donorPRcontroller');

const donorPRrouter = express.Router();

donorPRrouter.route('/doesDonorHasAPendingRequest').get(donorPRcontroller.doesDonorHasAPendingRequest);
donorPRrouter.route('/isThereAnyDonationInThreeMonths').get(donorPRcontroller.isThereAnyDonationInThreeMonths);
donorPRrouter.route('/getBloodRequetsInSameArea').get(donorPRcontroller.getBloodRequetsInSameArea);
donorPRrouter.route('/getBloodRequestsInSameDistrict').get(donorPRcontroller.getBloodRequestsInSameDistrict);
donorPRrouter.route('/confirmAnAppointment').get(donorPRcontroller.confirmAnAppointment);
donorPRrouter.route('/donorEndsAnAppointment').get(donorPRcontroller.donorEndsAnAppointment);

module.exports = donorPRrouter;

