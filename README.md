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

### Chạy backend riêng (development)

```bash
cd backend
npm install
npm run dev
```

### Chạy delivery service riêng

```bash
cd delivery-service
pip install -r requirements.txt
uvicorn main:app --reload --port 8000
```

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
```

---

## 📊 Quality Metrics (mục tiêu)

| Metric | Baseline | Target |
|--------|----------|--------|
| Test Coverage | ~45% | ≥ 80% |
| CI Fail Rate | ~35% | ≤ 10% |
| Lead Time (PR) | ~2 ngày | ≤ 1 ngày |
| SonarQube Issues | ~30 | ≤ 10 |

---

## 📁 Cấu trúc thư mục

```
foodiego/
├── backend/
│   ├── src/
│   │   ├── app.js
│   │   ├── server.js
│   │   ├── config/
│   │   ├── modules/
│   │   │   ├── auth/
│   │   │   ├── users/
│   │   │   ├── restaurants/
│   │   │   ├── menu-items/
│   │   │   └── orders/
│   │   ├── middlewares/
│   │   └── tests/
│   ├── package.json
│   └── Dockerfile
├── delivery-service/
│   ├── main.py
│   ├── requirements.txt
│   └── Dockerfile
├── docs/
│   ├── spqm-report.md
│   ├── process-etvx.md
│   ├── backlog.md
│   └── metrics.md
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
- [Báo cáo SPQM](docs/spqm-report.md)

---

*FoodieGo © 2024 — Đồ án SPQM*
