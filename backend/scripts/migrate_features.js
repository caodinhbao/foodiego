require('dotenv').config();
const db = require('../src/config/db');

const stmts = [
  // Feature 1: notes column on orders
  'ALTER TABLE orders ADD COLUMN notes TEXT DEFAULT NULL AFTER delivery_fee',

  // Feature 2: order_status_logs table
  `CREATE TABLE IF NOT EXISTS order_status_logs (
    id INT AUTO_INCREMENT PRIMARY KEY,
    order_id INT NOT NULL,
    status ENUM('pending','accepted','preparing','delivering','completed','cancelled') NOT NULL,
    changed_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE
  )`,
  'CREATE INDEX idx_status_logs_order ON order_status_logs(order_id)',

  // Feature 3: loyalty_points table
  `CREATE TABLE IF NOT EXISTS loyalty_points (
    id INT AUTO_INCREMENT PRIMARY KEY,
    customer_id INT NOT NULL,
    order_id INT DEFAULT NULL,
    points INT NOT NULL,
    description VARCHAR(200) NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (customer_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE SET NULL
  )`,
  'CREATE INDEX idx_loyalty_customer ON loyalty_points(customer_id)',

  // Feature 4: flash_sales table
  `CREATE TABLE IF NOT EXISTS flash_sales (
    id INT AUTO_INCREMENT PRIMARY KEY,
    menu_item_id INT NOT NULL,
    discount_percent TINYINT NOT NULL,
    start_time DATETIME NOT NULL,
    end_time DATETIME NOT NULL,
    created_by INT NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (menu_item_id) REFERENCES menu_items(id) ON DELETE CASCADE,
    FOREIGN KEY (created_by) REFERENCES users(id) ON DELETE CASCADE
  )`,
  'CREATE INDEX idx_flash_sales_item ON flash_sales(menu_item_id)',
  'CREATE INDEX idx_flash_sales_time ON flash_sales(start_time, end_time)',
];

(async () => {
  let ok = 0, skip = 0;
  for (const stmt of stmts) {
    try {
      await db.query(stmt);
      console.log('✅ OK:', stmt.substring(0, 70).replace(/\s+/g, ' '));
      ok++;
    } catch (e) {
      // Duplicate column / index is fine
      if (e.code === 'ER_DUP_FIELDNAME' || e.code === 'ER_DUP_KEYNAME' || e.message.includes('Duplicate')) {
        console.log('⚠️  SKIP (already exists):', e.message.substring(0, 80));
        skip++;
      } else {
        console.error('❌ ERR:', e.message);
      }
    }
  }
  console.log(`\nDone: ${ok} applied, ${skip} skipped`);
  process.exit(0);
})();
