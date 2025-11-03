const express = require('express');
const router = express.Router();
const {
  generateProductReport,
  downloadSampleTemplate
} = require('../controllers/report.controller');
const { authenticate } = require('../middleware/auth.middleware');

// All routes require authentication
router.use(authenticate);

// Report routes
router.get('/products', generateProductReport);
router.get('/template', downloadSampleTemplate);

module.exports = router;

