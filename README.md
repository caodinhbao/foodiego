# 🍜 FoodieGo — Hệ thống đặt món trực tuyến

> **Đồ án môn SPQM** | Sprint 5 ngày | Node.js + MySQL (XAMPP) + FastAPI  
> Trọng tâm: **LEAN + Lead Time + Measurement**

---

## 📌 Giới thiệu

FoodieGo là hệ thống đặt món trực tuyến cho phép:

- **Customer** xem nhà hàng, xem menu, đặt món, theo dõi trạng thái đơn hàng
- **Restaurant Owner** quản lý thông tin nhà hàng, thêm/sửa/xóa món, xử lý đơn hàng
- **Admin** quản lý người dùng và phân quyền hệ thống

---

## 👥 Thành viên nhóm

| Thành viên | Vai trò chính |
|------------|---------------|
| 🔵 Thành viên A (Bảo) | Team Lead — Auth + Users + CI/CD + Frontend |
| 🟢 Thành viên B | Backend — Restaurants + Menu Items + DB Schema |
| 🟡 Thành viên C | Backend — Orders + FastAPI Delivery Service |

---

## 🏗️ Tech Stack

| Thành phần | Công nghệ |
|-----------|-----------|
| Backend | Node.js 18 + Express |
| Database | **MySQL 8 (XAMPP)** |
| ORM/Driver | `mysql2/promise` |
| Auth | JWT + bcryptjs + Role-based Authorization |
| Service phụ | Python FastAPI (tính phí giao hàng) |
| Frontend | HTML + Vanilla CSS + Vanilla JS (Dark mode, Glassmorphism) |
| Test | Jest 29 + Supertest (42 test cases) |
| Quality | ESLint + Jest Coverage ≥ 80% |
| CI/CD | GitHub Actions |

---

## 🚀 Cách chạy

### Yêu cầu

- **XAMPP** (MySQL đang chạy)
- Node.js >= 18
- Python >= 3.10 (nếu dùng delivery-service)

### Bước 1 — Tạo database (chỉ làm 1 lần)

Mở **phpMyAdmin** (`http://localhost/phpmyadmin`) → tab **SQL** → paste và chạy file:

```
backend/migrations/002_mysql.sql
```

Hoặc dùng PowerShell (nếu MySQL trong PATH):

```powershell
mysql -u root -e "source backend/migrations/002_mysql.sql"
```

### Bước 2 — Cấu hình môi trường

Kiểm tra file `backend/.env` (XAMPP mặc định dùng root không password):

```env
PORT=3000
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=
DB_NAME=foodiego_db
JWT_SECRET=foodiego_super_secret_key_2024
JWT_EXPIRES_IN=7d
DELIVERY_SERVICE_URL=http://localhost:8000
NODE_ENV=development
```

### Bước 3 — Chạy backend + frontend

```powershell
cd backend
npm install
npm run dev
```

Thấy dòng này là thành công:
```
🚀 FoodieGo backend running on http://localhost:3000
```

### Bước 4 — Mở trình duyệt

| URL | Trang |
|-----|-------|
| `http://localhost:3000` | 🏠 Trang chủ (danh sách nhà hàng) |
| `http://localhost:3000/login.html` | 🔐 Đăng nhập / Đăng ký |
| `http://localhost:3000/restaurant.html` | 🍽️ Menu & Đặt món |
| `http://localhost:3000/orders.html` | 📦 Đơn hàng của tôi |
| `http://localhost:3000/admin.html` | ⚙️ Admin Panel |

> ⚠️ **Lưu ý**: Phải mở qua `http://localhost:3000` — **không** mở file HTML trực tiếp bằng double-click.

### Chạy delivery service (tùy chọn)

```powershell
cd delivery-service
pip install -r requirements.txt
uvicorn main:app --reload --port 8000
```

### Chạy test

```powershell
cd backend
npm test              # 42 test cases
npm run test:coverage # Coverage report
npm run lint          # ESLint check
```

---

## 📡 API Endpoints

### Auth

