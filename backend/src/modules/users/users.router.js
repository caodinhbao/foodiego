const express = require('express');
const router = express.Router();
const usersService = require('./users.service');
const authenticate = require('../../middlewares/authenticate');
const authorize = require('../../middlewares/authorize');

/**
 * GET /api/users
 * Chỉ Admin được gọi
 *
 * TODO (Thành viên A - Ngày 3):
 *  1. Dùng authenticate + authorize('admin')
 *  2. Gọi usersService.getAllUsers()
 *  3. Trả 200 + danh sách users
 */
router.get('/', authenticate, authorize('admin'), async (req, res, next) => {
  try {
    // TODO: implement
    const users = await usersService.getAllUsers();
    return res.status(200).json(users);
  } catch (err) {
    next(err);
  }
});

/**
 * PATCH /api/users/:id/role
 * Body: { role: 'customer' | 'restaurant' | 'admin' }
 * Chỉ Admin được gọi
 *
 * TODO (Thành viên A - Ngày 3):
 *  1. Validate role trong body
 *  2. Gọi usersService.updateUserRole(id, role)
 *  3. Trả 200 + user đã cập nhật
 */
router.patch('/:id/role', authenticate, authorize('admin'), async (req, res, next) => {
  try {
    // TODO: implement
    const { id } = req.params;
    const { role } = req.body;
    const validRoles = ['customer', 'restaurant', 'admin'];
    if (!role || !validRoles.includes(role)) {
      return res.status(400).json({ error: `role must be one of: ${validRoles.join(', ')}` });
    }
    const user = await usersService.updateUserRole(id, role);
    return res.status(200).json(user);
  } catch (err) {
    next(err);
  }
});

module.exports = router;
