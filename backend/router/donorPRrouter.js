const express = require('express');
const donorPRcontroller = require('../controller/donorPRcontroller');

const donorPRrouter = express.Router();

donorPRrouter.route('/doesDonorHasAPendingRequest/:donorid').get(donorPRcontroller.doesDonorHasAPendingRequest);
donorPRrouter.route('/doesDonorHasAPendingRequestBank/:donorid').get(donorPRcontroller.doesDonorHasAPendingRequestBank)
donorPRrouter.route('/isThereAnyDonationInThreeMonths/:donorid').get(donorPRcontroller.isThereAnyDonationInThreeMonths);
donorPRrouter.route('/getBloodRequetsInSameArea/:donorid').get(donorPRcontroller.getBloodRequetsInSameArea);
donorPRrouter.route('/getBloodRequestsInSameDistrict/:donorid').get(donorPRcontroller.getBloodRequestsInSameDistrict);
donorPRrouter.route('/confirmAnAppointment/:donorid/:requestid').get(donorPRcontroller.confirmAnAppointment);
donorPRrouter.route('/donorEndsAnAppointment/:donorid').get(donorPRcontroller.donorEndsAnAppointment);
donorPRrouter.route('/getBloodRequetsInSameAreaAsc/:donorid').get(donorPRcontroller.getBloodRequetsInSameAreaAsc);
donorPRrouter.route('/getBloodRequetsInSameAreaDesc/:donorid').get(donorPRcontroller.getBloodRequetsInSameAreaDesc);
donorPRrouter.route('/getBloodRequestsInSameDistrictAsc/:donorid').get(donorPRcontroller.getBloodRequestsInSameDistrictAsc);
donorPRrouter.route('/getBloodRequestsInSameDistrictDesc/:donorid').get(donorPRcontroller.getBloodRequestsInSameDistrictDesc);

module.exports = donorPRrouter;

