# 🗓️ Kế hoạch 5 ngày — FoodieGo

> Sprint duy nhất 5 ngày, tập trung hoàn thành **P0 + P1** (MVP Level 2).  
> Mỗi ngày họp stand-up 10 phút đầu giờ để sync tiến độ.

---

## 👥 Phân công cố định

| Người | Ký hiệu | Phụ trách |
|-------|---------|-----------|
| Thành viên A | 🔵 A | Team Lead — Auth + Users + CI/CD + SonarQube |
| Thành viên B | 🟢 B | Backend — Restaurants + Menu Items + DB Schema |
| Thành viên C | 🟡 C | Backend — Orders + FastAPI Delivery Service |

---

## 📌 Quy tắc làm việc 5 ngày

- Mỗi người làm **trên branch riêng** (`feature/...`), không commit thẳng `main`
- Mỗi PR phải được **1 người khác review** trước khi merge
- Cuối mỗi ngày: **push code + tạo PR** (dù chưa xong 100%)
- Ngày 5 **không thêm feature mới**, chỉ fix, test, và viết docs

---

## 📅 Ngày 1 — Setup hạ tầng & nền tảng

> **Mục tiêu**: Chạy được server, kết nối DB, có CI pipeline xanh

### 🔵 Thành viên A
| Thời gian | Task | Output |
|-----------|------|--------|
| Sáng | Tạo repo GitHub, cấu trúc thư mục backend (`src/modules/`, `src/middlewares/`, `src/config/`) | Repo live trên GitHub |
| Sáng | Viết `backend/package.json` (Express, pg, bcrypt, jsonwebtoken, dotenv, jest, supertest, eslint) | `npm install` chạy được |
| Chiều | Cấu hình ESLint (`.eslintrc.js`) | Lint chạy được |
| Chiều | Viết `.github/workflows/ci.yml` — chạy lint + test trên mỗi PR | CI pipeline xanh với test rỗng |
| Chiều | Viết `src/app.js` + `src/server.js` (Express app cơ bản) | `GET /health` trả `200 OK` |

### 🟢 Thành viên B
| Thời gian | Task | Output |
|-----------|------|--------|
| Sáng | Viết `docker-compose.yml` (backend + PostgreSQL + delivery-service) | `docker-compose up` chạy được |
| Sáng | Viết `backend/Dockerfile` | Image build thành công |
| Chiều | Viết schema SQL đầy đủ (`migrations/001_init.sql`) gồm 6 bảng: users, restaurants, menu_items, orders, order_items, reviews | File SQL chạy được trên Postgres |
| Chiều | Viết `src/config/db.js` (kết nối PostgreSQL với `pg` pool) | Backend kết nối DB thành công |

### 🟡 Thành viên C
| Thời gian | Task | Output |
|-----------|------|--------|
| Sáng | Setup Python FastAPI project: `delivery-service/main.py`, `requirements.txt`, `Dockerfile` | `uvicorn` chạy được |
| Sáng | Viết endpoint `POST /delivery-fee/calculate` (công thức: base_fee + distance * rate, giảm nếu order_amount cao) | API trả `delivery_fee` đúng |
| Chiều | Viết `delivery-service/test_main.py` — test 3 case cho delivery fee | Test pass |
| Chiều | Viết `src/modules/orders/` — tạo folder + file rỗng (router, service, model) | Structure sẵn sàng |

**✅ Checkpoint cuối ngày 1**: Server Express chạy, DB connect, CI pipeline xanh, FastAPI trả delivery fee.

---

## 📅 Ngày 2 — Auth + Restaurants

> **Mục tiêu**: Đăng ký / đăng nhập hoạt động + CRUD nhà hàng

### 🔵 Thành viên A
| Thời gian | Task | Output |
|-----------|------|--------|
| Sáng | Viết `auth.service.js`: hàm `register` (hash password, insert DB), `login` (so sánh hash, tạo JWT) | Logic auth hoàn chỉnh |
| Sáng | Viết `auth.router.js`: `POST /api/auth/register`, `POST /api/auth/login`, `GET /api/auth/profile` | 3 endpoints hoạt động |
| Chiều | Viết `middlewares/authenticate.js` — verify JWT, gán `req.user` | Middleware hoạt động |
| Chiều | Viết `middlewares/authorize.js` — kiểm tra role (`customer`, `restaurant`, `admin`) | Phân quyền hoạt động |
| Chiều | **Tạo PR** → nhờ B review | PR được review |

### 🟢 Thành viên B
| Thời gian | Task | Output |
|-----------|------|--------|
| Sáng | Viết `restaurants.service.js`: `createRestaurant`, `getAllRestaurants`, `getRestaurantById`, `updateRestaurant` | 4 service functions |
| Sáng | Viết `restaurants.router.js`: `POST`, `GET /`, `GET /:id`, `PATCH /:id` | 4 endpoints hoạt động |
| Chiều | Viết `menu-items.service.js` + `menu-items.router.js`: `POST`, `GET`, `PATCH`, `DELETE` | Menu Items CRUD hoạt động |
| Chiều | **Review PR của A** + **Tạo PR** của B | PR B hoàn tất |

