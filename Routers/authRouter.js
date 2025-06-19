const express = require('express');
const authController = require('../controllers/authcontroller');
const ownerController = require('../controllers/ownercontroller');
const { identifier } = require('../middlewares/identifier');
const router = express.Router();

router.post('/signup', authController.signup);
router.post('/signin', authController.signIn);
router.post('/signout', authController.signout);
router.patch('/sendVerification', authController.sendVerification);
router.patch('/verification', authController.otpVerfication);
router.get('/verify-token', identifier, authController.verifyToken);
router.post('/registered',identifier,ownerController.submit)
router.post('/show',ownerController.search)
// Future routes can be uncommented once implemented
// router.patch('/change-password', identifier, authController.changePassword);
// router.patch('/send-forgot-password-code', authController.sendforgotPasswordCode);
// router.patch('/verify-forgot-password-code', authController.isverifiedforgotPassword);

module.exports = router;