import 'dotenv/config';
import { User, Category, Product } from '../models/index.js';

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
    const homeGardenId = categories[3][0].id;
    const sportsId = categories[4][0].id;

    await Promise.all([
      // Electronics Products
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
        where: { name: 'Wireless Mouse' },
        defaults: {
          name: 'Wireless Mouse',
          description: 'Ergonomic wireless mouse with USB receiver',
          price: 29.99,
          category_id: electronicsId,
          stock_quantity: 150,
          image: 'https://images.unsplash.com/photo-1527814050087-3793815479db?w=400&h=400&fit=crop'
        }
      }),
      Product.findOrCreate({
        where: { name: 'Mechanical Keyboard' },
        defaults: {
          name: 'Mechanical Keyboard',
          description: 'RGB backlit mechanical gaming keyboard',
          price: 89.99,
          category_id: electronicsId,
          stock_quantity: 60,
          image: 'https://images.unsplash.com/photo-1595225476474-87563907a212?w=400&h=400&fit=crop'
        }
      }),
      Product.findOrCreate({
        where: { name: 'Smartwatch' },
        defaults: {
          name: 'Smartwatch',
          description: 'Fitness tracking smartwatch with heart rate monitor',
          price: 249.99,
          category_id: electronicsId,
          stock_quantity: 80,
          image: 'https://images.unsplash.com/photo-1587825140708-dfaf72ae4b04?w=400&h=400&fit=crop'
        }
      }),
      Product.findOrCreate({
        where: { name: '4K Monitor' },
        defaults: {
          name: '4K Monitor',
          description: '27-inch 4K UHD display for professionals',
          price: 449.99,
          category_id: electronicsId,
          stock_quantity: 35,
          image: 'https://images.unsplash.com/photo-1612198188060-c7c2a3b66eae?w=400&h=400&fit=crop'
        }
      }),
      Product.findOrCreate({
        where: { name: 'Tablet' },
        defaults: {
          name: 'Tablet',
          description: '10-inch tablet for work and entertainment',
          price: 399.99,
          category_id: electronicsId,
          stock_quantity: 70,
          image: 'https://images.unsplash.com/photo-1559056199-641a0ac8b55e?w=400&h=400&fit=crop'
        }
      }),

      // Clothing Products
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
        where: { name: 'Leather Jacket' },
        defaults: {
          name: 'Leather Jacket',
          description: 'Genuine leather jacket for style',
          price: 199.99,
          category_id: clothingId,
          stock_quantity: 45,
          image: 'https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=400&h=400&fit=crop'
        }
      }),
      Product.findOrCreate({
        where: { name: 'Hoodie' },
        defaults: {
          name: 'Hoodie',
          description: 'Comfortable pullover hoodie',
          price: 39.99,
          category_id: clothingId,
          stock_quantity: 120,
          image: 'https://images.unsplash.com/photo-1603252109303-2751441dd157?w=400&h=400&fit=crop'
        }
      }),
      Product.findOrCreate({
        where: { name: 'Sneakers' },
        defaults: {
          name: 'Sneakers',
          description: 'Stylish casual sneakers',
          price: 79.99,
          category_id: clothingId,
          stock_quantity: 100,
          image: 'https://images.unsplash.com/photo-1460353581641-37baddab0fa2?w=400&h=400&fit=crop'
        }
      }),
      Product.findOrCreate({
        where: { name: 'Baseball Cap' },
        defaults: {
          name: 'Baseball Cap',
          description: 'Adjustable baseball cap',
          price: 14.99,
          category_id: clothingId,
          stock_quantity: 180,
          image: 'https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=400&h=400&fit=crop'
        }
      }),
      Product.findOrCreate({
        where: { name: 'Dress Shirt' },
        defaults: {
          name: 'Dress Shirt',
          description: 'Formal dress shirt for office wear',
          price: 44.99,
          category_id: clothingId,
          stock_quantity: 90,
          image: 'https://images.unsplash.com/photo-1624222247344-550fb60583b2?w=400&h=400&fit=crop'
        }
      }),

      // Books Products
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
      }),
      Product.findOrCreate({
        where: { name: 'JavaScript Complete Guide' },
        defaults: {
          name: 'JavaScript Complete Guide',
          description: 'Master JavaScript from basics to advanced',
          price: 49.99,
          category_id: booksId,
          stock_quantity: 65,
          image: 'https://images.unsplash.com/photo-1495446815901-a7297e633e8d?w=400&h=400&fit=crop'
        }
      }),
      Product.findOrCreate({
        where: { name: 'Python for Data Science' },
        defaults: {
          name: 'Python for Data Science',
          description: 'Learn data analysis with Python',
          price: 54.99,
          category_id: booksId,
          stock_quantity: 55,
          image: 'https://images.unsplash.com/photo-1512820790803-83ca734da794?w=400&h=400&fit=crop'
        }
      }),
      Product.findOrCreate({
        where: { name: 'Web Development Bootcamp' },
        defaults: {
          name: 'Web Development Bootcamp',
          description: 'Complete web development course',
          price: 59.99,
          category_id: booksId,
          stock_quantity: 70,
          image: 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=400&h=400&fit=crop'
        }
      }),
      Product.findOrCreate({
        where: { name: 'Design Patterns' },
        defaults: {
          name: 'Design Patterns',
          description: 'Software design patterns explained',
          price: 44.99,
          category_id: booksId,
          stock_quantity: 48,
          image: 'https://images.unsplash.com/photo-1507842217343-583bb7270b66?w=400&h=400&fit=crop'
        }
      }),

      // Home & Garden Products
      Product.findOrCreate({
        where: { name: 'Table Lamp' },
        defaults: {
          name: 'Table Lamp',
          description: 'Modern LED table lamp',
          price: 34.99,
          category_id: homeGardenId,
          stock_quantity: 85,
          image: 'https://images.unsplash.com/photo-1538688525198-9b88f6f53126?w=400&h=400&fit=crop'
        }
      }),
      Product.findOrCreate({
        where: { name: 'Indoor Plant Pot' },
        defaults: {
          name: 'Indoor Plant Pot',
          description: 'Ceramic pot for indoor plants',
          price: 24.99,
          category_id: homeGardenId,
          stock_quantity: 120,
          image: 'https://images.unsplash.com/photo-1556228578-0d85b1a4d571?w=400&h=400&fit=crop'
        }
      }),
      Product.findOrCreate({
        where: { name: 'Decorative Cushion' },
        defaults: {
          name: 'Decorative Cushion',
          description: 'Soft decorative cushion for sofa',
          price: 18.99,
          category_id: homeGardenId,
          stock_quantity: 150,
          image: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400&h=400&fit=crop'
        }
      }),
      Product.findOrCreate({
        where: { name: 'Wall Mirror' },
        defaults: {
          name: 'Wall Mirror',
          description: 'Large decorative wall mirror',
          price: 89.99,
          category_id: homeGardenId,
          stock_quantity: 40,
          image: 'https://images.unsplash.com/photo-1600210491892-03d54c0aaf87?w=400&h=400&fit=crop'
        }
      }),
      Product.findOrCreate({
        where: { name: 'Garden Tool Set' },
        defaults: {
          name: 'Garden Tool Set',
          description: 'Complete gardening tool kit',
          price: 45.99,
          category_id: homeGardenId,
          stock_quantity: 60,
          image: 'https://images.unsplash.com/photo-1531685250784-7569952593d2?w=400&h=400&fit=crop'
        }
      }),

      // Sports Products
      Product.findOrCreate({
        where: { name: 'Yoga Mat' },
        defaults: {
          name: 'Yoga Mat',
          description: 'Non-slip yoga and exercise mat',
          price: 29.99,
          category_id: sportsId,
          stock_quantity: 110,
          image: 'https://images.unsplash.com/photo-1554068865-24cecd4e34b8?w=400&h=400&fit=crop'
        }
      }),
      Product.findOrCreate({
        where: { name: 'Dumbbells Set' },
        defaults: {
          name: 'Dumbbells Set',
          description: 'Adjustable weight dumbbells',
          price: 79.99,
          category_id: sportsId,
          stock_quantity: 55,
          image: 'https://images.unsplash.com/photo-1587938144185-1fa427b8b6df?w=400&h=400&fit=crop'
        }
      }),
      Product.findOrCreate({
        where: { name: 'Running Shoes' },
        defaults: {
          name: 'Running Shoes',
          description: 'Professional running shoes for athletes',
          price: 119.99,
          category_id: sportsId,
          stock_quantity: 75,
          image: 'https://images.unsplash.com/photo-1519505907962-0a6cb0167c73?w=400&h=400&fit=crop'
        }
      }),
      Product.findOrCreate({
        where: { name: 'Soccer Ball' },
        defaults: {
          name: 'Soccer Ball',
          description: 'Official size soccer ball',
          price: 24.99,
          category_id: sportsId,
          stock_quantity: 95,
          image: 'https://images.unsplash.com/photo-1517649763962-0c623066013b?w=400&h=400&fit=crop'
        }
      }),
      Product.findOrCreate({
        where: { name: 'Tennis Racket' },
        defaults: {
          name: 'Tennis Racket',
          description: 'Professional tennis racket',
          price: 89.99,
          category_id: sportsId,
          stock_quantity: 50,
          image: 'https://images.unsplash.com/photo-1613918108466-292b78a8ef95?w=400&h=400&fit=crop'
        }
      }),
      Product.findOrCreate({
        where: { name: 'Water Bottle' },
        defaults: {
          name: 'Water Bottle',
          description: 'Insulated stainless steel water bottle',
          price: 19.99,
          category_id: sportsId,
          stock_quantity: 140,
          image: 'https://images.unsplash.com/photo-1551958219-acbc608c6377?w=400&h=400&fit=crop'
        }
      })
    ]);
    console.log('✓ 35 sample products created with images');

    console.log(' Database seeding completed successfully!');
    console.log(' Login credentials:');
    console.log('Admin: admin@example.com / admin123');
    console.log('User:  user@example.com / user123');

    process.exit(0);
  } catch (error) {
    console.error('Seeding failed:', error.message);
    console.error(error.stack);
    process.exit(1);
  }
};

seedDatabase();

