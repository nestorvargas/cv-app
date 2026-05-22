const express = require('express');
const router = express.Router();
const { getCv, updateCv } = require('../controllers/cvController');

router.get('/:lang', getCv);
router.put('/:lang', updateCv);

module.exports = router;
