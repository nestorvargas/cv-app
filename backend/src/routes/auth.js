const express = require('express');
const router = express.Router();
const { requireAuth } = require('../middleware/auth');
const { login, logout, me, changeOwnPassword } = require('../controllers/authController');

router.post('/login', login);
router.post('/logout', logout);
router.get('/me', requireAuth, me);
router.put('/password', requireAuth, changeOwnPassword);

module.exports = router;
