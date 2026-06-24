-- ============================================================
--  FoodieGo — Database Schema
--  File: migrations/001_init.sql
--  Thành viên B tạo (Ngày 1)
--  Chạy: psql -U foodiego -d foodiego_db -f migrations/001_init.sql
-- ============================================================

-- Enum types
CREATE TYPE user_role AS ENUM ('customer', 'restaurant', 'admin');
CREATE TYPE restaurant_status AS ENUM ('active', 'inactive', 'pending');
CREATE TYPE order_status AS ENUM ('pending', 'accepted', 'preparing', 'delivering', 'completed', 'cancelled');

-- ── users ──────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS users (
  id            SERIAL PRIMARY KEY,
  name          VARCHAR(100) NOT NULL,
  email         VARCHAR(255) NOT NULL UNIQUE,
  password_hash TEXT NOT NULL,
  role          user_role NOT NULL DEFAULT 'customer',
  created_at    TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ── restaurants ────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS restaurants (
  id         SERIAL PRIMARY KEY,
  owner_id   INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  name       VARCHAR(200) NOT NULL,
  address    TEXT NOT NULL,
  phone      VARCHAR(20),
  status     restaurant_status NOT NULL DEFAULT 'active',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ── menu_items ─────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS menu_items (
  id            SERIAL PRIMARY KEY,
  restaurant_id INTEGER NOT NULL REFERENCES restaurants(id) ON DELETE CASCADE,
  name          VARCHAR(200) NOT NULL,
  description   TEXT,
  price         NUMERIC(10, 2) NOT NULL CHECK (price > 0),
  is_available  BOOLEAN NOT NULL DEFAULT true,
  created_at    TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ── orders ─────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS orders (
  id            SERIAL PRIMARY KEY,
  customer_id   INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  restaurant_id INTEGER NOT NULL REFERENCES restaurants(id),
  total_amount  NUMERIC(12, 2) NOT NULL CHECK (total_amount >= 0),
  delivery_fee  NUMERIC(10, 2) NOT NULL DEFAULT 0,
  status        order_status NOT NULL DEFAULT 'pending',
  created_at    TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ── order_items ────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS order_items (
  id           SERIAL PRIMARY KEY,
  order_id     INTEGER NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  menu_item_id INTEGER NOT NULL REFERENCES menu_items(id),
  quantity     INTEGER NOT NULL CHECK (quantity > 0),
  unit_price   NUMERIC(10, 2) NOT NULL CHECK (unit_price > 0)
);

-- ── reviews ────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS reviews (
  id            SERIAL PRIMARY KEY,
  customer_id   INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  restaurant_id INTEGER NOT NULL REFERENCES restaurants(id) ON DELETE CASCADE,
  rating        SMALLINT NOT NULL CHECK (rating BETWEEN 1 AND 5),
  comment       TEXT,
  created_at    TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE (customer_id, restaurant_id) -- mỗi customer chỉ review 1 lần
);

-- ── Indexes ────────────────────────────────────────────────────────────────
CREATE INDEX IF NOT EXISTS idx_restaurants_owner ON restaurants(owner_id);
CREATE INDEX IF NOT EXISTS idx_menu_items_restaurant ON menu_items(restaurant_id);
CREATE INDEX IF NOT EXISTS idx_orders_customer ON orders(customer_id);
CREATE INDEX IF NOT EXISTS idx_orders_restaurant ON orders(restaurant_id);
CREATE INDEX IF NOT EXISTS idx_order_items_order ON order_items(order_id);
