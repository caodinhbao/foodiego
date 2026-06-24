const _bcrypt = require('bcryptjs');
const _jwt = require('jsonwebtoken');
const _db = require('../../config/db');

/**
 * Đăng ký tài khoản mới
 * @param {string} name
 * @param {string} email
 * @param {string} password
 * @param {string} role - 'customer' | 'restaurant' | 'admin'
 * @returns {Promise<{id, name, email, role}>}
 *
 * TODO (Thành viên A - Ngày 2):
 *  1. Kiểm tra email đã tồn tại chưa → throw Error nếu trùng
 *  2. Hash password bằng bcrypt (saltRounds = 10)
 *  3. INSERT vào bảng users
 *  4. Trả về user (không kèm password_hash)
 */
const register = async (_name, _email, _password, _role = 'customer') => {
  // TODO: implement
  throw new Error('register() not implemented yet');
};

/**
 * Đăng nhập
 * @param {string} email
 * @param {string} password
 * @returns {Promise<{token: string, user: {id, name, email, role}}>}
 *
 * TODO (Thành viên A - Ngày 2):
 *  1. Tìm user theo email → throw Error 'Invalid credentials' nếu không thấy
 *  2. So sánh password với bcrypt.compare → throw Error nếu sai
 *  3. Tạo JWT token (payload: { id, email, role })
 *  4. Trả về { token, user }
 */
const login = async (_email, _password) => {
  // TODO: implement
  throw new Error('login() not implemented yet');
};

/**
 * Lấy thông tin user theo id
 * @param {number} id
 * @returns {Promise<{id, name, email, role, created_at}>}
 *
 * TODO (Thành viên A - Ngày 2):
 *  1. SELECT user theo id từ DB
 *  2. Không trả về password_hash
 */
const getProfile = async (_id) => {
  // TODO: implement
  throw new Error('getProfile() not implemented yet');
};

module.exports = { register, login, getProfile };
