import { Category, Product } from '../models/index.js';
import { successResponse, errorResponse, paginatedResponse } from '../utils/response.util.js';
import { Op } from 'sequelize';

export const getAllCategories = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 10,
      search = '',
      is_active
    } = req.query;

    const offset = (page - 1) * limit;
    const where = {};

    // Search filter
    if (search) {
      where[Op.or] = [
        { name: { [Op.iLike]: `%${search}%` } },
        { description: { [Op.iLike]: `%${search}%` } }
      ];
    }

    // Active status filter
    if (is_active !== undefined) {
      where.is_active = is_active === 'true';
    }

    const { count, rows: categories } = await Category.findAndCountAll({
      where,
      limit: parseInt(limit),
      offset: parseInt(offset),
      order: [['created_at', 'DESC']],
      include: [{
        model: Product,
        as: 'products',
        attributes: ['id'],
        required: false
      }]
    });

    // Add product count to each category
    const categoriesWithCount = categories.map(cat => {
      const category = cat.toJSON();
      category.product_count = category.products?.length || 0;
      delete category.products;
      return category;
    });

    const pagination = {
      total: count,
      page: parseInt(page),
      limit: parseInt(limit),
      totalPages: Math.ceil(count / limit)
    };

    return paginatedResponse(res, categoriesWithCount, pagination, 'Categories retrieved successfully');
  } catch (error) {
    console.error('Get all categories error:', error);
    return errorResponse(res, error.message || 'Failed to get categories');
  }
};

export const getCategoryById = async (req, res) => {
  try {
    const { id } = req.params;

    const category = await Category.findByPk(id, {
      include: [{
        model: Product,
        as: 'products',
        attributes: ['id', 'name', 'price', 'unique_id']
      }]
    });

    if (!category) {
      return errorResponse(res, 'Category not found', 404);
    }

    return successResponse(res, category, 'Category retrieved successfully');
  } catch (error) {
    console.error('Get category error:', error);
    return errorResponse(res, error.message || 'Failed to get category');
  }
};

export const createCategory = async (req, res) => {
  try {
    const { name, description } = req.body;

    const category = await Category.create({
      name,
      description
    });

    return successResponse(res, category, 'Category created successfully', 201);
  } catch (error) {
    console.error('Create category error:', error);
    return errorResponse(res, error.message || 'Failed to create category');
  }
};

export const updateCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description, is_active } = req.body;

    const category = await Category.findByPk(id);
    if (!category) {
      return errorResponse(res, 'Category not found', 404);
    }

    // Update category
    if (name !== undefined) category.name = name;
    if (description !== undefined) category.description = description;
    if (is_active !== undefined) category.is_active = is_active;

    await category.save();

    return successResponse(res, category, 'Category updated successfully');
  } catch (error) {
    console.error('Update category error:', error);
    return errorResponse(res, error.message || 'Failed to update category');
  }
};

export const deleteCategory = async (req, res) => {
  try {
    const { id } = req.params;

    const category = await Category.findByPk(id);
    if (!category) {
      return errorResponse(res, 'Category not found', 404);
    }

    // Check if category has products
    const productCount = await Product.count({ where: { category_id: id } });
    if (productCount > 0) {
      return errorResponse(res, 'Cannot delete category with existing products', 400);
    }

    await category.destroy();

    return successResponse(res, null, 'Category deleted successfully');
  } catch (error) {
    console.error('Delete category error:', error);
    return errorResponse(res, error.message || 'Failed to delete category');
  }
};

