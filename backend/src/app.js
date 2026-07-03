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
const authRouter      = require('./modules/auth/auth.router');
const usersRouter     = require('./modules/users/users.router');
const restaurantsRouter = require('./modules/restaurants/restaurants.router');
const { menuItemsByRestaurantRouter, menuItemsRouter } = require('./modules/menu-items/menu-items.router');
const ordersRouter    = require('./modules/orders/orders.router');

app.use('/api/auth',        authRouter);
app.use('/api/users',       usersRouter);
app.use('/api/restaurants', restaurantsRouter);
// Menu items by restaurant: GET/POST /api/restaurants/:restaurantId/menu-items
app.use('/api/restaurants/:restaurantId/menu-items', menuItemsByRestaurantRouter);
// Menu items directly: PATCH/DELETE /api/menu-items/:id
app.use('/api/menu-items',  menuItemsRouter);
app.use('/api/orders',      ordersRouter);

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
