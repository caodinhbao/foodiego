const express = require('express');
const router = express.Router();
const ordersService = require('./orders.service');
const authenticate = require('../../middlewares/authenticate');
const authorize = require('../../middlewares/authorize');

/**
 * POST /api/orders
 * Tạo đơn hàng mới — chỉ Customer
 * Body: { restaurant_id, items: [{menu_item_id, quantity}], distance_km }
 */
router.post('/', authenticate, authorize('customer'), async (req, res, next) => {
  try {
    const { restaurant_id, items } = req.body;
    if (!restaurant_id || !items || items.length === 0) {
      return res.status(400).json({ error: 'restaurant_id and items are required' });
    }
    const order = await ordersService.createOrder(req.user.id, req.body);
    return res.status(201).json(order);
  } catch (err) {
    next(err);
  }
});

/**
 * GET /api/orders/my
 * Danh sách đơn của customer đang đăng nhập
 *
 * QUAN TRỌNG: route này phải đặt TRƯỚC /:id để không bị overridden
 */
router.get('/my', authenticate, authorize('customer'), async (req, res, next) => {
  try {
    const orders = await ordersService.getMyOrders(req.user.id);
    return res.status(200).json(orders);
  } catch (err) {
    next(err);
  }
});

/**
 * GET /api/orders/:id
 * Chi tiết đơn hàng — Customer (đơn của mình) hoặc Owner (đơn nhà hàng mình)
 */
router.get('/:id', authenticate, async (req, res, next) => {
  try {
    const order = await ordersService.getOrderById(req.params.id, req.user);
    return res.status(200).json(order);
  } catch (err) {
    next(err);
  }
});

/**
 * PATCH /api/orders/:id/status
 * Cập nhật trạng thái đơn — chỉ Restaurant Owner
 * Body: { status: 'accepted' | 'preparing' | 'delivering' | 'completed' | 'cancelled' }
 */
router.patch('/:id/status', authenticate, authorize('restaurant'), async (req, res, next) => {
  try {
    const { status } = req.body;
    if (!status) {
      return res.status(400).json({ error: 'status is required' });
    }
    const order = await ordersService.updateOrderStatus(req.params.id, req.user.id, status);
    return res.status(200).json(order);
  } catch (err) {
    next(err);
  }
});

/**
 * GET /api/orders/:id/timeline
 * Lịch sử trạng thái đơn — Feature 2: Order Timeline
 */
router.get('/:id/timeline', authenticate, async (req, res, next) => {
  try {
    const orderId = req.params.id;
    // Kiểm tra order tồn tại + quyền
    const { rows: orderRows } = await require('../../config/db').query(
      'SELECT * FROM orders WHERE id = ?', [orderId]
    );
    if (!orderRows.length) return res.status(404).json({ error: 'Order not found' });

    const order = orderRows[0];
    if (req.user.role === 'customer' && order.customer_id !== req.user.id) {
      return res.status(403).json({ error: 'Forbidden' });
    }

    const { rows: logs } = await require('../../config/db').query(
      'SELECT status, changed_at FROM order_status_logs WHERE order_id = ? ORDER BY changed_at ASC',
      [orderId]
    );
    return res.json({ order_id: Number(orderId), timeline: logs });
  } catch (err) { next(err); }
});

/**
 * POST /api/orders/apply-voucher
 * Kiểm tra và áp dụng mã giảm giá
 * Body: { code, total_amount }
 */
router.post('/apply-voucher', authenticate, authorize('customer'), async (req, res, next) => {
  try {
    const { code, total_amount } = req.body;
    if (!code) return res.status(400).json({ error: 'Vui lòng nhập mã giảm giá' });

    // Danh sách voucher (có thể chuyển sang DB sau)
    const VOUCHERS = {
      'FOODIE10': { discount: 10, type: 'percent', desc: 'Giảm 10%',       min: 50000  },
      'FOODIE20': { discount: 20, type: 'percent', desc: 'Giảm 20%',       min: 100000 },
      'SHIP0':    { discount: 15000, type: 'fixed', desc: 'Miễn phí giao', min: 0      },
      'NEWUSER':  { discount: 30000, type: 'fixed', desc: 'Giảm 30.000đ',  min: 80000  },
      'WELCOME':  { discount: 15, type: 'percent', desc: 'Giảm 15%',       min: 70000  },
    };

    const voucher = VOUCHERS[code.toUpperCase()];
    if (!voucher) return res.status(404).json({ error: 'Mã giảm giá không hợp lệ' });
    if (total_amount < voucher.min) {
      return res.status(400).json({
        error: `Đơn tối thiểu ${new Intl.NumberFormat('vi-VN').format(voucher.min)}đ để dùng mã này`
      });
    }

    const discountAmount = voucher.type === 'percent'
      ? Math.round(total_amount * voucher.discount / 100)
      : voucher.discount;

    return res.json({
      code: code.toUpperCase(),
      desc: voucher.desc,
      discount_amount: discountAmount,
      final_amount: Math.max(0, total_amount - discountAmount),
    });
  } catch (err) { next(err); }
});

module.exports = router;
