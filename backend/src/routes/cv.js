const express = require('express');
const router = express.Router();
const { requireAdmin, requireProfileAccess } = require('../middleware/auth');
const { listProfiles, getCv, updateCv, createProfile, deleteProfile, setProfileOwner, cloneProfile } = require('../controllers/cvController');

const ownProfile = requireProfileAccess(req => req.params.profileName);

router.get('/', listProfiles);
router.post('/', createProfile);
router.put('/:profileName/owner', requireAdmin, setProfileOwner);
router.post('/:profileName/clone', ownProfile, cloneProfile);
router.get('/:profileName/:lang', ownProfile, getCv);
router.put('/:profileName/:lang', ownProfile, updateCv);
router.delete('/:profileName', ownProfile, deleteProfile);

module.exports = router;