| Method | Endpoint | Mô tả | Auth |
|--------|----------|-------|------|
| POST | `/api/auth/register` | Đăng ký tài khoản | ❌ |
| POST | `/api/auth/login` | Đăng nhập, nhận JWT | ❌ |
| GET | `/api/auth/profile` | Thông tin người dùng hiện tại | ✅ JWT |

### Users (Admin only)

| Method | Endpoint | Mô tả | Auth |
|--------|----------|-------|------|
| GET | `/api/users` | Danh sách tất cả users | 🛡️ Admin |
| PATCH | `/api/users/:id/role` | Cập nhật role user | 🛡️ Admin |

### Restaurants

| Method | Endpoint | Mô tả | Auth |
|--------|----------|-------|------|
| POST | `/api/restaurants` | Tạo nhà hàng | 🏪 Owner |
| GET | `/api/restaurants` | Danh sách nhà hàng active | ❌ |
| GET | `/api/restaurants/:id` | Chi tiết nhà hàng | ❌ |
| PATCH | `/api/restaurants/:id` | Cập nhật nhà hàng | 🏪 Owner |

### Menu Items

| Method | Endpoint | Mô tả | Auth |
|--------|----------|-------|------|
| POST | `/api/restaurants/:id/menu-items` | Thêm món vào menu | 🏪 Owner |
| GET | `/api/restaurants/:id/menu-items` | Xem menu nhà hàng | ❌ |
| PATCH | `/api/menu-items/:id` | Sửa thông tin món | 🏪 Owner |
| DELETE | `/api/menu-items/:id` | Xóa món | 🏪 Owner |

### Orders

| Method | Endpoint | Mô tả | Auth |
|--------|----------|-------|------|
| POST | `/api/orders` | Tạo đơn hàng | 🧑 Customer |
| GET | `/api/orders/my` | Danh sách đơn của tôi | 🧑 Customer |
| GET | `/api/orders/:id` | Chi tiết đơn hàng | Customer / Owner |
| PATCH | `/api/orders/:id/status` | Cập nhật trạng thái đơn | 🏪 Owner |

### Delivery Fee Service (FastAPI)

| Method | Endpoint | Mô tả |
|--------|----------|-------|
| POST | `/delivery-fee/calculate` | Tính phí giao hàng |

```json
// Request
{ "distance_km": 3.5, "order_amount": 150000 }

// Response
{ "delivery_fee": 25000 }
```

---

## 🔄 Order Status Flow

```
pending → accepted → preparing → delivering → completed
                  ↘                         ↗
                   → cancelled ─────────────
```

---

## 🗄️ Database Schema — MySQL

```sql
users          (id, name, email, password_hash, role ENUM, created_at)
restaurants    (id, owner_id→users, name, address, phone, status ENUM, created_at)
menu_items     (id, restaurant_id→restaurants, name, description, price, is_available, created_at)
orders         (id, customer_id→users, restaurant_id, total_amount, delivery_fee, status ENUM, created_at)
order_items    (id, order_id→orders, menu_item_id→menu_items, quantity, unit_price)
reviews        (id, customer_id→users, restaurant_id, rating, comment, created_at)
```

Migration file: [`backend/migrations/002_mysql.sql`](backend/migrations/002_mysql.sql)

---

## 📁 Cấu trúc thư mục

