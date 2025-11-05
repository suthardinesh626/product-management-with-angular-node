import express from 'express';
const router = express.Router();
import {
  generateProductReport,
  downloadSampleTemplate
} from '../controllers/report.controller.js';
import { authenticate } from '../middleware/auth.middleware.js';

router.use(authenticate);

router.get('/products', generateProductReport);
router.get('/template', downloadSampleTemplate);

export default router;

