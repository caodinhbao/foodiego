const db = require('../../config/db');

/**
 * Tạo nhà hàng mới
 * @param {number} ownerId
 * @param {object} data - { name, address, phone }
 * @returns {Promise<object>} restaurant
 *
 * TODO (Thành viên B - Ngày 2):
 *  1. Validate name, address bắt buộc
 *  2. INSERT INTO restaurants (owner_id, name, address, phone, status)
 *  3. Trả về restaurant vừa tạo
 */
const createRestaurant = async (ownerId, data) => {
  // TODO: implement
  throw new Error('createRestaurant() not implemented yet');
};

/**
 * Lấy danh sách tất cả nhà hàng (status = active)
 * @returns {Promise<Array>}
 *
 * TODO (Thành viên B - Ngày 2):
 *  1. SELECT * FROM restaurants WHERE status = 'active' ORDER BY created_at DESC
 */
const getAllRestaurants = async () => {
  // TODO: implement
  throw new Error('getAllRestaurants() not implemented yet');
};

/**
 * Lấy chi tiết một nhà hàng
 * @param {number} id
 * @returns {Promise<object>}
 *
 * TODO (Thành viên B - Ngày 2):
 *  1. SELECT * FROM restaurants WHERE id = $1
 *  2. Trả 404 nếu không tìm thấy
 */
const getRestaurantById = async (id) => {
  // TODO: implement
  throw new Error('getRestaurantById() not implemented yet');
};

/**
 * Cập nhật thông tin nhà hàng
 * @param {number} id
 * @param {number} ownerId - để kiểm tra quyền sở hữu
 * @param {object} data - { name?, address?, phone?, status? }
 * @returns {Promise<object>}
 *
 * TODO (Thành viên B - Ngày 2):
 *  1. Kiểm tra restaurant tồn tại và thuộc ownerId
 *  2. UPDATE chỉ các field được truyền vào
 *  3. Trả về restaurant đã cập nhật
 */
const updateRestaurant = async (id, ownerId, data) => {
  // TODO: implement
  throw new Error('updateRestaurant() not implemented yet');
};

module.exports = { createRestaurant, getAllRestaurants, getRestaurantById, updateRestaurant };