```
foodiego/
├── frontend/                        ← Giao diện web (HTML/CSS/JS)
│   ├── index.html                   ← Trang chủ, danh sách nhà hàng
│   ├── login.html                   ← Đăng nhập / Đăng ký
│   ├── restaurant.html              ← Menu & Đặt món
│   ├── orders.html                  ← Theo dõi đơn hàng
│   ├── admin.html                   ← Admin panel (quản lý users)
│   ├── css/
│   │   └── style.css                ← Global styles (Dark mode, Glassmorphism)
│   └── js/
│       └── api.js                   ← API wrapper & auth helpers
│
├── backend/
│   ├── src/
│   │   ├── app.js                   ← Express app + static file serving
│   │   ├── server.js                ← HTTP server entry point
│   │   ├── config/
│   │   │   └── db.js                ← MySQL connection pool (mysql2/promise)
│   │   ├── middlewares/
│   │   │   ├── authenticate.js      ← JWT verification middleware
│   │   │   └── authorize.js         ← Role-based access control
│   │   ├── modules/
│   │   │   ├── auth/                ← register, login, profile
│   │   │   ├── users/               ← admin user management
│   │   │   ├── restaurants/         ← CRUD nhà hàng
│   │   │   ├── menu-items/          ← CRUD món ăn
│   │   │   └── orders/              ← Đặt hàng & cập nhật status
│   │   └── tests/
│   │       └── integration/
│   │           ├── auth.integration.test.js
│   │           └── orders.integration.test.js
│   ├── migrations/
│   │   ├── 001_init.sql             ← PostgreSQL schema (gốc)
│   │   └── 002_mysql.sql            ← MySQL schema (đang dùng)
│   ├── .env                         ← Cấu hình môi trường (không commit)
│   ├── package.json
│   └── Dockerfile
│
├── delivery-service/                ← FastAPI tính phí giao hàng
│   ├── main.py
│   ├── test_main.py
│   ├── requirements.txt
│   └── Dockerfile
│
├── docs/
│   ├── sprint-5days.md              ← Kế hoạch 5 ngày chi tiết
│   ├── backlog.md                   ← User stories & sprint backlog
│   ├── process-etvx.md              ← Quy trình ETVX
│   └── metrics.md                   ← Metrics đo lường
│
├── .github/
│   └── workflows/
│       └── ci.yml                   ← CI: Lint + Test + Delivery-service test
├── setup-db.ps1                     ← Script tự động tạo DB (PowerShell)
├── start-backend.bat                ← Shortcut khởi động backend (Windows)
├── docker-compose.yml
└── README.md
```

---

## 🧪 Test Coverage

| File | Loại | Tests | Thành viên |
|------|------|-------|-----------|
| `auth.test.js` | Unit | 9 | 🔵 A (Bảo) |
| `restaurants.test.js` | Unit | 7 | 🟢 B |
| `orders.test.js` | Unit | 9 | 🟡 C |
| `auth.integration.test.js` | Integration | 9 | 🔵 A (Bảo) |
| `orders.integration.test.js` | Integration | 8 | 🟡 C |
| **Tổng** | | **42** | |

---

## 📊 Quality Metrics (mục tiêu)

| Metric | Target |
|--------|--------|
| Test Coverage | ≥ 80% |
| CI Fail Rate | ≤ 10% |
| Lead Time (PR) | ≤ 1 ngày |
| ESLint Errors | 0 |

---

## ✅ Definition of Done

Một task được coi là **hoàn thành** khi:

- [ ] Code đúng yêu cầu user story
- [ ] Có unit test hoặc integration test liên quan
- [ ] ESLint không có lỗi (0 errors)
- [ ] Test pass trên local
- [ ] Đã tạo Pull Request
- [ ] Ít nhất 1 thành viên review và approve
- [ ] GitHub Actions CI pass (xanh)
- [ ] Coverage không giảm xuống dưới 80%

---

## 📚 Tài liệu SPQM

- [📅 Kế hoạch 5 ngày](docs/sprint-5days.md)
- [📋 Backlog & User Stories](docs/backlog.md)
- [🔄 Quy trình ETVX](docs/process-etvx.md)
- [📊 Metrics & Measurement](docs/metrics.md)

---

## 🌿 Git Branching

| Branch | Mục đích |
|--------|---------|
| `main` | Production-ready code |
| `develop` | Integration branch |
| `feature/setup-express-ci` | Ngày 1 — Setup & CI ✅ |
| `feature/auth-middleware` | Ngày 2 — Auth & Middleware ✅ |
| `feature/users-test` | Ngày 3 — Users API & Tests ✅ |

---

*FoodieGo © 2024 — Đồ án SPQM*
