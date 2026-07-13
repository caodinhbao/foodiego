require('dotenv').config();
const express = require('express');
const cors    = require('cors');
const path    = require('path');

const app = express();

// ── Middleware ──────────────────────────────────────────────────────────────
app.use(cors());
app.use(express.json());

// ── Serve Frontend (static files) ───────────────────────────────────────────
const frontendPath = path.join(__dirname, '..', '..', 'frontend');
app.use(express.static(frontendPath));

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

// ── New Feature Routes ───────────────────────────────────────────────
const loyaltyRouter        = require('./modules/loyalty/loyalty.router');
const flashSalesRouter     = require('./modules/flash-sales/flash-sales.router');
const adminAnalyticsRouter = require('./modules/admin/admin.router');
const notificationsRouter  = require('./modules/notifications/notifications.router');

app.use('/api/loyalty',        loyaltyRouter);
app.use('/api/flash-sales',    flashSalesRouter);
app.use('/api/admin',          adminAnalyticsRouter);
app.use('/api/notifications',  notificationsRouter);


// ── 404 handler (chỉ cho /api routes) ─────────────────────────────────────
app.use('/api', (_req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

// ── Fallback: trả index.html cho mọi route khác ──────────────────────────────
app.get('*', (_req, res) => {
  res.sendFile(path.join(frontendPath, 'index.html'));
});

// ── Global error handler ────────────────────────────────────────────────────
// eslint-disable-next-line no-unused-vars
app.use((err, _req, res, _next) => {
  // eslint-disable-next-line no-console
  console.error(err.stack);
  res.status(err.status || 500).json({
    error: err.message || 'Internal Server Error',
  });
});

module.exports = app;
