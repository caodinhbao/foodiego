-- ============================================================
--  FoodieGo — Migration 003: New Features
--  Chạy trong phpMyAdmin / Navicat
-- ============================================================

USE foodiego_db;

-- ── Feature 1: Order Notes ──────────────────────────────────
ALTER TABLE orders ADD COLUMN IF NOT EXISTS notes TEXT DEFAULT NULL AFTER delivery_fee;

-- ── Feature 2: Order Status Timeline ───────────────────────
CREATE TABLE IF NOT EXISTS order_status_logs (
  id         INT AUTO_INCREMENT PRIMARY KEY,
  order_id   INT NOT NULL,
  status     ENUM('pending','accepted','preparing','delivering','completed','cancelled') NOT NULL,
  changed_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE
);
CREATE INDEX IF NOT EXISTS idx_status_logs_order ON order_status_logs(order_id);

-- ── Feature 3: Loyalty Points ───────────────────────────────
CREATE TABLE IF NOT EXISTS loyalty_points (
  id          INT AUTO_INCREMENT PRIMARY KEY,
  customer_id INT NOT NULL,
  order_id    INT DEFAULT NULL,
  points      INT NOT NULL,         -- positive = earn, negative = redeem
  description VARCHAR(200) NOT NULL,
  created_at  DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (customer_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (order_id)    REFERENCES orders(id) ON DELETE SET NULL
);
CREATE INDEX IF NOT EXISTS idx_loyalty_customer ON loyalty_points(customer_id);

-- ── Feature 4: Flash Sales ──────────────────────────────────
CREATE TABLE IF NOT EXISTS flash_sales (
  id               INT AUTO_INCREMENT PRIMARY KEY,
  menu_item_id     INT NOT NULL,
  discount_percent TINYINT NOT NULL CHECK (discount_percent BETWEEN 1 AND 99),
  start_time       DATETIME NOT NULL,
  end_time         DATETIME NOT NULL,
  created_by       INT NOT NULL,  -- admin user id
  created_at       DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (menu_item_id) REFERENCES menu_items(id) ON DELETE CASCADE,
  FOREIGN KEY (created_by)   REFERENCES users(id) ON DELETE CASCADE
);
CREATE INDEX IF NOT EXISTS idx_flash_sales_item ON flash_sales(menu_item_id);
CREATE INDEX IF NOT EXISTS idx_flash_sales_time ON flash_sales(start_time, end_time);
