import express from 'express';
const router = express.Router();
import {
  getAllUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser
} from '../controllers/user.controller.js';
import { authenticate, authorize } from '../middleware/auth.middleware.js';
import { validate } from '../middleware/validation.middleware.js';
import { registerValidator } from '../validators/auth.validator.js';

router.use(authenticate);

router.get('/', getAllUsers);
router.get('/:id', getUserById);
router.post('/', authorize('admin'), registerValidator, validate, createUser);
router.put('/:id', authorize('admin'), updateUser);
router.delete('/:id', authorize('admin'), deleteUser);

export default router;

