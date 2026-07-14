require('dotenv').config();
const mysql = require('mysql2/promise');
const bcrypt = require('bcryptjs');

async function seedMore() {
  const conn = await mysql.createConnection({
    host: process.env.DB_HOST || 'localhost',
    port: Number(process.env.DB_PORT) || 3306,
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'foodiego_db',
  });

  const hash = await bcrypt.hash('Password123!', 10);

  // 1. Tạo thêm users (chủ nhà hàng)
  const users = [
    ['Chủ - Phở Ngon Hà Nội', 'pho@restaurant.com', hash, 'restaurant'],
    ['Chủ - Burger Hẻm', 'burger@restaurant.com', hash, 'restaurant']
  ];

  const userIds = [];
  for (const user of users) {
    const [res] = await conn.query(
      'INSERT INTO users (name, email, password_hash, role) VALUES (?, ?, ?, ?)',
      user
    );
    userIds.push(res.insertId);
  }
  console.log('✅ Đã thêm 2 tài khoản chủ nhà hàng mới.');

  // 2. Tạo thêm nhà hàng
  const newRestaurants = [
    [userIds[0], 'Phở Ngon Hà Nội', '123 Cầu Giấy, Hà Nội', '0911223344', 'active'],
    [userIds[1], 'Burger Hẻm', '456 Nguyễn Trãi, TP.HCM', '0988776655', 'active']
  ];

  const restaurantIds = [];
  for (const rest of newRestaurants) {
    const [res] = await conn.query(
      'INSERT INTO restaurants (owner_id, name, address, phone, status) VALUES (?, ?, ?, ?, ?)',
      rest
    );
    restaurantIds.push(res.insertId);
  }
  console.log('✅ Đã thêm 2 nhà hàng mới.');

  // 3. Thêm món ăn
  const menuItems = [
    // Thêm món cho nhà hàng Phở
    [restaurantIds[0], 'Phở Bò Tái', 'Phở bò tái truyền thống', 50000, 1],
    [restaurantIds[0], 'Phở Gà', 'Phở gà ta xé phay', 45000, 1],
    [restaurantIds[0], 'Quẩy Giòn', 'Quẩy ăn kèm phở', 10000, 1],

    // Thêm món cho Burger
    [restaurantIds[1], 'Burger Bò Phô Mai', 'Burger bò Mỹ kèm phô mai', 65000, 1],
    [restaurantIds[1], 'Khoai Tây Chiên', 'Khoai chiên giòn', 30000, 1],
    [restaurantIds[1], 'Coca Cola', 'Nước ngọt có gas', 15000, 1],

    // Thêm món cho nhà hàng 1 (Nhà Hàng Đồ Ăn FoodieGo)
    [1, 'Cơm Chiên Hải Sản', 'Cơm chiên tôm mực siêu ngon', 75000, 1],
    [1, 'Mì Xào Bò', 'Mì xào bò rau cải', 60000, 1],
    [1, 'Salad Cá Hồi', 'Salad rau củ cá hồi tươi', 85000, 1],

    // Thêm món cho nhà hàng 2 (Quán Nước & Cà Phê FoodieGo)
    [2, 'Sinh Tố Bơ', 'Sinh tố bơ sáp béo ngậy', 45000, 1],
    [2, 'Trà Vải Trân Châu', 'Trà vải ngọt thanh kèm trân Châu', 35000, 1],
    [2, 'Cà Phê Muối', 'Cà phê đặc sản với lớp foam muối', 30000, 1]
  ];

  for (const item of menuItems) {
    await conn.query(
      'INSERT INTO menu_items (restaurant_id, name, description, price, is_available) VALUES (?, ?, ?, ?, ?)',
      item
    );
  }
  console.log(`✅ Đã thêm ${menuItems.length} món ăn mới cho các nhà hàng.`);

  await conn.end();
}

seedMore().catch(console.error);
