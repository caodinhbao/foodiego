const fs = require('fs');
const path = require('path');
const mysql = require('mysql2/promise');
const bcrypt = require('bcryptjs');

require('dotenv').config();

const DEFAULT_PASSWORD = 'Password123!';

async function runSqlFile(conn, filePath) {
  console.log(`📖 Đang đọc file: ${path.basename(filePath)}...`);
  const content = fs.readFileSync(filePath, 'utf8');
  
  // Tách các câu lệnh SQL dựa trên dấu chấm phẩy ;
  const statements = content
    .split(';')
    .map(stmt => {
      // Loại bỏ các dòng comment trong mỗi câu lệnh SQL
      return stmt
        .split('\n')
        .filter(line => {
          const trimmed = line.trim();
          return !trimmed.startsWith('--') && !trimmed.startsWith('#') && !trimmed.startsWith('/*');
        })
        .join('\n')
        .trim();
    })
    .filter(stmt => stmt.length > 0);

  for (let stmt of statements) {
    if (stmt.toUpperCase().startsWith('USE ')) {
      continue;
    }
    console.log(`👉 Chạy: ${stmt.substring(0, 100).replace(/\s+/g, ' ')}...`);
    try {
      await conn.query(stmt);
    } catch (err) {
      console.error(`❌ Lỗi khi chạy lệnh: "${stmt}"\n   Lỗi chi tiết: ${err.message} (code: ${err.code})`);
      // Bỏ qua lỗi duplicate column/index nếu có
      if (err.code === 'ER_DUP_FIELDNAME' || err.code === 'ER_DUP_KEYNAME' || err.message.includes('Duplicate') || err.message.includes('already exists')) {
        // console.log(`   ⚠️ Bỏ qua: ${err.message}`);
      } else {
        throw err;
      }
    }
  }
  console.log(`✅ Chạy xong file: ${path.basename(filePath)}`);
}

