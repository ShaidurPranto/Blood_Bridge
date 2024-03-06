const express = require('express');
const bankHistoryController = require('../controller/bankHistoryController');

const bankHistoryRouter = express.Router();

bankHistoryRouter.route('/getLastWeekCollections').get(bankHistoryController.getLastWeekCollections);
bankHistoryRouter.route('/getLastWeekDistributions').get(bankHistoryController.getLastWeekDistributions);

module.exports = bankHistoryRouter;