const db = require('../../config/db');

/**
 * Tạo món ăn mới
 * @param {number} restaurantId
 * @param {number} ownerId
 * @param {object} data
 * @returns {Promise<object>}
 */
const createMenuItem = async (restaurantId, ownerId, data) => {
  // Kiểm tra nhà hàng tồn tại
  const restQueryText =
    'SELECT * FROM restaurants WHERE id = ?';

  const restResult = await db.query(restQueryText, [restaurantId]);

  if (restResult.rows.length === 0) {
    const err = new Error('Restaurant not found');
    err.status = 404;
    throw err;
  }

  const restaurant = restResult.rows[0];

  // Kiểm tra quyền owner
  if (restaurant.owner_id !== ownerId) {
    const err = new Error(
      'Forbidden: You do not own this restaurant'
    );
    err.status = 403;
    throw err;
  }

  const {
    name,
    description,
    price,
    is_available,
  } = data;

  // Validate
  if (!name || price === undefined) {
    const err = new Error('Name and price are required');
    err.status = 400;
    throw err;
  }

  if (Number(price) <= 0) {
    const err = new Error('Price must be greater than 0');
    err.status = 400;
    throw err;
  }

  const queryText = `
    INSERT INTO menu_items
      (restaurant_id, name, description, price, is_available)
    VALUES (?, ?, ?, ?, ?)
  `;

  const result = await db.query(queryText, [
    restaurantId,
    name,
    description || null,
    price,
    is_available !== undefined ? is_available : true,
  ]);

  const selectQuery = 'SELECT * FROM menu_items WHERE id = ?';
  const newItem = await db.query(selectQuery, [result.rows.insertId]);

  return newItem.rows[0];
};

/**
 * Lấy menu của nhà hàng
 * @param {number} restaurantId
 * @returns {Promise<Array>}
 */
const getMenuByRestaurant = async (restaurantId) => {
  const restQueryText =
    'SELECT * FROM restaurants WHERE id = ?';

  const restResult = await db.query(restQueryText, [restaurantId]);

  if (restResult.rows.length === 0) {
    const err = new Error('Restaurant not found');
    err.status = 404;
    throw err;
  }

  const queryText = `
    SELECT
      mi.*,
      fs.discount_percent,
      IF(fs.id IS NOT NULL, mi.price, NULL) AS original_price,
      IF(fs.id IS NOT NULL, ROUND(mi.price * (1 - fs.discount_percent / 100)), mi.price) AS effective_price
    FROM menu_items mi
    LEFT JOIN flash_sales fs
      ON fs.menu_item_id = mi.id
      AND fs.start_time <= NOW()
      AND fs.end_time >= NOW()
    WHERE mi.restaurant_id = ?
      AND mi.is_available = true
    ORDER BY mi.name ASC
  `;

  const result = await db.query(queryText, [restaurantId]);

  return result.rows.map(row => {
    if (row.original_price) {
      row.price = row.effective_price;
    }
    return row;
  });
};

/**
 * Cập nhật món ăn
 * @param {number} id
 * @param {number} ownerId
 * @param {object} data
 * @returns {Promise<object>}
 */
const updateMenuItem = async (id, ownerId, data) => {
  const itemQueryText = `
    SELECT
      m.*,
      r.owner_id
    FROM menu_items m
    JOIN restaurants r
      ON m.restaurant_id = r.id
    WHERE m.id = ?
  `;

  const itemResult = await db.query(itemQueryText, [id]);

  if (itemResult.rows.length === 0) {
    const err = new Error('Menu item not found');
    err.status = 404;
    throw err;
  }

  const item = itemResult.rows[0];

  if (item.owner_id !== ownerId) {
    const err = new Error(
      'Forbidden: You do not own the restaurant of this menu item'
    );
    err.status = 403;
    throw err;
  }

  const fields = [];
  const values = [];

  if (data.name !== undefined) {
    if (!data.name.trim()) {
      const err = new Error('Name cannot be empty');
      err.status = 400;
      throw err;
    }

    fields.push(`name = ?`);
    values.push(data.name);
  }

  if (data.description !== undefined) {
    fields.push(`description = ?`);
    values.push(data.description);
  }

  if (data.price !== undefined) {
    if (Number(data.price) <= 0) {
      const err = new Error('Price must be greater than 0');
      err.status = 400;
      throw err;
    }

    fields.push(`price = ?`);
    values.push(data.price);
  }

  if (data.is_available !== undefined) {
    fields.push(`is_available = ?`);
    values.push(data.is_available);
  }

  // Không có dữ liệu cập nhật
  if (fields.length === 0) {
    // eslint-disable-next-line no-unused-vars
    const { owner_id, ...itemDetails } = item;
    return itemDetails;
  }

  values.push(id);

  const queryText = `
    UPDATE menu_items
    SET ${fields.join(', ')}
    WHERE id = ?
  `;

  await db.query(queryText, values);

  const updatedItemResult = await db.query('SELECT * FROM menu_items WHERE id = ?', [id]);
  return updatedItemResult.rows[0];
};

/**
 * Xóa mềm món ăn
 * @param {number} id
 * @param {number} ownerId
 */
const deleteMenuItem = async (id, ownerId) => {
  const itemQueryText = `
    SELECT
      m.*,
      r.owner_id
    FROM menu_items m
    JOIN restaurants r
      ON m.restaurant_id = r.id
    WHERE m.id = ?
  `;

  const itemResult = await db.query(itemQueryText, [id]);

  if (itemResult.rows.length === 0) {
    const err = new Error('Menu item not found');
    err.status = 404;
    throw err;
  }

  const item = itemResult.rows[0];

  if (item.owner_id !== ownerId) {
    const err = new Error(
      'Forbidden: You do not own the restaurant of this menu item'
    );
    err.status = 403;
    throw err;
  }

  const queryText =
    'UPDATE menu_items SET is_available = false WHERE id = ?';

  await db.query(queryText, [id]);
};

module.exports = {
  createMenuItem,
  getMenuByRestaurant,
  updateMenuItem,
  deleteMenuItem,
};
