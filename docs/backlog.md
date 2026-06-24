# 📝 Product Backlog — FoodieGo

> Backlog ưu tiên theo mức độ quan trọng (P0 → P3).  
> Cập nhật theo sprint. Gán người phụ trách theo phân công nhóm.

---

## 👥 Phân công nhóm

| Ký hiệu | Thành viên | Vai trò |
|---------|-----------|---------|
| **A** | Thành viên A | Team Lead — Auth + Users + CI/CD + SonarQube |
| **B** | Thành viên B | Backend — Restaurants + Menu Items + DB Schema |
| **C** | Thành viên C | Backend — Orders + FastAPI Delivery Service |

> ℹ️ **Lưu ý phân công**: Mỗi người viết test cho phần mình làm. Mỗi PR do 1 người khác review.

---

## 🔴 P0 — Bắt buộc (Core MVP)

| ID | User Story | Task kỹ thuật | Assign | Status |
|----|-----------|--------------|--------|--------|
| US-01 | *As a customer*, I want to register an account so that I can use the system. | `POST /api/auth/register` — validate input, hash password, lưu DB | A | ⬜ Todo |
| US-02 | *As a customer*, I want to log in so that I can access my account. | `POST /api/auth/login` — kiểm tra credentials, trả JWT | A | ⬜ Todo |
| US-03 | *As a user*, I want to view my profile so that I can see my account info. | `GET /api/auth/profile` — decode JWT, trả thông tin user | A | ⬜ Todo |
| US-04 | *As a customer*, I want to see a list of restaurants so that I can choose where to order. | `GET /api/restaurants` — list tất cả nhà hàng active | B | ⬜ Todo |
| US-05 | *As a customer*, I want to see the menu of a restaurant so that I can pick dishes. | `GET /api/restaurants/:id/menu-items` — list món theo nhà hàng | B | ⬜ Todo |
| US-06 | *As a customer*, I want to create an order so that I can order food. | `POST /api/orders` — tạo đơn, tính tổng tiền, gọi delivery-service tính phí | C | ⬜ Todo |
| US-07 | *As a restaurant owner*, I want to update order status so that I can manage fulfillment. | `PATCH /api/orders/:id/status` — cập nhật trạng thái theo flow | C | ⬜ Todo |

---

## 🟠 P1 — Quan trọng (Level 2 Requirements)

| ID | User Story | Task kỹ thuật | Assign | Status |
|----|-----------|--------------|--------|--------|
| US-08 | *As a system*, JWT auth và phân quyền theo role hoạt động đúng. | Middleware `authenticate` + `authorize(role)` | A | ⬜ Todo |
| US-09 | *As a developer*, môi trường chạy được bằng Docker Compose. | Viết `docker-compose.yml`, `Dockerfile` cho backend + FastAPI | A | ⬜ Todo |
| US-10 | *As a restaurant owner*, I want to create and manage my restaurant profile. | `POST /api/restaurants`, `PATCH /api/restaurants/:id` | B | ⬜ Todo |
| US-11 | *As a restaurant owner*, I want to add/edit/delete menu items. | `POST`, `PATCH`, `DELETE` menu-items endpoints | B | ⬜ Todo |
| US-12 | *As a customer*, I want to view my order history and order details. | `GET /api/orders/my`, `GET /api/orders/:id` | C | ⬜ Todo |
| US-13 | *As a developer*, Order API có unit test và integration test. | Jest + Supertest cho orders module — coverage ≥ 80% | C | ⬜ Todo |
| US-14 | *As a developer*, Auth API có unit test. | Jest unit test cho auth service | A | ⬜ Todo |
| US-15 | *As a team*, GitHub Actions tự động chạy lint + test trên mỗi PR. | Viết `.github/workflows/ci.yml` | A | ⬜ Todo |
| US-16 | *As a team*, SonarQube được tích hợp để phân tích chất lượng code. | Cấu hình SonarQube + token trong CI | A | ⬜ Todo |
| US-17 | *As an admin*, I want to see a list of all users. | `GET /api/users` — chỉ Admin được gọi | A | ⬜ Todo |
| US-18 | *As an admin*, I want to update user roles. | `PATCH /api/users/:id/role` — chỉ Admin | A | ⬜ Todo |

---

## 🟡 P2 — Mở rộng (SPQM + extra)

