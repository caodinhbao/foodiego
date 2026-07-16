FoodieGo - Hệ thống đặt món trực tuyến

1. LINK NỘP BÀI (VIDEO DEMO, BÁO CÁO SPQM, ẢNH MINH CHỨNG):
- Link Google Drive: [TODO: CHÈN LINK DRIVE CỦA BẠN VÀO ĐÂY]
(Lưu ý: Bạn hãy bỏ Video <= 5 phút, ảnh Sonar, ảnh Coverage, và báo cáo SPQM vào một folder Drive rồi để link ở đây).

2. THÔNG TIN CƠ SỞ DỮ LIỆU (DATABASE):
- Hệ quản trị: MySQL (XAMPP / Docker)
- Tên Database: foodiego_db
- Cách import:
  + Nếu dùng Docker: Chỉ cần gõ `docker-compose up -d`, hệ thống sẽ tự động khởi tạo database.
  + Nếu dùng XAMPP thủ công: Tạo database tên `foodiego_db` trong phpMyAdmin hoặc Navicat. Sau đó mở file `backend/migrations/002_mysql.sql` và chạy (Run) toàn bộ file đó để khởi tạo bảng và dữ liệu mẫu (mock data).

3. TÀI KHOẢN DEMO ĐÃ CÓ SẴN TRONG DB (Mật khẩu chung: Password123!):
- Tài khoản Admin: admin@foodiego.com
- Tài khoản Chủ nhà hàng (Restaurant): food@restaurant.com (Đồ ăn) / drink@restaurant.com (Nước uống)
- Tài khoản Khách hàng (Customer): an.nguyen@gmail.com / binh.tran@gmail.com / cuong.le@gmail.com
