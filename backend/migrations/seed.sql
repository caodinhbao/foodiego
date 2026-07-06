-- ============================================================
--  FoodieGo — Seed Data (MySQL)
--  Chạy SAU khi đã chạy 002_mysql.sql
-- ============================================================

USE foodiego_db;

-- ── 1. Users ────────────────────────────────────────────────
-- password_hash = bcrypt của "Password123!"
INSERT INTO users (name, email, password_hash, role) VALUES
  ('Admin FoodieGo',   'admin@foodiego.com',      '$2b$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2uheWG/igi.', 'admin'),
  ('Nguyễn Văn An',   'an.nguyen@gmail.com',      '$2b$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2uheWG/igi.', 'customer'),
  ('Trần Thị Bình',   'binh.tran@gmail.com',      '$2b$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2uheWG/igi.', 'customer'),
  ('Lê Văn Cường',    'cuong.le@gmail.com',        '$2b$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2uheWG/igi.', 'customer'),
  ('Phở Hà Nội HCM',  'pho.hanoi@restaurant.com', '$2b$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2uheWG/igi.', 'restaurant'),
  ('Bún Bò Huế Ngon', 'bunbo.hue@restaurant.com', '$2b$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2uheWG/igi.', 'restaurant'),
  ('Cơm Tấm Sài Gòn', 'comtam.sg@restaurant.com', '$2b$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2uheWG/igi.', 'restaurant'),
  ('Pizza House VN',  'pizza.house@restaurant.com','$2b$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2uheWG/igi.', 'restaurant');

-- ── 2. Restaurants ──────────────────────────────────────────
INSERT INTO restaurants (owner_id, name, address, phone, status) VALUES
  (5, 'Phở Hà Nội Authentic',    '12 Lý Thường Kiệt, Q.10, TP.HCM',     '0901234561', 'active'),
  (6, 'Bún Bò Huế Bà Tám',       '88 Nguyễn Thị Minh Khai, Q.3, TP.HCM','0901234562', 'active'),
  (7, 'Cơm Tấm Sườn Đặc Biệt',  '45 Võ Văn Tần, Q.3, TP.HCM',          '0901234563', 'active'),
  (8, 'Pizza House Sài Gòn',      '99 Lê Lợi, Q.1, TP.HCM',              '0901234564', 'active');

-- ── 3. Menu Items ────────────────────────────────────────────
-- Restaurant 1: Phở Hà Nội
INSERT INTO menu_items (restaurant_id, name, description, price, is_available) VALUES
  (1, 'Phở Bò Tái',         'Phở bò tái chín, nước dùng xương ninh 12 tiếng',        65000, 1),
  (1, 'Phở Bò Chín',        'Phở bò chín mềm, thơm ngon',                            65000, 1),
  (1, 'Phở Gà',             'Phở gà ta, nước trong ngọt tự nhiên',                   60000, 1),
  (1, 'Phở Đặc Biệt',       'Kết hợp tái, chín, gầu, gân, sách',                    85000, 1),
  (1, 'Quẩy',               'Quẩy giòn ăn kèm phở',                                 10000, 1);

-- Restaurant 2: Bún Bò Huế
INSERT INTO menu_items (restaurant_id, name, description, price, is_available) VALUES
  (2, 'Bún Bò Huế',         'Bún bò Huế chuẩn vị, sả ớt đặc trưng',                 55000, 1),
  (2, 'Bún Bò Đặc Biệt',   'Thêm giò heo, chả lụa',                                 75000, 1),
  (2, 'Bún Bò Chay',        'Bún bò chay, nước dùng nấm',                            50000, 1),
  (2, 'Bánh Mì Huế',        'Bánh mì thịt nướng kiểu Huế',                           25000, 1);

-- Restaurant 3: Cơm Tấm
INSERT INTO menu_items (restaurant_id, name, description, price, is_available) VALUES
  (3, 'Cơm Tấm Sườn',       'Cơm tấm sườn nướng, trứng ốp la, bì, chả',             55000, 1),
  (3, 'Cơm Tấm Bì Chả',    'Cơm tấm bì chả, nước mắm chua ngọt',                   50000, 1),
  (3, 'Cơm Tấm Đặc Biệt',  'Sườn + bì + chả + trứng ốp la',                        75000, 1),
  (3, 'Cơm Tấm Gà',         'Cơm tấm đùi gà nướng',                                 60000, 1),
  (3, 'Nước Ngọt',           'Pepsi / 7Up / nước suối',                              15000, 1);

