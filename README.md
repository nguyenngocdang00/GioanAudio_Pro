# StageAudio Pro v3 — cài đặt (làm 1 lần)

## 1. Apps Script (backend, đọc nhạc từ Drive)
1. Vào script.google.com → **Dự án mới** → dán toàn bộ `Code.gs`.
2. **Cài đặt dự án** → bật "Hiện tệp kê khai appsscript.json" → dán nội dung `appsscript.json`.
3. Chọn hàm **setup** → Chạy → cấp quyền → mở **Nhật ký thực thi**: ghi lại `API_KEY` và link thư mục `StageAudio`.
4. **Triển khai → Triển khai mới → Ứng dụng web**: Thực thi bằng *Tôi*, Quyền truy cập *Bất kỳ ai* → chép **URL kết thúc bằng /exec**.
   (Sửa `Code.gs` về sau phải tạo phiên bản triển khai mới.)

## 2. Nhạc
Chép file MP3/M4A/WAV vào thư mục **StageAudio** trên Drive (làm được bằng app Drive trên điện thoại).

## 3. Đưa app lên mạng (miễn phí, cần HTTPS để cài như app)
Tạo repo GitHub → tải lên `index.html`, `sw.js`, `manifest.webmanifest`, `icon-192.png`, `icon-512.png` →
Settings → Pages → Deploy from branch (`main`, `/root`) → mở `https://<tên>.github.io/<repo>/`.
API key **không** nằm trong code; bạn nhập trên từng máy.

## 4. Trên điện thoại
1. Mở link → *Thêm vào màn hình chính*.
2. Bấm **☁ Drive → Kết nối** (dán URL /exec + API key) → **Làm mới thư viện**.
3. Thêm tiết mục / hiệu ứng, chọn nhạc ở nhóm **Thư viện Drive**.
4. **Đồng bộ nhạc về máy** khi có wifi (các file hiện ✓ sẵn sàng offline). Thử bật chế độ máy bay rồi phát.
5. **Lưu kịch bản lên Drive** để máy khác dùng **Tải kịch bản từ Drive**.

## Lưu ý khi diễn
- Đồng bộ và thử offline **trước ngày diễn**; mang thêm một thiết bị dự phòng đã đồng bộ.
- iPhone: nếu không nghe tiếng, kiểm tra công tắc im lặng và cập nhật iOS.
- Nhạc đã chọn từ máy (không qua Drive) chỉ nằm trên máy đó; chỉ nhạc Drive mới đồng bộ giữa các máy.
