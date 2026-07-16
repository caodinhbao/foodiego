# 🍜 FoodieGo — Hệ thống đặt món trực tuyến

> **Đồ án môn SPQM** | Level 2 | Node.js + MySQL + FastAPI + Docker  
> Trọng tâm: **LEAN + Lead Time + Measurement**

---

## 📌 Giới thiệu

FoodieGo là hệ thống đặt món trực tuyến cho phép:

- **Customer** xem nhà hàng, xem menu, đặt món, theo dõi trạng thái đơn hàng
- **Restaurant Owner** quản lý thông tin nhà hàng, thêm/sửa/xóa món, xử lý đơn hàng
- **Admin** quản lý người dùng, nhà hàng và theo dõi thống kê hệ thống

---

## 👥 Thành viên nhóm

| Thành viên | Mã số SV | Vai trò chính |
|------------|----------|---------------|
| CAO ĐÌNH BẢO | 29219051113 | Team Lead — Auth + Users + CI/CD |
| VÕ DUY HOÀNG | 29219020704 | Backend — Restaurants + Menu Items |
| PHẠM HẢI THIÊN | 29219020597 | Backend — Orders + Delivery Service (FastAPI) |

---

## 🏗️ Tech Stack

| Thành phần | Công nghệ |
|-----------|-----------|
| Backend chính | Node.js + Express |
| Database | MySQL |
| Auth | JWT + Role-based Authorization |
| Service phụ | Python FastAPI (tính phí giao hàng) |
| Test | Jest + Supertest |
| Quality | ESLint + SonarQube |
| CI/CD | GitHub Actions |
| Deploy local | Docker Compose |

---

## 🚀 Cách chạy

### Yêu cầu

- Docker & Docker Compose
- Node.js >= 18
- Python >= 3.10 (nếu chạy delivery-service riêng)

### Chạy toàn bộ hệ thống với Docker Compose

```bash
# Clone repo
git clone https://github.com/<your-org>/foodiego.git
cd foodiego

# Copy file cấu hình môi trường
cp backend/.env.example backend/.env

# Khởi động tất cả services
docker-compose up --build
```

Sau khi khởi động:

| Service | URL |
|---------|-----|
| Backend API | http://localhost:3000 |
| Delivery Fee Service | http://localhost:8000 |
| MySQL | localhost:3306 |

### Chạy backend riêng (Dùng XAMPP / MySQL cục bộ)

Nếu bạn không cài Docker, bạn có thể chạy thủ công bằng XAMPP:
1. Bật **MySQL** trên XAMPP Control Panel.
2. Mở phần mềm **Navicat** (hoặc phpMyAdmin), kết nối vào localhost, tạo database tên là `foodiego_db`.
3. Mở file `backend/migrations/002_mysql.sql` bằng Navicat và chạy (Run) toàn bộ file để tạo bảng.
4. Copy file cấu hình môi trường:
   ```bash
   cd backend
   cp .env.example .env
   ```
5. Cài đặt thư viện và chạy:
   ```bash
   npm install
   npm run dev
   ```

### Chạy delivery service riêng

```bash
cd delivery-service
pip install -r requirements.txt
uvicorn main:app --reload --port 8000
```

### Chạy Giao diện (Frontend)
1. Mở thư mục `frontend/`.
2. Mở file `index.html` bằng trình duyệt (Chrome/Edge) hoặc dùng extension **Live Server** trên VSCode.
3. Hệ thống đã được tích hợp sẵn để gọi tới `http://localhost:3000` (Backend của bạn).

### Chạy test

```bash
cd backend
npm test              # Unit + Integration tests
npm run test:coverage # Xem coverage report
npm run lint          # ESLint
```

---

## 📡 API Endpoints

### Auth

| Method | Endpoint | Mô tả | Auth |
|--------|----------|-------|------|
| POST | `/api/auth/register` | Đăng ký tài khoản | ❌ |
| POST | `/api/auth/login` | Đăng nhập | ❌ |
| GET | `/api/auth/profile` | Lấy thông tin bản thân | ✅ |