-- Restaurant 4: Pizza House
INSERT INTO menu_items (restaurant_id, name, description, price, is_available) VALUES
  (4, 'Pizza Margherita',    'Sốt cà chua, phô mai mozzarella, rau quế',            120000, 1),
  (4, 'Pizza BBQ Chicken',   'Sốt BBQ, gà nướng, hành tây, ớt chuông',             149000, 1),
  (4, 'Pizza Hải Sản',       'Tôm, mực, sò điệp, sốt kem',                         169000, 1),
  (4, 'Mì Ý Bolognese',      'Mì ý sốt thịt bò bằm, phô mai parmesan',            110000, 1),
  (4, 'Gà Rán',              '4 miếng gà rán giòn, chấm sốt mayo',                  89000, 1);

-- ── 4. Orders ───────────────────────────────────────────────
INSERT INTO orders (customer_id, restaurant_id, total_amount, delivery_fee, status) VALUES
  (2, 1, 140000, 15000, 'completed'),
  (2, 3, 130000, 15000, 'completed'),
  (3, 2, 130000, 15000, 'delivering'),
  (3, 4, 269000, 20000, 'preparing'),
  (4, 1, 85000,  15000, 'completed'),
  (4, 3, 75000,  15000, 'accepted'),
  (2, 4, 238000, 20000, 'pending');

-- ── 5. Order Items ──────────────────────────────────────────
-- Order 1 (customer 2, restaurant 1: Phở)
INSERT INTO order_items (order_id, menu_item_id, quantity, unit_price) VALUES
  (1, 1, 1, 65000),   -- Phở Bò Tái
  (1, 4, 1, 75000);   -- Phở Đặc Biệt (discounted to display total)

-- Order 2 (customer 2, restaurant 3: Cơm Tấm)
INSERT INTO order_items (order_id, menu_item_id, quantity, unit_price) VALUES
  (2, 10, 2, 55000),  -- Cơm Tấm Sườn x2
  (2, 14, 1, 15000);  -- Nước Ngọt

-- Order 3 (customer 3, restaurant 2: Bún Bò)
INSERT INTO order_items (order_id, menu_item_id, quantity, unit_price) VALUES
  (3, 6,  1, 55000),  -- Bún Bò Huế
  (3, 7,  1, 75000);  -- Bún Bò Đặc Biệt

-- Order 4 (customer 3, restaurant 4: Pizza)
INSERT INTO order_items (order_id, menu_item_id, quantity, unit_price) VALUES
  (4, 16, 1, 120000), -- Pizza Margherita
  (4, 17, 1, 149000); -- Pizza BBQ Chicken

-- Order 5 (customer 4, restaurant 1: Phở)
INSERT INTO order_items (order_id, menu_item_id, quantity, unit_price) VALUES
  (5, 4,  1, 85000);  -- Phở Đặc Biệt

-- Order 6 (customer 4, restaurant 3: Cơm Tấm)
INSERT INTO order_items (order_id, menu_item_id, quantity, unit_price) VALUES
  (6, 12, 1, 75000);  -- Cơm Tấm Đặc Biệt

-- Order 7 (customer 2, restaurant 4: Pizza)
INSERT INTO order_items (order_id, menu_item_id, quantity, unit_price) VALUES
  (7, 17, 1, 149000), -- Pizza BBQ Chicken
  (7, 19, 1, 89000);  -- Gà Rán

-- ── 6. Reviews ──────────────────────────────────────────────
INSERT INTO reviews (customer_id, restaurant_id, rating, comment) VALUES
  (2, 1, 5, 'Phở ngon tuyệt, nước dùng đậm đà, sẽ quay lại!'),
  (2, 3, 4, 'Cơm tấm ngon, sườn mềm, giao hàng hơi chậm.'),
  (3, 2, 5, 'Bún bò chuẩn vị Huế, rất ngon và đậm đà!'),
  (4, 1, 4, 'Phở đặc biệt rất đáng tiền, sẽ order lại.'),
  (3, 4, 4, 'Pizza ngon, đế mỏng giòn, nhân nhiều.');
