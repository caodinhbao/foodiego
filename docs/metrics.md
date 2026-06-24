# 📊 Metrics & Measurement — FoodieGo

> Tài liệu theo dõi các chỉ số chất lượng quy trình của FoodieGo theo mục tiêu LEAN + Lead Time.  
> Cập nhật sau mỗi sprint.
| PR #1 | feature/setup-express-ci | ~22:43 | ~22:55 | ~12 phút | Bảo


---

## 🎯 Mục tiêu SMART-Q

| Thành phần | Nội dung |
|-----------|---------|
| **Specific** | Xây dựng hệ thống đặt món gồm auth, restaurant, menu, order, delivery fee |
| **Measured** | Coverage ≥ 80%, CI pass ≥ 90%, Lead Time ≤ 1 ngày, Sonar Issues ≤ 10 |
| **Aligned** | Bám đề tài FoodieGo và trọng tâm LEAN/lead time của môn SPQM |
| **Realistic** | Làm Level 2, không tách microservices phức tạp |
| **Timeframe** | Hoàn thành trong 3–4 tuần theo deadline môn |
| **Quality** | Có PR review, SonarQube, test, README, báo cáo SPQM đầy đủ |

---

## 📈 Baseline & Target

| Metric | Baseline (Sprint 0) | Target | Nguồn đo |
|--------|---------------------|--------|----------|
| Test Coverage | ~45% | ≥ 80% | `npm run test:coverage` |
| CI Fail Rate | ~35% | ≤ 10% | GitHub Actions history |
| Lead Time (PR) | ~2 ngày | ≤ 1 ngày | GitHub PR timeline |
| SonarQube Issues | ~30 | ≤ 10 | SonarQube Dashboard |
| PR Review Time | ~1.5 ngày | ≤ 8 giờ | GitHub PR timeline |
| Defect Count / Sprint | Chưa đo | ≤ 3 | GitHub Issues (label: bug) |

---

## 📅 Kết quả đo theo Sprint

### Sprint 1

| Metric | Giá trị | Ghi chú |
|--------|---------|---------|
| Test Coverage | — | Chưa đo |
| CI Fail Rate | — | — |
| Lead Time TB | — | — |
| SonarQube Issues | — | — |
| Số PR đã merge | — | — |
| Số bug phát sinh | — | — |

### Sprint 2

| Metric | Giá trị | Ghi chú |
|--------|---------|---------|
| Test Coverage | — | Chưa đo |
| CI Fail Rate | — | — |
| Lead Time TB | — | — |
| SonarQube Issues | — | — |
| Số PR đã merge | — | — |
| Số bug phát sinh | — | — |

### Sprint 3

| Metric | Giá trị | Ghi chú |
|--------|---------|---------|
| Test Coverage | — | Chưa đo |
| CI Fail Rate | — | — |
| Lead Time TB | — | — |
| SonarQube Issues | — | — |
| Số PR đã merge | — | — |
| Số bug phát sinh | — | — |

---

## 🔍 Cách đo từng Metric

### 1. Test Coverage

```bash
cd backend
npm run test:coverage
```

Xem file `coverage/lcov-report/index.html` hoặc kết quả terminal.  
Ghi lại: **Statements %, Branches %, Functions %, Lines %**

---

### 2. CI Fail Rate

Vào **GitHub → Actions** của repo, đếm:

```
CI Fail Rate = (Số pipeline fail) / (Tổng số pipeline chạy) × 100%
```

Chụp screenshot dashboard hoặc export từ GitHub API:

```bash
# Ví dụ dùng GitHub CLI
gh run list --limit 50 --json conclusion | jq '[.[] | .conclusion] | {total: length, failed: map(select(. == "failure")) | length}'
```

---

### 3. Lead Time (PR open → merge)

Vào từng Pull Request trên GitHub, ghi lại:
- **Opened at**: thời điểm PR được tạo
- **Merged at**: thời điểm PR được merge

```
Lead Time = Merged at - Opened at (tính bằng giờ)
```

Tổng hợp trung bình theo sprint.

| PR # | Feature | Opened | Merged | Lead Time |
|------|---------|--------|--------|-----------|
| #1 | ... | ... | ... | ... giờ |

---

### 4. SonarQube Issues

Sau khi CI chạy SonarQube scan:
1. Vào SonarQube Dashboard
2. Ghi lại: **Bugs / Vulnerabilities / Code Smells / Duplications**
3. So sánh với sprint trước

---

### 5. PR Review Time

```
Review Time = (Thời điểm approve/request changes đầu tiên) - (Thời điểm PR mở)
```

---

### 6. Defect Count

Đếm số GitHub Issues có label `bug` được tạo và đóng trong sprint.

---

## 📊 Biểu đồ cải tiến (điền sau)

### Coverage theo sprint

```
Sprint 0:  ████░░░░░░ 45%
Sprint 1:  ██████░░░░ 60%   ← (dự kiến)
Sprint 2:  ████████░░ 80%   ← (mục tiêu)
Sprint 3:  █████████░ 85%   ← (mục tiêu)
```

### CI Fail Rate theo sprint

```
Sprint 0:  35%  ████████████████████░░░░░░░░░░░
Sprint 1:  20%  ████████████░░░░░░░░░░░░░░░░░░░
Sprint 2:  10%  ██████░░░░░░░░░░░░░░░░░░░░░░░░░ (mục tiêu)
```

---

## 🏢 Tự đánh giá CMMI

| Giai đoạn | Mức CMMI | Bằng chứng |
|-----------|---------|-----------|
| Ban đầu (Sprint 0) | Level 1 — Initial | Code tự phát, chưa có PR rule, chưa đo metrics |
| Sau Sprint 1 | Level 2 — Managed | Có backlog, phân công, GitHub Actions, PR review rule |
| Sau Sprint 2 | Level 2+ | Có SonarQube, coverage, CI metrics, retrospective |
| Mục tiêu cuối | Hướng tới Level 3 | Quy trình ETVX tài liệu hóa, Definition of Done rõ ràng |

> ℹ️ Không ghi đạt Level 3 hoàn toàn — ghi "hướng tới Level 3" là hợp lý với quy mô nhóm sinh viên.

---

## 🔗 Liên kết

- [Backlog](backlog.md)
- [Quy trình ETVX](process-etvx.md)
- [README](../README.md)

---

*Cập nhật sau mỗi sprint — người phụ trách: Thành viên A*
