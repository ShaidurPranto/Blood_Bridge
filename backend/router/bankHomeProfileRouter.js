const express = require('express');
const bankHomeProfileController = require('../controller/bankHomeProfileController');
const upload = require('../multer/multer');

const bankHomeProfileRouter = express.Router();

bankHomeProfileRouter.route('/isDefaultPhoto').get(bankHomeProfileController.isDefaultPhoto);
bankHomeProfileRouter.route('/getPhoto').get(bankHomeProfileController.getProfilePhoto);
bankHomeProfileRouter.route('/getDefaultPhoto').get(bankHomeProfileController.getDefualtPhoto);
bankHomeProfileRouter.route('/updatePhoto').post(upload.photoUpload.single('file'), bankHomeProfileController.updateProfilePhoto);
bankHomeProfileRouter.route('/removePhoto').delete(bankHomeProfileController.removeAvatarPhoto);
bankHomeProfileRouter.route('/getDescription').get(bankHomeProfileController.getDescription);
bankHomeProfileRouter.route('/updateDescription').post(bankHomeProfileController.updateDescription);
bankHomeProfileRouter.route('/getTermsAndCondition').get(bankHomeProfileController.getTermsAndConditions);
bankHomeProfileRouter.route('/updateTermsAndCondition').post(bankHomeProfileController.updateTermsAndCondition);
bankHomeProfileRouter.route('/getInfo').get(bankHomeProfileController.getBankInfo);
bankHomeProfileRouter.route('/updateInfo').post(bankHomeProfileController.updateProfileInfo);
bankHomeProfileRouter.route('/updatePassword').post(bankHomeProfileController.updatePassword);

module.exports = bankHomeProfileRouter;