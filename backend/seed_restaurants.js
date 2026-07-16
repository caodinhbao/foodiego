const mysql = require('mysql2/promise');

const pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'foodiego_db',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

const restaurants = [
  {
    name: "Cơm Tấm Ba Ghiền",
    address: "84 Đặng Văn Ngữ, Phú Nhuận, TP.HCM",
    phone: "0901234567",
    menu: [
      { name: "Cơm Sườn Bì Chả", desc: "Sườn nướng than hoa siêu to khổng lồ", price: 65000 },
      { name: "Cơm Gà Nướng", desc: "Gà ta nướng mật ong", price: 55000 },
      { name: "Canh Khổ Qua Nhồi Thịt", desc: "Canh giải nhiệt thanh mát", price: 25000 }
    ]
  },
  {
    name: "Phở Hòa Pasteur",
    address: "260C Pasteur, Quận 3, TP.HCM",
    phone: "0902233445",
    menu: [
      { name: "Phở Đặc Biệt", desc: "Tái, nạm, gầu, gân, bò viên", price: 85000 },
      { name: "Phở Tái Nạm", desc: "Bò tươi ngon", price: 75000 },
      { name: "Quẩy", desc: "Quẩy giòn rụm", price: 10000 }
    ]
  },
  {
    name: "Highlands Coffee - Vincom",
    address: "L1 Vincom Center, Quận 1, TP.HCM",
    phone: "0912233445",
    menu: [
      { name: "Phin Sữa Đá", desc: "Cà phê truyền thống đậm đà", price: 35000 },
      { name: "Trà Sen Vàng", desc: "Trà sen mát lạnh", price: 49000 },
      { name: "Bánh Mì Thịt Nướng", desc: "Bánh mì Việt Nam", price: 29000 }
    ]
  },
  {
    name: "Pizza 4P's",
    address: "8/15 Lê Thánh Tôn, Quận 1, TP.HCM",
    phone: "0987654321",
    menu: [
      { name: "Half & Half Pizza", desc: "Burrata Margherita & 4 Cheese", price: 295000 },
      { name: "Crab Tomato Cream Spaghetti", desc: "Mì cua trứ danh", price: 245000 },
      { name: "Matcha Fondant", desc: "Bánh chocolate nhân matcha chảy", price: 95000 }
    ]
  },
  {
    name: "Bánh Mì Huỳnh Hoa",
    address: "26 Lê Thị Riêng, Quận 1, TP.HCM",
    phone: "0934123123",
    menu: [
      { name: "Bánh Mì Thịt Truyền Thống", desc: "Siêu nhiều thịt pate", price: 65000 },
      { name: "Bánh Mì Chả Lụa", desc: "Chả lụa thượng hạng", price: 45000 }
    ]
  },
  {
    name: "Gogi House - Nướng Hàn Quốc",
    address: "SC VivoCity, Quận 7, TP.HCM",
    phone: "0933445566",
    menu: [
      { name: "Combo Thịt Nướng Đỉnh Cao", desc: "Ba chỉ bò, dẻ sườn, nạc vai", price: 450000 },
      { name: "Lẩu Bulgogi", desc: "Lẩu bò đậm đà chuẩn vị Hàn", price: 300000 },
      { name: "Canh Kim Chi", desc: "Chua cay hấp dẫn", price: 79000 }
    ]
  },
  {
    name: "Haidilao Hot Pot",
    address: "Bitexco Financial Tower, Quận 1, TP.HCM",
    phone: "0999888777",
    menu: [
      { name: "Lẩu Tứ Xuyên", desc: "Siêu cay tê tái", price: 150000 },
      { name: "Thịt Bò Nhúng Lẩu", desc: "Bò Mỹ thái mỏng", price: 180000 },
      { name: "Múa Mì", desc: "Trình diễn múa mì tận bàn", price: 40000 }
    ]
  },
  {
    name: "Trà Sữa Phúc Long",
    address: "42 Ngô Đức Kế, Quận 1, TP.HCM",
    phone: "0966555444",
    menu: [
      { name: "Trà Đào Cam Sả", desc: "Best seller Phúc Long", price: 55000 },
      { name: "Trà Ô Long Sữa", desc: "Thơm mùi trà ô long rang", price: 50000 },
      { name: "Bánh Croissant Bơ Tỏi", desc: "Thơm nức mũi", price: 35000 }
    ]
  },
  {
    name: "Bún Bò Huế Hạnh",
    address: "135 Bành Văn Trân, Tân Bình, TP.HCM",
    phone: "0955111222",
    menu: [
      { name: "Bún Bò Đặc Biệt", desc: "Giò, chả, nạm, tái, gân", price: 60000 },
      { name: "Bún Bò Giò Heo", desc: "Giò nạc/móng bự chảng", price: 50000 },
      { name: "Trà Sâm Dứa", desc: "Giải nhiệt mát lạnh", price: 5000 }
    ]
  },
  {
    name: "KFC - Gà Rán",
    address: "Lotte Mart, Quận 7, TP.HCM",
    phone: "19001599",
    menu: [
      { name: "Combo 3 Miếng Gà", desc: "Gà giòn cay hoặc không cay", price: 105000 },
      { name: "Gà Quay Tiêu", desc: "Gà nướng tiêu cực ngon", price: 45000 },
      { name: "Khoai Tây Chiên Cỡ Lớn", desc: "Giòn rụm", price: 35000 }
    ]
  }
];

async function seed() {
  try {
    const [users] = await pool.query('SELECT id FROM users WHERE role = ? LIMIT 1', ['restaurant']);
    let ownerId;
    
    if (users.length === 0) {
      console.log('No restaurant owner found, creating one...');
      const [result] = await pool.query(
        'INSERT INTO users (name, email, password_hash, role) VALUES (?, ?, ?, ?)',
        ['Chuỗi Nhà Hàng Group', 'chain@foodiego.com', 'dummyhash123', 'restaurant']
      );
      ownerId = result.insertId;
    } else {
      ownerId = users[0].id;
    }

    console.log(`Using Owner ID: ${ownerId} for seeding new restaurants.`);

    for (const res of restaurants) {
      const [existing] = await pool.query('SELECT id FROM restaurants WHERE name = ?', [res.name]);
      if (existing.length > 0) {
        console.log(`Restaurant ${res.name} already exists. Skipping.`);
        continue;
      }

      const [resResult] = await pool.query(
        'INSERT INTO restaurants (owner_id, name, address, phone, status) VALUES (?, ?, ?, ?, ?)',
        [ownerId, res.name, res.address, res.phone, 'active']
      );
      const restaurantId = resResult.insertId;
      console.log(`Added restaurant: ${res.name}`);

      for (const item of res.menu) {
        await pool.query(
          'INSERT INTO menu_items (restaurant_id, name, description, price, is_available) VALUES (?, ?, ?, ?, ?)',
          [restaurantId, item.name, item.desc, item.price, 1]
        );
      }
      console.log(`  Added ${res.menu.length} menu items.`);
    }

    console.log('Seeding completed successfully!');
  } catch (err) {
    console.error('Error seeding data:', err);
  } finally {
    await pool.end();
    process.exit(0);
  }
}

seed();
