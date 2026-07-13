-- ============================================================
--  FoodieGo — Database Schema (MySQL / XAMPP)
--  Chạy trong Navicat hoặc phpMyAdmin
--  Query > Run SQL File → chọn file này
-- ============================================================

CREATE DATABASE IF NOT EXISTS foodiego_db
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

USE foodiego_db;

-- ── users ──────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS users (
  id            INT AUTO_INCREMENT PRIMARY KEY,
  name          VARCHAR(100) NOT NULL,
  email         VARCHAR(255) NOT NULL UNIQUE,
  password_hash TEXT NOT NULL,
  role          ENUM('customer', 'restaurant', 'admin') NOT NULL DEFAULT 'customer',
  created_at    DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- ── restaurants ────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS restaurants (
  id         INT AUTO_INCREMENT PRIMARY KEY,
  owner_id   INT NOT NULL,
  name       VARCHAR(200) NOT NULL,
  address    TEXT NOT NULL,
  phone      VARCHAR(20),
  status     ENUM('active', 'inactive', 'pending') NOT NULL DEFAULT 'active',
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (owner_id) REFERENCES users(id) ON DELETE CASCADE
);

-- ── menu_items ─────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS menu_items (
  id            INT AUTO_INCREMENT PRIMARY KEY,
  restaurant_id INT NOT NULL,
  name          VARCHAR(200) NOT NULL,
  description   TEXT,
  price         DECIMAL(10, 2) NOT NULL CHECK (price > 0),
  is_available  TINYINT(1) NOT NULL DEFAULT 1,
  created_at    DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (restaurant_id) REFERENCES restaurants(id) ON DELETE CASCADE
);

-- ── orders ─────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS orders (
  id            INT AUTO_INCREMENT PRIMARY KEY,
  customer_id   INT NOT NULL,
  restaurant_id INT NOT NULL,
  total_amount  DECIMAL(12, 2) NOT NULL,
  delivery_fee  DECIMAL(10, 2) NOT NULL DEFAULT 0,
  status        ENUM('pending','accepted','preparing','delivering','completed','cancelled') NOT NULL DEFAULT 'pending',
  created_at    DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (customer_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (restaurant_id) REFERENCES restaurants(id)
);

-- ── order_items ────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS order_items (
  id           INT AUTO_INCREMENT PRIMARY KEY,
  order_id     INT NOT NULL,
  menu_item_id INT NOT NULL,
  quantity     INT NOT NULL CHECK (quantity > 0),
  unit_price   DECIMAL(10, 2) NOT NULL CHECK (unit_price > 0),
  FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE,
  FOREIGN KEY (menu_item_id) REFERENCES menu_items(id)
);

-- ── reviews ────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS reviews (
  id            INT AUTO_INCREMENT PRIMARY KEY,
  customer_id   INT NOT NULL,
  restaurant_id INT NOT NULL,
  rating        TINYINT NOT NULL CHECK (rating BETWEEN 1 AND 5),
  comment       TEXT,
  created_at    DATETIME DEFAULT CURRENT_TIMESTAMP,
  UNIQUE KEY unique_review (customer_id, restaurant_id),
  FOREIGN KEY (customer_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (restaurant_id) REFERENCES restaurants(id) ON DELETE CASCADE
);

-- ── Indexes ────────────────────────────────────────────────────────────────
CREATE INDEX idx_restaurants_owner    ON restaurants(owner_id);
CREATE INDEX idx_menu_items_restaurant ON menu_items(restaurant_id);
CREATE INDEX idx_orders_customer      ON orders(customer_id);
CREATE INDEX idx_orders_restaurant    ON orders(restaurant_id);
CREATE INDEX idx_order_items_order    ON order_items(order_id);
