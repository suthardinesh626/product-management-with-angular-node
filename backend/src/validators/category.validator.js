import { body } from 'express-validator';

export const createCategoryValidator = [
  body('name')
    .trim()
    .notEmpty()
    .withMessage('Category name is required')
    .isLength({ min: 2, max: 255 })
    .withMessage('Category name must be between 2 and 255 characters'),
  body('description')
    .optional()
    .trim()
];

export const updateCategoryValidator = [
  body('name')
    .optional()
    .trim()
    .isLength({ min: 2, max: 255 })
    .withMessage('Category name must be between 2 and 255 characters'),
  body('description')
    .optional()
    .trim(),
  body('is_active')
    .optional()
    .isBoolean()
    .withMessage('is_active must be a boolean')
];

