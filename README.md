# World Cinema - Frontend (React.js)

Giao diện website đặt vé xem phim online, chọn ghế realtime, thanh toán VNPay, thẻ vé điện tử QR Code, và Quầy Soát vé / In vé tự động dành cho Nhân viên.

---

## 🛠️ Yêu cầu môi trường
- **Node.js**: Phiên bản 16.x - 18.x (khuyên dùng Node 18 LTS)
- **NPM**: 8.x+
- **Backend**: Spring Boot chạy tại `http://localhost:8080`

---

## 🚀 Hướng dẫn cài đặt & Khởi chạy

### 1. Cài đặt các gói phụ thuộc (Dependencies)
Do dự án sử dụng các gói thư viện tương thích React 17, hãy cài đặt bằng cờ `--legacy-peer-deps`:

```bash
npm install --legacy-peer-deps
```

### 2. Khởi chạy ứng dụng (Development Server)
```bash
npm start
```

Sau khi khởi chạy thành công:
- **Website người dùng**: `http://localhost:3000`
- **Quản trị (Admin)**: `http://localhost:3000/admin`
- **Cổng Nhân viên (Staff)**: `http://localhost:3000/staff`
- **Quầy Soát vé & In vé tự động**: `http://localhost:3000/staff/check-ticket` hoặc `http://localhost:3000/admin/check-ticket`

---

## 🌟 Các tính năng nổi bật mới
1. **Đặt vé & Chọn ghế Realtime**: Khóa giữ ghế khi có người đang chọn, tự động giải phóng khi hủy/hết hạn thanh toán.
2. **Thanh toán VNPay**: Tích hợp cổng thanh toán VNPay Sandbox với callback tự động xác nhận đơn hàng.
3. **Thẻ vé điện tử & Mã QR**: Tự động sinh mã đặt vé duy nhất (`WC2026-XXXXXX`) và mã QR Code động scannable.
4. **Quầy Soát Vé & In Vé Tự Động (Staff Kiosk)**: Quét Camera QR Code hoặc nhập mã đặt vé để xác thực và in vé xem phim chuẩn nhiệt (Thermal Ticket).
5. **Đánh giá & Xếp hạng sao thật**: Hệ thống đánh giá phim chuẩn không dùng rating ảo.