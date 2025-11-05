import Queue from 'bull';
import { Product, Category } from '../models/index.js';
import csv from 'csv-parser';
import ExcelJS from 'exceljs';
import fs from 'fs';
import path from 'path';

// Create queue
const uploadProductsQueue = new Queue('product-upload', {
  redis: {
    host: process.env.REDIS_HOST || 'localhost',
    port: process.env.REDIS_PORT || 6379
  }
});

// Process queue jobs
uploadProductsQueue.process(async (job) => {
  const { filePath, fileType } = job.data;
  
  try {
    const products = [];
    let processedCount = 0;
    let errorCount = 0;
    const errors = [];

    // Parse file based on type
    if (fileType === '.csv') {
      // Process CSV
      await new Promise((resolve, reject) => {
        fs.createReadStream(filePath)
          .pipe(csv())
          .on('data', (row) => {
            products.push(row);
          })
          .on('end', resolve)
          .on('error', reject);
      });
    } else if (fileType === '.xlsx' || fileType === '.xls') {
      // Process Excel
      const workbook = new ExcelJS.Workbook();
      await workbook.xlsx.readFile(filePath);
      const worksheet = workbook.worksheets[0];

      const headers = [];
      worksheet.getRow(1).eachCell((cell) => {
        headers.push(cell.value);
      });

      worksheet.eachRow((row, rowNumber) => {
        if (rowNumber === 1) return; // Skip header

        const product = {};
        row.eachCell((cell, colNumber) => {
          product[headers[colNumber - 1]] = cell.value;
        });
        products.push(product);
      });
    }

    // Process products in batches
    const batchSize = 100;
    const totalProducts = products.length;

    for (let i = 0; i < products.length; i += batchSize) {
      const batch = products.slice(i, i + batchSize);
      
      for (const productData of batch) {
        try {
          // Validate required fields
          if (!productData.name || !productData.price || !productData.category_id) {
            errors.push({
              row: i + batch.indexOf(productData) + 2,
              error: 'Missing required fields (name, price, category_id)'
            });
            errorCount++;
            continue;
          }

          // Verify category exists
          const category = await Category.findByPk(productData.category_id);
          if (!category) {
            errors.push({
              row: i + batch.indexOf(productData) + 2,
              error: `Category with ID ${productData.category_id} not found`
            });
            errorCount++;
            continue;
          }

          // Create product
          await Product.create({
            name: productData.name,
            description: productData.description || null,
            price: parseFloat(productData.price),
            category_id: parseInt(productData.category_id),
            stock_quantity: parseInt(productData.stock_quantity) || 0,
            image: productData.image || null
          });

          processedCount++;
        } catch (error) {
          errors.push({
            row: i + batch.indexOf(productData) + 2,
            error: error.message
          });
          errorCount++;
        }
      }

      // Update progress
      job.progress((i + batch.length) / totalProducts * 100);
    }

    // Clean up uploaded file
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }

    return {
      success: true,
      totalProducts: products.length,
      processedCount,
      errorCount,
      errors: errors.slice(0, 50) // Limit error messages
    };

  } catch (error) {
    // Clean up uploaded file
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }
    
    throw new Error(`Bulk upload failed: ${error.message}`);
  }
});

// Queue event handlers
uploadProductsQueue.on('completed', (job, result) => {
  console.log(`Job ${job.id} completed successfully:`, result);
});

uploadProductsQueue.on('failed', (job, err) => {
  console.error(`Job ${job.id} failed:`, err.message);
});

uploadProductsQueue.on('progress', (job, progress) => {
  console.log(`Job ${job.id} progress: ${progress}%`);
});

export { uploadProductsQueue };

