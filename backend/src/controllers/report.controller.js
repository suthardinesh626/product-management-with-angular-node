import { Product, Category } from '../models/index.js';
import { errorResponse } from '../utils/response.util.js';
import ExcelJS from 'exceljs';
import { Op } from 'sequelize';

export const generateProductReport = async (req, res) => {
  try {
    const {
      format = 'xlsx',
      search = '',
      category = '',
      minPrice,
      maxPrice,
      is_active
    } = req.query;

    const where = {};

    if (search) {
      where.name = { [Op.iLike]: `%${search}%` };
    }

    if (category) {
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

    if (minPrice || maxPrice) {
      where.price = {};
      if (minPrice) where.price[Op.gte] = parseFloat(minPrice);
      if (maxPrice) where.price[Op.lte] = parseFloat(maxPrice);
    }

    if (is_active !== undefined) {
      where.is_active = is_active === 'true';
    }

    const products = await Product.findAll({
      where,
      include: [{
        model: Category,
        as: 'category',
        attributes: ['name', 'unique_id']
      }],
      order: [['created_at', 'DESC']],
      raw: false
    });

    if (format === 'csv') {
      res.setHeader('Content-Type', 'text/csv');
      res.setHeader('Content-Disposition', 'attachment; filename=products-report.csv');

      res.write('Product ID,Product Name,Description,Price,Category,Stock Quantity,Status,Created At\n');

      for (const product of products) {
        const row = [
          product.unique_id,
          `"${product.name}"`,
          `"${product.description || ''}"`,
          product.price,
          `"${product.category?.name || ''}"`,
          product.stock_quantity,
          product.is_active ? 'Active' : 'Inactive',
          product.created_at ? new Date(product.created_at).toISOString() : ''
        ].join(',');
        res.write(row + '\n');
      }

      res.end();
    } else {
      const workbook = new ExcelJS.stream.xlsx.WorkbookWriter({
        stream: res
      });

      res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
      res.setHeader('Content-Disposition', 'attachment; filename=products-report.xlsx');

      const worksheet = workbook.addWorksheet('Products');

      worksheet.columns = [
        { header: 'Product ID', key: 'unique_id', width: 38 },
        { header: 'Product Name', key: 'name', width: 30 },
        { header: 'Description', key: 'description', width: 40 },
        { header: 'Price', key: 'price', width: 12 },
        { header: 'Category', key: 'category', width: 20 },
        { header: 'Category ID', key: 'category_id', width: 38 },
        { header: 'Stock Quantity', key: 'stock_quantity', width: 15 },
        { header: 'Status', key: 'status', width: 12 },
        { header: 'Created At', key: 'created_at', width: 20 }
      ];

      worksheet.getRow(1).font = { bold: true };
      worksheet.getRow(1).fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: 'FFD3D3D3' }
      };

      for (const product of products) {
        worksheet.addRow({
          unique_id: product.unique_id,
          name: product.name,
          description: product.description || '',
          price: parseFloat(product.price),
          category: product.category?.name || '',
          category_id: product.category?.unique_id || '',
          stock_quantity: product.stock_quantity,
          status: product.is_active ? 'Active' : 'Inactive',
          created_at: product.created_at ? new Date(product.created_at).toISOString() : ''
        }).commit();
      }

      worksheet.addRow({});
      const summaryRow = worksheet.addRow({
        unique_id: 'TOTAL PRODUCTS',
        name: products.length,
        price: products.reduce((sum, p) => sum + parseFloat(p.price), 0).toFixed(2)
      });
      summaryRow.font = { bold: true };
      summaryRow.commit();

      await workbook.commit();
    }

  } catch (error) {
    console.error('Generate report error:', error);
    if (!res.headersSent) {
      return errorResponse(res, error.message || 'Failed to generate report');
    }
  }
};

export const downloadSampleTemplate = async (req, res) => {
  try {
    const { format = 'xlsx' } = req.query;

    const categories = await Category.findAll({
      attributes: ['id', 'name', 'unique_id'],
      where: { is_active: true }
    });

    if (format === 'csv') {
      res.setHeader('Content-Type', 'text/csv');
      res.setHeader('Content-Disposition', 'attachment; filename=product-upload-template.csv');

      res.write('name,description,price,category_id,stock_quantity\n');
      
      if (categories.length > 0) {
        res.write(`Sample Product,Sample Description,99.99,${categories[0].id},100\n`);
      } else {
        res.write('Sample Product,Sample Description,99.99,1,100\n');
      }

      res.end();
    } else {
      const workbook = new ExcelJS.Workbook();
      const worksheet = workbook.addWorksheet('Products');
      const categoriesSheet = workbook.addWorksheet('Categories Reference');

      worksheet.columns = [
        { header: 'name', key: 'name', width: 30 },
        { header: 'description', key: 'description', width: 40 },
        { header: 'price', key: 'price', width: 12 },
        { header: 'category_id', key: 'category_id', width: 15 },
        { header: 'stock_quantity', key: 'stock_quantity', width: 15 }
      ];

      worksheet.getRow(1).font = { bold: true };
      worksheet.getRow(1).fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: 'FFD3D3D3' }
      };

      if (categories.length > 0) {
        worksheet.addRow({
          name: 'Sample Product',
          description: 'Sample Description',
          price: 99.99,
          category_id: categories[0].id,
          stock_quantity: 100
        });
      }

      categoriesSheet.columns = [
        { header: 'Category ID', key: 'id', width: 15 },
        { header: 'Category Name', key: 'name', width: 30 },
        { header: 'Unique ID', key: 'unique_id', width: 38 }
      ];

      categoriesSheet.getRow(1).font = { bold: true };
      categoriesSheet.getRow(1).fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: 'FFFFCCCC' }
      };

      categories.forEach(cat => {
        categoriesSheet.addRow({
          id: cat.id,
          name: cat.name,
          unique_id: cat.unique_id
        });
      });

      res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
      res.setHeader('Content-Disposition', 'attachment; filename=product-upload-template.xlsx');

      await workbook.xlsx.write(res);
      res.end();
    }

  } catch (error) {
    console.error('Download template error:', error);
    if (!res.headersSent) {
      return errorResponse(res, error.message || 'Failed to download template');
    }
  }
};

