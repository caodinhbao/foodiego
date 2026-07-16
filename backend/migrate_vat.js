require('dotenv').config();
const db = require('./src/config/db');

async function runMigration() {
  try {
    console.log('Running migration...');
    // Attempt to add vat_fee column
    await db.query('ALTER TABLE orders ADD COLUMN vat_fee DECIMAL(10,2) NOT NULL DEFAULT 0 AFTER delivery_fee');
    console.log('Migration successful: vat_fee column added to orders table.');
  } catch (error) {
    if (error.code === 'ER_DUP_FIELDNAME') {
      console.log('Migration skipped: vat_fee column already exists.');
    } else {
      console.error('Migration failed:', error);
    }
  } finally {
    process.exit(0);
  }
}

runMigration();
