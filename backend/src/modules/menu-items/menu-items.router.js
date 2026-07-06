const express = require('express');
const router = express.Router({ mergeParams: true }); // để lấy :restaurantId từ parent
const menuItemsService = require('./menu-items.service');
const authenticate = require('../../middlewares/authenticate');
const authorize = require('../../middlewares/authorize');

/**
 * POST /api/restaurants/:restaurantId/menu-items
 * Thêm món mới — chỉ Restaurant Owner
 * Body: { name, description, price, is_available? }
 *
 * TODO (Thành viên B - Ngày 2):
 *  1. authenticate + authorize('restaurant')
 *  2. Validate name, price bắt buộc
 *  3. Gọi service.createMenuItem(restaurantId, req.user.id, body)
 *  4. Trả 201 + item
 */
router.post('/', authenticate, authorize('restaurant'), async (req, res, next) => {
  try {
    // TODO: implement
    const item = await menuItemsService.createMenuItem(req.params.restaurantId, req.user.id, req.body);
    return res.status(201).json(item);
  } catch (err) {
    next(err);
  }
});

/**
 * GET /api/restaurants/:restaurantId/menu-items
 * Xem menu của nhà hàng — public
 *
 * TODO (Thành viên B - Ngày 2):
 *  1. Gọi service.getMenuByRestaurant(restaurantId)
 *  2. Trả 200 + danh sách món
 */
router.get('/', async (req, res, next) => {
  try {
    // TODO: implement
    const items = await menuItemsService.getMenuByRestaurant(req.params.restaurantId);
    return res.status(200).json(items);
  } catch (err) {
    next(err);
  }
});

/**
 * PATCH /api/menu-items/:id  (mount riêng ở app.js)
 * Cập nhật món — chỉ Owner
 */
const routerItem = express.Router();

routerItem.patch('/:id', authenticate, authorize('restaurant'), async (req, res, next) => {
  try {
    // TODO: implement
    const item = await menuItemsService.updateMenuItem(req.params.id, req.user.id, req.body);
    return res.status(200).json(item);
  } catch (err) {
    next(err);
  }
});

/**
 * DELETE /api/menu-items/:id
 * Xóa món (soft delete) — chỉ Owner
 */
routerItem.delete('/:id', authenticate, authorize('restaurant'), async (req, res, next) => {
  try {
    // TODO: implement
    await menuItemsService.deleteMenuItem(req.params.id, req.user.id);
    return res.status(204).send();
  } catch (err) {
    next(err);
  }
});

/**
 * GET /api/menu-items/search?q=<keyword>
 * Tìm kiếm món ăn xuyên tất cả nhà hàng — public
 */
routerItem.get('/search', async (req, res, next) => {
  try {
    const db = require('../../config/db');
    const q = req.query.q?.trim();
    if (!q || q.length < 2) {
      return res.status(400).json({ error: 'Từ khóa tìm kiếm phải có ít nhất 2 ký tự' });
    }
    const { rows } = await db.query(
      `SELECT mi.id, mi.name, mi.description, mi.price, mi.is_available,
              r.id AS restaurant_id, r.name AS restaurant_name, r.address AS restaurant_address
       FROM menu_items mi
       JOIN restaurants r ON r.id = mi.restaurant_id
       WHERE mi.name LIKE ? AND mi.is_available = 1 AND r.status = 'active'
       ORDER BY mi.name ASC
       LIMIT 30`,
      [`%${q}%`]
    );
    return res.json(rows);
  } catch (err) { next(err); }
});

module.exports = { menuItemsByRestaurantRouter: router, menuItemsRouter: routerItem };
