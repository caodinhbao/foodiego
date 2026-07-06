const express = require('express');
const router = express.Router();
const authService = require('./auth.service');
const authenticate = require('../../middlewares/authenticate');

/**
 * POST /api/auth/register
 * Body: { name, email, password, role? }
 *
 * TODO (Thành viên A - Ngày 2):
 *  1. Validate: name, email, password bắt buộc
 *  2. Gọi authService.register(...)
 *  3. Trả 201 + { message, user }
 *  4. Catch lỗi email trùng → 409
 */
router.post('/register', async (req, res, next) => {
  try {
    // TODO: implement
    const { name, email, password, role } = req.body;
    if (!name || !email || !password) {
      return res.status(400).json({ error: 'name, email and password are required' });
    }
    const user = await authService.register(name, email, password, role);
    return res.status(201).json({ message: 'Registered successfully', user });
  } catch (err) {
    next(err);
  }
});

/**
 * POST /api/auth/login
 * Body: { email, password }
 *
 * TODO (Thành viên A - Ngày 2):
 *  1. Validate: email, password bắt buộc
 *  2. Gọi authService.login(...)
 *  3. Trả 200 + { token, user }
 *  4. Catch lỗi credentials sai → 401
 */
router.post('/login', async (req, res, next) => {
  try {
    // TODO: implement
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ error: 'email and password are required' });
    }
    const result = await authService.login(email, password);
    return res.status(200).json(result);
  } catch (err) {
    next(err);
  }
});

/**
 * GET /api/auth/profile
 * Header: Authorization: Bearer <token>
 *
 * TODO (Thành viên A - Ngày 2):
 *  1. Dùng middleware authenticate để xác thực
 *  2. Gọi authService.getProfile(req.user.id)
 *  3. Trả 200 + user info
 */
router.get('/profile', authenticate, async (req, res, next) => {
  try {
    // TODO: implement
    const user = await authService.getProfile(req.user.id);
    return res.status(200).json(user);
  } catch (err) {
    next(err);
  }
});

/**
 * PATCH /api/auth/profile
 * Cập nhật tên — chỉ user đã đăng nhập
 * Body: { name }
 */
router.patch('/profile', authenticate, async (req, res, next) => {
  try {
    const db = require('../../config/db');
    const { name } = req.body;
    if (!name || name.trim().length < 2) {
      return res.status(400).json({ error: 'Tên phải có ít nhất 2 ký tự' });
    }
    await db.query('UPDATE users SET name = ? WHERE id = ?', [name.trim(), req.user.id]);
    const { rows } = await db.query(
      'SELECT id, name, email, role, created_at FROM users WHERE id = ?',
      [req.user.id]
    );
    return res.json(rows[0]);
  } catch (err) { next(err); }
});

/**
 * POST /api/auth/change-password
 * Đổi mật khẩu — chỉ user đã đăng nhập
 * Body: { currentPassword, newPassword }
 */
router.post('/change-password', authenticate, async (req, res, next) => {
  try {
    const db   = require('../../config/db');
    const bcrypt = require('bcryptjs');
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      return res.status(400).json({ error: 'Vui lòng nhập đầy đủ thông tin' });
    }
    if (newPassword.length < 6) {
      return res.status(400).json({ error: 'Mật khẩu mới phải có ít nhất 6 ký tự' });
    }

    const { rows } = await db.query('SELECT password_hash FROM users WHERE id = ?', [req.user.id]);
    const valid = await bcrypt.compare(currentPassword, rows[0].password_hash);
    if (!valid) {
      return res.status(401).json({ error: 'Mật khẩu hiện tại không đúng' });
    }

    const newHash = await bcrypt.hash(newPassword, 10);
    await db.query('UPDATE users SET password_hash = ? WHERE id = ?', [newHash, req.user.id]);
    return res.json({ message: 'Đổi mật khẩu thành công!' });
  } catch (err) { next(err); }
});

module.exports = router;
