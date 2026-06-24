require('dotenv').config();
const express = require('express');
const cors = require('cors');

const app = express();

// ── Middleware ──────────────────────────────────────────────────────────────
app.use(cors());
app.use(express.json());

// ── Health check ────────────────────────────────────────────────────────────
app.get('/health', (_req, res) => {
  res.json({ status: 'ok', service: 'foodiego-backend' });
});

// ── Routes ──────────────────────────────────────────────────────────────────
// TODO (Thành viên A - Ngày 2): đăng ký auth routes
// const authRouter = require('./modules/auth/auth.router');
// app.use('/api/auth', authRouter);

// TODO (Thành viên A - Ngày 3): đăng ký users routes
// const usersRouter = require('./modules/users/users.router');
// app.use('/api/users', usersRouter);

// TODO (Thành viên B - Ngày 2): đăng ký restaurants routes
// const restaurantsRouter = require('./modules/restaurants/restaurants.router');
// app.use('/api/restaurants', restaurantsRouter);

// TODO (Thành viên B - Ngày 2): đăng ký menu-items routes
// const menuItemsRouter = require('./modules/menu-items/menu-items.router');
// app.use('/api/menu-items', menuItemsRouter);

// TODO (Thành viên C - Ngày 3): đăng ký orders routes
// const ordersRouter = require('./modules/orders/orders.router');
// app.use('/api/orders', ordersRouter);

// ── 404 handler ─────────────────────────────────────────────────────────────
app.use((_req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

// ── Global error handler ────────────────────────────────────────────────────
// eslint-disable-next-line no-unused-vars
app.use((err, _req, res, _next) => {
  console.error(err.stack);
  res.status(err.status || 500).json({
    error: err.message || 'Internal Server Error',
  });
});

module.exports = app;
