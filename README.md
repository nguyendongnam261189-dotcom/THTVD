<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>

# CỔNG THÔNG TIN ĐIỆN TỬ - TRƯỜNG TIỂU HỌC TRẦN VĂN DƯ
## Ứng dụng Quản lý CLB & Học liệu số

Đây là mã nguồn cho ứng dụng web giúp nhà trường quản lý hình ảnh, video hoạt động và chia sẻ tài liệu chuyên môn.

---

## 🚀 HƯỚNG DẪN CÀI ĐẶT (QUAN TRỌNG)

Để ứng dụng hoạt động đầy đủ (Lưu trữ dữ liệu, Đăng nhập, Tải ảnh), bạn cần thiết lập **Google Apps Script**.

### Bước 1: Chuẩn bị Database
1. Truy cập [Google Sheets](https://sheets.new) để tạo một bảng tính mới.
2. Đặt tên file là: `DB_TruongHoc` (hoặc tên tùy ý).

### Bước 2: Cài đặt mã nguồn Backend
1. Trên thanh menu của Google Sheet, chọn **Tiện ích mở rộng (Extensions)** > **Apps Script**.
2. Một tab mới sẽ mở ra. Hãy xóa hết code cũ và **Copy toàn bộ nội dung trong file `backend/Code.gs`** của dự án này dán vào đó.
3. Nhấn tổ hợp phím `Ctrl + S` để lưu.

### Bước 3: Khởi tạo dữ liệu tự động
1. Trong giao diện Apps Script, nhìn lên thanh công cụ, tìm ô chọn hàm (thường ghi là `myFunction`).
2. Đổi thành hàm **`setupSystem`**.
3. Nhấn nút **Chạy (Run)**.
4. Google sẽ yêu cầu quyền truy cập (Review Permissions). Hãy cấp quyền (Chọn tài khoản -> Advanced -> Go to ... (unsafe) -> Allow).
   > *Lưu ý: Đây là script của chính bạn tạo ra nên hoàn toàn an toàn.*
5. Sau khi chạy xong, quay lại Google Sheet, bạn sẽ thấy các tab `Users` và `Posts` đã được tạo. Email của bạn đã được thêm vào tab `Users` với quyền ADMIN.

### Bước 4: Triển khai (Deploy) lấy Link
1. Nhấn nút xanh **Deploy** (Triển khai) ở góc trên bên phải > chọn **New deployment** (Tùy chọn triển khai mới).
2. Nhấn biểu tượng bánh răng chọn **Web app**.
3. Điền thông tin:
   - **Description**: `Version 1`
   - **Execute as**: `Me` (Tôi) - **BẮT BUỘC**.
   - **Who has access**: `Anyone` (Bất kỳ ai) - **BẮT BUỘC** để App truy cập được.
4. Nhấn **Deploy**. Copy đường dẫn **Web app URL** (có dạng `https://script.google.com/macros/s/.../exec`).

### Bước 5: Kết nối App
1. Mở Ứng dụng Web này lên.
2. Tại màn hình Đăng nhập, nhấn vào nút **Cài đặt (Bánh răng)** ở góc trên bên phải.
3. Dán URL Web App vừa copy vào ô trống và nhấn **Lưu**.
4. Đăng nhập bằng email của bạn (đã được cấp quyền ở Bước 3).

---

## 🛠 Chạy ứng dụng dưới máy (Local Development)

**Yêu cầu:** Node.js

1. Cài đặt thư viện:
   `npm install`
2. Cấu hình Gemini API Key:
   - Tạo file `.env.local`
   - Thêm dòng: `GEMINI_API_KEY=your_api_key_here`
3. Chạy ứng dụng:
   `npm run dev`

Link ứng dụng mẫu trên AI Studio: https://ai.studio/apps/drive/1B-lAQCWLRCpmVhyDtYZAwgLoEY6-9PNp
