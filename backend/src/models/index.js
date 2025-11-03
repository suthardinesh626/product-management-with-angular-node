const sequelize = require('../config/database');
const User = require('./user.model');
const Category = require('./category.model');
const Product = require('./product.model');

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
const syncDatabase = async (options = {}) => {
  try {
    await sequelize.sync(options);
    console.log('✅ Database synced successfully');
  } catch (error) {
    console.error('❌ Error syncing database:', error);
    throw error;
  }
};

module.exports = {
  sequelize,
  User,
  Category,
  Product,
  syncDatabase
};

