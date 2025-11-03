const express = require('express');
const router = express.Router();
const {
  getAllUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser
} = require('../controllers/user.controller');
const { authenticate, authorize } = require('../middleware/auth.middleware');
const { validate } = require('../middleware/validation.middleware');
const { registerValidator } = require('../validators/auth.validator');

// All routes require authentication
router.use(authenticate);

// User CRUD operations
router.get('/', getAllUsers);
router.get('/:id', getUserById);
router.post('/', authorize('admin'), registerValidator, validate, createUser);
router.put('/:id', authorize('admin'), updateUser);
router.delete('/:id', authorize('admin'), deleteUser);

module.exports = router;

