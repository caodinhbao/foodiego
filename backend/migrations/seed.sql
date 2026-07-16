-- ============================================================
--  FoodieGo — Seed Data (MySQL)
--  Chạy SAU khi đã chạy 002_mysql.sql
-- ============================================================

USE foodiego_db;

SET FOREIGN_KEY_CHECKS = 0;
TRUNCATE TABLE order_items;
TRUNCATE TABLE orders;
TRUNCATE TABLE reviews;
TRUNCATE TABLE menu_items;
TRUNCATE TABLE restaurants;
TRUNCATE TABLE users;
SET FOREIGN_KEY_CHECKS = 1;

-- ── 1. Users ────────────────────────────────────────────────
-- password_hash = bcrypt của "foodiego123"
INSERT INTO users (id, name, email, password_hash, role) VALUES
  (1, 'Admin FoodieGo', 'admin@foodiego.com', '$2b$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2uheWG/igi.', 'admin'),
  (2, 'Khách hàng Demo', 'customer@test.com', '$2b$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2uheWG/igi.', 'customer'),
  (3, 'Chủ nhà hàng Demo', 'owner@test.com', '$2b$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2uheWG/igi.', 'restaurant');

-- ── 2. Restaurants ──────────────────────────────────────────
INSERT INTO restaurants (id, owner_id, name, address, phone, status) VALUES
  (1, 3, 'Phở Hà Nội Authentic', '12 Lý Thường Kiệt, Q.10, TP.HCM', '0901234561', 'active'),
  (2, 3, 'Bún Bò Huế Bà Tám', '88 Nguyễn Thị Minh Khai, Q.3, TP.HCM', '0901234562', 'active');

-- ── 3. Menu Items ────────────────────────────────────────────
-- Phở Hà Nội
INSERT INTO menu_items (id, restaurant_id, name, description, price, is_available) VALUES
  (1, 1, 'Phở Bò Tái', 'Phở bò tái chín, nước dùng xương ninh 12 tiếng', 65000, 1),
  (2, 1, 'Phở Đặc Biệt', 'Kết hợp tái, chín, gầu, gân, sách', 85000, 1),
  (3, 1, 'Quẩy', 'Quẩy giòn ăn kèm phở', 10000, 1);

-- Bún Bò Huế
INSERT INTO menu_items (id, restaurant_id, name, description, price, is_available) VALUES
  (4, 2, 'Bún Bò Huế', 'Bún bò Huế chuẩn vị, sả ớt đặc trưng', 55000, 1),
  (5, 2, 'Bún Bò Đặc Biệt', 'Thêm giò heo, chả lụa', 75000, 1);

-- ── 4. Orders ───────────────────────────────────────────────
INSERT INTO orders (id, customer_id, restaurant_id, total_amount, delivery_fee, status) VALUES
  (1, 2, 1, 150000, 15000, 'completed'),
  (2, 2, 2, 130000, 15000, 'delivering');

-- ── 5. Order Items ──────────────────────────────────────────
INSERT INTO order_items (order_id, menu_item_id, quantity, unit_price) VALUES
  (1, 1, 1, 65000), 
  (1, 2, 1, 85000), 
  (2, 4, 1, 55000), 
  (2, 5, 1, 75000);

-- ── 6. Reviews ──────────────────────────────────────────────
INSERT INTO reviews (customer_id, restaurant_id, rating, comment) VALUES
  (2, 1, 5, 'Phở ngon tuyệt, nước dùng đậm đà, sẽ quay lại!');
