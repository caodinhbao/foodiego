const db = require('../../config/db');

/**
 * Thêm món ăn mới vào menu
 * @param {number} restaurantId
 * @param {number} ownerId - kiểm tra quyền sở hữu
 * @param {object} data - { name, description, price, is_available? }
 * @returns {Promise<object>} menu item
 *
 * TODO (Thành viên B - Ngày 2):
 *  1. Kiểm tra restaurant tồn tại và thuộc ownerId
 *  2. Validate: name và price bắt buộc, price > 0
 *  3. INSERT INTO menu_items
 *  4. Trả về item vừa tạo
 */
const createMenuItem = async (restaurantId, ownerId, data) => {
  // TODO: implement
  throw new Error('createMenuItem() not implemented yet');
};

/**
 * Lấy danh sách món ăn theo nhà hàng
 * @param {number} restaurantId
 * @returns {Promise<Array>}
 *
 * TODO (Thành viên B - Ngày 2):
 *  1. SELECT * FROM menu_items WHERE restaurant_id = $1 AND is_available = true
 */
const getMenuByRestaurant = async (restaurantId) => {
  // TODO: implement
  throw new Error('getMenuByRestaurant() not implemented yet');
};

/**
 * Cập nhật thông tin món ăn
 * @param {number} id
 * @param {number} ownerId - kiểm tra quyền
 * @param {object} data - { name?, description?, price?, is_available? }
 * @returns {Promise<object>}
 *
 * TODO (Thành viên B - Ngày 2):
 *  1. Kiểm tra item tồn tại + restaurant thuộc ownerId
 *  2. UPDATE chỉ các field được truyền vào
 */
const updateMenuItem = async (id, ownerId, data) => {
  // TODO: implement
  throw new Error('updateMenuItem() not implemented yet');
};

/**
 * Xóa món ăn (soft delete — set is_available = false)
 * @param {number} id
 * @param {number} ownerId - kiểm tra quyền
 * @returns {Promise<void>}
 *
 * TODO (Thành viên B - Ngày 2):
 *  1. Kiểm tra item tồn tại + quyền
 *  2. UPDATE menu_items SET is_available = false WHERE id = $1
 */
const deleteMenuItem = async (id, ownerId) => {
  // TODO: implement
  throw new Error('deleteMenuItem() not implemented yet');
};

module.exports = { createMenuItem, getMenuByRestaurant, updateMenuItem, deleteMenuItem };
