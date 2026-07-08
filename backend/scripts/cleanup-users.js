require('dotenv').config();
const mysql = require('mysql2/promise');

(async () => {
  const conn = await mysql.createConnection({
    host:     process.env.DB_HOST     || 'localhost',
    port:     Number(process.env.DB_PORT) || 3306,
    user:     process.env.DB_USER     || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME     || 'foodiego_db',
    multipleStatements: true,
    charset:  'utf8mb4',
  });

  // Xóa dữ liệu liên quan trước (FK)
  await conn.query('SET FOREIGN_KEY_CHECKS=0');
  await conn.query('TRUNCATE TABLE reviews');
  await conn.query('TRUNCATE TABLE order_items');
  await conn.query('TRUNCATE TABLE orders');
  // Xóa tất cả user không phải admin
  await conn.query("DELETE FROM users WHERE role != 'admin'");
  await conn.query('SET FOREIGN_KEY_CHECKS=1');

  const [users] = await conn.query('SELECT id, name, email, role FROM users');
  console.log('\nUsers còn lại:');
  users.forEach(u => console.log(` - [${u.role}] ${u.name} <${u.email}>`));
  console.log('\n✅ Xong! Chỉ còn 1 tài khoản admin.');
  await conn.end();
})().catch(e => { console.error('Lỗi:', e.message); process.exit(1); });
