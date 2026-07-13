const express = require('express');
const router = express.Router();
const db = require('../../config/db');
const authenticate = require('../../middlewares/authenticate');
const authorize = require('../../middlewares/authorize');

/**
 * GET /api/admin/analytics
 * Tổng quan toàn hệ thống — chỉ admin
 */
router.get('/analytics', authenticate, authorize('admin'), async (req, res, next) => {
  try {
    const [
      { rows: totalOrders },
      { rows: revenue },
      { rows: newUsers7d },
      { rows: newOrders7d },
      { rows: ordersByStatus },
      { rows: daily7d },
    ] = await Promise.all([
      db.query('SELECT COUNT(*) AS total FROM orders'),
      db.query('SELECT COALESCE(SUM(total_amount),0) AS total FROM orders WHERE status = \'completed\''),
      db.query('SELECT COUNT(*) AS total FROM users WHERE created_at >= DATE_SUB(NOW(), INTERVAL 7 DAY)'),
      db.query('SELECT COUNT(*) AS total FROM orders WHERE created_at >= DATE_SUB(NOW(), INTERVAL 7 DAY)'),
      db.query('SELECT status, COUNT(*) AS count FROM orders GROUP BY status'),
      db.query(`SELECT DATE(created_at) AS date, COUNT(*) AS orders,
                  SUM(CASE WHEN status = 'completed' THEN total_amount ELSE 0 END) AS revenue
                FROM orders WHERE created_at >= DATE_SUB(NOW(), INTERVAL 7 DAY)
                GROUP BY DATE(created_at) ORDER BY date ASC`),
    ]);

    return res.json({
      total_orders: Number(totalOrders[0].total),
      total_revenue: Number(revenue[0].total),
      new_users_7d: Number(newUsers7d[0].total),
      new_orders_7d: Number(newOrders7d[0].total),
      orders_by_status: ordersByStatus,
      daily_stats_7d: daily7d,
    });
  } catch (err) { next(err); }
});

/**
 * GET /api/admin/top-restaurants
 * Top 5 nhà hàng doanh thu cao nhất
 */
router.get('/top-restaurants', authenticate, authorize('admin'), async (req, res, next) => {
  try {
    const { rows } = await db.query(
      `SELECT r.id, r.name, r.address,
              COUNT(o.id) AS total_orders,
              COALESCE(SUM(CASE WHEN o.status = 'completed' THEN o.total_amount ELSE 0 END), 0) AS revenue
       FROM restaurants r
       LEFT JOIN orders o ON o.restaurant_id = r.id
       GROUP BY r.id, r.name, r.address
       ORDER BY revenue DESC
       LIMIT 5`
    );
    return res.json(rows);
  } catch (err) { next(err); }
});

/**
 * GET /api/admin/top-items
 * Top 5 món ăn bán chạy nhất
 */
router.get('/top-items', authenticate, authorize('admin'), async (req, res, next) => {
  try {
    const { rows } = await db.query(
      `SELECT mi.id, mi.name, mi.price, r.name AS restaurant_name,
              SUM(oi.quantity) AS total_sold,
              COUNT(DISTINCT oi.order_id) AS order_count
       FROM order_items oi
       JOIN menu_items mi ON mi.id = oi.menu_item_id
       JOIN restaurants r  ON r.id  = mi.restaurant_id
       GROUP BY mi.id, mi.name, mi.price, r.name
       ORDER BY total_sold DESC
       LIMIT 5`
    );
    return res.json(rows);
  } catch (err) { next(err); }
});

/**
 * GET /api/admin/users-stats
 * Thống kê users theo role
 */
router.get('/users-stats', authenticate, authorize('admin'), async (req, res, next) => {
  try {
    const { rows } = await db.query(
      'SELECT role, COUNT(*) AS count FROM users GROUP BY role'
    );
    return res.json(rows);
  } catch (err) { next(err); }
});

module.exports = router;
