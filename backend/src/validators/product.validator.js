import { body } from 'express-validator';

export const createProductValidator = [
  body('name')
    .trim()
    .notEmpty()
    .withMessage('Product name is required')
    .isLength({ min: 2, max: 255 })
    .withMessage('Product name must be between 2 and 255 characters'),
  body('description')
    .optional()
    .trim(),
  body('price')
    .notEmpty()
    .withMessage('Price is required')
    .isFloat({ min: 0 })
    .withMessage('Price must be a positive number'),
  body('category_id')
    .notEmpty()
    .withMessage('Category ID is required')
    .isInt({ min: 1 })
    .withMessage('Category ID must be a valid integer'),
  body('stock_quantity')
    .optional()
    .isInt({ min: 0 })
    .withMessage('Stock quantity must be a non-negative integer')
];

export const updateProductValidator = [
  body('name')
    .optional()
    .trim()
    .isLength({ min: 2, max: 255 })
    .withMessage('Product name must be between 2 and 255 characters'),
  body('description')
    .optional()
    .trim(),
  body('price')
    .optional()
    .isFloat({ min: 0 })
    .withMessage('Price must be a positive number'),
  body('category_id')
    .optional()
    .isInt({ min: 1 })
    .withMessage('Category ID must be a valid integer'),
  body('stock_quantity')
    .optional()
    .isInt({ min: 0 })
    .withMessage('Stock quantity must be a non-negative integer'),
  body('is_active')
    .optional()
    .isBoolean()
    .withMessage('is_active must be a boolean')
];

