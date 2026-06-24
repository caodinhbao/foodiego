const { Pool } = require('pg');

// ── PostgreSQL connection pool ───────────────────────────────────────────────
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

pool.on('error', (err) => {
  // eslint-disable-next-line no-console
  console.error('Unexpected DB error', err);
  process.exit(-1);
});

/**
 * Run a SQL query
 * @param {string} text - SQL query string
 * @param {Array} params - Query parameters
 * @returns {Promise<import('pg').QueryResult>}
 */
const query = (text, params) => pool.query(text, params);

module.exports = { query, pool };
