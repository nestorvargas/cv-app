const express = require('express');
const router = express.Router();
const { requireAuth } = require('../middleware/auth');
const { login, logout, me, changeOwnPassword } = require('../controllers/authController');
const { config, googleLogin, googleRegister } = require('../controllers/googleAuthController');

router.get('/config', config);
router.post('/login', login);
router.post('/google', googleLogin);
router.post('/google/register', googleRegister);
router.post('/logout', logout);
router.get('/me', requireAuth, me);
router.put('/password', requireAuth, changeOwnPassword);

module.exports = router;
