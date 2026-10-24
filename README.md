# Orb Clash

Game đấu bóng vật lý offline: hai (hoặc tám) quả bóng tự lao vào nhau, kỹ năng tự kích hoạt, bạn giữ nút **Dồn lực** để lật kèo. Toàn bộ game là một file HTML (canvas + JavaScript thuần), chơi được trên máy tính và điện thoại.

- 126 quả bóng, 5 độ hiếm, mỗi quả một nhân vật và kỹ năng riêng
- Chế độ: đấu nhanh với bot, Leo tháp (25 tầng, 5 boss), Vô tận, Hỗn chiến 8 bóng, Tournament (LAN hoặc đấu bot)
- Rương gacha, hợp thể bóng, hộp bí ẩn, code quà

## Chơi
Mở `OrbClash-offline.html` bằng trình duyệt, hoặc cài bản Windows từ trang Releases.

## Phát triển
```
python build.py                 # ghép src/ → OrbClash-offline.html
cd server && npm install && node server.js 8787   # server tournament LAN
cd electron && npm install && npm run dist        # bộ cài Windows
```

Tác giả: Trần Đức Long · GitHub [Kokonut-Original](https://github.com/Kokonut-Original)
