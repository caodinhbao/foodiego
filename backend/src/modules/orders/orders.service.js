const db = require('../../config/db');
const axios = require('axios');

const VALID_STATUS = ['pending', 'accepted', 'preparing', 'delivering', 'completed', 'cancelled'];
const STATUS_TRANSITIONS = {
  pending:    ['accepted', 'cancelled'],
  accepted:   ['preparing', 'cancelled'],
  preparing:  ['delivering'],
  delivering: ['completed'],
  completed:  [],
  cancelled:  [],
};

const createOrder = async (customerId, data) => {
  const { restaurant_id, items, distance_km = 3 } = data || {};

  if (!restaurant_id || !items || !Array.isArray(items) || items.length === 0) {
    const err = new Error('restaurant_id và items (array) là bắt buộc');
    err.status = 400;
    throw err;
  }

  const menuItemIds = items.map((i) => i.menu_item_id);
  const placeholders = menuItemIds.map(() => '?').join(',');
  const { rows: menuRows } = await db.query(
    `SELECT * FROM menu_items WHERE id IN (${placeholders}) AND is_available = 1`,
    menuItemIds
  );

  if (menuRows.length !== menuItemIds.length) {
    const err = new Error('Một hoặc nhiều món ăn không tồn tại hoặc không khả dụng');
    err.status = 400;
    throw err;
  }

  const menuMap = {};
  menuRows.forEach((m) => { menuMap[m.id] = m; });

  let total_amount = 0;
  const orderItems = items.map((item) => {
    const menuItem = menuMap[item.menu_item_id];
    const unit_price = Number(menuItem.price);
    const quantity = Number(item.quantity) || 1;
    total_amount += unit_price * quantity;
    return { menu_item_id: item.menu_item_id, quantity, unit_price };
  });

  // Gọi delivery-service (fallback nếu không available)
  let delivery_fee = 0;
  try {
    const deliveryServiceUrl = process.env.DELIVERY_SERVICE_URL || 'http://localhost:8000';
    const feeRes = await axios.post(`${deliveryServiceUrl}/delivery-fee/calculate`, {
      distance_km: Number(distance_km),
      order_amount: total_amount,
    }, { timeout: 2000 });
    delivery_fee = feeRes.data.delivery_fee || 0;
  } catch (_err) {
    delivery_fee = Math.max(5000, Number(distance_km) * 3000);
  }

  // Transaction
  const conn = await db.pool.getConnection();
  try {
    await conn.beginTransaction();

    const [orderResult] = await conn.execute(
      "INSERT INTO orders (customer_id, restaurant_id, total_amount, delivery_fee, status) VALUES (?, ?, ?, ?, 'pending')",
      [customerId, restaurant_id, total_amount, delivery_fee]
    );
    const orderId = orderResult.insertId;

    for (const item of orderItems) {
      await conn.execute(
        'INSERT INTO order_items (order_id, menu_item_id, quantity, unit_price) VALUES (?, ?, ?, ?)',
        [orderId, item.menu_item_id, item.quantity, item.unit_price]
      );
    }

    await conn.commit();

    // Lấy order kèm items
    const [orders] = await conn.execute('SELECT * FROM orders WHERE id = ?', [orderId]);
    const [itemRows] = await conn.execute(
      `SELECT oi.*, mi.name AS item_name
       FROM order_items oi
       JOIN menu_items mi ON mi.id = oi.menu_item_id
       WHERE oi.order_id = ?`,
      [orderId]
    );
    const order = orders[0];
    order.items = itemRows;
    return order;
  } catch (err) {
    await conn.rollback();
    throw err;
  } finally {
    conn.release();
  }
};

const getMyOrders = async (customerId) => {
  const { rows: orders } = await db.query(
    'SELECT * FROM orders WHERE customer_id = ? ORDER BY created_at DESC',
    [customerId]
  );

  // Thêm items cho mỗi order
  for (const order of orders) {
    const { rows: items } = await db.query(
      `SELECT oi.*, mi.name AS item_name
       FROM order_items oi
       JOIN menu_items mi ON mi.id = oi.menu_item_id
       WHERE oi.order_id = ?`,
      [order.id]
    );
    order.items = items;
  }
  return orders;
};

const getOrderById = async (orderId, user) => {
  const { rows } = await db.query('SELECT * FROM orders WHERE id = ?', [orderId]);
  if (rows.length === 0) {
    const err = new Error('Order not found');
    err.status = 404;
    throw err;
  }
  const order = rows[0];

  if (user.role === 'customer' && order.customer_id !== user.id) {
    const err = new Error('Forbidden');
    err.status = 403;
    throw err;
  }
  if (user.role === 'restaurant') {
    const { rows: rest } = await db.query('SELECT owner_id FROM restaurants WHERE id = ?', [order.restaurant_id]);
    if (rest.length === 0 || rest[0].owner_id !== user.id) {
      const err = new Error('Forbidden');
      err.status = 403;
      throw err;
    }
  }

  const { rows: items } = await db.query(
    `SELECT oi.*, mi.name AS item_name
     FROM order_items oi
     JOIN menu_items mi ON mi.id = oi.menu_item_id
     WHERE oi.order_id = ?`,
    [orderId]
  );
  order.items = items;
  return order;
};

const updateOrderStatus = async (orderId, ownerId, newStatus) => {
  if (!VALID_STATUS.includes(newStatus)) {
    const err = new Error(`Trạng thái không hợp lệ. Hợp lệ: ${VALID_STATUS.join(', ')}`);
    err.status = 400;
    throw err;
  }

  const { rows: orderRows } = await db.query(
    `SELECT o.*, r.owner_id AS restaurant_owner_id
     FROM orders o
     JOIN restaurants r ON r.id = o.restaurant_id
     WHERE o.id = ?`,
    [orderId]
  );
  if (orderRows.length === 0) {
    const err = new Error('Order not found');
    err.status = 404;
    throw err;
  }

  const order = orderRows[0];
  if (order.restaurant_owner_id !== ownerId) {
    const err = new Error('Forbidden: not the restaurant owner');
    err.status = 403;
    throw err;
  }

  const allowed = STATUS_TRANSITIONS[order.status] || [];
  if (!allowed.includes(newStatus)) {
    const err = new Error(`Không thể chuyển từ "${order.status}" sang "${newStatus}"`);
    err.status = 400;
    throw err;
  }

  await db.query('UPDATE orders SET status = ? WHERE id = ?', [newStatus, orderId]);
  const { rows } = await db.query('SELECT * FROM orders WHERE id = ?', [orderId]);
  return rows[0];
};

module.exports = {
  createOrder,
  getMyOrders,
  getOrderById,
  updateOrderStatus,
  STATUS_TRANSITIONS,
};
