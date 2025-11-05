import { Product, Category } from '../models/index.js';
import { successResponse, errorResponse, paginatedResponse } from '../utils/response.util.js';
import { Op } from 'sequelize';
import fs from 'fs';
import path from 'path';
import { uploadProductsQueue } from '../queues/product.queue.js';

export const getAllProducts = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 10,
      search = '',
      category = '',
      sortBy = 'created_at',
      sortOrder = 'DESC',
      minPrice,
      maxPrice,
      is_active
    } = req.query;

    const offset = (page - 1) * limit;
    const where = {};

    // Search filter (product name or category name)
    if (search) {
      where.name = { [Op.iLike]: `%${search}%` };
    }

    // Category filter
    if (category) {
      // Check if it's a category ID or name
      const categoryRecord = await Category.findOne({
        where: {
          [Op.or]: [
            { id: isNaN(category) ? null : parseInt(category) },
            { unique_id: category },
            { name: { [Op.iLike]: `%${category}%` } }
          ]
        }
      });

      if (categoryRecord) {
        where.category_id = categoryRecord.id;
      }
    }

    // Price range filter
    if (minPrice || maxPrice) {
      where.price = {};
      if (minPrice) where.price[Op.gte] = parseFloat(minPrice);
      if (maxPrice) where.price[Op.lte] = parseFloat(maxPrice);
    }

    // Active status filter
    if (is_active !== undefined) {
      where.is_active = is_active === 'true';
    }

    // Validate sort field
    const allowedSortFields = ['name', 'price', 'created_at', 'stock_quantity'];
    const sortField = allowedSortFields.includes(sortBy) ? sortBy : 'created_at';
    const order = sortOrder.toUpperCase() === 'ASC' ? 'ASC' : 'DESC';

    const { count, rows: products } = await Product.findAndCountAll({
      where,
      limit: parseInt(limit),
      offset: parseInt(offset),
      order: [[sortField, order]],
      include: [{
        model: Category,
        as: 'category',
        attributes: ['id', 'name', 'unique_id']
      }]
    });

    const pagination = {
      total: count,
      page: parseInt(page),
      limit: parseInt(limit),
      totalPages: Math.ceil(count / limit)
    };

    return paginatedResponse(res, products, pagination, 'Products retrieved successfully');
  } catch (error) {
    console.error('Get all products error:', error);
    return errorResponse(res, error.message || 'Failed to get products');
  }
};

export const getProductById = async (req, res) => {
  try {
    const { id } = req.params;

    const product = await Product.findByPk(id, {
      include: [{
        model: Category,
        as: 'category',
        attributes: ['id', 'name', 'unique_id', 'description']
      }]
    });

    if (!product) {
      return errorResponse(res, 'Product not found', 404);
    }

    return successResponse(res, product, 'Product retrieved successfully');
  } catch (error) {
    console.error('Get product error:', error);
    return errorResponse(res, error.message || 'Failed to get product');
  }
};

export const createProduct = async (req, res) => {
  try {
    const { name, description, price, category_id, stock_quantity } = req.body;

    // Verify category exists
    const category = await Category.findByPk(category_id);
    if (!category) {
      return errorResponse(res, 'Category not found', 404);
    }

    // Handle image upload
    const image = req.file ? `/uploads/images/${req.file.filename}` : null;

    const product = await Product.create({
      name,
      description,
      price,
      category_id,
      stock_quantity: stock_quantity || 0,
      image
    });

    // Fetch with category info
    const productWithCategory = await Product.findByPk(product.id, {
      include: [{
        model: Category,
        as: 'category',
        attributes: ['id', 'name', 'unique_id']
      }]
    });

    return successResponse(res, productWithCategory, 'Product created successfully', 201);
  } catch (error) {
    console.error('Create product error:', error);
    // Clean up uploaded file if product creation fails
    if (req.file) {
      fs.unlinkSync(req.file.path);
    }
    return errorResponse(res, error.message || 'Failed to create product');
  }
};

export const updateProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description, price, category_id, stock_quantity, is_active } = req.body;

    const product = await Product.findByPk(id);
    if (!product) {
      return errorResponse(res, 'Product not found', 404);
    }

    // Verify category if being updated
    if (category_id && category_id !== product.category_id) {
      const category = await Category.findByPk(category_id);
      if (!category) {
        return errorResponse(res, 'Category not found', 404);
      }
    }

    // Handle image upload
    if (req.file) {
      // Delete old image if exists
      if (product.image) {
        const oldImagePath = path.join(__dirname, '../../', product.image);
        if (fs.existsSync(oldImagePath)) {
          fs.unlinkSync(oldImagePath);
        }
      }
      product.image = `/uploads/images/${req.file.filename}`;
    }

    // Update product
    if (name !== undefined) product.name = name;
    if (description !== undefined) product.description = description;
    if (price !== undefined) product.price = price;
    if (category_id !== undefined) product.category_id = category_id;
    if (stock_quantity !== undefined) product.stock_quantity = stock_quantity;
    if (is_active !== undefined) product.is_active = is_active;

    await product.save();

    // Fetch with category info
    const productWithCategory = await Product.findByPk(product.id, {
      include: [{
        model: Category,
        as: 'category',
        attributes: ['id', 'name', 'unique_id']
      }]
    });

    return successResponse(res, productWithCategory, 'Product updated successfully');
  } catch (error) {
    console.error('Update product error:', error);
    // Clean up uploaded file if update fails
    if (req.file) {
      fs.unlinkSync(req.file.path);
    }
    return errorResponse(res, error.message || 'Failed to update product');
  }
};

export const deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;

    const product = await Product.findByPk(id);
    if (!product) {
      return errorResponse(res, 'Product not found', 404);
    }

    // Delete image if exists
    if (product.image) {
      const imagePath = path.join(__dirname, '../../', product.image);
      if (fs.existsSync(imagePath)) {
        fs.unlinkSync(imagePath);
      }
    }

    await product.destroy();

    return successResponse(res, null, 'Product deleted successfully');
  } catch (error) {
    console.error('Delete product error:', error);
    return errorResponse(res, error.message || 'Failed to delete product');
  }
};

export const bulkUpload = async (req, res) => {
  try {
    if (!req.file) {
      return errorResponse(res, 'File is required', 400);
    }

    const filePath = req.file.path;
    const fileExtension = path.extname(req.file.originalname).toLowerCase();

    // Add job to queue for background processing
    const job = await uploadProductsQueue.add({
      filePath,
      fileType: fileExtension,
      userId: req.user.id
    });

    return successResponse(res, {
      jobId: job.id,
      message: 'Bulk upload started. You can check the status using the job ID.'
    }, 'Bulk upload initiated successfully', 202);
  } catch (error) {
    console.error('Bulk upload error:', error);
    return errorResponse(res, error.message || 'Failed to process bulk upload');
  }
};

export const getBulkUploadStatus = async (req, res) => {
  try {
    const { jobId } = req.params;
    const job = await uploadProductsQueue.getJob(jobId);

    if (!job) {
      return errorResponse(res, 'Job not found', 404);
    }

    const state = await job.getState();
    const progress = job.progress();
    const result = job.returnvalue;
    const failedReason = job.failedReason;

    return successResponse(res, {
      jobId: job.id,
      state,
      progress,
      result,
      failedReason
    }, 'Job status retrieved successfully');
  } catch (error) {
    console.error('Get job status error:', error);
    return errorResponse(res, error.message || 'Failed to get job status');
  }
};

