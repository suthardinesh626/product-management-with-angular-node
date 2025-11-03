const express = require('express');
const router = express.Router();
const {
  getAllProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  bulkUpload,
  getBulkUploadStatus
} = require('../controllers/product.controller');
const { authenticate } = require('../middleware/auth.middleware');
const { validate } = require('../middleware/validation.middleware');
const { uploadImage, uploadBulk } = require('../middleware/upload.middleware');
const {
  createProductValidator,
  updateProductValidator
} = require('../validators/product.validator');

// All routes require authentication
router.use(authenticate);

// Product CRUD operations
router.get('/', getAllProducts);
router.get('/:id', getProductById);
router.post('/', uploadImage.single('image'), createProductValidator, validate, createProduct);
router.put('/:id', uploadImage.single('image'), updateProductValidator, validate, updateProduct);
router.delete('/:id', deleteProduct);

// Bulk operations
router.post('/bulk/upload', uploadBulk.single('file'), bulkUpload);
router.get('/bulk/status/:jobId', getBulkUploadStatus);

module.exports = router;

