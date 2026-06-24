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

module.exports = router;
