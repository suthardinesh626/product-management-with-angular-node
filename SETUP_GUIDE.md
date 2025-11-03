# Quick Setup Guide

This guide will help you set up the Product Management System in under 10 minutes.

## Prerequisites Checklist

- [ ] Node.js (v18+) installed - Check with: `node --version`
- [ ] PostgreSQL (v14+) installed - Check with: `psql --version`
- [ ] Redis installed - Check with: `redis-cli --version`

## Step-by-Step Setup

### 1. Install Prerequisites (if needed)

#### macOS
```bash
# Install Homebrew (if not installed)
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"

# Install Node.js
brew install node

# Install PostgreSQL
brew install postgresql@14
brew services start postgresql@14

# Install Redis
brew install redis
brew services start redis
```

#### Ubuntu/Debian
```bash
# Install Node.js
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# Install PostgreSQL
sudo apt-get install postgresql postgresql-contrib
sudo systemctl start postgresql
sudo systemctl enable postgresql

# Install Redis
sudo apt-get install redis-server
sudo systemctl start redis
sudo systemctl enable redis
```

### 2. Database Setup

```bash
# Create PostgreSQL database
createdb product_management

# Or using psql
psql -U postgres -c "CREATE DATABASE product_management;"
```

### 3. Backend Setup

```bash
cd backend

# Install dependencies
npm install

# Create .env file
cat > .env << EOF
PORT=3000
NODE_ENV=development
DB_HOST=localhost
DB_PORT=5432
DB_NAME=product_management
DB_USER=postgres
DB_PASSWORD=postgres
JWT_SECRET=$(openssl rand -base64 32)
JWT_EXPIRE=7d
UPLOAD_DIR=uploads
MAX_FILE_SIZE=10485760
REDIS_HOST=localhost
REDIS_PORT=6379
EOF

# Run database migrations
npm run migrate

# Seed database with sample data (optional)
node src/config/seed.js

# Start backend server
npm run dev
```

**Backend should now be running on http://localhost:3000**

### 4. Frontend Setup (New Terminal)

```bash
cd frontend

# Install dependencies
npm install

# Install Angular CLI globally (if not installed)
npm install -g @angular/cli

# Start frontend server
npm start
```

**Frontend should now be running on http://localhost:4200**

## Quick Test

1. **Open browser**: Navigate to `http://localhost:4200`

2. **Login with sample credentials**:
   - Email: `admin@example.com`
   - Password: `admin123`

3. **Explore features**:
   - View products list
   - Create a new product
   - Upload bulk products
   - Generate reports

## Common Issues & Solutions

### Issue: Port Already in Use

**Backend (Port 3000)**
```bash
# Find and kill process
lsof -ti:3000 | xargs kill -9

# Or change port in .env
PORT=3001
```

**Frontend (Port 4200)**
```bash
# Find and kill process
lsof -ti:4200 | xargs kill -9

# Or run on different port
ng serve --port 4201
```

### Issue: Database Connection Failed

```bash
# Check PostgreSQL is running
pg_isready

# Restart PostgreSQL
brew services restart postgresql@14  # macOS
sudo systemctl restart postgresql    # Linux

# Check credentials
psql -U postgres -d product_management
```

### Issue: Redis Connection Failed

```bash
# Check Redis is running
redis-cli ping

# Should return: PONG

# Restart Redis
brew services restart redis           # macOS
sudo systemctl restart redis         # Linux
```

### Issue: Module Not Found (Frontend)

```bash
cd frontend
rm -rf node_modules package-lock.json
npm install
```

### Issue: Module Not Found (Backend)

```bash
cd backend
rm -rf node_modules package-lock.json
npm install
```

## Verify Installation

### Check Backend
```bash
# Health check
curl http://localhost:3000/health

# Should return: {"status":"ok","timestamp":"..."}
```

### Check Frontend
Open browser to `http://localhost:4200` - Should see login page

### Check Database
```bash
psql -U postgres -d product_management -c "\dt"

# Should list tables: users, categories, products
```

### Check Redis
```bash
redis-cli ping

# Should return: PONG
```

## Next Steps

1. **Import Postman Collection**:
   - Open Postman
   - Import `Product_Management_API.postman_collection.json`
   - Test all API endpoints

2. **Explore the Application**:
   - Create categories
   - Add products
   - Try bulk upload
   - Generate reports

3. **Read Full Documentation**:
   - See `README.md` for complete API documentation
   - Check out all features and configurations

## Need Help?

- Check `README.md` for detailed documentation
- Review error logs in terminal
- Ensure all prerequisites are properly installed
- Verify environment variables in `.env`

## Production Deployment Notes

Before deploying to production:

1. **Change JWT Secret**: Use a strong random secret
2. **Update Database Credentials**: Use secure passwords
3. **Configure CORS**: Restrict to your domain
4. **Enable HTTPS**: Use SSL certificates
5. **Set NODE_ENV**: Change to `production`
6. **Configure Firewall**: Restrict database/redis access
7. **Backup Strategy**: Set up regular database backups
8. **Monitoring**: Add logging and monitoring tools

---

**Congratulations! Your Product Management System is now ready to use! 🎉**

