const mysql = require('mysql2/promise');

// ── MySQL connection pool (XAMPP default) ────────────────────────────────────
const pool = mysql.createPool({
  host:     process.env.DB_HOST     || 'localhost',
  port:     Number(process.env.DB_PORT) || 3306,
  user:     process.env.DB_USER     || 'root',
  password: process.env.DB_PASSWORD || '',          // XAMPP mặc định không có password
  database: process.env.DB_NAME     || 'foodiego_db',
  waitForConnections: true,
  connectionLimit: 10,
  charset: 'utf8mb4',
});

/**
 * Run a SQL query
 * @param {string} text   - SQL query string (dùng ? cho params)
 * @param {Array}  params - Query parameters
 * @returns {Promise<[rows, fields]>}
 */
const query = async (text, params) => {
  const [rows, fields] = await pool.execute(text, params);
  return { rows, fields };
};

/**
 * Lấy một connection từ pool (dùng cho transaction)
 */
const getConnection = () => pool.getConnection();

module.exports = { query, pool, getConnection };
