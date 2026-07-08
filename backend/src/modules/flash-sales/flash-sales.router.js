const express = require('express');
const router = express.Router();
const db = require('../../config/db');
const authenticate = require('../../middlewares/authenticate');
const authorize = require('../../middlewares/authorize');

/**
 * GET /api/flash-sales/active
 * Lấy tất cả flash sale đang diễn ra — public
 */
router.get('/active', async (_req, res, next) => {
  try {
    const now = new Date();
    const { rows } = await db.query(
      `SELECT fs.*, mi.name AS item_name, mi.price AS original_price,
              r.id AS restaurant_id, r.name AS restaurant_name
       FROM flash_sales fs
       JOIN menu_items mi ON mi.id = fs.menu_item_id
       JOIN restaurants r  ON r.id  = mi.restaurant_id
       WHERE fs.start_time <= ? AND fs.end_time >= ? AND mi.is_available = 1 AND r.status = 'active'
       ORDER BY fs.discount_percent DESC`,
      [now, now]
    );

    const data = rows.map(r => ({
      ...r,
      sale_price: Math.round(Number(r.original_price) * (1 - r.discount_percent / 100)),
      ends_at: r.end_time,
    }));

    return res.json(data);
  } catch (err) { next(err); }
});

/**
 * GET /api/flash-sales/item/:menuItemId
 * Kiểm tra 1 món có đang flash sale không — public
 */
router.get('/item/:menuItemId', async (req, res, next) => {
  try {
    const now = new Date();
    const { rows } = await db.query(
      `SELECT * FROM flash_sales
       WHERE menu_item_id = ? AND start_time <= ? AND end_time >= ?
       ORDER BY discount_percent DESC LIMIT 1`,
      [req.params.menuItemId, now, now]
    );
    if (!rows.length) return res.json(null);
    return res.json(rows[0]);
  } catch (err) { next(err); }
});

/**
 * POST /api/flash-sales
 * Admin tạo flash sale mới
 * Body: { menu_item_id, discount_percent, start_time, end_time }
 */
router.post('/', authenticate, authorize('admin'), async (req, res, next) => {
  try {
    const { menu_item_id, discount_percent, start_time, end_time } = req.body;

    if (!menu_item_id || !discount_percent || !start_time || !end_time) {
      return res.status(400).json({ error: 'Thiếu thông tin bắt buộc' });
    }
    if (discount_percent < 1 || discount_percent > 99) {
      return res.status(400).json({ error: 'discount_percent phải từ 1 đến 99' });
    }
    if (new Date(end_time) <= new Date(start_time)) {
      return res.status(400).json({ error: 'end_time phải sau start_time' });
    }

    // Kiểm tra menu item tồn tại
    const { rows: items } = await db.query(
      'SELECT id, name, price FROM menu_items WHERE id = ?',
      [menu_item_id]
    );
    if (!items.length) {
      return res.status(404).json({ error: 'Món ăn không tồn tại' });
    }

    const { rows: result } = await db.query(
      'INSERT INTO flash_sales (menu_item_id, discount_percent, start_time, end_time, created_by) VALUES (?, ?, ?, ?, ?)',
      [menu_item_id, discount_percent, new Date(start_time), new Date(end_time), req.user.id]
    );

    return res.status(201).json({
      id: result.insertId,
      menu_item_id,
      item_name: items[0].name,
      original_price: items[0].price,
      sale_price: Math.round(Number(items[0].price) * (1 - discount_percent / 100)),
      discount_percent,
      start_time,
      end_time,
    });
  } catch (err) { next(err); }
});

/**
 * DELETE /api/flash-sales/:id
 * Admin xóa flash sale
 */
router.delete('/:id', authenticate, authorize('admin'), async (req, res, next) => {
  try {
    await db.query('DELETE FROM flash_sales WHERE id = ?', [req.params.id]);
    return res.status(204).send();
  } catch (err) { next(err); }
});

/**
 * Helper: Lấy flash sale giảm giá tốt nhất cho một món
 */
async function getActiveSaleForItem(menuItemId) {
  try {
    const now = new Date();
    const { rows } = await db.query(
      `SELECT * FROM flash_sales
       WHERE menu_item_id = ? AND start_time <= ? AND end_time >= ?
       ORDER BY discount_percent DESC LIMIT 1`,
      [menuItemId, now, now]
    );
    return rows[0] || null;
  } catch { return null; }
}

module.exports = router;
module.exports.getActiveSaleForItem = getActiveSaleForItem;
