# 📝 Product Backlog — FoodieGo

> Backlog ưu tiên theo mức độ quan trọng (P0 → P3).  
> Cập nhật theo sprint. Gán người phụ trách theo phân công nhóm.

---

## 👥 Phân công nhóm

| Ký hiệu | Thành viên | Vai trò |
|---------|-----------|---------|
| 🔵 **A** | Thành viên A (Bảo) | Team Lead — Auth + Users + CI/CD + Frontend |
| 🟢 **B** | Thành viên B | Backend — Restaurants + Menu Items + DB Schema |
| 🟡 **C** | Thành viên C | Backend — Orders + FastAPI Delivery Service |

> ℹ️ **Lưu ý phân công**: Mỗi người viết test cho phần mình làm. Mỗi PR do 1 người khác review.

---

## 🔴 P0 — Bắt buộc (Core MVP)

| ID | User Story | Task kỹ thuật | Assign | Status |
|----|-----------|--------------|--------|--------|
| US-01 | *As a customer*, I want to register an account so that I can use the system. | `POST /api/auth/register` — validate input, hash password, lưu DB | 🔵 A | ✅ Done |
| US-02 | *As a customer*, I want to log in so that I can access my account. | `POST /api/auth/login` — kiểm tra credentials, trả JWT | 🔵 A | ✅ Done |
| US-03 | *As a user*, I want to view my profile so that I can see my account info. | `GET /api/auth/profile` — decode JWT, trả thông tin user | 🔵 A | ✅ Done |
| US-04 | *As a customer*, I want to see a list of restaurants so that I can choose where to order. | `GET /api/restaurants` — list tất cả nhà hàng active | 🟢 B | ✅ Done |
| US-05 | *As a customer*, I want to see the menu of a restaurant so that I can pick dishes. | `GET /api/restaurants/:id/menu-items` — list món theo nhà hàng | 🟢 B | ✅ Done |
| US-06 | *As a customer*, I want to create an order so that I can order food. | `POST /api/orders` — tạo đơn, tính tổng tiền, gọi delivery-service tính phí | 🟡 C | ✅ Done |
| US-07 | *As a restaurant owner*, I want to update order status so that I can manage fulfillment. | `PATCH /api/orders/:id/status` — cập nhật trạng thái theo flow | 🟡 C | ✅ Done |

---

## 🟠 P1 — Quan trọng (Level 2 Requirements)

