const db = require('../../config/db');
const axios = require('axios');

// Trạng thái hợp lệ và các chuyển trạng thái được phép
const VALID_STATUS = ['pending', 'accepted', 'preparing', 'delivering', 'completed', 'cancelled'];
const STATUS_TRANSITIONS = {
  pending: ['accepted', 'cancelled'],
  accepted: ['preparing', 'cancelled'],
  preparing: ['delivering'],
  delivering: ['completed'],
  completed: [],
  cancelled: [],
};

/**
 * Tạo đơn hàng mới
 * @param {number} customerId
 * @param {object} data - { restaurant_id, items: [{menu_item_id, quantity}], distance_km }
 * @returns {Promise<object>} order với order_items
 *
 * TODO (Thành viên C - Ngày 3):
 *  1. Validate: restaurant_id, items không rỗng
 *  2. Lấy thông tin từng menu_item để tính unit_price
 *  3. Tính total_amount = sum(quantity * unit_price)
 *  4. Gọi delivery-service: POST /delivery-fee/calculate { distance_km, order_amount }
 *  5. INSERT orders + INSERT order_items (dùng transaction)
 *  6. Trả về order với danh sách items
 */
const createOrder = async (customerId, data) => {
  // TODO: implement
  throw new Error('createOrder() not implemented yet');
};

/**
 * Lấy danh sách đơn hàng của customer
 * @param {number} customerId
 * @returns {Promise<Array>}
 *
 * TODO (Thành viên C - Ngày 3):
 *  1. SELECT * FROM orders WHERE customer_id = $1 ORDER BY created_at DESC
 */
const getMyOrders = async (customerId) => {
  // TODO: implement
  throw new Error('getMyOrders() not implemented yet');
};

/**
 * Lấy chi tiết đơn hàng
 * @param {number} orderId
 * @param {object} user - { id, role }
 * @returns {Promise<object>}
 *
 * TODO (Thành viên C - Ngày 3):
 *  1. SELECT order + JOIN order_items
 *  2. Kiểm tra quyền: customer chỉ xem đơn của mình, owner xem đơn nhà hàng mình
 */
const getOrderById = async (orderId, user) => {
  // TODO: implement
  throw new Error('getOrderById() not implemented yet');
};

/**
 * Cập nhật trạng thái đơn hàng
 * @param {number} orderId
 * @param {number} ownerId
 * @param {string} newStatus
 * @returns {Promise<object>}
 *
 * TODO (Thành viên C - Ngày 3):
 *  1. Lấy đơn hiện tại, kiểm tra nhà hàng thuộc ownerId
 *  2. Kiểm tra STATUS_TRANSITIONS[currentStatus] có chứa newStatus không
 *  3. UPDATE orders SET status = $1 WHERE id = $2
 *  4. Trả về order đã cập nhật
 */
const updateOrderStatus = async (orderId, ownerId, newStatus) => {
  // TODO: implement
  throw new Error('updateOrderStatus() not implemented yet');
};

module.exports = {
  createOrder,
  getMyOrders,
  getOrderById,
  updateOrderStatus,
  STATUS_TRANSITIONS, // export để dùng trong test
};
