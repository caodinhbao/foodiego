/**
 * FoodieGo — Database Seeder
 * Chạy: node scripts/seed.js
 */
require('dotenv').config();
const fs   = require('fs');
const path = require('path');
const mysql = require('mysql2/promise');

const sqlFile = path.join(__dirname, '..', 'migrations', 'seed.sql');

async function seed() {
  const conn = await mysql.createConnection({
    host:              process.env.DB_HOST     || 'localhost',
    port:     Number(process.env.DB_PORT)      || 3306,
    user:              process.env.DB_USER     || 'root',
    password:          process.env.DB_PASSWORD || '',
    database:          process.env.DB_NAME     || 'foodiego_db',
    multipleStatements: true,
  });

  console.log('✅ Kết nối database thành công');

  const sql = fs.readFileSync(sqlFile, 'utf8');

  try {
    await conn.query(sql);
    console.log('✅ Seed data đã được nạp thành công!');
    console.log('');
    console.log('📦 Dữ liệu mẫu đã tạo:');
    console.log('   👤 8 users  (1 admin, 3 customers, 4 restaurant owners)');
    console.log('   🏪 4 restaurants');
    console.log('   🍜 19 menu items');
    console.log('   📋 7 orders');
    console.log('   ⭐ 5 reviews');
    console.log('');
    console.log('🔑 Tài khoản test (password: Password123!):');
    console.log('   admin@foodiego.com          (admin)');
    console.log('   an.nguyen@gmail.com         (customer)');
    console.log('   binh.tran@gmail.com         (customer)');
    console.log('   pho.hanoi@restaurant.com    (restaurant)');
  } catch (err) {
    if (err.code === 'ER_DUP_ENTRY') {
      console.warn('⚠️  Dữ liệu đã tồn tại, bỏ qua seed.');
    } else {
      throw err;
    }
  } finally {
    await conn.end();
  }
}

seed().catch(err => {
  console.error('❌ Lỗi seed:', err.message);
  process.exit(1);
});
