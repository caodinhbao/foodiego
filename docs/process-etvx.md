# 📋 Quy trình ETVX — FoodieGo

> Tài liệu mô tả quy trình phát triển phần mềm của nhóm theo mô hình **ETVX** (Entry – Task – Verification – Exit).  
> Trọng tâm: đảm bảo chất lượng quy trình để phục vụ mục tiêu LEAN/Lead Time của đồ án SPQM.

---

## 🔍 ETVX là gì?

**ETVX** là mô hình mô tả quy trình phát triển phần mềm, gồm 4 thành phần:

| Thành phần | Ý nghĩa |
|-----------|---------|
| **Entry** | Điều kiện đầu vào để bắt đầu giai đoạn |
| **Task** | Các hoạt động cần thực hiện trong giai đoạn |
| **Verification** | Kiểm tra/xác nhận kết quả trước khi tiếp tục |
| **Exit** | Điều kiện để kết thúc giai đoạn và chuyển sang giai đoạn tiếp theo |

---

## 🗂️ Quy trình ETVX cho FoodieGo

### Giai đoạn 1 — Requirement

| Thành phần | Nội dung |
|-----------|----------|
| **Entry** | Có đề tài FoodieGo, xác định được 3 role (Customer, Owner, Admin) |
| **Task** | - Viết user stories cho từng role<br>- Tạo product backlog với priority P0/P1/P2/P3<br>- Xác định MVP cần làm trước<br>- Phân chia nhiệm vụ cho từng thành viên |
| **Verification** | - Cả nhóm review backlog<br>- Kiểm tra: mỗi user story có đủ "As a … I want … So that …" chưa?<br>- Xác nhận priority hợp lý với thời gian |
| **Exit** | Backlog có đủ P0/P1 với priority rõ ràng, assign cho từng người |

---

### Giai đoạn 2 — Design

| Thành phần | Nội dung |
|-----------|----------|
| **Entry** | Backlog P0/P1 đã được duyệt |
| **Task** | - Thiết kế ERD (Entity Relationship Diagram)<br>- Thiết kế API spec (method, endpoint, request/response)<br>- Thiết kế phân quyền theo role<br>- Định nghĩa Order status flow |
| **Verification** | - Nhóm review ERD: đủ bảng, đúng quan hệ chưa?<br>- Review API spec: endpoint rõ ràng, consistent chưa?<br>- Xác nhận schema với yêu cầu **MySQL (XAMPP)** |
| **Exit** | Có ERD hoàn chỉnh + API docs cơ bản + schema SQL (`002_mysql.sql`) được duyệt |

---

### Giai đoạn 3 — Coding

| Thành phần | Nội dung |
|-----------|----------|
| **Entry** | Task đã được assign, design đã duyệt |
| **Task** | - Code theo branch riêng: `feature/<tên-feature>`<br>- Tuân theo convention ESLint đã cấu hình<br>- Viết unit test kèm theo khi code logic<br>- Không commit thẳng lên `main` |
| **Verification** | - Chạy `npm run lint` — không có lỗi ESLint<br>- Chạy `npm test` — test pass trên local<br>- Self-review code trước khi tạo PR |
| **Exit** | Feature hoàn thành trên branch, đã tạo Pull Request lên `develop` |

**Quy ước đặt tên branch:**

```
feature/auth-register
feature/restaurant-crud
feature/order-create
fix/order-status-bug
```

---

### Giai đoạn 4 — Review

| Thành phần | Nội dung |
|-----------|----------|
| **Entry** | Pull Request đã được tạo |
| **Task** | - Reviewer đọc code, kiểm tra logic, convention<br>- Comment trực tiếp trên PR nếu cần sửa<br>- Author sửa theo feedback và push lại |
| **Verification** | - Ít nhất 1 thành viên approve PR<br>- Không có comment "request changes" còn tồn đọng<br>- GitHub Actions CI pass (lint + test) |
| **Exit** | PR được merge vào `develop` |

