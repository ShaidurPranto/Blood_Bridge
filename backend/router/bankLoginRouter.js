const express = require('express');
const bankLoginController = require('../controller/bankLoginController');

const bankLoginRouter = express.Router();

bankLoginRouter.route('/').post(bankLoginController.bankLogin);


module.exports = bankLoginRouter;