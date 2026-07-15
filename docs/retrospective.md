# 🔄 Báo Cáo Họp Cải Tiến (Sprint Retrospective) — FoodieGo

**Thời gian:** 15/07/2026  
**Thành phần tham gia:** A (Bảo - Nhóm trưởng), B, C  
**Chủ tọa:** Bảo  
**Thư ký:** C

---

## 1. 🎯 Tổng kết Mục tiêu Sprint
- **Mục tiêu:** Hoàn thiện 100% Core MVP (Level 2 SPQM), chuyển đổi hoàn toàn sang MySQL, đảm bảo Test Coverage đạt chuẩn và thiết lập hệ thống CI/CD hoàn chỉnh lên Render.com.
- **Kết quả:** **ĐẠT (100%)**. Toàn bộ 25/25 User Stories đã hoàn thành, kể cả các yêu cầu mở rộng P3.

## 2. 🟢 Những điều làm tốt (What went well?)
1. **Kiến trúc rõ ràng ngay từ đầu:** Việc áp dụng Modular Architecture giúp chia việc rất dễ. Mỗi người ôm một module riêng biệt, không ai bị conflict code (xung đột) với ai.
2. **Kiểm thử tự động (Automated Testing):** Bộ Unit Test và Integration Test lên tới 161 test cases là một cứu cánh thực sự. Khi gặp lỗi cú pháp PostgreSQL chuyển sang MySQL, bộ test giúp bắt ngay lập tức các hàm bị hỏng.
3. **CI/CD Trơn tru:** Github Actions tự động test và tự động đẩy code lên Render giúp giảm thiểu thời gian triển khai thủ công. Tỉ lệ CI Fail Rate giảm dần đều.
4. **Clean Code & Review:** Việc áp dụng ESLint nghiêm ngặt từ đầu và nguyên tắc "Ít nhất 1 người review PR" đã giúp chất lượng code rất ổn định. Không có rác kỹ thuật (`TODO` comments) bị rớt lại trong nhánh `main` ở giai đoạn cuối.

## 3. 🔴 Những điều chưa tốt / Điểm nghẽn (What went wrong / Bottlenecks?)
1. **Chuyển đổi CSDL giữa chừng:** Ban đầu code và setup schema bị lẫn lộn giữa PostgreSQL và MySQL (do copy-paste từ các tutorial khác nhau hoặc hiểu nhầm). Việc chuyển hướng sang thuần MySQL tốn thêm một khoảng thời gian để sửa lỗi cú pháp (`RETURNING *`, `$1`).
2. **Trễ nải tài liệu:** Nhóm quá mải mê viết code và test mà quên cập nhật file `backlog.md` và `README.md`. Hệ quả là nhiều API và tính năng đã làm xong nhưng không ai (ngay cả tester) biết để gọi. Mãi đến cuối sprint mới cập nhật đầy đủ.
3. **Khó khăn tích hợp SonarQube:** Việc config SonarCloud token bị lúng túng mất một buổi do Github Secrets cấu hình sai tên biến.

## 4. 💡 Hành động cải tiến cho dự án tới (Action Items)

| Hành động | Phụ trách | Mức độ ưu tiên |
|-----------|-----------|----------------|
| **Chốt chặt Tech Stack ngay ngày 0:** Tránh tuyệt đối việc mỗi người code một dialect database khác nhau (MySQL vs Postgres). Phải có script setup CSDL chuẩn chia sẻ cho cả team ngay từ đầu. | Bảo (Lead) | Cao |
| **Làm tài liệu song song với code (Doc-as-code):** API nào xong phải ném luôn vào Swagger hoặc README ngay trong PR đó. Không để dồn đến cuối dự án mới viết. | Cả nhóm | Cao |
| **Nâng cao Integration Test:** Cần giả lập (Mock) tốt hơn cho các external service (như Delivery Fee API) để test không bị phụ thuộc vào môi trường mạng. | Thành viên C | Trung bình |

---
*Ghi chú: Bản báo cáo này là minh chứng cho việc nhóm đã có hoạt động thanh tra và thích nghi (Inspect & Adapt) đúng theo tinh thần Agile/Scrum.*
