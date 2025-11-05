import express from 'express';
const router = express.Router();
import {
  getAllCategories,
  getCategoryById,
  createCategory,
  updateCategory,
  deleteCategory
} from '../controllers/category.controller.js';
import { authenticate } from '../middleware/auth.middleware.js';
import { validate } from '../middleware/validation.middleware.js';
import {
  createCategoryValidator,
  updateCategoryValidator
} from '../validators/category.validator.js';

router.use(authenticate);

router.get('/', getAllCategories);
router.get('/:id', getCategoryById);
router.post('/', createCategoryValidator, validate, createCategory);
router.put('/:id', updateCategoryValidator, validate, updateCategory);
router.delete('/:id', deleteCategory);

export default router;

