const express = require('express');
const bankBScontroller = require('../controller/bankBScontroller');

const bankBSrouter = express.Router();

bankBSrouter.route('/getBloodInfo').get(bankBScontroller.getBloodInfo);
bankBSrouter.route('/updateBloodInfo').post(bankBScontroller.updateBloodInfo);
bankBSrouter.route('/addBloodInfo').post(bankBScontroller.addBloodInfo);
bankBSrouter.route('/deleteBloodInfo').delete(bankBScontroller.deleteBloodInfo);
bankBSrouter.route('/bloodGroupAndRhInPromise').post(bankBScontroller.bloodGroupAndRhInPromise);

module.exports = bankBSrouter;