import express from 'express';
const router = express.Router();
import {
  getAllProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  bulkUpload,
  getBulkUploadStatus
} from '../controllers/product.controller.js';
import { authenticate } from '../middleware/auth.middleware.js';
import { validate } from '../middleware/validation.middleware.js';
import { uploadImage, uploadBulk } from '../middleware/upload.middleware.js';
import {
  createProductValidator,
  updateProductValidator
} from '../validators/product.validator.js';

router.use(authenticate);

router.get('/', getAllProducts);
router.get('/:id', getProductById);
router.post('/', uploadImage.single('image'), createProductValidator, validate, createProduct);
router.put('/:id', uploadImage.single('image'), updateProductValidator, validate, updateProduct);
router.delete('/:id', deleteProduct);

router.post('/bulk/upload', uploadBulk.single('file'), bulkUpload);
router.get('/bulk/status/:jobId', getBulkUploadStatus);

export default router;

