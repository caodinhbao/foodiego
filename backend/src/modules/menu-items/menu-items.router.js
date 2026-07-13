const express = require('express');

const router = express.Router({
  mergeParams: true, // Lấy restaurantId từ router cha
});

const routerItem = express.Router();

const menuItemsService = require('./menu-items.service');
const authenticate = require('../../middlewares/authenticate');
const authorize = require('../../middlewares/authorize');

/**
 * POST /api/restaurants/:restaurantId/menu-items
 * Thêm món mới
 * Chỉ Restaurant Owner
 */
router.post(
  '/',
  authenticate,
  authorize('restaurant'),
  async (req, res, next) => {
    try {
      // TODO: Validate request body

      const item = await menuItemsService.createMenuItem(
        req.params.restaurantId,
        req.user.id,
        req.body
      );

      return res.status(201).json(item);
    } catch (err) {
      next(err);
    }
  }
);

/**
 * GET /api/restaurants/:restaurantId/menu-items
 * Lấy danh sách món của nhà hàng
 */
router.get('/', async (req, res, next) => {
  try {
    const items = await menuItemsService.getMenuByRestaurant(
      req.params.restaurantId
    );

    return res.status(200).json(items);
  } catch (err) {
    next(err);
  }
});

/**
 * PATCH /api/menu-items/:id
 * Cập nhật món ăn
 */
routerItem.patch(
  '/:id',
  authenticate,
  authorize('restaurant'),
  async (req, res, next) => {
    try {
      const item = await menuItemsService.updateMenuItem(
        req.params.id,
        req.user.id,
        req.body
      );

      return res.status(200).json(item);
    } catch (err) {
      next(err);
    }
  }
);

/**
 * DELETE /api/menu-items/:id
 * Xóa mềm món ăn
 */
routerItem.delete(
  '/:id',
  authenticate,
  authorize('restaurant'),
  async (req, res, next) => {
    try {
      await menuItemsService.deleteMenuItem(
        req.params.id,
        req.user.id
      );

      return res.status(204).send();
    } catch (err) {
      next(err);
    }
  }
);

/**
 * GET /api/menu-items/search?q=<keyword>
 * Tìm kiếm món ăn
 */
routerItem.get('/search', async (req, res, next) => {
  try {
    const db = require('../../config/db');

    const keyword = req.query.q?.trim();

    if (!keyword || keyword.length < 2) {
      return res.status(400).json({
        error: 'Từ khóa tìm kiếm phải có ít nhất 2 ký tự',
      });
    }

    const { rows } = await db.query(
      `
        SELECT
          mi.id,
          mi.name,
          mi.description,
          mi.price,
          mi.is_available,
          r.id AS restaurant_id,
          r.name AS restaurant_name,
          r.address AS restaurant_address
        FROM menu_items mi
        JOIN restaurants r
          ON r.id = mi.restaurant_id
        WHERE mi.name LIKE ?
          AND mi.is_available = 1
          AND r.status = 'active'
        ORDER BY mi.name ASC
        LIMIT 30
      `,
      [`%${keyword}%`]
    );

    return res.json(rows);
  } catch (err) {
    next(err);
  }
});

module.exports = {
  menuItemsByRestaurantRouter: router,
  menuItemsRouter: routerItem,
};
