const express = require('express');
const router = express.Router();
const { generatePdf } = require('../controllers/pdfController');

router.get('/:lang', generatePdf);

module.exports = router;
