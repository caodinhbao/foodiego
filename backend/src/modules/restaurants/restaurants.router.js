const express = require('express');
const router = express.Router();

const restaurantsService = require('./restaurants.service');
const authenticate = require('../../middlewares/authenticate');
const authorize = require('../../middlewares/authorize');

/**
 * POST /api/restaurants
 * Tạo nhà hàng mới
 * Chỉ Restaurant Owner được phép tạo
 */
router.post(
  '/',
  authenticate,
  authorize('restaurant'),
  async (req, res, next) => {
    try {
      const restaurant = await restaurantsService.createRestaurant(
        req.user.id,
        req.body
      );

      return res.status(201).json(restaurant);
    } catch (err) {
      next(err);
    }
  }
);

/**
 * GET /api/restaurants
 * Lấy danh sách tất cả nhà hàng
 * Public
 */
router.get('/', async (req, res, next) => {
  try {
    const restaurants = await restaurantsService.getAllRestaurants(req.query.search);

    return res.status(200).json(restaurants);
  } catch (err) {
    next(err);
  }
});

/**
 * GET /api/restaurants/:id
 * Lấy thông tin chi tiết nhà hàng
 */
router.get('/:id', async (req, res, next) => {
  try {
    const restaurant = await restaurantsService.getRestaurantById(
      req.params.id
    );

    return res.status(200).json(restaurant);
  } catch (err) {
    next(err);
  }
});

/**
 * PATCH /api/restaurants/:id
 * Cập nhật thông tin nhà hàng
 * Chỉ owner của nhà hàng
 */
router.patch(
  '/:id',
  authenticate,
  authorize('restaurant'),
  async (req, res, next) => {
    try {
      const restaurant = await restaurantsService.updateRestaurant(
        req.params.id,
        req.user.id,
        req.body
      );

      return res.status(200).json(restaurant);
    } catch (err) {
      next(err);
    }
  }
);

/**
 * GET /api/restaurants/:id/orders
 * Lấy danh sách đơn hàng của nhà hàng
 */
router.get(
  '/:id/orders',
  authenticate,
  authorize('restaurant', 'admin'),
  async (req, res, next) => {
    try {
      const db = require('../../config/db');
      const restaurantId = req.params.id;

      // Kiểm tra quyền owner
      if (req.user.role === 'restaurant') {
        const { rows: restaurant } = await db.query(
          'SELECT owner_id FROM restaurants WHERE id = ?',
          [restaurantId]
        );

        if (
          !restaurant.length ||
          restaurant[0].owner_id !== req.user.id
        ) {
          return res
            .status(403)
            .json({ error: 'Forbidden: not the restaurant owner' });
        }
      }

      const { rows: orders } = await db.query(
        `
        SELECT *
        FROM orders
        WHERE restaurant_id = ?
        ORDER BY created_at DESC
      `,
        [restaurantId]
      );

      // Lấy danh sách món của từng order
      for (const order of orders) {
        const { rows: items } = await db.query(
          `
          SELECT
            oi.*,
            mi.name AS item_name
          FROM order_items oi
          JOIN menu_items mi
            ON mi.id = oi.menu_item_id
          WHERE oi.order_id = ?
        `,
          [order.id]
        );

        order.items = items;
      }

      return res.status(200).json(orders);
    } catch (err) {
      next(err);
    }
  }
);

/**
 * GET /api/restaurants/:id/reviews
 * Lấy danh sách đánh giá
 */
router.get('/:id/reviews', async (req, res, next) => {
  try {
    const db = require('../../config/db');

    const { rows: reviews } = await db.query(
      `
      SELECT
        r.id,
        r.rating,
        r.comment,
        r.created_at,
        u.name AS customer_name
      FROM reviews r
      JOIN users u
        ON u.id = r.customer_id
      WHERE r.restaurant_id = ?
      ORDER BY r.created_at DESC
    `,
      [req.params.id]
    );

    const avg =
      reviews.length > 0
        ? (
          reviews.reduce((sum, item) => sum + item.rating, 0) /
          reviews.length
        ).toFixed(1)
        : null;

    return res.json({
      reviews,
      avg_rating: avg,
      total: reviews.length,
    });
  } catch (err) {
    next(err);
  }
});

/**
 * POST /api/restaurants/:id/reviews
 * Customer đánh giá nhà hàng
 */
router.post(
  '/:id/reviews',
  authenticate,
  authorize('customer'),
  async (req, res, next) => {
    try {
      const db = require('../../config/db');

      const { rating, comment } = req.body;
      const restaurantId = req.params.id;
      const customerId = req.user.id;

      if (!rating || rating < 1 || rating > 5) {
        return res.status(400).json({
          error: 'Rating phải từ 1 đến 5',
        });
      }

      // Kiểm tra đã từng hoàn thành đơn hàng
      const { rows: orders } = await db.query(
        `
        SELECT id
        FROM orders
        WHERE customer_id = ?
          AND restaurant_id = ?
          AND status = 'completed'
        LIMIT 1
      `,
        [customerId, restaurantId]
      );

      if (!orders.length) {
        return res.status(403).json({
          error:
            'Bạn cần hoàn thành đơn hàng tại đây trước khi đánh giá',
        });
      }

      // Kiểm tra đã đánh giá hay chưa
      const { rows: existing } = await db.query(
        `
        SELECT id
        FROM reviews
        WHERE customer_id = ?
          AND restaurant_id = ?
      `,
        [customerId, restaurantId]
      );

      if (existing.length) {
        await db.query(
          `
          UPDATE reviews
          SET rating = ?, comment = ?
          WHERE customer_id = ?
            AND restaurant_id = ?
        `,
          [
            rating,
            comment || null,
            customerId,
            restaurantId,
          ]
        );
      } else {
        await db.query(
          `
          INSERT INTO reviews
          (customer_id, restaurant_id, rating, comment)
          VALUES (?, ?, ?, ?)
        `,
          [
            customerId,
            restaurantId,
            rating,
            comment || null,
          ]
        );
      }

      return res.status(201).json({
        message: 'Đánh giá thành công!',
      });
    } catch (err) {
      next(err);
    }
  }
);

/**
 * GET /api/restaurants/:id/revenue
 * Thống kê doanh thu 7 ngày gần nhất
 */
router.get(
  '/:id/revenue',
  authenticate,
  authorize('restaurant', 'admin'),
  async (req, res, next) => {
    try {
      const db = require('../../config/db');
      const restaurantId = req.params.id;

      if (req.user.role === 'restaurant') {
        const { rows: restaurant } = await db.query(
          'SELECT owner_id FROM restaurants WHERE id = ?',
          [restaurantId]
        );

        if (
          !restaurant.length ||
          restaurant[0].owner_id !== req.user.id
        ) {
          return res.status(403).json({
            error: 'Forbidden',
          });
        }
      }

      const { rows } = await db.query(
        `
        SELECT
          DATE(created_at) AS date,
          COUNT(*) AS total_orders,
          SUM(
            CASE
              WHEN status = 'completed'
              THEN total_amount
              ELSE 0
            END
          ) AS revenue
        FROM orders
        WHERE restaurant_id = ?
          AND created_at >= DATE_SUB(NOW(), INTERVAL 7 DAY)
        GROUP BY DATE(created_at)
        ORDER BY date ASC
      `,
        [restaurantId]
      );

      return res.json(rows);
    } catch (err) {
      next(err);
    }
  }
);

module.exports = router;
