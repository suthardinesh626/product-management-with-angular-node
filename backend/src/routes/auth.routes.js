import express from 'express';
const router = express.Router();
import {
  register,
  login,
  getProfile,
  updateProfile,
  changePassword
} from '../controllers/auth.controller.js';
import { authenticate } from '../middleware/auth.middleware.js';
import { validate } from '../middleware/validation.middleware.js';
import {
  registerValidator,
  loginValidator,
  changePasswordValidator
} from '../validators/auth.validator.js';

// Public routes
router.post('/register', registerValidator, validate, register);
router.post('/login', loginValidator, validate, login);

// Protected routes
router.get('/profile', authenticate, getProfile);
router.put('/profile', authenticate, updateProfile);
router.put('/change-password', authenticate, changePasswordValidator, validate, changePassword);

export default router;

