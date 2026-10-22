const express = require('express');
const multer = require('multer');
const router = express.Router();
const { status, assist } = require('../controllers/aiController');
const { importCv } = require('../controllers/importController');

// PDFs are parsed in memory and never written to disk
const pdfUpload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 8 * 1024 * 1024 },
  fileFilter: (req, file, cb) => cb(null, file.mimetype === 'application/pdf'),
});

router.get('/status', status);
router.post('/assist', assist);
router.post('/import-cv', pdfUpload.single('file'), importCv);

module.exports = router;
