const express = require('express');
const router = express.Router();
const ordersService = require('./orders.service');
const authenticate = require('../../middlewares/authenticate');
const authorize = require('../../middlewares/authorize');

/**
 * POST /api/orders
 * Tạo đơn hàng mới — chỉ Customer
 * Body: { restaurant_id, items: [{menu_item_id, quantity}], distance_km }
 *
 * TODO (Thành viên C - Ngày 3):
 *  1. authenticate + authorize('customer')
 *  2. Validate: restaurant_id, items bắt buộc
 *  3. Gọi ordersService.createOrder(req.user.id, body)
 *  4. Trả 201 + order
 */
router.post('/', authenticate, authorize('customer'), async (req, res, next) => {
  try {
    // TODO: implement
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
 * TODO (Thành viên C - Ngày 3):
 *  1. authenticate + authorize('customer')
 *  2. Gọi ordersService.getMyOrders(req.user.id)
 *  3. Trả 200 + list
 *
 * QUAN TRỌNG: route này phải đặt TRƯỚC /:id để không bị overridden
 */
router.get('/my', authenticate, authorize('customer'), async (req, res, next) => {
  try {
    // TODO: implement
    const orders = await ordersService.getMyOrders(req.user.id);
    return res.status(200).json(orders);
  } catch (err) {
    next(err);
  }
});

/**
 * GET /api/orders/:id
 * Chi tiết đơn hàng — Customer (đơn của mình) hoặc Owner (đơn nhà hàng mình)
 *
 * TODO (Thành viên C - Ngày 3):
 *  1. authenticate
 *  2. Gọi ordersService.getOrderById(id, req.user)
 *  3. Trả 200 + order detail
 */
router.get('/:id', authenticate, async (req, res, next) => {
  try {
    // TODO: implement
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
 *
 * TODO (Thành viên C - Ngày 3):
 *  1. authenticate + authorize('restaurant')
 *  2. Validate status hợp lệ
 *  3. Gọi ordersService.updateOrderStatus(id, req.user.id, status)
 *  4. Trả 200 + order cập nhật
 */
router.patch('/:id/status', authenticate, authorize('restaurant'), async (req, res, next) => {
  try {
    // TODO: implement
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

module.exports = router;
