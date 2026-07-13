const express = require('express');
const router = express.Router();
const db = require('../../config/db');
const authenticate = require('../../middlewares/authenticate');
const authorize = require('../../middlewares/authorize');

// Earn rate: 1 point per 1000 VND spent
const EARN_RATE = 1 / 1000;
// Redeem rate: 100 points = 10,000 VND
const REDEEM_RATE = 100; // points per 10k

/**
 * GET /api/loyalty/balance
 * Lấy số điểm hiện tại + hạng thành viên
 */
router.get('/balance', authenticate, authorize('customer'), async (req, res, next) => {
  try {
    const customerId = req.user.id;
    const { rows } = await db.query(
      'SELECT COALESCE(SUM(points), 0) AS total FROM loyalty_points WHERE customer_id = ?',
      [customerId]
    );
    const total = Math.max(0, Number(rows[0].total));

    // Hạng thành viên
    let tier, nextTier, nextPoints;
    if (total < 500) {
      tier = 'Đồng'; nextTier = 'Bạc'; nextPoints = 500;
    } else if (total < 2000) {
      tier = 'Bạc'; nextTier = 'Vàng'; nextPoints = 2000;
    } else if (total < 5000) {
      tier = 'Vàng'; nextTier = 'Kim cương'; nextPoints = 5000;
    } else {
      tier = 'Kim cương'; nextTier = null; nextPoints = null;
    }

    return res.json({
      points: total,
      tier,
      next_tier: nextTier,
      next_tier_points: nextPoints,
      progress_percent: nextPoints ? Math.min(100, Math.round((total / nextPoints) * 100)) : 100,
    });
  } catch (err) { next(err); }
});

/**
 * GET /api/loyalty/history
 * Lịch sử tích/tiêu điểm
 */
router.get('/history', authenticate, authorize('customer'), async (req, res, next) => {
  try {
    const { rows } = await db.query(
      'SELECT * FROM loyalty_points WHERE customer_id = ? ORDER BY created_at DESC LIMIT 50',
      [req.user.id]
    );
    return res.json(rows);
  } catch (err) { next(err); }
});

/**
 * POST /api/loyalty/redeem
 * Đổi điểm lấy voucher (100 điểm = 10k VND giảm giá)
 * Body: { points }
 */
router.post('/redeem', authenticate, authorize('customer'), async (req, res, next) => {
  try {
    const customerId = req.user.id;
    const pointsToRedeem = Math.floor(Number(req.body.points) || 0);

    if (pointsToRedeem < REDEEM_RATE) {
      return res.status(400).json({ error: `Cần tối thiểu ${REDEEM_RATE} điểm để đổi (= 10.000đ)` });
    }

    // Kiểm tra số dư
    const { rows } = await db.query(
      'SELECT COALESCE(SUM(points), 0) AS total FROM loyalty_points WHERE customer_id = ?',
      [customerId]
    );
    const balance = Math.max(0, Number(rows[0].total));

    if (balance < pointsToRedeem) {
      return res.status(400).json({ error: `Bạn chỉ có ${balance} điểm, không đủ để đổi` });
    }

    const discountAmount = Math.floor(pointsToRedeem / REDEEM_RATE) * 10000;

    await db.query(
      'INSERT INTO loyalty_points (customer_id, points, description) VALUES (?, ?, ?)',
      [customerId, -pointsToRedeem, `Đổi ${pointsToRedeem} điểm lấy voucher ${discountAmount.toLocaleString('vi-VN')}đ`]
    );

    return res.json({
      redeemed_points: pointsToRedeem,
      discount_amount: discountAmount,
      remaining_points: balance - pointsToRedeem,
      message: `Đổi thành công! Bạn được giảm ${discountAmount.toLocaleString('vi-VN')}đ cho đơn tiếp theo.`,
    });
  } catch (err) { next(err); }
});

/**
 * POST /api/loyalty/earn  (internal — called after order completed)
 * Cộng điểm cho customer khi đơn hoàn thành
 */
async function earnPoints(customerId, orderId, totalAmount) {
  try {
    const points = Math.floor(Number(totalAmount) * EARN_RATE);
    if (points <= 0) return;
    await db.query(
      'INSERT INTO loyalty_points (customer_id, order_id, points, description) VALUES (?, ?, ?, ?)',
      [customerId, orderId, points, `Tích điểm từ đơn #${orderId} (${Number(totalAmount).toLocaleString('vi-VN')}đ)`]
    );
  } catch (e) {
    console.error('[Loyalty] earnPoints error:', e.message);
  }
}

module.exports = router;
module.exports.earnPoints = earnPoints;