### Users

| Method | Endpoint | Mô tả | Auth |
|--------|----------|-------|------|
| GET | `/api/users` | Danh sách users | Admin |
| PATCH | `/api/users/:id/role` | Cập nhật role | Admin |

### Restaurants

| Method | Endpoint | Mô tả | Auth |
|--------|----------|-------|------|
| POST | `/api/restaurants` | Tạo nhà hàng | Restaurant Owner |
| GET | `/api/restaurants` | Danh sách nhà hàng | ❌ |
| GET | `/api/restaurants/:id` | Chi tiết nhà hàng | ❌ |
| PATCH | `/api/restaurants/:id` | Cập nhật nhà hàng | Owner |

### Menu Items

| Method | Endpoint | Mô tả | Auth |
|--------|----------|-------|------|
| POST | `/api/restaurants/:id/menu-items` | Thêm món | Owner |
| GET | `/api/restaurants/:id/menu-items` | Xem menu | ❌ |
| PATCH | `/api/menu-items/:id` | Sửa món | Owner |
| DELETE | `/api/menu-items/:id` | Xóa món | Owner |

### Orders

| Method | Endpoint | Mô tả | Auth |
|--------|----------|-------|------|
| POST | `/api/orders` | Tạo đơn hàng | Customer |
| GET | `/api/orders/my` | Đơn của tôi | Customer |
| GET | `/api/orders/:id` | Chi tiết đơn | Customer / Owner |
| PATCH | `/api/orders/:id/status` | Cập nhật trạng thái | Owner |
| GET | `/api/orders/:id/timeline` | Lịch sử trạng thái đơn | Customer / Owner |
| POST | `/api/orders/apply-voucher` | Áp dụng mã giảm giá | Customer |

### Reviews (Đánh giá)

| Method | Endpoint | Mô tả | Auth |
|--------|----------|-------|------|
| POST | `/api/restaurants/:id/reviews` | Viết đánh giá nhà hàng | Customer |
| GET | `/api/restaurants/:id/reviews` | Xem đánh giá nhà hàng | ❌ |

### Loyalty (Tích điểm)

| Method | Endpoint | Mô tả | Auth |
|--------|----------|-------|------|
| GET | `/api/loyalty/balance` | Xem điểm và hạng thành viên | Customer |
| GET | `/api/loyalty/history` | Xem lịch sử tích/tiêu điểm | Customer |
| POST | `/api/loyalty/redeem` | Đổi điểm lấy mã giảm giá | Customer |

### Flash Sales (Khuyến mãi Giờ Vàng)

| Method | Endpoint | Mô tả | Auth |
|--------|----------|-------|------|
| GET | `/api/flash-sales/active` | Xem các chiến dịch đang chạy | ❌ |
| GET | `/api/flash-sales` | Danh sách chiến dịch | Admin |
| GET | `/api/flash-sales/:id` | Chi tiết chiến dịch | ❌ |

### Admin Analytics

| Method | Endpoint | Mô tả | Auth |
|--------|----------|-------|------|
| GET | `/api/admin/analytics` | Thống kê tổng quan hệ thống | Admin |
| GET | `/api/admin/top-restaurants` | Top 5 nhà hàng doanh thu cao | Admin |
| GET | `/api/admin/top-items` | Top 5 món bán chạy nhất | Admin |
| GET | `/api/admin/users-stats` | Thống kê người dùng theo role | Admin |

### Notifications (Thông báo)

| Method | Endpoint | Mô tả | Auth |
|--------|----------|-------|------|
| GET | `/api/notifications` | Lấy danh sách thông báo | ✅ |
| PATCH | `/api/notifications/read-all` | Đánh dấu đã đọc tất cả | ✅ |

### Delivery Fee Service (FastAPI)

| Method | Endpoint | Mô tả |
|--------|----------|-------|
| POST | `/delivery-fee/calculate` | Tính phí giao hàng |

