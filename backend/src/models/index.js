import sequelize from '../config/database.js';
import User from './user.model.js';
import Category from './category.model.js';
import Product from './product.model.js';

// Define associations
Category.hasMany(Product, {
  foreignKey: 'category_id',
  as: 'products',
  onDelete: 'RESTRICT',
  onUpdate: 'CASCADE'
});

Product.belongsTo(Category, {
  foreignKey: 'category_id',
  as: 'category'
});

// Sync database
export const syncDatabase = async (options = {}) => {
  try {
    await sequelize.sync(options);
    console.log(' Database synced successfully');
  } catch (error) {
    console.error('Error syncing database:', error);
    throw error;
  }
};

export { sequelize, User, Category, Product };

