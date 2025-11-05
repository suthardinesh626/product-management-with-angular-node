import fs from 'fs';

// Product name templates by category
const productTemplates = {
  1: [ // Electronics
    'Wireless Earbuds', 'Laptop', 'Gaming Mouse', 'Mechanical Keyboard', 'USB-C Hub',
    'External SSD', 'Monitor', 'Webcam', 'Smartwatch', 'Tablet', 'Power Bank',
    'Phone Case', 'Screen Protector', 'Charging Cable', 'Bluetooth Speaker',
    'Gaming Headset', 'Microphone', 'LED Strip', 'Smart Plug', 'Router'
  ],
  2: [ // Clothing
    'T-Shirt', 'Jeans', 'Hoodie', 'Jacket', 'Sneakers', 'Cap', 'Socks',
    'Dress', 'Shirt', 'Pants', 'Shorts', 'Sweater', 'Coat', 'Scarf',
    'Gloves', 'Belt', 'Tie', 'Boots', 'Sandals', 'Backpack'
  ],
  3: [ // Books
    'Programming Guide', 'Novel', 'Cookbook', 'Biography', 'Textbook',
    'Comic Book', 'Magazine', 'Dictionary', 'Atlas', 'Journal',
    'Workbook', 'Manual', 'Encyclopedia', 'Poetry Book', 'Children Book'
  ],
  4: [ // Home & Garden
    'Lamp', 'Plant Pot', 'Cushion', 'Rug', 'Mirror', 'Vase', 'Clock',
    'Curtain', 'Bedsheet', 'Pillow', 'Blanket', 'Storage Box', 'Shelf',
    'Picture Frame', 'Candle', 'Tool Set', 'Garden Hose', 'Planter'
  ],
  5: [ // Sports
    'Yoga Mat', 'Dumbbells', 'Resistance Band', 'Jump Rope', 'Water Bottle',
    'Gym Bag', 'Running Shoes', 'Soccer Ball', 'Basketball', 'Tennis Racket',
    'Bicycle', 'Skateboard', 'Helmet', 'Knee Pads', 'Stopwatch'
  ]
};

// Image URLs by category
const categoryImages = {
  1: [ // Electronics
    'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=400&h=400&fit=crop',
    'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=400&h=400&fit=crop',
    'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&h=400&fit=crop',
    'https://images.unsplash.com/photo-1527814050087-3793815479db?w=400&h=400&fit=crop',
    'https://images.unsplash.com/photo-1595225476474-87563907a212?w=400&h=400&fit=crop',
    'https://images.unsplash.com/photo-1587825140708-dfaf72ae4b04?w=400&h=400&fit=crop',
    'https://images.unsplash.com/photo-1585792180666-f7347c490ee2?w=400&h=400&fit=crop',
    'https://images.unsplash.com/photo-1559056199-641a0ac8b55e?w=400&h=400&fit=crop',
    'https://images.unsplash.com/photo-1593642632823-8f785ba67e45?w=400&h=400&fit=crop',
    'https://images.unsplash.com/photo-1612198188060-c7c2a3b66eae?w=400&h=400&fit=crop'
  ],
  2: [ // Clothing
    'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400&h=400&fit=crop',
    'https://images.unsplash.com/photo-1542272604-787c3835535d?w=400&h=400&fit=crop',
    'https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=400&h=400&fit=crop',
    'https://images.unsplash.com/photo-1434389677669-e08b4cac3105?w=400&h=400&fit=crop',
    'https://images.unsplash.com/photo-1603252109303-2751441dd157?w=400&h=400&fit=crop',
    'https://images.unsplash.com/photo-1460353581641-37baddab0fa2?w=400&h=400&fit=crop',
    'https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=400&h=400&fit=crop',
    'https://images.unsplash.com/photo-1551028719-00167b16eac5?w=400&h=400&fit=crop',
    'https://images.unsplash.com/photo-1624222247344-550fb60583b2?w=400&h=400&fit=crop',
    'https://images.unsplash.com/photo-1562157873-818bc0726f68?w=400&h=400&fit=crop'
  ],
  3: [ // Books
    'https://images.unsplash.com/photo-1532012197267-da84d127e765?w=400&h=400&fit=crop',
    'https://images.unsplash.com/photo-1495446815901-a7297e633e8d?w=400&h=400&fit=crop',
    'https://images.unsplash.com/photo-1512820790803-83ca734da794?w=400&h=400&fit=crop',
    'https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=400&h=400&fit=crop',
    'https://images.unsplash.com/photo-1507842217343-583bb7270b66?w=400&h=400&fit=crop',
    'https://images.unsplash.com/photo-1524578271613-d550eacf6090?w=400&h=400&fit=crop',
    'https://images.unsplash.com/photo-1516979187457-637abb4f9353?w=400&h=400&fit=crop',
    'https://images.unsplash.com/photo-1543002588-bfa74002ed7e?w=400&h=400&fit=crop',
    'https://images.unsplash.com/photo-1471086569966-db3eebc25a59?w=400&h=400&fit=crop',
    'https://images.unsplash.com/photo-1550399105-c4db5fb85c18?w=400&h=400&fit=crop'
  ],
  4: [ // Home & Garden
    'https://images.unsplash.com/photo-1556228578-0d85b1a4d571?w=400&h=400&fit=crop',
    'https://images.unsplash.com/photo-1538688525198-9b88f6f53126?w=400&h=400&fit=crop',
    'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=400&h=400&fit=crop',
    'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400&h=400&fit=crop',
    'https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?w=400&h=400&fit=crop',
    'https://images.unsplash.com/photo-1493663284031-b7e3aefcae8e?w=400&h=400&fit=crop',
    'https://images.unsplash.com/photo-1523755231516-e43fd2e8dca5?w=400&h=400&fit=crop',
    'https://images.unsplash.com/photo-1600210491892-03d54c0aaf87?w=400&h=400&fit=crop',
    'https://images.unsplash.com/photo-1598928506311-c55ded91a20c?w=400&h=400&fit=crop',
    'https://images.unsplash.com/photo-1531685250784-7569952593d2?w=400&h=400&fit=crop'
  ],
  5: [ // Sports
    'https://images.unsplash.com/photo-1517649763962-0c623066013b?w=400&h=400&fit=crop',
    'https://images.unsplash.com/photo-1546483875-ad9014c88eba?w=400&h=400&fit=crop',
    'https://images.unsplash.com/photo-1519505907962-0a6cb0167c73?w=400&h=400&fit=crop',
    'https://images.unsplash.com/photo-1461896836934-ffe607ba8211?w=400&h=400&fit=crop',
    'https://images.unsplash.com/photo-1554068865-24cecd4e34b8?w=400&h=400&fit=crop',
    'https://images.unsplash.com/photo-1587938144185-1fa427b8b6df?w=400&h=400&fit=crop',
    'https://images.unsplash.com/photo-1613918108466-292b78a8ef95?w=400&h=400&fit=crop',
    'https://images.unsplash.com/photo-1515523110800-9415d13b84a8?w=400&h=400&fit=crop',
    'https://images.unsplash.com/photo-1551958219-acbc608c6377?w=400&h=400&fit=crop',
    'https://images.unsplash.com/photo-1605296867304-46d5465a13f1?w=400&h=400&fit=crop'
  ]
};

