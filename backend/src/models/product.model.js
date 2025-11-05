import { DataTypes } from 'sequelize';
import { v4 as uuidv4 } from 'uuid';
import sequelize from '../config/database.js';

const Product = sequelize.define('products', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  unique_id: {
    type: DataTypes.STRING(36),
    allowNull: false,
    unique: true,
    defaultValue: () => uuidv4()
  },
  name: {
    type: DataTypes.STRING(255),
    allowNull: false,
    validate: {
      notEmpty: true
    }
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  price: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
    validate: {
      min: 0
    }
  },
  image: {
    type: DataTypes.STRING(500),
    allowNull: true
  },
  category_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'categories',
      key: 'id'
    }
  },
  stock_quantity: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  },
  is_active: {
    type: DataTypes.BOOLEAN,
    defaultValue: true
  }
}, {
  timestamps: true,
  indexes: [
    {
      unique: true,
      fields: ['unique_id']
    },
    {
      fields: ['category_id']
    },
    {
      fields: ['name']
    },
    {
      fields: ['price']
    }
  ]
});

export default Product;

