const mineflayer = require('mineflayer')
const inventoryViewer = require('mineflayer-web-inventory')
const { pathfinder, Movements, goals: { GoalNear, GoalFollow, GoalBlock } } = require('mineflayer-pathfinder')
const pvp = require('mineflayer-pvp').plugin
const tpsPlugin = require('mineflayer-tps')(mineflayer)
const armorManager = require('mineflayer-armor-manager')
const collectBlock = require('mineflayer-collectblock').plugin
const autoeat = require('mineflayer-auto-eat').plugin

const rlsync = require('readline-sync')
let bacctype = rlsync.question(`Auth: `)

let bauth, bname, bpass;
if (bacctype === 'mojang') {
  bauth = 'mojang';
  bname = rlsync.question(`Email: `)
  bpass = rlsync.question('Password: ');
} else if (bacctype === 'microsoft') {
  bauth = 'microsoft';
  bname = rlsync.question(`Email: `)
  bpass = rlsync.question('Password: ');
} else {
  bauth = 'offline';
  bname = rlsync.question(`Name: `)
  bpass = '';
}

let bip = rlsync.question(`Server: `)
let bver = rlsync.question(`Version: `)
let ip = bip.split(':');

const readline = require('readline')
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
})

const opn = require('opn');
const path = require('path');

const options = {
  username: bname,
  host: ip[0],
  port: ip[1],
  version: bver,
  auth: bauth,
  password: bpass
}
createbot()

clientlog(`Dùng \x1b[38;2;38;88;252m.help\x1b[0m để hiển thị toàn bộ command`)

