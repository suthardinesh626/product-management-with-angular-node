require('dotenv').config();
const { syncDatabase } = require('../models');

const runMigration = async () => {
  console.log('🔄 Starting database migration...\n');

  try {
    // Sync database (creates tables if they don't exist)
    await syncDatabase({ alter: true });

    console.log('\n✅ Database migration completed successfully!');
    console.log('📊 All tables have been created/updated.\n');

    process.exit(0);
  } catch (error) {
    console.error('\n❌ Migration failed:', error.message);
    console.error(error.stack);
    process.exit(1);
  }
};

runMigration();