| ID | User Story | Task kỹ thuật | Assign | Status |
|----|-----------|--------------|--------|--------|
| US-19 | *As a system*, tính phí giao hàng tự động qua FastAPI service. | `POST /delivery-fee/calculate` — Python FastAPI | C | ⬜ Todo |
| US-20 | *As a customer*, I want to leave a review for a restaurant. | `POST /api/reviews`, `GET /api/restaurants/:id/reviews` | B | ⬜ Todo |
| US-21 | *As a team*, đo và báo cáo metrics Lead Time, Coverage, CI Fail Rate. | Thu thập từ GitHub + Sonar, ghi vào `docs/metrics.md` | Cả nhóm | ⬜ Todo |
| US-22 | *As a developer*, README đầy đủ hướng dẫn chạy và API docs. | Cập nhật README.md | A | ⬜ Todo |

---

## ⚪ P3 — Optional (nếu còn thời gian)

| ID | User Story | Task kỹ thuật | Assign | Status |
|----|-----------|--------------|--------|--------|
| US-23 | *As an admin*, I want a dashboard showing order statistics. | Aggregate query + endpoint thống kê | C | ⬜ Todo |
| US-24 | *As a customer*, I want to search restaurants by name or cuisine. | `GET /api/restaurants?search=...` | B | ⬜ Todo |
| US-25 | *As a restaurant owner*, I want to see my revenue summary. | Aggregate query cho owner | C | ⬜ Todo |

---

## 📅 Sprint Plan (đề xuất)

### Sprint 1 — Foundation (Tuần 1–2)

**Mục tiêu**: Setup hạ tầng + Auth + DB hoàn chỉnh

| Task | Assign | Deadline |
|------|--------|---------|
| Setup repo, Docker Compose, PostgreSQL schema | B | Ngày 3 |
| Auth: register, login, profile (US-01, 02, 03) | A | Ngày 5 |
| JWT middleware + phân quyền (US-08) | A | Ngày 5 |
| Restaurant CRUD (US-10) | B | Ngày 7 |
| Menu Items CRUD (US-11) | B | Ngày 7 |
| GitHub Actions CI (US-15) | A | Ngày 5 |

**Kết quả kỳ vọng**: CI chạy được, Auth hoạt động, có thể tạo nhà hàng và menu.

---

### Sprint 2 — Core Business Logic (Tuần 2–3)

**Mục tiêu**: Orders hoàn chỉnh + FastAPI + Test

| Task | Assign | Deadline |
|------|--------|---------|
| Order create (US-06) | C | Ngày 10 |
| Order status update (US-07) | C | Ngày 10 |
| Order list + detail (US-12) | C | Ngày 11 |
| FastAPI delivery-service (US-19) | C | Ngày 12 |
| Unit test Auth (US-14) | A | Ngày 12 |
| Integration test Orders (US-13) | C | Ngày 12 |
| Admin: users list + update role (US-17, 18) | A | Ngày 13 |
| SonarQube config (US-16) | A | Ngày 13 |

**Kết quả kỳ vọng**: Toàn bộ flow order hoạt động, coverage ≥ 80%, Sonar chạy.

---

### Sprint 3 — Quality & SPQM Report (Tuần 3–4)

**Mục tiêu**: Hoàn thiện chất lượng, đo metrics, viết báo cáo

| Task | Assign | Deadline |
|------|--------|---------|
| Thu thập và ghi metrics (US-21) | Cả nhóm | Ngày 16 |
| Retrospective Sprint 1 + 2 | Cả nhóm | Ngày 16 |
| Review + P2 features nếu kịp | B, C | Ngày 18 |
| Hoàn thiện README + docs (US-22) | A | Ngày 19 |
| Viết báo cáo SPQM | Cả nhóm | Ngày 21 |

---

## 📊 Trạng thái Backlog

| Priority | Tổng | Todo | In Progress | Done |
|----------|------|------|-------------|------|
| P0 | 7 | 7 | 0 | 0 |
| P1 | 11 | 11 | 0 | 0 |
| P2 | 4 | 4 | 0 | 0 |
| P3 | 3 | 3 | 0 | 0 |
| **Tổng** | **25** | **25** | **0** | **0** |

---

## 🔗 Liên kết

- [README](../README.md)
- [Quy trình ETVX](process-etvx.md)
- [Metrics](metrics.md)

---

*Cập nhật lần cuối: Sprint 0 — ngày khởi động dự án*
