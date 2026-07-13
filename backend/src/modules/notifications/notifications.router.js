const express = require('express');
const router = express.Router();
const db = require('../../config/db');
const jwt = require('jsonwebtoken');

// SSE clients: Map<restaurantId, Set<res>>
const sseClients = new Map();

/**
 * GET /api/notifications/stream?restaurant_id=X&token=JWT
 * SSE endpoint — nhà hàng đăng ký nhận thông báo đơn mới
 * Note: EventSource không hỗ trợ custom headers nên dùng token qua query param
 */
router.get('/stream', async (req, res) => {
  // Xác thực token từ query param
  const token = req.query.token || req.headers.authorization?.replace('Bearer ', '');
  if (!token) return res.status(401).json({ error: 'No token provided' });

  let user;
  try {
    user = jwt.verify(token, process.env.JWT_SECRET);
  } catch {
    return res.status(401).json({ error: 'Invalid token' });
  }

  if (user.role !== 'restaurant' && user.role !== 'admin') {
    return res.status(403).json({ error: 'Forbidden' });
  }

  // Lấy restaurant_id của owner này
  let restaurantId = req.query.restaurant_id;
  if (!restaurantId && user.role === 'restaurant') {
    try {
      const { rows } = await db.query(
        'SELECT id FROM restaurants WHERE owner_id = ? LIMIT 1', [user.id]
      );
      if (rows.length) restaurantId = rows[0].id;
    } catch (_) { /* eslint-disable-line no-empty */ }
  }

  if (!restaurantId) {
    return res.status(400).json({ error: 'restaurant_id required' });
  }

  // SSE headers
  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('Connection', 'keep-alive');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.flushHeaders();

  // Send initial connected event
  res.write(`event: connected\ndata: ${JSON.stringify({ message: 'Connected', restaurant_id: restaurantId })}\n\n`);

  // Register client
  const rid = String(restaurantId);
  if (!sseClients.has(rid)) sseClients.set(rid, new Set());
  sseClients.get(rid).add(res);

  // Heartbeat every 25s to keep connection alive
  const heartbeat = setInterval(() => {
    res.write(': heartbeat\n\n');
  }, 25000);

  // Cleanup on disconnect
  req.on('close', () => {
    clearInterval(heartbeat);
    sseClients.get(rid)?.delete(res);
    if (sseClients.get(rid)?.size === 0) sseClients.delete(rid);
  });
});

/**
 * Broadcast new order event to all SSE clients of a restaurant
 * Called from orders.service.js after order created
 */
function notifyNewOrder(restaurantId, order) {
  const rid = String(restaurantId);
  const clients = sseClients.get(rid);
  if (!clients || clients.size === 0) return;

  const payload = JSON.stringify({
    order_id: order.id,
    total: order.total_amount,
    items_count: order.items?.length || 0,
    created_at: order.created_at,
  });

  clients.forEach(client => {
    try {
      client.write(`event: new_order\ndata: ${payload}\n\n`);
    } catch (_) {
      clients.delete(client);
    }
  });
}

module.exports = router;
module.exports.notifyNewOrder = notifyNewOrder;
