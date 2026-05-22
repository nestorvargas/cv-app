const express = require('express');
const router = express.Router();
const { listProfiles, getCv, updateCv, createProfile, deleteProfile } = require('../controllers/cvController');

router.get('/', listProfiles);
router.post('/', createProfile);
router.get('/:profileName/:lang', getCv);
router.put('/:profileName/:lang', updateCv);
router.delete('/:profileName', deleteProfile);

module.exports = router;
