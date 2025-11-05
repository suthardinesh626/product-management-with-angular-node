# Product Management System

A full-stack Product Management System built with **Angular 17**, **Node.js**, **Express**, and **PostgreSQL** with advanced features including bulk upload, report generation, and comprehensive CRUD operations.

## 🚀 Features

### Backend Features
- ✅ **User Management** - Complete CRUD with JWT authentication
- ✅ **Category Management** - Organize products with categories
- ✅ **Product Management** - Full CRUD with image upload
- ✅ **Bulk Upload** - Handle large product imports (CSV/XLSX) without timeout using queue processing
- ✅ **Report Generation** - Export products to CSV/XLSX without timeout using streaming
- ✅ **Advanced Product API**:
  - Server-side pagination
  - Sorting by price (ascending/descending)
  - Search by category and product names
  - Price range filtering
- ✅ **Security** - Password encryption (bcrypt), JWT tokens, helmet.js
- ✅ **Validation** - Express validator for all inputs
- ✅ **Error Handling** - Comprehensive error handling middleware

### Frontend Features
- ✅ **Modern Angular 17** - Standalone components
- ✅ **Responsive Design** - Mobile-friendly UI
- ✅ **Authentication** - Login/Register with JWT
- ✅ **Role-Based Access** - Admin and User roles
- ✅ **Real-time Updates** - Product list with live search
- ✅ **File Upload** - Image upload for products
- ✅ **Bulk Import** - Upload CSV/Excel with progress tracking
- ✅ **Report Export** - Download products in CSV/XLSX format

## 📋 Prerequisites

Before running this application, make sure you have the following installed:

- **Node.js** (v18 or higher)
- **PostgreSQL** (v14 or higher)
- **Redis** (for queue processing)
- **npm** or **yarn**
- **Angular CLI** (v17)

## 🛠️ Installation & Setup

### 1. Clone the Repository

### 2. Backend Setup

#### Install Dependencies

```bash
cd backend
npm install
```

#### Configure Environment Variables

Create a `.env` file in the `backend` directory:

```bash
cp .env.example .env
```

Edit `.env` with your configuration:

```env
# Server Configuration
PORT=3000
NODE_ENV=development

# Database Configuration
DB_HOST=localhost
DB_PORT=5432
DB_NAME=product_management
DB_USER=postgres
DB_PASSWORD=your_password

# JWT Configuration
JWT_SECRET=your_jwt_secret_key_change_this_in_production
JWT_EXPIRE=7d

# Upload Configuration
UPLOAD_DIR=uploads
MAX_FILE_SIZE=10485760

# Redis Configuration (for Bull Queue)
REDIS_HOST=localhost
REDIS_PORT=6379
```

#### Setup PostgreSQL Database

```bash
# Login to PostgreSQL
psql -U postgres

# Create database
CREATE DATABASE product_management;

# Exit psql
\q
```

#### Start Redis Server

```bash
# On macOS with Homebrew
brew services start redis

# On Linux
sudo systemctl start redis

# Or run Redis in the foreground
redis-server
```

#### Run Database Migrations

The application will automatically create tables on first run. Alternatively, you can manually sync:

```bash
node -e "require('./src/models').syncDatabase({ force: true })"
```

⚠️ **Warning**: Using `force: true` will drop all existing tables and recreate them.

#### Start Backend Server

```bash
# Development mode with auto-reload
npm run dev

# Production mode
npm start
```

The backend API will be available at: `http://localhost:3000`

### 3. Frontend Setup

#### Install Dependencies

```bash
cd ../frontend
npm install
```

#### Configure Environment

The environment is already configured in `src/environments/environment.ts`:

```typescript
export const environment = {
  production: false,
  apiUrl: 'http://localhost:3000/api'
};
```

For production, update `src/environments/environment.prod.ts`.

#### Start Frontend Application

```bash
npm start
```

The Angular application will be available at: `http://localhost:4200`

## 🗄️ Database Schema

