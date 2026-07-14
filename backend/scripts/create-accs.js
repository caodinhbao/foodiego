require('dotenv').config();
const mysql = require('mysql2/promise');
const bcrypt = require('bcryptjs');

async function createAccounts() {
  const conn = await mysql.createConnection({
    host: process.env.DB_HOST || 'localhost',
    port: Number(process.env.DB_PORT) || 3306,
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'foodiego_db',
  });

  const hash = await bcrypt.hash('Password123!', 10);

  // 1. Tạo user cho "Nhà Hàng Đồ Ăn FoodieGo"
  const [res1] = await conn.query(
    'INSERT INTO users (name, email, password_hash, role) VALUES (?, ?, ?, ?)',
    ['Chủ - Nhà Hàng Đồ Ăn', 'food@restaurant.com', hash, 'restaurant']
  );
  const user1Id = res1.insertId;

  // Cập nhật nhà hàng
  await conn.query('UPDATE restaurants SET owner_id = ? WHERE id = 1', [user1Id]);

  // 2. Tạo user cho "Quán Nước & Cà Phê FoodieGo"
  const [res2] = await conn.query(
    'INSERT INTO users (name, email, password_hash, role) VALUES (?, ?, ?, ?)',
    ['Chủ - Quán Nước & Cà Phê', 'drink@restaurant.com', hash, 'restaurant']
  );
  const user2Id = res2.insertId;

  // Cập nhật nhà hàng
  await conn.query('UPDATE restaurants SET owner_id = ? WHERE id = 2', [user2Id]);

  console.log('✅ Đã tạo lại 2 tài khoản:');
  console.log('1. Email: food@restaurant.com | Password: Password123!');
  console.log('2. Email: drink@restaurant.com | Password: Password123!');

  await conn.end();
}

createAccounts().catch(console.error);
