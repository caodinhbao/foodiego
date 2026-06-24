const db = require('../../config/db');

/**
 * Lấy danh sách tất cả users (Admin only)
 * @returns {Promise<Array>}
 *
 * TODO (Thành viên A - Ngày 3):
 *  1. SELECT id, name, email, role, created_at FROM users ORDER BY created_at DESC
 *  2. Không trả về password_hash
 */
const getAllUsers = async () => {
  // TODO: implement
  throw new Error('getAllUsers() not implemented yet');
};

/**
 * Cập nhật role của user
 * @param {number} id
 * @param {string} role - 'customer' | 'restaurant' | 'admin'
 * @returns {Promise<{id, name, email, role}>}
 *
 * TODO (Thành viên A - Ngày 3):
 *  1. Validate role hợp lệ
 *  2. UPDATE users SET role = $1 WHERE id = $2
 *  3. Trả về user đã cập nhật
 */
const updateUserRole = async (id, role) => {
  // TODO: implement
  throw new Error('updateUserRole() not implemented yet');
};

module.exports = { getAllUsers, updateUserRole };