### 🟡 Thành viên C
| Thời gian | Task | Output |
|-----------|------|--------|
| Sáng | Viết `orders.model.js` — query SQL: `createOrder`, `createOrderItems`, `findOrderById`, `findOrdersByCustomer` | Model functions |
| Chiều | Tích hợp gọi FastAPI từ Node.js (`axios` gọi `POST /delivery-fee/calculate` khi tạo đơn) | Gọi API thành công |
| Chiều | **Review PR của B** | Feedback hoặc approve |

**✅ Checkpoint cuối ngày 2**: Auth hoạt động, có thể đăng ký/đăng nhập, CRUD nhà hàng + menu chạy.

---

## 📅 Ngày 3 — Orders + Users + Test

> **Mục tiêu**: Flow đặt hàng hoàn chỉnh + test bắt đầu

### 🔵 Thành viên A
| Thời gian | Task | Output |
|-----------|------|--------|
| Sáng | Viết `users.router.js`: `GET /api/users` (admin only), `PATCH /api/users/:id/role` (admin only) | Admin API hoạt động |
| Sáng | Viết unit test cho auth service (`tests/auth.test.js`) — test register, login, invalid cases | ≥ 5 test cases pass |
| Chiều | Cấu hình Jest coverage threshold (80%) trong `package.json` | Coverage check tự động |
| Chiều | Cấu hình SonarQube trong CI (`ci.yml` bước sonar-scan) | Sonar chạy trong pipeline |

### 🟢 Thành viên B
| Thời gian | Task | Output |
|-----------|------|--------|
| Sáng | Viết unit test cho restaurants service (`tests/restaurants.test.js`) — mock DB, test CRUD | ≥ 5 test cases pass |
| Sáng | Viết unit test cho menu-items service (`tests/menu-items.test.js`) | ≥ 4 test cases pass |
| Chiều | Merge PR B sau khi CI xanh | Code vào `develop` |
| Chiều | Thêm validation input cho restaurants + menu-items (kiểm tra field bắt buộc, giá > 0, v.v.) | Validation hoạt động |

### 🟡 Thành viên C
| Thời gian | Task | Output |
|-----------|------|--------|
| Sáng | Viết `orders.service.js`: `createOrder` (tính total, gọi delivery-fee API, insert orders + order_items), `getMyOrders`, `getOrderById` | Service hoàn chỉnh |
| Sáng | Viết `orders.router.js`: `POST /api/orders`, `GET /api/orders/my`, `GET /api/orders/:id`, `PATCH /api/orders/:id/status` | 4 endpoints hoạt động |
| Chiều | Implement order status validation (chỉ cho phép transition hợp lệ: `pending→accepted→preparing→delivering→completed`) | Flow đúng |
| Chiều | **Tạo PR** cho orders module | PR tạo xong |

**✅ Checkpoint cuối ngày 3**: Toàn bộ business logic xong. Có thể đặt đơn từ đầu đến cuối.

---

## 📅 Ngày 4 — Integration Test + Coverage + Fix bugs

> **Mục tiêu**: Coverage ≥ 80%, CI xanh ổn định, không bug nghiêm trọng

### 🔵 Thành viên A
| Thời gian | Task | Output |
|-----------|------|--------|
| Sáng | Viết integration test cho auth (`tests/integration/auth.integration.test.js`) — dùng Supertest, test register → login → profile | E2E auth test pass |
| Chiều | Review tất cả PR còn tồn đọng | PR được merge |
| Chiều | Fix bất kỳ CI fail nào, đảm bảo pipeline xanh liên tục | CI ổn định |
| Chiều | Kiểm tra SonarQube dashboard, ghi issues vào `docs/metrics.md` | Metric Sprint 1 có dữ liệu |

### 🟢 Thành viên B
| Thời gian | Task | Output |
|-----------|------|--------|
| Sáng | Viết integration test cho restaurants (`tests/integration/restaurants.integration.test.js`) — test CRUD flow đầy đủ | Test pass |
| Chiều | Kiểm tra toàn bộ API với Postman/Insomnia, ghi lại bug nếu có | Danh sách bug (GitHub Issues) |
| Chiều | Fix bug tìm thấy, push lên branch fix | Bug closed |

### 🟡 Thành viên C
| Thời gian | Task | Output |
|-----------|------|--------|
| Sáng | Viết integration test cho orders (`tests/integration/orders.integration.test.js`) — test tạo đơn, cập nhật status, lấy danh sách | Test pass |
| Sáng | Test FastAPI với pytest (`delivery-service/test_main.py`) — edge cases: distance = 0, order rất lớn | Test pass |
| Chiều | Merge PR orders sau khi CI xanh | Code vào `develop` |
| Chiều | Tích hợp kiểm tra end-to-end: customer đặt đơn → owner cập nhật status → customer xem đơn hoàn thành | Flow hoạt động đúng |