| ID | User Story | Task kỹ thuật | Assign | Status |
|----|-----------|--------------|--------|--------|
| US-08 | *As a system*, JWT auth và phân quyền theo role hoạt động đúng. | Middleware `authenticate` + `authorize(role)` | 🔵 A | ✅ Done |
| US-09 | *As a developer*, môi trường chạy được bằng Docker Compose. | Viết `docker-compose.yml`, `Dockerfile` cho backend + FastAPI | 🟢 B | 🔄 In Progress |
| US-10 | *As a restaurant owner*, I want to create and manage my restaurant profile. | `POST /api/restaurants`, `PATCH /api/restaurants/:id` | 🟢 B | ✅ Done |
| US-11 | *As a restaurant owner*, I want to add/edit/delete menu items. | `POST`, `PATCH`, `DELETE` menu-items endpoints | 🟢 B | ✅ Done |
| US-12 | *As a customer*, I want to view my order history and order details. | `GET /api/orders/my`, `GET /api/orders/:id` | 🟡 C | ✅ Done |
| US-13 | *As a developer*, Order API có unit test và integration test. | Jest + Supertest cho orders module — coverage ≥ 80% | 🟡 C | ✅ Done |
| US-14 | *As a developer*, Auth API có unit test. | Jest unit test cho auth service (9 test cases) | 🔵 A | ✅ Done |
| US-15 | *As a team*, GitHub Actions tự động chạy lint + test trên mỗi PR. | Viết `.github/workflows/ci.yml` — MySQL + feature/** trigger | 🔵 A | ✅ Done |
| US-16 | *As a team*, SonarQube được tích hợp để phân tích chất lượng code. | Cấu hình SonarQube + token trong CI | 🔵 A | ⬜ Todo |
| US-17 | *As an admin*, I want to see a list of all users. | `GET /api/users` — chỉ Admin được gọi | 🔵 A | ✅ Done |
| US-18 | *As an admin*, I want to update user roles. | `PATCH /api/users/:id/role` — chỉ Admin | 🔵 A | ✅ Done |

---

## 🟡 P2 — Mở rộng (SPQM + extra)

| ID | User Story | Task kỹ thuật | Assign | Status |
|----|-----------|--------------|--------|--------|
| US-19 | *As a system*, tính phí giao hàng tự động qua FastAPI service. | `POST /delivery-fee/calculate` — Python FastAPI | 🟡 C | ✅ Done |
| US-20 | *As a customer*, I want to leave a review for a restaurant. | `POST /api/reviews`, `GET /api/restaurants/:id/reviews` | 🟢 B | 🟢 Done |
| US-21 | *As a team*, đo và báo cáo metrics Lead Time, Coverage, CI Fail Rate. | Thu thập từ GitHub + Sonar, ghi vào `docs/metrics.md` | Cả nhóm | 🔄 In Progress |
| US-22 | *As a developer*, README đầy đủ hướng dẫn chạy và API docs. | Cập nhật README.md — MySQL/XAMPP + frontend | 🔵 A | ✅ Done |

---

## ⚪ P3 — Optional (nếu còn thời gian)

| ID | User Story | Task kỹ thuật | Assign | Status |
|----|-----------|--------------|--------|--------|
| US-23 | *As an admin*, I want a dashboard showing order statistics. | Aggregate query + endpoint thống kê | 🟡 C | 🟢 Done |
| US-24 | *As a customer*, I want to search restaurants by name or cuisine. | `GET /api/restaurants?search=...` | 🟢 B | 🟢 Done |
| US-25 | *As a restaurant owner*, I want to see my revenue summary. | Aggregate query cho owner | 🟡 C | 🟢 Done |

---

## 📅 Sprint Plan — 5 ngày

> Chi tiết đầy đủ xem [sprint-5days.md](sprint-5days.md)

### Ngày 1 — Setup hạ tầng

| Task | Assign | Status |
|------|--------|--------|
| Tạo repo GitHub, cấu trúc thư mục backend | 🔵 A | ✅ Done |
| Viết `package.json`, cài dependencies | 🔵 A | ✅ Done |
| Cấu hình ESLint | 🔵 A | ✅ Done |
| Viết `.github/workflows/ci.yml` | 🔵 A | ✅ Done |
| Viết `src/app.js` + `src/server.js` | 🔵 A | ✅ Done |
| MySQL schema (`002_mysql.sql`) | 🟢 B | ✅ Done |
| Cấu hình `config/db.js` — mysql2/promise | 🟢 B | ✅ Done |
| FastAPI delivery-service cơ bản | 🟡 C | ✅ Done |

### Ngày 2 — Auth + Restaurants

| Task | Assign | Status |
|------|--------|--------|
| `auth.service.js` + `auth.router.js` | 🔵 A | ✅ Done |
| `middlewares/authenticate.js` | 🔵 A | ✅ Done |
| `middlewares/authorize.js` | 🔵 A | ✅ Done |
| `restaurants.service.js` + `restaurants.router.js` | 🟢 B | ✅ Done |
| `menu-items.service.js` + `menu-items.router.js` | 🟢 B | ✅ Done |
| `orders.model.js` | 🟡 C | ✅ Done |

### Ngày 3 — Orders + Users + Test

| Task | Assign | Status |
|------|--------|--------|
| `users.router.js` + `users.service.js` | 🔵 A | ✅ Done |
| `auth.test.js` — 9 unit tests | 🔵 A | ✅ Done |
| `auth.integration.test.js` — 9 integration tests | 🔵 A | ✅ Done |
| `restaurants.test.js` — 7 unit tests | 🟢 B | ✅ Done |
| `orders.service.js` + `orders.router.js` | 🟡 C | ✅ Done |
| `orders.test.js` — 9 unit tests | 🟡 C | ✅ Done |
| `orders.integration.test.js` — 8 integration tests | 🟡 C | ✅ Done |

### Ngày 4 — Integration Test + Fix CI

| Task | Assign | Status |
|------|--------|--------|
| Fix CI: PostgreSQL → MySQL | 🔵 A | ✅ Done |
| Fix ESLint errors (quotes) | 🔵 A | ✅ Done |
| Review các PR tồn đọng | 🔵 A | 🔄 In Progress |
| Frontend web (login, home, restaurant, orders, admin) | 🔵 A | ✅ Done |
| SonarQube config | 🔵 A | ⬜ Todo |
| Kiểm tra end-to-end toàn bộ flow | 🟡 C | ⬜ Todo |

### Ngày 5 — Docs + Metrics + Báo cáo

| Task | Assign | Status |
|------|--------|--------|
| Cập nhật README.md | 🔵 A | ✅ Done |
| Cập nhật `docs/backlog.md` | 🔵 A | ✅ Done |
| Thu thập CI Fail Rate, Lead Time | 🔵 A | ⬜ Todo |
| Ghi metrics vào `docs/metrics.md` | Cả nhóm | ⬜ Todo |
| Viết `docs/retrospective.md` | Cả nhóm | ⬜ Todo |
| Viết báo cáo SPQM | Cả nhóm | ⬜ Todo |

---

## 📊 Trạng thái Backlog

| Priority | Tổng | Todo | In Progress | Done |
|----------|------|------|-------------|------|
| P0 | 7 | 0 | 0 | 7 |
| P1 | 11 | 1 | 1 | 9 |
| P2 | 4 | 1 | 1 | 2 |
| P3 | 3 | 3 | 0 | 0 |
| **Tổng** | **25** | **5** | **2** | **18** |

---

## 🔗 Liên kết

- [README](../README.md)
- [Kế hoạch 5 ngày](sprint-5days.md)
- [Quy trình ETVX](process-etvx.md)
- [Metrics](metrics.md)

---

*Cập nhật lần cuối: Ngày 4 Sprint — 05/07/2024*
