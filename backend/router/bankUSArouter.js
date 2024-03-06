const express = require('express');
const bankUSAcontroller = require('../controller/bankUSAcontroller');

const bankUSArouter = express.Router();

bankUSArouter.route('/userReceivedBlood').post(bankUSAcontroller.userReceivedBlood);

module.exports = bankUSArouter;