async function main() {
  const host = process.env.DB_HOST || 'localhost';
  const port = Number(process.env.DB_PORT) || 3306;
  const user = process.env.DB_USER || 'root';
  const password = process.env.DB_PASSWORD || '';
  const database = process.env.DB_NAME || 'foodiego_db';

  console.log(`🔌 Kết nối tới MySQL tại ${host}:${port} bằng user '${user}'...`);
  
  let conn = await mysql.createConnection({
    host,
    port,
    user,
    password,
    multipleStatements: true,
  });

  console.log(`🔧 Tạo database '${database}' nếu chưa tồn tại...`);
  await conn.query(`CREATE DATABASE IF NOT EXISTS ${database} CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci`);
  await conn.end();

  conn = await mysql.createConnection({
    host,
    port,
    user,
    password,
    database,
    multipleStatements: true,
    charset: 'utf8mb4',
  });

  const migrationsDir = path.join(__dirname, '..', 'migrations');
  
  console.log('\n🚀 Khởi tạo các bảng gốc...');
  await runSqlFile(conn, path.join(migrationsDir, '002_mysql.sql'));

  console.log('\n🚀 Cập nhật các tính năng mới (migration 003)...');
  await runSqlFile(conn, path.join(migrationsDir, '003_new_features.sql'));

  console.log('\n🌱 Đang chèn dữ liệu mẫu (Seeding)...');
  await conn.query('SET FOREIGN_KEY_CHECKS=0');
  await conn.query('TRUNCATE TABLE reviews');
  await conn.query('TRUNCATE TABLE order_items');
  await conn.query('TRUNCATE TABLE orders');
  await conn.query('TRUNCATE TABLE menu_items');
  await conn.query('TRUNCATE TABLE restaurants');
  await conn.query('TRUNCATE TABLE users');
  await conn.query('SET FOREIGN_KEY_CHECKS=1');

  const hash = await bcrypt.hash(DEFAULT_PASSWORD, 10);

  const users = [
    ['Admin FoodieGo',   'admin@foodiego.com',           hash, 'admin'],
    ['Nguyễn Văn An',    'an.nguyen@gmail.com',          hash, 'customer'],
    ['Trần Thị Bình',    'binh.tran@gmail.com',          hash, 'customer'],
    ['Lê Văn Cường',     'cuong.le@gmail.com',           hash, 'customer'],
    ['Phở Hà Nội HCM',   'pho.hanoi@restaurant.com',    hash, 'restaurant'],
    ['Bún Bò Huế Ngon',  'bunbo.hue@restaurant.com',    hash, 'restaurant'],
    ['Cơm Tấm Sài Gòn',  'comtam.sg@restaurant.com',    hash, 'restaurant'],
    ['Pizza House VN',   'pizza.house@restaurant.com',   hash, 'restaurant'],
    ['Phúc Long Tea',    'phuclong@restaurant.com',      hash, 'restaurant'],
    ['Cà Phê Muối',      'caphemuoi@restaurant.com',     hash, 'restaurant'],
    ['Ăn Vặt Cô Tám',    'anvat@restaurant.com',         hash, 'restaurant'],
    ['Sushi Sakura',     'sushi.sakura@restaurant.com',  hash, 'restaurant'],
    ['K-Pub BBQ',        'kpub@restaurant.com',          hash, 'restaurant'],
    ['Hải Sản D9',       'haisan.d9@restaurant.com',     hash, 'restaurant'],
    ['Burger Lab',       'burger.lab@restaurant.com',    hash, 'restaurant'],
  ];
  for (const [name, email, password_hash, role] of users) {
    await conn.query(
      'INSERT INTO users (name, email, password_hash, role) VALUES (?, ?, ?, ?)',
      [name, email, password_hash, role]
    );
  }

  const restaurants = [
    [5, 'Phở Hà Nội Authentic',   '12 Lý Thường Kiệt, Q.10, TP.HCM',      '0901234561', 'active'],
    [6, 'Bún Bò Huế Bà Tám',      '88 Nguyễn Thị Minh Khai, Q.3, TP.HCM', '0901234562', 'active'],
    [7, 'Cơm Tấm Sườn Đặc Biệt', '45 Võ Văn Tần, Q.3, TP.HCM',           '0901234563', 'active'],
    [8, 'Pizza House Sài Gòn',    '99 Lê Lợi, Q.1, TP.HCM',               '0901234564', 'active'],
    [9, 'Phúc Long Tea & Coffee', '120 Trần Hưng Đạo, Q.1, TP.HCM',       '0901112223', 'active'],
    [10, 'Cà Phê Muối Chú Long',  '15 Lê Lợi, Q.1, TP.HCM',               '0901112224', 'active'],
    [11, 'Ăn Vặt Cô Tám',         '99 Sư Vạn Hạnh, Q.10, TP.HCM',         '0901112225', 'active'],
    [12, 'Sushi Sakura Nhật Bản',  '24 Ngô Văn Năm, Q.1, TP.HCM',          '0902223331', 'active'],
    [13, 'K-Pub BBQ Hàn Quốc',     '134 Nguyễn Tri Phương, Q.5, TP.HCM',   '0902223332', 'active'],
    [14, 'Hải Sản Tươi Sống D9',   '45 Đường số 9, Q.7, TP.HCM',           '0902223333', 'active'],
    [15, 'Burger & Grill Lab',     '78 Thảo Điền, Q.2, TP.HCM',            '0902223334', 'active'],
  ];
  for (const [owner_id, name, address, phone, status] of restaurants) {
    await conn.query(
      'INSERT INTO restaurants (owner_id, name, address, phone, status) VALUES (?, ?, ?, ?, ?)',
      [owner_id, name, address, phone, status]
    );
  }

  const menuItems = [
    [1, 'Phở Bò Tái',        'Phở bò tái chín, nước dùng xương ninh 12 tiếng', 65000, 1],
    [1, 'Phở Bò Chín',       'Phở bò chín mềm, thơm ngon',                     65000, 1],
    [1, 'Phở Gà',            'Phở gà ta, nước trong ngọt tự nhiên',             60000, 1],
    [1, 'Phở Đặc Biệt',      'Kết hợp tái, chín, gầu, gân, sách',              85000, 1],
    [1, 'Quẩy',              'Quẩy giòn ăn kèm phở',                           10000, 1],
    [2, 'Bún Bò Huế',        'Bún bò Huế chuẩn vị, sả ớt đặc trưng',          55000, 1],
    [2, 'Bún Bò Đặc Biệt',  'Thêm giò heo, chả lụa',                          75000, 1],
    [2, 'Bún Bò Chay',       'Bún bò chay, nước dùng nấm',                     50000, 1],
    [2, 'Bánh Mì Huế',       'Bánh mì thịt nướng kiểu Huế',                    25000, 1],
    [3, 'Cơm Tấm Sườn',      'Cơm tấm sườn nướng, trứng ốp la, bì, chả',      55000, 1],
    [3, 'Cơm Tấm Bì Chả',   'Cơm tấm bì chả, nước mắm chua ngọt',            50000, 1],
    [3, 'Cơm Tấm Đặc Biệt', 'Sườn + bì + chả + trứng ốp la',                 75000, 1],
    [3, 'Cơm Tấm Gà',        'Cơm tấm đùi gà nướng',                           60000, 1],
    [3, 'Nước Ngọt',          'Pepsi / 7Up / nước suối',                        15000, 1],
    [4, 'Pizza Margherita',  'Sốt cà chua, phô mai mozzarella, rau quế',      120000, 1],
    [4, 'Pizza BBQ Chicken', 'Sốt BBQ, gà nướng, hành tây, ớt chuông',        149000, 1],
    [4, 'Pizza Hải Sản',     'Tôm, mực, sò điệp, sốt kem',                    169000, 1],
    [4, 'Mì Ý Bolognese',    'Mì ý sốt thịt bò bằm, phô mai parmesan',       110000, 1],
    [4, 'Gà Rán',            '4 miếng gà rán giòn, chấm sốt mayo',             89000, 1],
    [5, 'Trà Sữa Phúc Long', 'Trà sữa đậm vị đặc trưng',                       50000, 1],
    [5, 'Trà Đào Cam Sả',    'Mát lạnh sảng khoái',                            55000, 1],
    [5, 'Trà Vải',           'Trà vải ngọt thanh',                             50000, 1],
    [6, 'Cà Phê Muối',       'Cà phê đặc sản muối béo ngậy',                   25000, 1],
    [6, 'Bạc Xỉu',           'Cà phê sữa đá ngọt ngào',                        30000, 1],
    [7, 'Bánh Tráng Trộn',   'Bánh tráng trộn bò khô trứng cút',               25000, 1],
    [7, 'Cá Viên Chiên',     'Cá viên, bò viên, xúc xích chiên giòn',          35000, 1],
    [7, 'Trà Chanh',         'Trà chanh giã tay giải khát',                    15000, 1],
    // Restaurant 8: Sushi Sakura
    [8, 'Combo Sushi Premium', 'Set sushi 12 miếng gồm cá hồi, cá trích, lươn nhật, tôm đỏ', 249000, 1],
    [8, 'Sashimi Cá Hồi Sakura', '5 lát sashimi cá hồi tươi sống nhập khẩu Na Uy', 125000, 1],
    [8, 'Mì Udon Bò', 'Mì udon sợi dai kết hợp thịt bò Mỹ sốt đặc trưng', 89000, 1],
    [8, 'Cơm Cuốn Cali', 'Cơm cuốn bơ, thanh cua, trứng tôm', 75000, 1],
    [8, 'Trà Xanh Nhật Bản', 'Trà xanh Matcha đá lạnh không đường', 20000, 1],
    // Restaurant 9: K-Pub BBQ
    [9, 'Ba Chỉ Bò Mỹ Sốt K-Pub', '200g ba chỉ bò cuộn nướng sốt cay Hàn Quốc', 159000, 1],
    [9, 'Sườn Heo Sốt Galbi', 'Sườn heo nướng tẩm gia vị Galbi truyền thống', 189000, 1],
    [9, 'Cơm Trộn Đất Đá', 'Cơm trộn thịt bò, trứng lòng đào, rau củ và sốt gochujang', 85000, 1],
    [9, 'Canh Kim Chi Sườn Bò', 'Canh kim chi nóng hổi đậm đà', 79000, 1],
    [9, 'Rượu Soju Truyền Thống', 'Rượu soju truyền thống thơm ngon', 65000, 1],
    // Restaurant 10: Hải Sản D9
    [10, 'Lẩu Thái Hải Sản', 'Lẩu thái tôm mực chua cay cho 2-3 người ăn', 299000, 1],
    [10, 'Cua Sốt Ớt Singapore', 'Cua thịt chắc ngọt sốt ớt cay nồng đậm đà', 350000, 1],
    [10, 'Ốc Hương Rang Muối Ớt', 'Ốc hương tươi sống rang muối cay mặn', 120000, 1],
    [10, 'Mực Trứng Hấp Hành Gừng', 'Mực tươi ngon ngọt hấp gừng ấm nồng', 150000, 1],
    [10, 'Bia Sài Gòn Chill', 'Bia lon ướp lạnh sảng khoái', 20000, 1],
    // Restaurant 11: Burger Lab
    [11, 'Signature Double Beef Burger', '2 lớp bò Mỹ nướng lò, phô mai Cheddar tan chảy, sốt BBQ độc quyền', 119000, 1],
    [11, 'Crispy Chicken Burger', 'Ức gà chiên giòn, xà lách, sốt mayonnaise tỏi', 89000, 1],
    [11, 'Khoai Tây Chiên Phô Mai', 'Khoai tây múi cau chiên giòn lắc bột phô mai', 45000, 1],
    [11, 'Cánh Gà Buffalo', '6 cánh gà chiên giòn lắc sốt trâu cay ngọt', 85000, 1],
    [11, 'Coca-Cola Zero', 'Nước ngọt không đường mát lạnh', 15000, 1],
  ];
  for (const [restaurant_id, name, description, price, is_available] of menuItems) {
    await conn.query(
      'INSERT INTO menu_items (restaurant_id, name, description, price, is_available) VALUES (?, ?, ?, ?, ?)',
      [restaurant_id, name, description, price, is_available]
    );
  }

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

  await conn.end();
  
  console.log('\n✨ Đã thiết lập database & dữ liệu mẫu thành công!');
  console.log('🔑 Tài khoản test — password: Password123!');
  console.log('   - admin@foodiego.com           (admin)');
  console.log('   - an.nguyen@gmail.com          (customer)');
  console.log('   - pho.hanoi@restaurant.com     (restaurant)');
}

main().catch(err => {
  console.error('\n❌ Lỗi thiết lập database:', err.message);
  process.exit(1);
});
