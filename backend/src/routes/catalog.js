const express = require('express');
const router = express.Router();
const { requireAuth, requireAdmin } = require('../middleware/auth');
const { searchTitles, addTitle } = require('../controllers/catalogController');

router.get('/titles', searchTitles);
router.post('/titles', requireAuth, requireAdmin, addTitle);

module.exports = router;
