const express = require('express');
const bankUPAcontroller = require('../controller/bankUPAcontroller');
const upload = require('../multer/multer');

const bankUPArouter = express.Router();

bankUPArouter.route('/getUserPhoto').get(bankUPAcontroller.getUserPhoto);
bankUPArouter.route('/getUserDocument').get(bankUPAcontroller.getDocument);
bankUPArouter.route('/acceptPendingUserAppointment').post(bankUPAcontroller.acceptPendingUserAppointment);
bankUPArouter.route('/rejectPendingUserAppointment').post(bankUPAcontroller.rejectPendingUserAppointment);
bankUPArouter.route('/hasDocument').get( bankUPAcontroller.hasDocument);


module.exports = bankUPArouter;