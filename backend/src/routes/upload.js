const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const { requireProfileAccess } = require('../middleware/auth');
const { uploadImage } = require('../controllers/uploadController');

const storage = multer.diskStorage({
  destination: path.join(__dirname, '..', '..', 'uploads'),
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    cb(null, `profile_${Date.now()}${ext}`);
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) cb(null, true);
    else cb(new Error('Only images allowed'));
  },
});

// Access is checked before multer so files for foreign profiles are never written
router.post('/image', requireProfileAccess(req => req.query.profileName), upload.single('image'), uploadImage);

module.exports = router;
