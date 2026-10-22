const express = require('express');
const router = express.Router();
const { requireProfileAccess } = require('../middleware/auth');
const { generatePdf } = require('../controllers/pdfController');

router.get('/:profileName/:lang', requireProfileAccess(req => req.params.profileName), generatePdf);

module.exports = router;
