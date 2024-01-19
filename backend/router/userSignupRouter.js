const express = require('express');
const userSignupController = require('../controller/userSignupController');

const userSignupRouter = express.Router();

userSignupRouter.route('/:name/:email/:pass').get(userSignupController);

module.exports = userSignupRouter;