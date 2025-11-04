require('dotenv').config();
const { Product } = require('../models');

const updateProductImages = async () => {
  console.log('Updating product images...');

  try {
    // Define image mappings for products
    const imageUpdates = [
      {
        name: 'Laptop Computer',
        image: 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=400&h=400&fit=crop'
      },
      {
        name: 'Smartphone',
        image: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=400&h=400&fit=crop'
      },
      {
        name: 'Wireless Headphones',
        image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&h=400&fit=crop'
      },
      {
        name: 'T-Shirt',
        image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400&h=400&fit=crop'
      },
      {
        name: 'Jeans',
        image: 'https://images.unsplash.com/photo-1542272604-787c3835535d?w=400&h=400&fit=crop'
      },
      {
        name: 'Programming Book',
        image: 'https://images.unsplash.com/photo-1532012197267-da84d127e765?w=400&h=400&fit=crop'
      }
    ];

    // Update each product
    for (const update of imageUpdates) {
      const result = await Product.update(
        { image: update.image },
        { where: { name: update.name } }
      );
      
      if (result[0] > 0) {
        console.log(`Updated image for: ${update.name}`);
      } else {
        console.log(`Product not found: ${update.name}`);
      }
    }

    console.log('Product images updated successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Update failed:', error.message);
    console.error(error.stack);
    process.exit(1);
  }
};

updateProductImages();