### Users Table
```sql
- id (INTEGER, PRIMARY KEY)
- email (STRING, UNIQUE)
- password (STRING, ENCRYPTED)
- name (STRING)
- role (ENUM: 'admin', 'user')
- is_active (BOOLEAN)
- created_at (TIMESTAMP)
- updated_at (TIMESTAMP)
```

### Categories Table
```sql
- id (INTEGER, PRIMARY KEY)
- unique_id (UUID, UNIQUE, AUTO-GENERATED)
- name (STRING)
- description (TEXT)
- is_active (BOOLEAN)
- created_at (TIMESTAMP)
- updated_at (TIMESTAMP)
```

### Products Table
```sql
- id (INTEGER, PRIMARY KEY)
- unique_id (UUID, UNIQUE, AUTO-GENERATED)
- name (STRING)
- description (TEXT)
- price (DECIMAL)
- image (STRING)
- category_id (INTEGER, FOREIGN KEY)
- stock_quantity (INTEGER)
- is_active (BOOLEAN)
- created_at (TIMESTAMP)
- updated_at (TIMESTAMP)
```

## 🔌 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/profile` - Get current user profile
- `PUT /api/auth/profile` - Update profile
- `PUT /api/auth/change-password` - Change password

### Users (Admin Only)
- `GET /api/users` - Get all users (with pagination)
- `GET /api/users/:id` - Get user by ID
- `POST /api/users` - Create user
- `PUT /api/users/:id` - Update user
- `DELETE /api/users/:id` - Delete user

### Categories
- `GET /api/categories` - Get all categories
- `GET /api/categories/:id` - Get category by ID
- `POST /api/categories` - Create category
- `PUT /api/categories/:id` - Update category
- `DELETE /api/categories/:id` - Delete category

### Products
- `GET /api/products` - Get all products (with pagination, sorting, search)
- `GET /api/products/:id` - Get product by ID
- `POST /api/products` - Create product (with image upload)
- `PUT /api/products/:id` - Update product
- `DELETE /api/products/:id` - Delete product

### Bulk Upload
- `POST /api/products/bulk/upload` - Upload CSV/Excel file
- `GET /api/products/bulk/status/:jobId` - Get upload status

### Reports
- `GET /api/reports/products` - Download product report (CSV/XLSX)
- `GET /api/reports/template` - Download bulk upload template

## 📮 Postman Collection

Import the Postman collection for API testing:

1. Open Postman
2. Click **Import**
3. Select `Product_Management_API.postman_collection.json`
4. The collection includes all API endpoints with examples

### Testing Flow:
1. **Register/Login** - Get authentication token (automatically saved)
2. **Create Categories** - Add product categories
3. **Create Products** - Add individual products
4. **Bulk Upload** - Import multiple products via CSV/Excel
5. **List Products** - Test pagination, sorting, and search
6. **Generate Reports** - Export product data

## 🚦 Usage Guide

### 1. First Time Setup

1. **Register an Account**
   - Navigate to `http://localhost:4200`
   - Click "Register here"
   - Create your account

2. **Create Categories**
   - Go to "Categories" in the sidebar
   - Click "+ Add Category"
   - Add categories (e.g., Electronics, Clothing, Books)

3. **Add Products**
   - Go to "Products" in the sidebar
   - Click "+ Add Product"
   - Fill in product details and upload an image

### 2. Bulk Upload Products

1. **Download Template**
   - Navigate to "Bulk Upload"
   - Download the Excel or CSV template
   - Fill in product data

2. **Upload File**
   - Select your completed file
   - Click "Upload File"
   - Monitor the progress bar
   - View results after completion

### 3. Generate Reports

1. **Filter Products** (Optional)
   - Use search and category filters
   - Apply price range filters

2. **Export Data**
   - Click "Export XLSX" or "Export CSV"
   - File will download automatically

### 4. Product List Features

- **Search**: Type product name to search
- **Filter**: Select category from dropdown
- **Sort**: Click on "Name" or "Price" column headers
- **Pagination**: Navigate through pages at the bottom
- **Actions**: Edit or delete products

