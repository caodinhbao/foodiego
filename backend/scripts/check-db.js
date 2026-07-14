require('dotenv').config();
const mysql = require('mysql2/promise');

async function check() {
  const conn = await mysql.createConnection({
    host: process.env.DB_HOST || 'localhost',
    port: Number(process.env.DB_PORT) || 3306,
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'foodiego_db',
  });

  const [restaurants] = await conn.query('SELECT * FROM restaurants');
  console.log('Restaurants:', restaurants);

  const [users] = await conn.query('SELECT * FROM users WHERE role = "restaurant"');
  console.log('Restaurant Users:', users);

  await conn.end();
}

check().catch(console.error);
