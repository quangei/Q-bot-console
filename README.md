# Q-bot-console
Minecraft bot with chat and some command

This program use mineflayer and mineflayer-plugins

# How to use:
- Install node.js https://nodejs.org/en
- Install gitbash https://git-scm.com/downloads (to use git clone)
- Open cmd and goto file you want to save my bot with `cd`
- Use `git clone https://github.com/quangei/Q-bot-console.git`
- Use `cd q-bot-console`
- Use `npm install`
- Use `node bot.js`
- Or you can download .exe

# Command list:
 - Gui command:
 - .help - Hiển thị danh sách lệnh
 - .clear - Xóa màn hình console.
 - .meslog - Lọc tin nhắn và chat.
 - Chat command:
 - .chat | .send | .say <message> - Gửi tin nhắn đến máy chủ
 - .cmd | .command <command> - Gửi lệnh đến máy chủ mà không cần /
 - .spam <mes> <delay> <time> (BETA) - Spam gì đó vào đến máy chủ
 - Bot info command:
 - .coord | .coordinates - Gửi tin nhắn đến máy chủ
 - .inv | .inventory - Hiển thị iventory trong túi đồ của bot.
 - .item | .items - Hiển thị item trong túi đồ của bot.
 - .itemslot <slot> (1-44) - Hiển thị thông tin chi tiết của item trong slot được nhập.
 - .webinv | .showinv | .invsee - Hiển thị kho đồ trong túi đồ của bot trên web.
 - .server - Hiển thị thông tin về máy chủ.
 - .player | .players - Liệt kê tất cả người chơi đang online.
 - .playerinfo - Hiển thị thông tin chi tiết về một người chơi cụ thể.
 - .nbtitems - Hiển thị thông tin chi tiết của toàn bộ item trong inventory.
 - .nbtslot <slot> (1-44) - .Hiển thị thông tin chi tiết của slot chỉ định trong inventory.
 - .idslot - Hiển thị slot id.
 - Moment command:
 - .goto <player> <postion> - Di chuyển đến vị trí hoặc người chơi được chỉ định.
 - .stopgoto - undefined
 - .follow <player> - Đi theo một người chơi khác trên máy chủ.
 - .unfollow - Thoát khỏi chế độ đi theo người chơi.
 - .fight <player> - PVP với một người chơi khác trên máy chủ.
 - .sneak - Bật chế độ lén bước.
 - .unsneak - Tắt chế độ lén bước.
 - .jump - Nhảy lên.
 - .hand | .hands | .handslot <1-8> - Chuyển hotbar được cầm.
 - .equip (Lỗi) - Equip item trong túi đồ vào các vị trí như tay, đầu, thân thể,...
 - .unequip - Tháo item khỏi các vị trí: đầu, thân thể,...
 - .afk - Tự động di chuyển để tránh bị kick ra khi không hoạt động.
 - .stopafk - Dừng chế độ tự động đi lại.
 - .eat (Lỗi) - Ăn thức ăn.
 - .guard (Chưa test) - Bảo vệ một khu vực (di chuyển và tấn công).
 - .stopguard (Chưa test) - Dừng chế độ bảo vệ khu vực.
 - .mine (Chưa hoàn thiện) - Đào block.
 - .dropslot <slot> (1-44) - Vứt slot chỉ định trong inventory.
 - .dropall - Đang lỗi chưa tìm đc cách fix.
 - .disconnect - Cho bot rời server.
 - .reconnect - Cho bot vào lại server.
 - .exit | .quit | .leave - Cho bot rời server và thoát khỏi chương trình.
 - Creative command:
 - .fly - Cho bot bay trong creative.
 - .stopfly - Cho bot không bay trong creative.
 - .setinvslot - Chx xg.
 - .clearslot <slot> - Xóa 1 ô đồ trong chế độ creative.
 - .clearinv | .clearinventory - Xóa 1 ô đồ trong chế độ creative.
