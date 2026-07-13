const db = require('../../config/db');

/**
 * Tạo nhà hàng mới
 */
const createRestaurant = async (ownerId, data) => {
  const { name, address, phone } = data || {};

  // Validate dữ liệu
  if (!name || !address) {
    const err = new Error('name và address là bắt buộc');
    err.status = 400;
    throw err;
  }

  // Thêm nhà hàng
  const { rows: result } = await db.query(
    `
      INSERT INTO restaurants
      (owner_id, name, address, phone, status)
      VALUES (?, ?, ?, ?, ?)
    `,
    [
      ownerId,
      name,
      address,
      phone || null,
      'active',
    ]
  );

  // Lấy thông tin vừa tạo
  const { rows } = await db.query(
    'SELECT * FROM restaurants WHERE id = ?',
    [result.insertId]
  );

  return rows[0];
};

/**
 * Lấy danh sách nhà hàng đang hoạt động
 */
const getAllRestaurants = async () => {
  const { rows } = await db.query(
    `
      SELECT *
      FROM restaurants
      WHERE status = 'active'
      ORDER BY created_at DESC
    `
  );

  return rows;
};

/**
 * Lấy thông tin nhà hàng theo id
 */
const getRestaurantById = async (id) => {
  const { rows } = await db.query(
    'SELECT * FROM restaurants WHERE id = ?',
    [id]
  );

  if (rows.length === 0) {
    const err = new Error('Restaurant not found');
    err.status = 404;
    throw err;
  }

  return rows[0];
};

/**
 * Cập nhật thông tin nhà hàng
 */
const updateRestaurant = async (id, ownerId, data) => {
  // Kiểm tra nhà hàng tồn tại
  const { rows: restaurant } = await db.query(
    'SELECT * FROM restaurants WHERE id = ?',
    [id]
  );

  if (restaurant.length === 0) {
    const err = new Error('Restaurant not found');
    err.status = 404;
    throw err;
  }

  // Kiểm tra quyền owner
  if (restaurant[0].owner_id !== ownerId) {
    const err = new Error('Forbidden: not the owner');
    err.status = 403;
    throw err;
  }

  const fields = [];
  const values = [];

  if (data.name !== undefined) {
    fields.push('name = ?');
    values.push(data.name);
  }

  if (data.address !== undefined) {
    fields.push('address = ?');
    values.push(data.address);
  }

  if (data.phone !== undefined) {
    fields.push('phone = ?');
    values.push(data.phone);
  }

  if (data.status !== undefined) {
    fields.push('status = ?');
    values.push(data.status);
  }

  // Không có gì để cập nhật
  if (fields.length === 0) {
    return restaurant[0];
  }

  values.push(id);

  await db.query(
    `
      UPDATE restaurants
      SET ${fields.join(', ')}
      WHERE id = ?
    `,
    values
  );

  const { rows } = await db.query(
    'SELECT * FROM restaurants WHERE id = ?',
    [id]
  );

  return rows[0];
};

module.exports = {
  createRestaurant,
  getAllRestaurants,
  getRestaurantById,
  updateRestaurant,
};
