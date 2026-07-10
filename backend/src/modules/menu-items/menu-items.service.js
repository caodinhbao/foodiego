const db = require('../../config/db');

const createMenuItem = async (restaurantId, ownerId, data) => {
  const { name, description, price, is_available = true } = data || {};
  if (!name || price === undefined) {
    const err = new Error('name và price là bắt buộc');
    err.status = 400;
    throw err;
  }
  if (Number(price) <= 0) {
    const err = new Error('price phải lớn hơn 0');
    err.status = 400;
    throw err;
  }

  const { rows: rest } = await db.query('SELECT * FROM restaurants WHERE id = ?', [restaurantId]);
  if (rest.length === 0) {
    const err = new Error('Restaurant not found');
    err.status = 404;
    throw err;
  }
  if (rest[0].owner_id !== ownerId) {
    const err = new Error('Forbidden: not the owner');
    err.status = 403;
    throw err;
  }

  const { rows: result } = await db.query(
    'INSERT INTO menu_items (restaurant_id, name, description, price, is_available) VALUES (?, ?, ?, ?, ?)',
    [restaurantId, name, description || null, price, is_available ? 1 : 0]
  );
  const { rows } = await db.query('SELECT * FROM menu_items WHERE id = ?', [result.insertId]);
  return rows[0];
};

const getMenuByRestaurant = async (restaurantId) => {
  const { rows } = await db.query(
    `SELECT mi.*, fs.discount_percent
     FROM menu_items mi
     LEFT JOIN flash_sales fs ON mi.id = fs.menu_item_id
        AND fs.start_time <= NOW() AND fs.end_time >= NOW()
     WHERE mi.restaurant_id = ? AND mi.is_available = 1
     ORDER BY mi.created_at DESC`,
    [restaurantId]
  );
  return rows.map(r => {
    if (r.discount_percent) {
      r.original_price = r.price;
      r.price = Math.round(Number(r.price) * (1 - r.discount_percent / 100));
    }
    return r;
  });
};

const updateMenuItem = async (id, ownerId, data) => {
  const { rows: item } = await db.query(
    `SELECT mi.*, r.owner_id
     FROM menu_items mi
     JOIN restaurants r ON r.id = mi.restaurant_id
     WHERE mi.id = ?`,
    [id]
  );
  if (item.length === 0) {
    const err = new Error('Menu item not found');
    err.status = 404;
    throw err;
  }
  if (item[0].owner_id !== ownerId) {
    const err = new Error('Forbidden: not the owner');
    err.status = 403;
    throw err;
  }

  const fields = [];
  const values = [];
  if (data.name         !== undefined) { fields.push('name = ?');         values.push(data.name); }
  if (data.description  !== undefined) { fields.push('description = ?');  values.push(data.description); }
  if (data.price        !== undefined) { fields.push('price = ?');        values.push(data.price); }
  if (data.is_available !== undefined) { fields.push('is_available = ?'); values.push(data.is_available ? 1 : 0); }

  if (fields.length === 0) return item[0];

  values.push(id);
  await db.query(`UPDATE menu_items SET ${fields.join(', ')} WHERE id = ?`, values);
  const { rows } = await db.query('SELECT * FROM menu_items WHERE id = ?', [id]);
  return rows[0];
};

const deleteMenuItem = async (id, ownerId) => {
  const { rows: item } = await db.query(
    `SELECT mi.*, r.owner_id
     FROM menu_items mi
     JOIN restaurants r ON r.id = mi.restaurant_id
     WHERE mi.id = ?`,
    [id]
  );
  if (item.length === 0) {
    const err = new Error('Menu item not found');
    err.status = 404;
    throw err;
  }
  if (item[0].owner_id !== ownerId) {
    const err = new Error('Forbidden: not the owner');
    err.status = 403;
    throw err;
  }
  await db.query('UPDATE menu_items SET is_available = 0 WHERE id = ?', [id]);
};

module.exports = { createMenuItem, getMenuByRestaurant, updateMenuItem, deleteMenuItem };
