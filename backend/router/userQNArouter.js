const express = require('express');
const upload = require('../multer/multer');
const userQNAcontroller = require('../controller/userQNAcontroller');

const userQNArouter = express.Router();

userQNArouter.route('/createQNA').post(upload.photoUpload.single('file'),userQNAcontroller.createQNA);
userQNArouter.route('/createQNAnoPhoto').post(userQNAcontroller.createQNAnoPhoto);
userQNArouter.route('/getQNAofAuser').get(userQNAcontroller.getQNAofAuser);
userQNArouter.route('/answerToQuestion').post(userQNAcontroller.answerToQuestion);
userQNArouter.route('/getPhoto').get(userQNAcontroller.getPhoto);
userQNArouter.route('/getName').get(userQNAcontroller.getName);
userQNArouter.route('/getQNA').get(userQNAcontroller.getQNA);

module.exports = userQNArouter;