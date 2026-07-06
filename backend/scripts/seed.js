/**
 * FoodieGo — Database Seeder
 * Chạy: node scripts/seed.js
 * Password mặc định cho tất cả tài khoản test: Password123!
 */
require('dotenv').config();
const bcrypt = require('bcryptjs');
const mysql  = require('mysql2/promise');

const DEFAULT_PASSWORD = 'Password123!';

async function seed() {
  const conn = await mysql.createConnection({
    host:              process.env.DB_HOST     || 'localhost',
    port:     Number(process.env.DB_PORT)      || 3306,
    user:              process.env.DB_USER     || 'root',
    password:          process.env.DB_PASSWORD || '',
    database:          process.env.DB_NAME     || 'foodiego_db',
    multipleStatements: true,
  });

  console.log('✅ Kết nối database thành công');
  console.log('🔐 Đang hash password...');

  const hash = await bcrypt.hash(DEFAULT_PASSWORD, 10);
  console.log(`   Hash tạo ra: ${hash}`);

  // ── Clear toàn bộ dữ liệu cũ ──────────────────────────────
  await conn.query('SET FOREIGN_KEY_CHECKS=0');
  await conn.query('TRUNCATE TABLE reviews');
  await conn.query('TRUNCATE TABLE order_items');
  await conn.query('TRUNCATE TABLE orders');
  await conn.query('TRUNCATE TABLE menu_items');
  await conn.query('TRUNCATE TABLE restaurants');
  await conn.query('TRUNCATE TABLE users');
  await conn.query('SET FOREIGN_KEY_CHECKS=1');
  console.log('🗑️  Đã xóa dữ liệu cũ');

  // ── 1. Users ────────────────────────────────────────────────
  const users = [
    ['Admin FoodieGo',   'admin@foodiego.com',           hash, 'admin'],
    ['Nguyễn Văn An',    'an.nguyen@gmail.com',          hash, 'customer'],
    ['Trần Thị Bình',    'binh.tran@gmail.com',          hash, 'customer'],
    ['Lê Văn Cường',     'cuong.le@gmail.com',           hash, 'customer'],
    ['Phở Hà Nội HCM',   'pho.hanoi@restaurant.com',    hash, 'restaurant'],
    ['Bún Bò Huế Ngon',  'bunbo.hue@restaurant.com',    hash, 'restaurant'],
    ['Cơm Tấm Sài Gòn',  'comtam.sg@restaurant.com',    hash, 'restaurant'],
    ['Pizza House VN',   'pizza.house@restaurant.com',   hash, 'restaurant'],
  ];

  for (const [name, email, password_hash, role] of users) {
    await conn.query(
      'INSERT INTO users (name, email, password_hash, role) VALUES (?, ?, ?, ?)',
      [name, email, password_hash, role]
    );
  }
  console.log(`👤 Đã tạo ${users.length} users`);

  // ── 2. Restaurants ──────────────────────────────────────────
  const restaurants = [
    [5, 'Phở Hà Nội Authentic',   '12 Lý Thường Kiệt, Q.10, TP.HCM',      '0901234561', 'active'],
    [6, 'Bún Bò Huế Bà Tám',      '88 Nguyễn Thị Minh Khai, Q.3, TP.HCM', '0901234562', 'active'],
    [7, 'Cơm Tấm Sườn Đặc Biệt', '45 Võ Văn Tần, Q.3, TP.HCM',           '0901234563', 'active'],
    [8, 'Pizza House Sài Gòn',    '99 Lê Lợi, Q.1, TP.HCM',               '0901234564', 'active'],
  ];

  for (const [owner_id, name, address, phone, status] of restaurants) {
    await conn.query(
      'INSERT INTO restaurants (owner_id, name, address, phone, status) VALUES (?, ?, ?, ?, ?)',
      [owner_id, name, address, phone, status]
    );
  }
  console.log(`🏪 Đã tạo ${restaurants.length} restaurants`);

  // ── 3. Menu Items ────────────────────────────────────────────
  const menuItems = [
    // Restaurant 1: Phở Hà Nội
    [1, 'Phở Bò Tái',        'Phở bò tái chín, nước dùng xương ninh 12 tiếng', 65000, 1],
    [1, 'Phở Bò Chín',       'Phở bò chín mềm, thơm ngon',                     65000, 1],
    [1, 'Phở Gà',            'Phở gà ta, nước trong ngọt tự nhiên',             60000, 1],
    [1, 'Phở Đặc Biệt',      'Kết hợp tái, chín, gầu, gân, sách',              85000, 1],
    [1, 'Quẩy',              'Quẩy giòn ăn kèm phở',                           10000, 1],
    // Restaurant 2: Bún Bò Huế
    [2, 'Bún Bò Huế',        'Bún bò Huế chuẩn vị, sả ớt đặc trưng',          55000, 1],
    [2, 'Bún Bò Đặc Biệt',  'Thêm giò heo, chả lụa',                          75000, 1],
    [2, 'Bún Bò Chay',       'Bún bò chay, nước dùng nấm',                     50000, 1],
    [2, 'Bánh Mì Huế',       'Bánh mì thịt nướng kiểu Huế',                    25000, 1],
    // Restaurant 3: Cơm Tấm
    [3, 'Cơm Tấm Sườn',      'Cơm tấm sườn nướng, trứng ốp la, bì, chả',      55000, 1],
    [3, 'Cơm Tấm Bì Chả',   'Cơm tấm bì chả, nước mắm chua ngọt',            50000, 1],
    [3, 'Cơm Tấm Đặc Biệt', 'Sườn + bì + chả + trứng ốp la',                 75000, 1],
    [3, 'Cơm Tấm Gà',        'Cơm tấm đùi gà nướng',                           60000, 1],
    [3, 'Nước Ngọt',          'Pepsi / 7Up / nước suối',                        15000, 1],
    // Restaurant 4: Pizza House
    [4, 'Pizza Margherita',  'Sốt cà chua, phô mai mozzarella, rau quế',      120000, 1],
    [4, 'Pizza BBQ Chicken', 'Sốt BBQ, gà nướng, hành tây, ớt chuông',        149000, 1],
    [4, 'Pizza Hải Sản',     'Tôm, mực, sò điệp, sốt kem',                    169000, 1],
    [4, 'Mì Ý Bolognese',    'Mì ý sốt thịt bò bằm, phô mai parmesan',       110000, 1],
    [4, 'Gà Rán',            '4 miếng gà rán giòn, chấm sốt mayo',             89000, 1],
  ];

  for (const [restaurant_id, name, description, price, is_available] of menuItems) {
    await conn.query(
      'INSERT INTO menu_items (restaurant_id, name, description, price, is_available) VALUES (?, ?, ?, ?, ?)',
      [restaurant_id, name, description, price, is_available]
    );
  }
  console.log(`🍜 Đã tạo ${menuItems.length} menu items`);

  // ── 4. Orders ───────────────────────────────────────────────
  const orders = [
    [2, 1, 140000, 15000, 'completed'],
    [2, 3, 130000, 15000, 'completed'],
    [3, 2, 130000, 15000, 'delivering'],
    [3, 4, 269000, 20000, 'preparing'],
    [4, 1, 85000,  15000, 'completed'],
    [4, 3, 75000,  15000, 'accepted'],
    [2, 4, 238000, 20000, 'pending'],
  ];

  for (const [customer_id, restaurant_id, total_amount, delivery_fee, status] of orders) {
    await conn.query(
      'INSERT INTO orders (customer_id, restaurant_id, total_amount, delivery_fee, status) VALUES (?, ?, ?, ?, ?)',
      [customer_id, restaurant_id, total_amount, delivery_fee, status]
    );
  }
  console.log(`📋 Đã tạo ${orders.length} orders`);

  // ── 5. Order Items ──────────────────────────────────────────
  const orderItems = [
    [1, 1, 1, 65000], [1, 4, 1, 75000],
    [2, 10, 2, 55000], [2, 14, 1, 15000],
    [3, 6, 1, 55000], [3, 7, 1, 75000],
    [4, 16, 1, 120000], [4, 17, 1, 149000],
    [5, 4, 1, 85000],
    [6, 12, 1, 75000],
    [7, 17, 1, 149000], [7, 19, 1, 89000],
  ];

  for (const [order_id, menu_item_id, quantity, unit_price] of orderItems) {
    await conn.query(
      'INSERT INTO order_items (order_id, menu_item_id, quantity, unit_price) VALUES (?, ?, ?, ?)',
      [order_id, menu_item_id, quantity, unit_price]
    );
  }

  // ── 6. Reviews ──────────────────────────────────────────────
  const reviews = [
    [2, 1, 5, 'Phở ngon tuyệt, nước dùng đậm đà, sẽ quay lại!'],
    [2, 3, 4, 'Cơm tấm ngon, sườn mềm, giao hàng hơi chậm.'],
    [3, 2, 5, 'Bún bò chuẩn vị Huế, rất ngon và đậm đà!'],
    [4, 1, 4, 'Phở đặc biệt rất đáng tiền, sẽ order lại.'],
    [3, 4, 4, 'Pizza ngon, đế mỏng giòn, nhân nhiều.'],
  ];

  for (const [customer_id, restaurant_id, rating, comment] of reviews) {
    await conn.query(
      'INSERT INTO reviews (customer_id, restaurant_id, rating, comment) VALUES (?, ?, ?, ?)',
      [customer_id, restaurant_id, rating, comment]
    );
  }
  console.log(`⭐ Đã tạo ${reviews.length} reviews`);

  await conn.end();

  console.log('');
  console.log('✅ Seed hoàn tất!');
  console.log('');
  console.log('🔑 Tài khoản test — password: Password123!');
  console.log('   admin@foodiego.com           (admin)');
  console.log('   an.nguyen@gmail.com          (customer)');
  console.log('   binh.tran@gmail.com          (customer)');
  console.log('   cuong.le@gmail.com           (customer)');
  console.log('   pho.hanoi@restaurant.com     (restaurant)');
}

seed().catch(err => {
  console.error('❌ Lỗi seed:', err.message);
  process.exit(1);
});
