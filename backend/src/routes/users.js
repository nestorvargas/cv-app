const express = require('express');
const router = express.Router();
const { requireAuth, requireAdmin } = require('../middleware/auth');
const { listUsers, createUser, updateUser, deleteUser } = require('../controllers/userController');

router.use(requireAuth, requireAdmin);

router.get('/', listUsers);
router.post('/', createUser);
router.put('/:id(\\d+)', updateUser);
router.delete('/:id(\\d+)', deleteUser);

module.exports = router;
