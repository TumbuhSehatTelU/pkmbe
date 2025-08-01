const express = require('express');
const router = express.Router();
const AuthController = require('../controllers/auth.controller');
const authMiddleware = require('../middleware/auth.middleware');

router.post('/register/request-otp', AuthController.requestOtp);
router.post('/register/verify', AuthController.verifyAndRegister);


router.post('/login', AuthController.login);

router.get('/profile', authMiddleware.authenticateToken, AuthController.getProfile);


module.exports = router;