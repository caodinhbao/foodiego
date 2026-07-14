require('dotenv').config();
const mysql = require('mysql2/promise');
const bcrypt = require('bcryptjs');

async function createCustomers() {
  const conn = await mysql.createConnection({
    host: process.env.DB_HOST || 'localhost',
    port: Number(process.env.DB_PORT) || 3306,
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'foodiego_db',
  });

  const hash = await bcrypt.hash('Password123!', 10);

  // 1. Khách hàng 1
  await conn.query(
    'INSERT INTO users (name, email, password_hash, role) VALUES (?, ?, ?, ?)',
    ['Khách Hàng Một', 'khachhang1@gmail.com', hash, 'customer']
  );

  // 2. Khách hàng 2
  await conn.query(
    'INSERT INTO users (name, email, password_hash, role) VALUES (?, ?, ?, ?)',
    ['Khách Hàng Hai', 'khachhang2@gmail.com', hash, 'customer']
  );

  console.log('✅ Đã tạo thêm 2 tài khoản khách hàng:');
  console.log('1. Email: khachhang1@gmail.com | Password: Password123!');
  console.log('2. Email: khachhang2@gmail.com | Password: Password123!');

  await conn.end();
}

createCustomers().catch(console.error);