## 🔧 Configuration Options

### Backend Configuration

**Pagination Limits**
```javascript
// In controllers, adjust default pagination
const limit = req.query.limit || 10; // Default items per page
```

**File Upload Limits**
```javascript
// In .env file
MAX_FILE_SIZE=10485760 // 10MB in bytes
```

**JWT Token Expiry**
```javascript
// In .env file
JWT_EXPIRE=7d // 7 days
```

### Frontend Configuration

**API Base URL**
```typescript
// src/environments/environment.ts
export const environment = {
  apiUrl: 'http://localhost:3000/api' // Change for production
};
```

## 🐛 Troubleshooting

### Backend Issues

**Port Already in Use**
```bash
# Kill process on port 3000
lsof -ti:3000 | xargs kill -9
```

**Database Connection Error**
- Verify PostgreSQL is running: `pg_isready`
- Check credentials in `.env` file
- Ensure database exists: `psql -U postgres -l`

**Redis Connection Error**
```bash
# Check if Redis is running
redis-cli ping
# Should return: PONG

# Start Redis if not running
redis-server
```

### Frontend Issues

**Module Not Found**
```bash
# Clear node_modules and reinstall
rm -rf node_modules package-lock.json
npm install
```

**Port 4200 in Use**
```bash
# Run on different port
ng serve --port 4201
```

## 📊 Performance Optimizations

### Bulk Upload
- Uses **Bull Queue** with Redis for background processing
- Processes files in batches of 100 records
- Returns job ID immediately (no timeout)
- Poll status endpoint for progress updates

### Report Generation
- Uses **streaming** to handle large datasets
- Processes data in chunks
- Downloads start immediately (no timeout)
- Memory-efficient for millions of records

### Database
- Indexes on frequently queried columns (name, price, category_id)
- Connection pooling (max 10 connections)
- Prepared statements via Sequelize

## 🔒 Security Features

- **Password Hashing**: bcrypt with salt rounds
- **JWT Authentication**: Secure token-based auth
- **Input Validation**: Express-validator on all endpoints
- **SQL Injection Prevention**: Sequelize ORM with parameterized queries
- **XSS Protection**: Helmet.js middleware
- **CORS**: Configured for frontend origin
- **File Upload Security**: File type and size validation

## 📁 Project Structure

```
test/
├── backend/
│   ├── src/
│   │   ├── config/         # Database configuration
│   │   ├── controllers/    # Request handlers
│   │   ├── middleware/     # Auth, validation, upload
│   │   ├── models/         # Database models
│   │   ├── routes/         # API routes
│   │   ├── queues/         # Bull queue processors
│   │   ├── utils/          # Helper functions
│   │   └── validators/     # Input validation rules
│   ├── uploads/            # Uploaded files
│   ├── server.js           # Entry point
│   ├── package.json
│   └── .env
├── frontend/
│   ├── src/
│   │   ├── app/
│   │   │   ├── core/       # Services, guards, interceptors
│   │   │   ├── features/   # Feature modules
│   │   │   ├── app.component.ts
│   │   │   ├── app.config.ts
│   │   │   └── app.routes.ts
│   │   ├── environments/   # Environment configs
│   │   ├── styles.css      # Global styles
│   │   └── main.ts
│   ├── angular.json
│   ├── package.json
│   └── tsconfig.json
├── Product_Management_API.postman_collection.json
└── README.md
```

## 🎯 Future Enhancements

- [ ] Add product variants (size, color)
- [ ] Implement product reviews and ratings
- [ ] Add inventory tracking and alerts
- [ ] Implement order management
- [ ] Add analytics dashboard
- [ ] Integrate payment gateway
- [ ] Add email notifications
- [ ] Implement real-time updates with WebSockets
- [ ] Add multi-language support
- [ ] Implement advanced reporting with charts

## 👤 Author

**Dinesh Suthar**


**Note**: This is a demonstration project. For production use, ensure proper security audits, environment configuration, and testing.