function createbot() {
  const bot = mineflayer.createBot(options)

  console.log(options)

  bot.on('login', () => {
    clientlog(`\x1b[38;2;252;246;50m${options.username} login in ${options.host}:${options.port}\x1b[0m`)
    process.title = `${options.username} @ ${options.host}:${options.port}`
    bot.on('message', (message) => clientlog(message.toAnsi()));
  })

  bot.on('spawn', () => {
    const mcData = require('minecraft-data')(bot.version);
    movements = new Movements(bot, mcData);
    bot.pathfinder.setMovements(movements)
  })

  bot.loadPlugin(pathfinder)
  bot.loadPlugin(pvp)
  bot.loadPlugin(tpsPlugin)
  bot.loadPlugin(armorManager)
  bot.loadPlugin(collectBlock)
  bot.loadPlugin(autoeat)

  bot.armorManager.equipAll()

  let invoptions = {
    port: 4000,
  }
  inventoryViewer(bot, invoptions)

  rl.on('line', (command) => {
    let arg = command.split(' ')
    let cmd = arg[0]
    if (cmd.startsWith('.')) {
        switch(cmd) {
          case '.help':
            const cguis = [
              {
                usage: ".help",
                description: "Hiển thị danh sách lệnh"
              },
              {
                usage: ".clear || .cls",
                description: "Xóa màn hình console."
              },
              {
                usage: ".meslog",
                description: "Lọc tin nhắn và chat."
              },
            ];
            const cchats = [
              {
                usage: ".chat | .send | .say <message>",
                description: "Gửi tin nhắn đến máy chủ"
              },
              {
                usage: ".cmd | .command <command>",
                description: "Gửi lệnh đến máy chủ mà không cần /"
              },
              {
                usage: `.spam "<text>" <delay> <time> <antispamtype:length:customechars(optional)`,
                description: "Spam gì đó vào đến máy chủ"
              }  
            ];
            const cbotinfos = [
              {
                usage: ".coord | .coordinates",
                description: "Gửi tin nhắn đến máy chủ"
              },
              {
                usage: ".inv | .inventory",
                description: "Hiển thị toàn bộ đồ của bot."
              },
              {
                usage: ".item | .items",
                description: "Hiển thị item trong túi đồ của bot."
              },
              {
                usage: ".itemslot <slot> (1-44)",
                description: "Hiển thị thông tin chi tiết của item trong slot được nhập."
              },
              {
                usage: ".webinv | .showinv | .invsee",
                description: "Hiển thị kho đồ trong túi đồ của bot trên web."
              },
              {
                usage: ".server",
                description: "Hiển thị thông tin về máy chủ."
              },
              {
                usage: ".player | .players",
                description: "Liệt kê tất cả người chơi đang online."
              },
              {
                usage: ".playerinfo",
                description: "Hiển thị thông tin chi tiết về một người chơi cụ thể."
              },
              {
                usage: ".nbtitems",
                description: "Hiển thị thông tin chi tiết của toàn bộ item trong inventory."
              },
              {
                usage: ".nbtslot <slot> (1-44)",
                description: ".Hiển thị thông tin chi tiết của slot chỉ định trong inventory."
              },
              {
                usage: ".idslot",
                description: "Hiển thị slot id."
              },
              {
                usage: ".itemslot <slot>",
                description: "Hiển thị thông tin slot."
              },
            ];
            const cmoments = [
              {
                usage: ".goto <player> <postion>",
                description: "Di chuyển đến vị trí hoặc người chơi được chỉ định."
              },
              {
                usage: ".stopgoto",
                destination: "Dừng đi đến vị trí hoặc người chơi."
              },
              {
                usage: ".follow <player>",
                description: "Đi theo một người chơi khác trên máy chủ."
              },
              {
                usage: ".unfollow",
                description: "Thoát khỏi chế độ đi theo người chơi."
              },
              {
                usage: ".fight <player>",
                description: "PVP với một người chơi khác trên máy chủ."
              },
              {
                usage: ".stopfight",
                description: "Dừng PVP."
              },
              {
                usage: ".sneak",
                description: "Bật chế độ lén bước."
              },
              {
                usage: ".unsneak",
                description: "Tắt chế độ lén bước."
              },
              {
                usage: ".jump",
                description: "Nhảy lên."
              },
              {
                usage: ".move",
                description: "TODO."
              },
              {
                usage: ".forcemove <Direction:forward|back|left|right> <duration>",
                description: "Di chuyển."
              },
              {
                usage: ".stopmove",
                description: "Dừng di chuyển."
              },
              {
                usage: ".hand | .hands | .handslot <1-8>",
                description: "Chuyển hotbar được cầm."
              },
              {
                usage: ".equip",
                description: "Equip item trong túi đồ vào các vị trí như tay, đầu, thân thể,..."
              },
              {
                usage: ".unequip",
                description: "Tháo item khỏi các vị trí: đầu, thân thể,..."
              },
              {
                usage: ".afk",
                description: "Tự động di chuyển để tránh bị kick ra khi không hoạt động."
              },
              {
                usage: ".stopafk",
                description: "Dừng chế độ tự động đi lại."
              },
              {
                usage: ".eat (Lỗi)",
                description: "Cho bot tự ăn thức ăn."
              },
              {
                usage: ".stopeat (Lỗi)",
                description: "Dừng cho bot tự ăn thức ăn."
              },
              {
                usage: ".guard (Chưa test)",
                description: "Bảo vệ một khu vực (di chuyển và tấn công)."
              },
              {
                usage: ".stopguard (Chưa test)",
                description: "Dừng chế độ bảo vệ khu vực."
              },
              {
                usage: ".mine (Chưa hoàn thiện)",
                description: "Đào block."
              },
              {
                usage: ".dropslot <slot> (1-44)",
                description: "Vứt slot chỉ định trong inventory."
              },
              {
                usage: ".dropall",
                description: "Đang lỗi chưa tìm đc cách fix."
              },
              {
                usage: ".login",
                description: "Đổi tên cho bot."
              },
              {
                usage: ".conn | .connect <ip:port> <version>",
                description: "Cho bot vào server."
              },
              {
                usage: ".disco | .disconnect",
                description: "Cho bot rời server."
              },
              {
                usage: ".reco | .reconnect",
                description: "Cho bot vào lại server."
              },
              {
                usage: ".exit | .quit | .leave",
                description: "Cho bot rời server và thoát khỏi chương trình."
              } 
            ];
            const ccreatives = [
              {
                usage: ".fly",
                description: "Cho bot bay trong creative."
              },
              {
                usage: ".stopfly",
                description: "Cho bot không bay trong creative."
              },
              {
                usage: ".setinvslot",
                description: "Chx xg."
              },
              {
                usage: ".clearslot <slot>",
                description: "Xóa 1 ô đồ trong chế độ creative."
              },
              {
                usage: ".clearinv | .clearinventory",
                description: "Xóa 1 ô đồ trong chế độ creative."
              }
            ]
            clientlog("\x1b[38;2;222;128;40mDanh sách lệnh của bot:\x1b[0m");
            clientlog(`\x1b[38;2;252;196;40mGui command:\x1b[0m`)
            cguis.forEach(cgui => {
                clientlog(`\x1b[38;2;71;242;48m${cgui.usage}\x1b[0m - ${cgui.description}`);
            });
            clientlog(`\x1b[38;2;252;196;40mChat command:\x1b[0m`)
            cchats.forEach(cchat => {
                clientlog(`\x1b[38;2;71;242;48m${cchat.usage}\x1b[0m - ${cchat.description}`);
            });
            clientlog(`\x1b[38;2;252;196;40mBot info command:\x1b[0m`)
            cbotinfos.forEach(cbotinfo => {
                clientlog(`\x1b[38;2;71;242;48m${cbotinfo.usage}\x1b[0m - ${cbotinfo.description}`);
            });
            clientlog(`\x1b[38;2;252;196;40mMoment command:\x1b[0m`)
            cmoments.forEach(cmoment => {
                clientlog(`\x1b[38;2;71;242;48m${cmoment.usage}\x1b[0m - ${cmoment.description}`);
            });
            clientlog(`\x1b[38;2;252;196;40mCreative command:\x1b[0m`)
            ccreatives.forEach(ccreative => {
                clientlog(`\x1b[38;2;71;242;48m${ccreative.usage}\x1b[0m - ${ccreative.description}`);
            });
            break;
          
          case '.chat':
          case '.send':
          case '.say':
            if (!arg[1]) {
              clientlog('Chat must be need arguments')
            }
            bot.chat(arg[1].substring())
            break;
          
          case '.cmd':
          case '.command':
            if (!arg[1]) {
              clientlog('Command must be need arguments')
            }
            bot.chat('/'+arg[1].substring())
            break;

          case '.spam':
            let args = command.split(/ (?=(?:(?:[^"]*"){2})*[^"]*$)/);
            if (args.length < 3) {
              clientlog(`Usage: .spam "<text>" <delay> <time> <antispamtype:length:customechars(optional)`)
              clientlog(`Anti spam type:all | number | letter | capitalize | lowercase | custom`)
              return
            }
            let text = command.match(/"([^"]+)"/)[1];
            let delay = parseInt(args[2]) * 1000
            let time = parseInt(args[3]) * 1000
            let antispam = args[4]
            let prefix = (args[5] ?? '').split(':')
            let randomChar = (chars) => chars[Math.floor(Math.random() * chars.length)]
            let aspam, length, chars, left, right
            if (antispam) {
              aspam = antispam.split(':')
              length = parseInt(aspam[1])
              switch (aspam[0]) {
                case 'all':
                  chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()_+";
                  break
                case 'number':
                  chars = "0123456789";
                  break
                case 'letter':
                  chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";
                  break
                case 'capitalize':
                  chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
                  break
                case 'lowercase':
                  chars = "abcdefghijklmnopqrstuvwxyz";
                  break
                case 'custom':
                  chars = aspam[2]
                  break
                default:
                  chars = "";
            }
              left = prefix[0] || '';
              right = prefix[1] || '';            
            } else {
              length = 0
              left = ""
              right = ""
            }
            function randomString(length, chars) {
              let result = "";
              for (let i = 0; i < length; i++) {
                result += randomChar(chars);
              }
              return result
            }
        
            function spam() {
              clientlog(`Bắt đầu spam "${text}" cách ${delay / 1000}s trong ${time/ 1000}s với antispam ${left} ${antispam} ${right}`);
              intervalId = setInterval(() => {
                let spam = `${text} ${left} ${randomString(length, chars)} ${right}`
                bot.chat(spam)
              }, delay);
              setTimeout(() => {
                clientlog('Kết thúc spam tin nhắn');
                clearInterval(intervalId);
              }, time + 1000);
            }
            spam();
            break;

          case '.stopspam':
            if (intervalId) {
              clearInterval(intervalId);
              clientlog('Spamming stopped');
            } else {
              clientlog('No spamming in progress');
            }
            break;
                        
          case '.fly':
            if (bot.player.gamemode != 1) {clientlog(`You need in creative to use`); return}
            bot.creative.startFlying()
            break;

          case '.flyto':
            if (bot.player.gamemode != 1) {clientlog(`You need in creative to use`); return}
            bot.creative.flyTo(destination)
            break

          case '.stopfly':
            if (bot.player.gamemode != 1) {clientlog(`You need in creative to use`); return}
            bot.creative.stopFlying()
            break;

          case '.setinvslot': //unfinish
          if (bot.player.gamemode != 1) {clientlog(`You need in creative to use`); return}
            bot.creative.setInventorySlot(slot, item)
            break;

          case '.clearslot':
            if (bot.player.gamemode != 1) {clientlog(`You need in creative to use`); return}
            const cclearslot = arg[1]
            bot.creative.clearSlot(cclearslot)
            break;

          case '.clearinv':
          case '.clearinventory':
            if (bot.player.gamemode != 1) {clientlog(`You need in creative to use`); return}
            bot.creative.clearInventory()
            break;
        
          case '.coord':
          case '.coordinates':
            clientlog(`[Coordinates] ${bot.entity.position}`);
            clientlog(`[World] ${bot.game.dimension}`);
            break;

          case '.info':
            const worlds = bot.game.dimension
            const world = worlds.split(':')
            const worldname = world[1]
            clientlog(`Health: ${bot.health} / Food: ${bot.food}`)
            clientlog(`Oxygen: ${bot.oxygenLevel}`)
            clientlog(`Coordinates: ${bot.entity.position} at ${worldname}`)
            clientlog(`Spawn point: ${bot.spawnPoint}`)
            clientlog(`Gamemode: ${bot.game.gameMode} (${bot.player.gamemode})`)
            break;
        
          case '.clear':
          case '.cls':
            console.clear()
            clientlog(`\x1b[38;2;45;255;25mSuccessful clear\x1b[0m`)
          break;

          case '.inv':
          case '.inventory':
            clientlog(`                                   BOT INVENTORY                                       `)
            clientlog(`| Slot | Slot Name    | Name                      | Count | id_item                   |`)
            clientlog(`=======================================================================================`)
            const slots = bot.inventory.slots;
            slots.forEach((item, index) => {
              if (item) {
                let slotName = '';
                if (item.slot >= 36 && item.slot <= 44) {
                  slotName = `Hotbar ${item.slot - 35}`;
                } else if (item.slot === 45) {
                  slotName = 'Off Hand';
                }else if (item.slot === 5) {
                  slotName = 'Helmet';
                }else if (item.slot === 6) {
                  slotName = 'Chestplate';
                }else if (item.slot === 7) {
                  slotName = 'Leggings';
                }else if (item.slot === 8) {
                  slotName = 'Boots';
                } else if (item.slot >= 9 && item.slot <= 35) {
                  slotName = `Container ${item.slot - 8}`;
                } else {
                  slotName = `Slot ${item.slot}`;
                }
                clientlog(`| ${item.slot.toString().padEnd(4)} | ${slotName.padEnd(12)} | ${item.displayName.padEnd(25)} | ${item.count.toString().padEnd(2)}/${item.stackSize.toString().padEnd(2)} | ${item.name.padEnd(25)} |`);
              } else {
                let slotName = '';
                if (index >= 36 && index <= 44) {
                  slotName = `Hotbar ${index - 35}`;
                } else if (index === 45) {
                  slotName = 'Off Hand';
                }else if (index === 5) {
                  slotName = 'Helmet';
                }else if (index === 6) {
                  slotName = 'Chestplate';
                }else if (index === 7) {
                  slotName = 'Leggings';
                }else if (index === 8) {
                  slotName = 'Boots';
                } else if (index >= 9 && index <= 35) {
                  slotName = `Container ${index - 8}`;
                } else {
                  slotName = `Slot ${index}`;
                }
                clientlog(`| ${index.toString().padEnd(4)} | ${slotName.padEnd(12)} | Empty                     | null  | empty                     |`);
              }
            });
            break;

          case '.itemslot':
            const itemslot = arg[1];
              if (itemslot >= 0 && itemslot < 45) {
                if (bot.inventory.slots[itemslot]) {
                  const item = bot.inventory.slots[itemslot]
                  clientlog(`Slot: ${item.slot}`)
                  clientlog(`Name: ${item.displayName}`)
                  clientlog(`Id: ${item.name}`)
                  clientlog(`Count: ${item.count}`)
                  clientlog(`Stack size: ${item.stackSize}`)
                  clientlog(`Durability: ${item.durabilityUsed}`)
                  clientlog(`Enchants: ${JSON.stringify(item.enchants)}`)
                  clientlog(`Item type: ${item.type}`)
                  clientlog(`Custome name: ${item.customName}`)
                  clientlog(`Custome lore: ${item.customLore}`)
                  clientlog(`Meta data: ${item.metadata}`)
                  clientlog(`Repair cost: ${item.repairCost}`)
                } else {
                  clientlog(`This slot is empty`);
                }
              } else {
                clientlog(`Invalid slot number. Use .itemslot (0-44)`);
              }
            break;

          case '.item':
          case '.items':
            clientlog(`All item in bot inventory:`)
            for (const item of bot.inventory.items()) {
              clientlog(`[Item] Slot ${item.slot.toString().padEnd(2)} : ${item.name} x ${item.count} Enchants:${JSON.stringify(item.enchants)}`); item.enchants
            }
            break;

          case '.nbtslot':
            const nbtslot = arg[1];
              if (nbtslot >= 0 && nbtslot < 45) {
                if (bot.inventory.slots[nbtslot]) {
                  console.log(bot.inventory.slots[nbtslot]);
                } else {
                  clientlog(`This slot is empty`);
                }
              } else {
                clientlog(`Invalid slot number. Use .nbtslot (0-44)`);
              }
            break;

          case '.nbtitems':
            console.log(bot.inventory.slots)
            break;

          case '.hand':
          case '.hands':
          case '.handslot':
            if (!arg[1]) { clientlog(`Change quickbar slot must be need a slot`); clientlog(`Example: ${arg[0]} 3`); return }
            if (arg[1] < 1 || arg[1] > 9) { clientlog('Slot available (1-9)'); return }
              clientlog('Change hands to slot ' + arg[1])
              let bquickbarchange = (arg[1] - 1)
              bot.setQuickBarSlot(bquickbarchange)
            break;
            
          case '.equip':
            bot.armorManager.equipAll()
            break;

          case '.unequip':
            if (arg[1] == 'head' || arg[1] == 'torso' || arg[1] == 'legs' || arg[1] == 'feet' || arg[1] == 'off-hand' || arg[1] == 'all') {
              if (arg[1] !== 'all') {
                clientlog(`Unequip ${arg[1]}`)
                bot.unequip(arg[1])
              } else if (arg[1] = 'all') {
                unequipall()
              }
            } else {
              clientlog(`Unequip available ( head | torso | legs | feet | off-hand | all)`)
            }
            async function unequipall() {
              await bot.unequip('head')
              await bot.unequip('torso')
              await bot.unequip('legs')
              await bot.unequip('feet')
              await bot.unequip('off-hand')
              await clientlog(`Unequip all`)
            }
            break;

          case '.webinv':
          case '.showinv':
          case '.invsee':
            clientlog("Open web inventory in http://localhost:"+ invoptions.port)
            clientlog(`Open invslot`)
            opn("http://localhost:"+ invoptions.port)
            opn("https://camo.githubusercontent.com/83196104a7c585ce3a0143662ee2a1ecf40084782d647df5a344bbd33e626b10/68747470733a2f2f77696b692e76672f696d616765732f312f31332f496e76656e746f72792d736c6f74732e706e67")
            break;

          case '.dropslot':
            let slot = arg[1]
            if (!slot) return
            if (slot < 1 || slot > 44) {clientlog('Slot available (1-44)\n Use ".idslot" to see slot id'); return} 
            let dropslot = bot.inventory.slots[slot]
            if (dropslot && dropslot.type !== -1) {
              bot.tossStack(dropslot)
                clientlog(`Drop slot ${slot}`)
            } else {
              clientlog(`Slot ${slot} is empty or invalid`)
            }
            break;

          case '.dropall':
            tossInventory(bot)
            async function tossInventory(bot) {
              const items = bot.inventory.items()
              
              for (const item of items) {
                await bot.tossStack(item)
              }
            }
            break;

          case '.idslot':
            opn("https://camo.githubusercontent.com/83196104a7c585ce3a0143662ee2a1ecf40084782d647df5a344bbd33e626b10/68747470733a2f2f77696b692e76672f696d616765732f312f31332f496e76656e746f72792d736c6f74732e706e67")
            break;
          
          case '.fight':
            let target = null
            if (!arg[1]) {
              if (username == console) { clientlog(username, 'Can\'t fight with Console'); return }
              target = bot.players[username].entity
            } else {
              target = bot.players[arg[1]].entity
            }

            if (!target) { clientlog(username, 'Can\'t see' + target?.username); return }
              clientlog('Start PVP with ' + target.username)
              followattack(target)
              bot.pvp.attack(target)

            setTimeout(() => {
              const sword = bot.inventory.items().find(item => item.name.includes('sword'))
              if (sword) bot.equip(sword, 'hand')
            }, 250)
            break;
          
          case '.stopfight':
            stopfollowattack()
            bot.pvp.stop()
            break;

          case '.server':
            clientlog(`IP: ${options.host}:${options.port}`)
            clientlog(`Ver: ${options.version}`)
            clientlog(`TPS: ${bot.getTps()}`)
            clientlog(`Difficulty: ${bot.game.difficulty}`)
            clientlog(`Hardcore: ${bot.game.hardcore}`)
            clientlog(`Maxplayer: ${bot.game.maxPlayers}`)
            clientlog(`World tpye: ${bot.game.levelType}`)
            break;

          case '.tps':
            clientlog('Server tps: ' + bot.getTps())
            break;
        
          case '.player':
          case '.players':
            const players = Object.keys(bot.players).map((name) => `\x1b[32m${name}(${bot.players[name].ping}ms)\x1b[0m`).join(' | ');
            clientlog(`[Player List] ${players}`);
            break;
          case '.playerinfo':
            if (arg.length < 2) {
              clientlog('[Player Info] .playerinfo <player>\n[Player Info] Example: .playerinfo bot');
            } else {
              const target = arg[1];
              if (!bot.players[target]) {
                clientlog(`[Player Info] ${target} is not on the server`);
              } else {
                const playerinfo = `\x1b[32m${target}(${bot.players[target]?.ping}ms)\x1b[0m UUID: ${bot.players[target]?.uuid}`;
                clientlog(`[Player Info] ${playerinfo}`);
              }
            }
            break;
          
          case '.sneak':
            bot.setControlState('sneak', true);
            clientlog(`${bot.username} start sneak`);
            break;
          
          case '.unsneak':
            bot.setControlState('sneak', false);
            clientlog(`${bot.username} stop sneak`);
            break;
          
          case '.jump':
            bot.setControlState('jump', true);
            setTimeout(() => {bot.setControlState('jump', false)}, 500);
            clientlog(`[Bot] ${bot.username} jump`);
            break;

          case '.lookat':
            let targetPos;
            if (arg.length === 2) {
              // Nếu người chơi nhập tọa độ, sử dụng nó
              const [x, y, z] = arg[1].split(',');
              targetPos = new Vec3(parseFloat(x), parseFloat(y), parseFloat(z));
            } else if (arg.length === 3) {
              // Nếu người chơi nhập tên người chơi, sử dụng tọa độ của người chơi
              const targetPlayer = arg[1];
              const player = bot.players[targetPlayer];
              if (!player) {
                clientlog(`Không tìm thấy người chơi '${targetPlayer}'`);
                return;
              }
              targetPos = player.entity.position;
            } else {
              clientlog(`Usage: .lookat <x,y,z> | <player>`);
              return;
            }
          
            bot.lookAt(targetPos);
            clientlog(`Đang nhìn về phía ${targetPos}`);
            break;

          case '.look':
            const yaw = arg[1]
            const pitch = arg[2]
            if (arg.length < 2 ) {
              clientlog(`Usage: .look <yaw> <pitch>`);
              return;
            }
            bot.look(yaw, pitch, [force])
            clientlog(`Đang nhìn về hướng ${yaw} ${pitch}`)
            break

          case '.move':
            
            break;

          case '.forcemove':
            if (arg[0] === '.forcemove') {
              const direction = arg[1];
              const duration =parseFloat(arg[2]);
          
              if (direction && ['forward', 'back', 'left', 'right'].includes(direction) && !isNaN(duration) && duration > 0) {
                clientlog(`Moving ${direction} for ${duration} seconds`);
                const controlState = {
                  forward: false,
                  back: false,
                  left: false,
                  right: false
                };
                controlState[direction] = true;
                bot.setControlState(direction, true);
                setTimeout(() => {
                  bot.setControlState(direction, false);
                  clientlog(`Stopped moving ${direction}`);
                }, duration * 1000);
              } else {
                clientlog('Usage: .forcemove <Direction:forward|back|left|right> <duration>');
                }
              }
            break;

          case '.stopmove':
            bot.setControlState('forward', false)
            bot.setControlState('back', false)
            bot.setControlState('left', false)
            bot.setControlState('right', false)
            bot.setControlState('jump', false)
            bot.setControlState('sprint', false)
            break;
          
          case '.goto':
            if (arg.length < 2 ) {
                clientlog(`Usage: ${cmd} <x> <y> <z> or <player>`);
                return;
              }
              const x = parseFloat(arg[1]);
              const y = parseFloat(arg[2]);
              const z = parseFloat(arg[3]);
            
              if (isNaN(x) || isNaN(y) || isNaN(z)) {
                const targetPlayer = bot.players[arg[1]];
            
                if (targetPlayer) {
                  const position = targetPlayer.entity.position;
            
                  clientlog(`Going to ${arg[1]}'s position: ${position.x.toFixed(2)}, ${position.y.toFixed(2)}, ${position.z.toFixed(2)}`);
                  bot.pathfinder.setGoal(new GoalNear(position.x, position.y, position.z, 0));
                } else {
                  clientlog(`Can't find player: ${arg[1]}`);
                }
              } else {
                clientlog(`Going to coordinates: ${x.toFixed(2)}, ${y.toFixed(2)}, ${z.toFixed(2)}`);
                bot.pathfinder.setGoal(new GoalNear(x, y, z, 0));
              }
            break;

          case '.stopgoto':
            bot.pathfinder.setGoal(null);
            clientlog(`Stopped goto`);
            break;
          
          case '.follow':
            followplayer();
            break;
          
          case '.unfollow':
            unfollowPlayer();
            break;
          
          case '.afk':
            clientlog('[AFK] Starting anti-afk');
            isAFK = true;
            startAFK();
            break;
          
          case '.stopafk':
            clientlog('[AFK] Stop anti-afk');
            isAFK = false;
            clearTimeout(afktimer);
            break;
          
          case '.eat':
            clientlog(`Enable auto-eat`)
            bot.autoEat.enable()
            break;

          case '.stopeat':
            clientlog(`Disable auto-eat`)
            bot.autoEat.disable()
            break;

          case '.guard':
            const guardpos = bot.entity.position
            guardArea(guardposition)
            break;

          case '.stopguard':
            clientlog('Stop guarding...')
            stopGuarding
            break;
          
          case '.meslog':
            if (!arg[1]) {
              clientlog(`Usage '.meslog + off / mes / chat / all'`);
              break;
            }
            const logs = arg[1];
            bot.removeAllListeners('message');
            bot.removeAllListeners('chat');
            switch (logs) {
              case 'all':
                clientlog('Show all');
                bot.on('message', (message) => {
                  clientlog(message.toAnsi());
                });
                break;
              case 'mes':
                clientlog('Show message');
                bot.on('message', (message, position) => {
                  if (position !== 'game_info') {
                    clientlog(message.toAnsi());
                  }
                });
                break;
              case 'chat':
                clientlog('Show chat');
                bot.on('chat', (username, message) => {
                  clientlog(`<${username}> ${message}`);
                });
                break;
              case 'off':
                clientlog('Message logged off');
                break;
              default:
                clientlog(`Unknown logs: ${logs}`);
            }
            break;
            

          case '.mine':
            mineblock()
            break;
          
          case ".conn":
          case '.connect':
            bhost = arg[1];
            let ip = bhost.split(':');
            options.host = ip[0];
            options.port = ip[1]
            let bver = arg[2]
            options.version = bver
            createbot()
            break;

          case '.disco':
          case '.disconnect':
            bot.quit()
            clientlog(`${options.username} left ${options.host}:${options.port}`)
            break;
          
          case '.reco':
          case '.reconnect':
            createbot()
            break;

          case '.exit':
          case '.leave':
          case '.quit':
            clientlog(`${options.username} left ${options.host}:${options.port}`);
            process.exit();
            break;

          default:
            let newcmd = cmd.substring(1)
            clientlog(`Unknown command: "${newcmd}". Type ".help" for a list of commands.`);
        }
    } else {
      bot.chat(command);
    }

    function mineblock() {
      clientlog('Chx xong')
    }
    
    function followplayer() {
      if (!arg[1]) {
        clientlog('Usage: .follow <player>');
        return;
      }
    
      let followplayer = bot.players[arg[1]].entity;
    
      if (!followplayer) {
        clientlog(`Can't find player: ${arg[1]}`);
        return;
      }
    
      bot.pathfinder.setGoal(new GoalFollow(followplayer, 1), true)
    
      clientlog(`Following ${arg[1]}`);
    }
    
    function unfollowPlayer() {
      bot.pathfinder.setGoal(null);
      clientlog(`Stopped following player`);
    }
    
    function startAFK() {
      if (!isAFK) return;
    
      const mcData = require('minecraft-data')(bot.version);
      let state = true;
      
      afktimer = setTimeout(() => {
        if (!state) {
          bot.setControlState('jump', true);
          state = true;
        } else {
          const direction = Math.floor(Math.random() * 5);
          switch (direction) {
            case 0:
              bot.setControlState('forward', true);
              break;
            case 1:
              bot.setControlState('back', true);
              break;
            case 2:
              bot.setControlState('left', true);
              break;
            case 3:
              bot.setControlState('right', true);
              break;
            case 4:
              bot.setControlState('jump', true);
              setTimeout(() => bot.setControlState('jump', false), 250);
              break;
          }
          state = false;
        }
        
        startAFK();
      }, 5000);
    }
    
    function guardArea (pos) {
      guardPos = pos
      if (!bot.pvp.target) {
        moveToGuardPos()
      }
    }
    
    function stopGuarding () {
      guardPos = null
      bot.pvp.stop()
      bot.pathfinder.setGoal(null)
    }
    
    function moveToGuardPos () {
      bot.pathfinder.setMovements(new Movements(bot))
      bot.pathfinder.setGoal(new GoalBlock(guardPos.x, guardPos.y, guardPos.z))
    }
    
    function followattack(player) {
      if (player == bot.player) { return }
      clientlog('Following ' + player.username + ' to attack')
      bot.pathfinder.setGoal(new GoalFollow(player, 2), true)
    }
    
    function stopfollowattack() {
      bot.pathfinder.setGoal(null);
      clientlog(`Stopped fight player`);
    }
  })
  
  bot.on('kicked', console.log)
  bot.on('error', console.log)
}

function clientlog(log) {
  const time = new Date().toLocaleTimeString()
  console.log(`\r [${time}] \x1b[38;2;72;250;235m[Q]\x1b[0m ${log}`)
  rl.prompt(true)
}