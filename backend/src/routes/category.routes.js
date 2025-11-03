const express = require('express');
const router = express.Router();
const {
  getAllCategories,
  getCategoryById,
  createCategory,
  updateCategory,
  deleteCategory
} = require('../controllers/category.controller');
const { authenticate } = require('../middleware/auth.middleware');
const { validate } = require('../middleware/validation.middleware');
const {
  createCategoryValidator,
  updateCategoryValidator
} = require('../validators/category.validator');

// All routes require authentication
router.use(authenticate);

// Category CRUD operations
router.get('/', getAllCategories);
router.get('/:id', getCategoryById);
router.post('/', createCategoryValidator, validate, createCategory);
router.put('/:id', updateCategoryValidator, validate, updateCategory);
router.delete('/:id', deleteCategory);

module.exports = router;

