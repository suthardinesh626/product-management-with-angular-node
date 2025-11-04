require('dotenv').config();
const { User, Category, Product } = require('../models');

const seedDatabase = async () => {
  console.log('Starting database seeding...');

  try {
    // Create admin user
    console.log('Creating admin user...');
    const admin = await User.findOrCreate({
      where: { email: 'admin@example.com' },
      defaults: {
        email: 'admin@example.com',
        password: 'admin123',
        name: 'Admin User',
        role: 'admin'
      }
    });
    console.log('✓ Admin user created');

    // Create regular user
    console.log('Creating regular user...');
    const user = await User.findOrCreate({
      where: { email: 'user@example.com' },
      defaults: {
        email: 'user@example.com',
        password: 'user123',
        name: 'Regular User',
        role: 'user'
      }
    });
    console.log('✓ Regular user created');

    // Create categories
    console.log('\nCreating categories...');
    const categories = await Promise.all([
      Category.findOrCreate({
        where: { name: 'Electronics' },
        defaults: { name: 'Electronics', description: 'Electronic devices and gadgets' }
      }),
      Category.findOrCreate({
        where: { name: 'Clothing' },
        defaults: { name: 'Clothing', description: 'Fashion and apparel' }
      }),
      Category.findOrCreate({
        where: { name: 'Books' },
        defaults: { name: 'Books', description: 'Books and educational materials' }
      }),
      Category.findOrCreate({
        where: { name: 'Home & Garden' },
        defaults: { name: 'Home & Garden', description: 'Home improvement and garden supplies' }
      }),
      Category.findOrCreate({
        where: { name: 'Sports' },
        defaults: { name: 'Sports', description: 'Sports equipment and accessories' }
      })
    ]);
    console.log('✓ 5 categories created');

    // Create sample products
    console.log('\nCreating sample products...');
    const electronicsId = categories[0][0].id;
    const clothingId = categories[1][0].id;
    const booksId = categories[2][0].id;

    await Promise.all([
      Product.findOrCreate({
        where: { name: 'Laptop Computer' },
        defaults: {
          name: 'Laptop Computer',
          description: 'High-performance laptop with latest processor',
          price: 999.99,
          category_id: electronicsId,
          stock_quantity: 50,
          image: 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=400&h=400&fit=crop'
        }
      }),
      Product.findOrCreate({
        where: { name: 'Smartphone' },
        defaults: {
          name: 'Smartphone',
          description: 'Latest smartphone with amazing camera',
          price: 699.99,
          category_id: electronicsId,
          stock_quantity: 100,
          image: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=400&h=400&fit=crop'
        }
      }),
      Product.findOrCreate({
        where: { name: 'Wireless Headphones' },
        defaults: {
          name: 'Wireless Headphones',
          description: 'Premium noise-cancelling headphones',
          price: 199.99,
          category_id: electronicsId,
          stock_quantity: 75,
          image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&h=400&fit=crop'
        }
      }),
      Product.findOrCreate({
        where: { name: 'T-Shirt' },
        defaults: {
          name: 'T-Shirt',
          description: 'Comfortable cotton t-shirt',
          price: 19.99,
          category_id: clothingId,
          stock_quantity: 200,
          image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400&h=400&fit=crop'
        }
      }),
      Product.findOrCreate({
        where: { name: 'Jeans' },
        defaults: {
          name: 'Jeans',
          description: 'Classic blue denim jeans',
          price: 49.99,
          category_id: clothingId,
          stock_quantity: 150,
          image: 'https://images.unsplash.com/photo-1542272604-787c3835535d?w=400&h=400&fit=crop'
        }
      }),
      Product.findOrCreate({
        where: { name: 'Programming Book' },
        defaults: {
          name: 'Programming Book',
          description: 'Learn advanced programming concepts',
          price: 39.99,
          category_id: booksId,
          stock_quantity: 80,
          image: 'https://images.unsplash.com/photo-1532012197267-da84d127e765?w=400&h=400&fit=crop'
        }
      })
    ]);
    console.log('✓ 6 sample products created');

    console.log(' Database seeding completed successfully!');
    console.log(' Login credentials:');
    console.log('Admin: admin@example.com / admin123');
    console.log('User:  user@example.com / user123');

    process.exit(0);
  } catch (error) {
    console.error('\n❌ Seeding failed:', error.message);
    console.error(error.stack);
    process.exit(1);
  }
};

seedDatabase();

