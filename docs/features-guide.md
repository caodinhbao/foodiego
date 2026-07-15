# 📖 Hướng Dẫn Hoạt Động Các Chức Năng (Features Guide)

Tài liệu này mô tả luồng hoạt động (business logic) của toàn bộ các chức năng có trong hệ thống FoodieGo. Thầy cô và các thành viên có thể dựa vào đây để hiểu rõ cách hệ thống xử lý dữ liệu đằng sau.

---

## 1. 🔐 Chức năng Xác thực & Phân quyền (Auth & Users)
**File xử lý:** `src/modules/auth/`, `src/modules/users/`

*   **Đăng ký (Register):** Người dùng (Customer) truyền vào `name`, `email`, `password`. Mật khẩu sẽ được mã hóa một chiều bằng thư viện `bcrypt` trước khi lưu vào database (MySQL). Mặc định người dùng mới sẽ có role là `customer`.
*   **Đăng nhập (Login):** Hệ thống tìm user theo `email`, so sánh mật khẩu mã hóa. Nếu đúng, hệ thống dùng thư viện `jsonwebtoken` (JWT) để sinh ra một Token có thời hạn (VD: 7 ngày), chứa thông tin `id` và `role` của user.
*   **Phân quyền (Role-based Access Control):** 
    *   Mọi API cần bảo mật đều chạy qua middleware `authenticate` (để giải mã JWT).
    *   Các API đặc thù (VD: Tạo nhà hàng, Sửa giá món ăn) sẽ đi qua thêm middleware `authorize('restaurant', 'admin')` để chặn những người không có quyền.
*   **Cấp quyền Admin:** Chỉ có Admin mới có thể gọi API `PATCH /api/users/:id/role` để nâng cấp một `customer` thành `restaurant` (Chủ quán) hoặc `admin`.

---

## 2. 🏪 Chức năng Nhà hàng & Món ăn (Restaurants & Menu Items)
**File xử lý:** `src/modules/restaurants/`, `src/modules/menu-items/`

*   **Quản lý Nhà hàng:** 
    *   User có role `restaurant` được quyền tạo nhà hàng mới. ID của user đó sẽ được lưu vào cột `owner_id`.
    *   Tính năng Tìm kiếm: Khi khách hàng gọi `GET /api/restaurants?search=phở`, hệ thống sẽ dùng câu lệnh `LIKE '%phở%'` trong MySQL để lọc tên hoặc địa chỉ nhà hàng.
*   **Quản lý Menu:**
    *   Chủ nhà hàng có thể thêm món ăn, định giá và cập nhật trạng thái `is_available` (còn hàng / hết hàng).
    *   Khách hàng xem menu bằng cách truyền `restaurant_id` vào API. Hệ thống chỉ trả về những món có `is_available = true` (nếu đang là khách xem).

---

## 3. 🛒 Chức năng Đặt hàng (Orders & Delivery)
**File xử lý:** `src/modules/orders/`, `delivery-service/main.py`

Đây là luồng phức tạp nhất của hệ thống, kết hợp giữa Node.js và Python FastAPI.

1.  **Tính phí giao hàng (FastAPI):** Node.js gọi HTTP request sang service Python (chạy ở cổng 8000). Python nhận `distance` (khoảng cách) và trả về `delivery_fee` (phí giao hàng) dựa trên công thức cấu hình sẵn.
2.  **Tạo đơn hàng:** 
    *   Khách hàng gửi danh sách món ăn (`menu_item_id`, `quantity`).
    *   Node.js truy vấn giá của từng món từ DB để tự tính `total_amount` (tránh trường hợp khách hàng truyền sai giá từ Frontend).
    *   Cộng `total_amount` + `delivery_fee` = Tổng tiền khách phải trả.
    *   Lưu vào bảng `orders` và bảng `order_items` (sử dụng Transaction của MySQL để đảm bảo tính toàn vẹn: nếu lỗi giữa chừng thì hủy bỏ toàn bộ).
3.  **Cập nhật trạng thái:** 
    *   Chủ nhà hàng chuyển trạng thái đơn theo luồng: `pending` ➔ `accepted` ➔ `preparing` ➔ `delivering` ➔ `completed`.
    *   Mọi thay đổi đều được ghi lại lịch sử.

---

## 4. ⭐ Chức năng Đánh giá (Reviews)
**File xử lý:** `src/modules/restaurants/restaurants.router.js` (Phần Review)

*   Sau khi ăn xong, khách hàng có thể đánh giá (Rating từ 1-5 sao) và để lại bình luận cho nhà hàng.
*   Hệ thống sẽ lưu vào bảng `reviews` gồm `customer_id`, `restaurant_id`, `rating`. Khi hiển thị danh sách nhà hàng, có thể tính điểm đánh giá trung bình.

---

## 5. 📊 Chức năng Thống kê (Dashboards)
**File xử lý:** `src/modules/admin/`, `src/modules/orders/orders.service.js`

*   **Doanh thu Chủ nhà hàng (Owner Revenue):** Sử dụng câu lệnh `SUM(total_amount)` gom nhóm (`GROUP BY`) theo tháng hoặc ngày, dựa trên các đơn hàng có trạng thái `completed`. Chủ nhà hàng chỉ xem được doanh thu của chính nhà hàng do họ sở hữu (truy vấn kèm điều kiện `owner_id = user.id`).
*   **Thống kê Admin:** Admin có thể xem tổng số user, tổng số nhà hàng, tổng doanh thu toàn sàn để đánh giá sự phát triển của hệ thống.

---
*Tài liệu này được tạo tự động nhằm phục vụ mục đích giải trình mã nguồn (Source Code Explanation) khi nộp đồ án môn học.*