**✅ Checkpoint cuối ngày 4**: Coverage ≥ 80%, CI xanh, bug chính đã fix, SonarQube có dữ liệu.

---

## 📅 Ngày 5 — Docs + Metrics + Báo cáo SPQM

> **Mục tiêu**: Hoàn thiện tài liệu, đo metrics cuối, chuẩn bị nộp

### 🔵 Thành viên A
| Thời gian | Task | Output |
|-----------|------|--------|
| Sáng | Thu thập CI Fail Rate từ GitHub Actions history | Số liệu ghi vào `docs/metrics.md` |
| Sáng | Thu thập Lead Time của tất cả PR đã merge (thời gian open → merge) | Bảng Lead Time ghi vào metrics |
| Chiều | Cập nhật README.md: hướng dẫn chạy đầy đủ, API docs hoàn chỉnh | README hoàn chỉnh |
| Chiều | Viết phần CMMI self-assessment trong báo cáo | Đánh giá CMMI có dẫn chứng |

### 🟢 Thành viên B
| Thời gian | Task | Output |
|-----------|------|--------|
| Sáng | Cập nhật `docs/process-etvx.md` với bằng chứng thực tế (link PR, screenshot CI) | ETVX có evidence |
| Sáng | Cập nhật `docs/backlog.md` — đánh dấu done/in-progress | Backlog phản ánh thực tế |
| Chiều | Viết `docs/spqm-report.md` — phần Design (ERD + API design) | Báo cáo có phần Design |
| Chiều | Chụp màn hình ERD, SonarQube dashboard, coverage report để đính kèm báo cáo | Ảnh minh họa |

### 🟡 Thành viên C
| Thời gian | Task | Output |
|-----------|------|--------|
| Sáng | Thu thập số liệu coverage cuối cùng (`npm run test:coverage`), ghi vào metrics | Coverage cuối chính xác |
| Sáng | Viết `docs/retrospective.md` — Sprint retrospective (what went well, issues, action items) | Retrospective hoàn chỉnh |
| Chiều | Viết `docs/spqm-report.md` — phần Orders + Delivery Service | Báo cáo có phần C |
| Chiều | Kiểm tra `docker-compose up --build` chạy sạch từ đầu (clean run test) | Demo chạy được |

**✅ Checkpoint cuối ngày 5**: Toàn bộ docs xong, metrics có dữ liệu thực, demo chạy được.

---

## 📊 Tổng quan phân công theo ngày

| | Thành viên A 🔵 | Thành viên B 🟢 | Thành viên C 🟡 |
|--|----------------|----------------|----------------|
| **Ngày 1** | Setup repo, Express app, CI pipeline | Docker Compose, DB schema, pg config | FastAPI delivery-service, orders folder |
| **Ngày 2** | Auth service + JWT middleware | Restaurant + Menu Items CRUD | Orders model + tích hợp FastAPI |
| **Ngày 3** | Users API, auth unit test, SonarQube | Restaurant + Menu test, validation | Orders service + router hoàn chỉnh |
| **Ngày 4** | Auth integration test, review PRs, CI fix | Restaurant integration test, Postman test | Orders integration test, E2E test |
| **Ngày 5** | Metrics đo CI/Lead Time, README | ETVX docs, backlog update, ERD | Coverage final, retrospective, clean run |

---

## ⚠️ Rủi ro và cách xử lý

| Rủi ro | Khả năng | Xử lý |
|--------|----------|-------|
| Coverage không đạt 80% | Trung bình | Ưu tiên viết test ngày 3–4, bỏ P2 nếu cần |
| CI fail liên tục | Thấp | A chịu trách nhiệm fix ngay trong ngày |
| Merge conflict | Trung bình | Mỗi người làm module riêng biệt, sync qua `develop` thường xuyên |
| FastAPI không tích hợp được | Thấp | Dùng mock response tạm thời trong Node.js |
| Thiếu thời gian P1 | Trung bình | Bỏ SonarQube local, chỉ cần CI Github xanh + coverage |

---

## 📋 Checklist nộp bài

- [ ] `docker-compose up --build` chạy được từ đầu
- [ ] Tất cả P0 API hoạt động đúng
- [ ] Coverage ≥ 80% (`npm run test:coverage`)
- [ ] CI pipeline xanh (GitHub Actions)
- [ ] `docs/metrics.md` có đủ 4–6 metrics với số liệu thực
- [ ] `docs/process-etvx.md` có đủ 7 giai đoạn với bằng chứng
- [ ] `docs/backlog.md` cập nhật trạng thái hoàn thành
- [ ] `docs/retrospective.md` có action items
- [ ] README đầy đủ hướng dẫn chạy
- [ ] Ít nhất 5 PR đã được review và merge

---

*FoodieGo — Kế hoạch 5 ngày | Tạo ngày 24/06/2024*
