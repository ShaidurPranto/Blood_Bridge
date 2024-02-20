const express = require('express');
const bankHomeController = require('../controller/bankHomeController');
const upload = require('../multer/multer');

const bankHomeRouter = express.Router();

bankHomeRouter.route('/isDefaultPhoto').get(bankHomeController.isDefaultPhoto);
bankHomeRouter.route('/getPhoto').get(bankHomeController.getProfilePhoto);
bankHomeRouter.route('/getDefaultPhoto').get(bankHomeController.getDefualtPhoto);
bankHomeRouter.route('/updatePhoto').post(upload.photoUpload.single('file'), bankHomeController.updateProfilePhoto);
bankHomeRouter.route('/removePhoto').delete(bankHomeController.removeAvatarPhoto);

module.exports = bankHomeRouter;