import express from 'express';
const router = express.Router();
import {
  generateProductReport,
  downloadSampleTemplate
} from '../controllers/report.controller.js';
import { authenticate } from '../middleware/auth.middleware.js';

// All routes require authentication
router.use(authenticate);

// Report routes
router.get('/products', generateProductReport);
router.get('/template', downloadSampleTemplate);

export default router;