**Request body:**
```json
{
  "distance_km": 3.5,
  "order_amount": 150000
}
```

**Response:**
```json
{
  "delivery_fee": 25000
}
```

---

## 🔄 Order Status Flow

```
ORDER → accepted → preparing → delivering → completed
                                            → cancelled
```

---

## 🗄️ Database Schema (tóm tắt)

```
users (id, name, email, password_hash, role, created_at)
restaurants (id, owner_id, name, address, phone, status, created_at)
menu_items (id, restaurant_id, name, description, price, is_available, created_at)
orders (id, customer_id, restaurant_id, total_amount, delivery_fee, status, created_at)
order_items (id, order_id, menu_item_id, quantity, unit_price)
reviews (id, customer_id, restaurant_id, rating, comment, created_at)
loyalty_points (id, customer_id, order_id, points, description, created_at)
flash_sales (id, name, start_time, end_time, status, created_at)
flash_sale_items (id, flash_sale_id, menu_item_id, discount_percent, created_at)
order_status_logs (id, order_id, status, changed_by, changed_at)
notifications (id, user_id, title, body, is_read, type, reference_id, created_at)
```

---

## 📊 Quality Metrics (mục tiêu)

| Metric | Baseline | Target |
|--------|----------|--------|
| Test Coverage | ~45% | ≥ 80% |
| CI Fail Rate | ~35% | ≤ 10% |
| Lead Time (PR) | ~2 ngày | ≤ 1 ngày |
| SonarQube Issues | ~30 | ≤ 10 |

### 📸 SonarQube Dashboard Screenshot

> **[TODO]:** Dán ảnh chụp màn hình kết quả SonarQube của bạn vào thư mục `docs/images/sonarqube.png` và hiển thị nó ở đây.
> ![SonarQube Result](docs/images/sonarqube.png)

---

## 📁 Cấu trúc thư mục

```
foodiego/
├── backend/
│   ├── migrations/
│   ├── scripts/
│   ├── src/
│   │   ├── config/
│   │   ├── middlewares/
│   │   ├── modules/
│   │   │   ├── admin/
│   │   │   ├── auth/
│   │   │   ├── flash-sales/
│   │   │   ├── loyalty/
│   │   │   ├── menu-items/
│   │   │   ├── notifications/
│   │   │   ├── orders/
│   │   │   ├── restaurants/
│   │   │   └── users/
│   │   ├── tests/
│   │   ├── app.js
│   │   └── server.js
│   ├── package.json
│   └── Dockerfile
├── delivery-service/
│   ├── main.py
│   ├── requirements.txt
│   └── Dockerfile
├── frontend/
│   ├── css/
│   │   └── style.css
│   ├── js/
│   │   └── api.js
│   ├── index.html
│   ├── login.html
│   ├── admin.html
│   └── ... (các file HTML khác)
├── docs/
│   ├── architecture.md
│   ├── backlog.md
│   ├── features-guide.md
│   ├── metrics.md
│   ├── process-etvx.md
│   ├── retrospective.md
│   └── project-plan.md
├── .github/
│   └── workflows/
│       └── ci.yml
├── docker-compose.yml
└── README.md
```

---

## ✅ Definition of Done

Một task được xem là **hoàn thành** khi đáp ứng đủ các tiêu chí:

- [ ] Code đúng yêu cầu user story
- [ ] Có unit test hoặc integration test liên quan
- [ ] ESLint không có lỗi
- [ ] Test pass trên local
- [ ] Đã tạo Pull Request
- [ ] Ít nhất 1 thành viên review và approve
- [ ] GitHub Actions pipeline pass (CI xanh)
- [ ] Coverage không giảm xuống dưới 80%
- [ ] API được cập nhật trong README hoặc docs

---

## 📚 Tài liệu SPQM

- [Quy trình ETVX](docs/process-etvx.md)
- [Backlog & User Stories](docs/backlog.md)
- [Metrics & Measurement](docs/metrics.md)

---

*FoodieGo © 2024 — Đồ án SPQM*
