const express = require('express');
const router = express.Router();
const { status, assist } = require('../controllers/aiController');

router.get('/status', status);
router.post('/assist', assist);

module.exports = router;