const modifiers = ['Pro', 'Premium', 'Ultra', 'Max', 'Plus', 'Elite', 'Advanced', 'Basic', 'Classic', 'Deluxe'];
const colors = ['Black', 'White', 'Blue', 'Red', 'Green', 'Gray', 'Silver', 'Gold', 'Pink', 'Purple'];
const sizes = ['Small', 'Medium', 'Large', 'XL', 'XXL'];

function getRandomElement(array) {
  return array[Math.floor(Math.random() * array.length)];
}

function generateProductName(category) {
  const baseProduct = getRandomElement(productTemplates[category]);
  const modifier = Math.random() > 0.5 ? getRandomElement(modifiers) : '';
  const color = Math.random() > 0.6 ? getRandomElement(colors) : '';

  const parts = [modifier, color, baseProduct].filter(Boolean);
  return parts.join(' ');
}

function generatePrice(category) {
  const priceRanges = {
    1: [19.99, 999.99],    // Electronics
    2: [9.99, 199.99],     // Clothing
    3: [9.99, 79.99],      // Books
    4: [14.99, 299.99],    // Home & Garden
    5: [14.99, 499.99]     // Sports
  };

  const [min, max] = priceRanges[category];
  return (Math.random() * (max - min) + min).toFixed(2);
}

function generateDescription(productName) {
  const descriptions = [
    `High-quality ${productName} with premium features`,
    `Professional ${productName} for everyday use`,
    `Durable ${productName} with modern design`,
    `Comfortable ${productName} perfect for any occasion`,
    `Stylish ${productName} with excellent performance`,
    `Reliable ${productName} with long-lasting quality`,
    `Affordable ${productName} with great value`,
    `Innovative ${productName} with advanced technology`,
    `Versatile ${productName} suitable for all needs`,
    `Premium ${productName} with superior craftsmanship`
  ];

  return getRandomElement(descriptions);
}

function generateStockQuantity() {
  return Math.floor(Math.random() * 500) + 10; // 10 to 509
}

function generateCSV() {
  const totalProducts = 1200; // Generate 1200 products
  let csvContent = 'name,description,price,category_id,stock_quantity,image\n';

  console.log(' Generating 1200 dummy products...\n');

  for (let i = 0; i < totalProducts; i++) {
    // Distribute products across categories (1-5)
    const category = (i % 5) + 1;

    const name = generateProductName(category);
    const description = generateDescription(name);
    const price = generatePrice(category);
    const stock = generateStockQuantity();
    const image = getRandomElement(categoryImages[category]);

    // Escape description if it contains commas
    const escapedDescription = description.includes(',') ? `"${description}"` : description;

    csvContent += `${name},${escapedDescription},${price},${category},${stock},${image}\n`;

    // Progress indicator
    if ((i + 1) % 100 === 0) {
      console.log(`✓ Generated ${i + 1} products...`);
    }
  }

  // Write to file
  const fileName = 'bulk_products_1200.csv';
  try {
    fs.writeFileSync(fileName, csvContent, { encoding: 'utf8', mode: 0o666 });
    console.log(' Successfully created bulk_products_1200.csv');
    console.log(` Total products: ${totalProducts}`);
    console.log(` File location: ${process.cwd()}/${fileName}`);
    console.log(` File size: ${(csvContent.length / 1024).toFixed(2)} KB`);
    console.log(' Ready for bulk upload testing!');
    console.log(' To upload:');
    console.log('1. Go to Products Bulk Upload in the UI');
    console.log('2. Select this CSV file');
    console.log('3. Upload and monitor the progress');
  } catch (error) {
    console.error(' Error writing file:', error.message);
    console.log(' Alternative: Copy the script output and create the file manually');
  }
}

generateCSV();

