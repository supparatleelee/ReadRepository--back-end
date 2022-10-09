const express = require('express');

const authController = require('../controller/authController');
const authenticate = require('../middlewares/authenticate');

const router = express.Router();

router.post('/register', authController.register);
router.post('/login', authController.login);
router.get('/me', authenticate, authController.getMe);
router.delete('/deleteAccount', authenticate, authController.deleteAccount);

module.exports = router;
