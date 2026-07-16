/**
 * FoodieGo — Database Seeder
 * Chạy: npm run seed
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
    charset:           'utf8mb4',
  });

  console.log('✅ Kết nối database thành công');
  console.log('🔐 Đang hash password...');

  const hash = await bcrypt.hash(DEFAULT_PASSWORD, 10);
  
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
    // 1 Admin
    ['Admin FoodieGo',   'admin@foodiego.com',           hash, 'admin'],
    // 3 Customers
    ['Nguyễn Văn An',    'an.nguyen@gmail.com',          hash, 'customer'],
    ['Trần Thị Bình',    'binh.tran@gmail.com',          hash, 'customer'],
    ['Lê Văn Cường',     'cuong.le@gmail.com',           hash, 'customer'],
    // 2 Specific Restaurant Owners
    ['Chủ - Nhà Hàng Đồ Ăn', 'food@restaurant.com',      hash, 'restaurant'],
    ['Chủ - Quán Nước & Cà Phê', 'drink@restaurant.com', hash, 'restaurant'],
    // A few more Restaurant Owners
    ['Chủ - Cơm Tấm Sài Gòn',  'comtam.sg@restaurant.com', hash, 'restaurant'],
    ['Chủ - Pizza House VN',   'pizza.house@restaurant.com', hash, 'restaurant'],
    ['Chủ - Bún Bò Huế',       'bunbo.hue@restaurant.com', hash, 'restaurant']
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
    // The 2 specific ones
    [5, 'Nhà Hàng Đồ Ăn FoodieGo', '123 Đường Ẩm Thực, Quận 1, TP.HCM', '1800-FOOD', 'active'],
    [6, 'Quán Nước & Cà Phê FoodieGo', '456 Đường Giải Khát, Quận 3, TP.HCM', '1800-DRINK', 'active'],
    // The additional ones
    [7, 'Cơm Tấm Sài Gòn', '45 Võ Văn Tần, Q.3, TP.HCM', '0901234563', 'active'],
    [8, 'Pizza House Sài Gòn', '99 Lê Lợi, Q.1, TP.HCM', '0901234564', 'active'],
    [9, 'Bún Bò Huế Bà Tám', '88 Nguyễn Thị Minh Khai, Q.3, TP.HCM', '0901234562', 'active']
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
    // Restaurant 1: Nhà Hàng Đồ Ăn FoodieGo
    [1, 'Cơm Chiên Hải Sản', 'Cơm chiên tôm mực siêu ngon', 75000, 1],
    [1, 'Mì Xào Bò', 'Mì xào bò rau cải', 60000, 1],
    [1, 'Salad Cá Hồi', 'Salad rau củ cá hồi tươi', 85000, 1],
    [1, 'Sushi Cá Hồi', 'Sushi cá hồi tươi ngon', 95000, 1], 
    // Restaurant 2: Quán Nước & Cà Phê FoodieGo
    [2, 'Sinh Tố Bơ', 'Sinh tố bơ sáp béo ngậy', 45000, 1],
    [2, 'Trà Vải Trân Châu', 'Trà vải ngọt thanh kèm trân Châu', 35000, 1],
    [2, 'Cà Phê Muối', 'Cà phê đặc sản với lớp foam muối', 30000, 1],
    [2, 'Hamburger & Fries', 'Burger kèm khoai tây chiên', 85000, 1], 
    
    // Restaurant 3: Cơm Tấm Sài Gòn
    [3, 'Cơm Tấm Sườn', 'Cơm tấm sườn nướng, trứng ốp la', 55000, 1],
    [3, 'Cơm Tấm Bì Chả', 'Cơm tấm bì chả, nước mắm chua ngọt', 50000, 1],
    
    // Restaurant 4: Pizza House
    [4, 'Pizza Margherita', 'Sốt cà chua, phô mai mozzarella', 120000, 1],
    [4, 'Pizza BBQ Chicken', 'Sốt BBQ, gà nướng, hành tây', 149000, 1],
    
    // Restaurant 5: Bún Bò Huế
    [5, 'Bún Bò Huế', 'Bún bò Huế chuẩn vị, sả ớt đặc trưng', 55000, 1],
    [5, 'Bún Bò Đặc Biệt', 'Thêm giò heo, chả lụa', 75000, 1],
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
    [3, 2, 80000, 15000, 'delivering'],
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
    [1, 1, 1, 75000], [1, 2, 1, 60000],
    [2, 5, 1, 45000], [2, 6, 1, 35000],
  ];

  for (const [order_id, menu_item_id, quantity, unit_price] of orderItems) {
    await conn.query(
      'INSERT INTO order_items (order_id, menu_item_id, quantity, unit_price) VALUES (?, ?, ?, ?)',
      [order_id, menu_item_id, quantity, unit_price]
    );
  }

  // ── 6. Reviews ──────────────────────────────────────────────
  const reviews = [
    [2, 1, 5, 'Món ăn ngon, giao hàng nhanh!'],
    [3, 2, 5, 'Nước uống ngon tuyệt vời!'],
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
  console.log('   food@restaurant.com          (restaurant - Đồ ăn)');
  console.log('   drink@restaurant.com         (restaurant - Nước uống)');
}

seed().catch(err => {
  console.error('❌ Lỗi seed:', err.message);
  process.exit(1);
});
