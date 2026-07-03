const db = require('../../config/db');

const createRestaurant = async (ownerId, data) => {
  const { name, address, phone } = data || {};
  if (!name || !address) {
    const err = new Error('name và address là bắt buộc');
    err.status = 400;
    throw err;
  }
  const { rows: result } = await db.query(
    'INSERT INTO restaurants (owner_id, name, address, phone, status) VALUES (?, ?, ?, ?, ?)',
    [ownerId, name, address, phone || null, 'active']
  );
  const { rows } = await db.query('SELECT * FROM restaurants WHERE id = ?', [result.insertId]);
  return rows[0];
};

const getAllRestaurants = async () => {
  const { rows } = await db.query(
    'SELECT * FROM restaurants WHERE status = \'active\' ORDER BY created_at DESC'
  );
  return rows;
};

const getRestaurantById = async (id) => {
  const { rows } = await db.query('SELECT * FROM restaurants WHERE id = ?', [id]);
  if (rows.length === 0) {
    const err = new Error('Restaurant not found');
    err.status = 404;
    throw err;
  }
  return rows[0];
};

const updateRestaurant = async (id, ownerId, data) => {
  const { rows: check } = await db.query('SELECT * FROM restaurants WHERE id = ?', [id]);
  if (check.length === 0) {
    const err = new Error('Restaurant not found');
    err.status = 404;
    throw err;
  }
  if (check[0].owner_id !== ownerId) {
    const err = new Error('Forbidden: not the owner');
    err.status = 403;
    throw err;
  }

  const fields = [];
  const values = [];
  if (data.name    !== undefined) { fields.push('name = ?');    values.push(data.name); }
  if (data.address !== undefined) { fields.push('address = ?'); values.push(data.address); }
  if (data.phone   !== undefined) { fields.push('phone = ?');   values.push(data.phone); }
  if (data.status  !== undefined) { fields.push('status = ?');  values.push(data.status); }

  if (fields.length === 0) return check[0];

  values.push(id);
  await db.query(`UPDATE restaurants SET ${fields.join(', ')} WHERE id = ?`, values);
  const { rows } = await db.query('SELECT * FROM restaurants WHERE id = ?', [id]);
  return rows[0];
};

module.exports = { createRestaurant, getAllRestaurants, getRestaurantById, updateRestaurant };