**Checklist review (reviewer dùng):**

- [ ] Code đúng với user story không?
- [ ] Có test cho logic chính không?
- [ ] ESLint không lỗi?
- [ ] Không hardcode giá trị nhạy cảm (password, key)?
- [ ] API response format đúng convention?
- [ ] Coverage không giảm dưới 80%?

---

### Giai đoạn 5 — Testing

| Thành phần | Nội dung |
|-----------|----------|
| **Entry** | Build pass trên nhánh develop |
| **Task** | - Chạy toàn bộ Jest unit test<br>- Chạy Supertest integration test cho các API chính<br>- Kiểm tra coverage report |
| **Verification** | - Coverage ≥ 80%<br>- Tất cả test case pass<br>- Không có test bị skip không có lý do |
| **Exit** | CI pipeline xanh, coverage đạt ngưỡng |

**Lệnh kiểm tra:**

```bash
npm test
npm run test:coverage
```

---

### Giai đoạn 6 — Measurement

| Thành phần | Nội dung |
|-----------|----------|
| **Entry** | Có dữ liệu từ GitHub Actions, SonarQube, Git log |
| **Task** | - Thu thập metrics: Coverage, CI Fail Rate, Lead Time, SonarQube Issues<br>- Ghi vào `docs/metrics.md`<br>- So sánh với baseline ban đầu |
| **Verification** | - Metrics được đo bằng công cụ thực (không ước tính)<br>- Có biểu đồ hoặc bảng so sánh Before/After |
| **Exit** | Báo cáo cải tiến có số liệu cụ thể |

**Metrics cần đo:**

| Metric | Nguồn dữ liệu | Tần suất |
|--------|--------------|---------|
| Test Coverage | `npm run test:coverage` | Mỗi sprint |
| CI Fail Rate | GitHub Actions history | Mỗi tuần |
| Lead Time | Git: thời gian PR open → merge | Mỗi PR |
| SonarQube Issues | SonarQube Dashboard | Mỗi sprint |
| PR Review Time | GitHub: PR timeline | Mỗi PR |
| Defect Count | GitHub Issues (label: bug) | Mỗi sprint |

---

### Giai đoạn 7 — Retrospective

| Thành phần | Nội dung |
|-----------|----------|
| **Entry** | Kết thúc mỗi sprint (1–2 tuần) |
| **Task** | - Họp nhóm: mỗi người nêu What went well / What didn't / What to improve<br>- Ghi lại action items cụ thể<br>- Cập nhật `docs/retrospective.md` |
| **Verification** | - Có action items được ghi rõ người chịu trách nhiệm<br>- Action items từ sprint trước đã được follow-up |
| **Exit** | Có kế hoạch cải tiến cho sprint tiếp theo |

**Template Retrospective:**

```markdown
## Sprint X — Retrospective (ngày __)

### ✅ What went well
- ...

### ❌ What didn't go well
- ...

### 🔧 What to improve
- ...

### 📌 Action Items
| Action | Người phụ trách | Deadline |
|--------|----------------|---------|
| ... | ... | ... |
```

---

## 🔁 Sơ đồ tổng quan quy trình

```
[Requirement] → [Design] → [Coding] → [Review] → [Testing] → [Measurement]
                                                                     ↓
                                                            [Retrospective]
                                                                     ↓
                                                         (Cải tiến sprint tiếp)
```

---

## 📌 Ghi chú quan trọng

- Mỗi thành viên **chỉ commit lên branch của mình**, không commit thẳng lên `main` hay `develop`.
- `main` chỉ nhận merge từ `develop` khi release.
- Mọi thay đổi đều phải qua **Pull Request + Review**.
- Lead Time được tính từ thời điểm **PR được tạo** đến khi **được merge**.

---

*FoodieGo — ETVX Process Document | Cập nhật theo sprint*
