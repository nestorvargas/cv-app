const express = require('express');
const router = express.Router();
const { requireAdmin } = require('../middleware/auth');
const { searchTitles, addTitle } = require('../controllers/catalogController');

router.get('/titles', searchTitles);
router.post('/titles', requireAdmin, addTitle);

module.exports = router;
