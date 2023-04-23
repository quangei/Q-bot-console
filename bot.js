const mineflayer = require('mineflayer')
const inventoryViewer = require('mineflayer-web-inventory')
const { pathfinder, Movements, goals: { GoalNear, GoalFollow, GoalBlock } } = require('mineflayer-pathfinder')
const pvp = require('mineflayer-pvp').plugin
const tpsPlugin = require('mineflayer-tps')(mineflayer)
const armorManager = require('mineflayer-armor-manager')
const collectBlock = require('mineflayer-collectblock').plugin
const autoeat = require('mineflayer-auto-eat').plugin

const rlsync = require('readline-sync')
let bname = 'Bot'
let bip = '192.168.1.5:57917'
let bver = '1.18.2'
let ip = bip.split(':');

const opn = require('opn');
const path = require('path');

const readline = require('readline')
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
})

const options = {
  username: bname,
  host: ip[0],
  port: ip[1],
  version: bver,
}

const bot = mineflayer.createBot(options)

console.log(options)

bot.on('login', () => {
  clientlog(`\x1b[38;2;252;246;50m${options.username} login in ${options.host}:${options.port}\x1b[0m`)
  clientlog(`Dùng \x1b[38;2;38;88;252m.help\x1b[0m để hiển thị toàn bộ command`)
  clientlog(`Dùng \x1b[38;2;38;88;252m.meslog\x1b[0m \x1b[38;2;122;135;120mmes /chat / off\x1b[0m để đổi chế độ hiển thị chat`)
  clientlog('\x1b[38;2;255;165;0m\u25A0\x1b[0m là mới thêm vào hoặc sửa gì đó')
  clientlog('\x1b[38;2;71;242;48m\u25A0\x1b[0m là đã hoàn thiện')
  clientlog('\x1b[38;2;252;227;38m\u25A0\x1b[0m là chưa thử nghiệm')
  clientlog('\x1b[38;2;247;25;25m\u25A0\x1b[0m là chưa hoàn thiện hoặc lỗi mà chx sửa được')
  process.title = `${options.username} @ ${options.host}:${options.port}`
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
        const commands = [
          {
            name: ".help",
            description: "Hiển thị danh sách lệnh"
          },
          {
            name: ".chat | .send | .say",
            description: "Gửi tin nhắn đến máy chủ."
          },
          {
            name: ".cmd | .command",
            description: "Gửi lệnh đến máy chủ mà không cần /."
          },
          {
            name: ".coord | .coordinates",
            description: "Hiển thị tọa độ hiện tại của bot."
          },
          {
            name: ".clear",
            description: "Xóa màn hình console."
          },
          {
            name: ".inv | .inventory",
            description: "Hiển thị iventory trong túi đồ của bot."
          },
          {
            name: ".item | .items",
            description: "Hiển thị item trong túi đồ của bot."
          },
          {
            name: ".webinv | .showinv",
            description: "Hiển thị kho đồ trong túi đồ của bot trên web."
          },
          {
            name: ".server",
            description: "Hiển thị thông tin về máy chủ."
          },
          {
            name: ".player | .players",
            description: "Liệt kê tất cả người chơi đang online."
          },
          {
            name: ".playerinfo",
            description: "Hiển thị thông tin chi tiết về một người chơi cụ thể."
          },
          {
            name: ".goto",
            description: "Di chuyển đến vị trí hoặc người chơi được chỉ định."
          },
          {
            name: ".follow",
            description: "Đi theo một người chơi khác trên máy chủ."
          },
          {
            name: ".unfollow",
            description: "Thoát khỏi chế độ đi theo người chơi."
          },
          {
            name: ".fight",
            description: "PVP với một người chơi khác trên máy chủ."
          },
          {
            name: ".sneak",
            description: "Bật chế độ lén bước."
          },
          {
            name: ".unsneak",
            description: "Tắt chế độ lén bước."
          },
          {
            name: ".nbtitems",
            description: "Hiển thị thông tin chi tiết của toàn bộ item trong inventory."
          },
          {
            name: ".nbtslot",
            description: ".Hiển thị thông tin chi tiết của slot chỉ định trong inventory."
          },
          {
            name: ".dropslot",
            description: "Vứt slot chỉ định trong inventory."
          },
          {
            name: ".dropall",
            description: "Đang lỗi chưa tìm đc cách fix."
          },
          {
            name: ".jump",
            description: "Nhảy lên."
          },
          {
            name: ".hand | .hands | .handslot",
            description: "Chuyển tay sử dụng."
          },
          {
            name: ".equip",
            description: "Equip item trong túi đồ vào các vị trí như tay, đầu, thân thể,..."
          },
          {
            name: ".unequip",
            description: "Tháo item khỏi các vị trí: đầu, thân thể,..."
          },
          {
            name: ".afk",
            description: "Tự động di chuyển để tránh bị kick ra khi không hoạt động."
          },
          {
            name: ".stopafk",
            description: "Dừng chế độ tự động đi lại."
          },
          {
            name: ".eat",
            description: "Ăn thức ăn."
          },
          {
            name: ".guard",
            description: "Bảo vệ một khu vực (di chuyển và tấn công)."
          },
          {
            name: ".stopguard",
            description: "Dừng chế độ bảo vệ khu vực."
          },
          {
            name: ".mine",
            description: "Đào block."
          },
          {
            name: ".meslog",
            description: "Lọc tin nhắn và chat."
          },
          {
            name: ".dropslot",
            description: "Vứt toàn bộ đồ của 1 ô nào đó."
          },
          {
            name: ".idslot",
            description: "Hiển thị slot id."
          },
          {
            name: ".disconnect",
            description: "Cho bot rời server."
          },
          {
            name: ".reconnect",
            description: "Cho bot vào lại server."
          },
          {
            name: ".exit | .quit | .leave",
            description: "Cho bot rời server và thoát khỏi chương trình."
          }
        ];
        clientlog("\x1b[33mDanh sách lệnh của bot:\x1b[0m");
        commands.forEach(availablecommand => {
          clientlog(`\x1b[38;2;71;242;48m${availablecommand.name}\x1b[0m - ${availablecommand.description}`);
        });
        break;
      
      case '.chat':
      case '.send':
      case '.say':
        if (!arg[1]) {
          clientlog('Chat must be need arguments')
        }
        bot.chat(message.substring(5))
        break;
      
      case '.cmd':
      case '.command':
        if (!arg[1]) {
          clientlog('Command must be need arguments')
        }
        bot.chat('/'+message.substring(5))
        break;
    
      case '.coord':
      case '.coordinates':
        clientlog(`[Coordinates] ${bot.entity.position}`);
        clientlog(`[World] ${bot.game.dimension}`);
        break;

      case '.info':
        const world = bot.game.dimension
        const world2 = world.split(':')
        const worldname = world2[1]
        const effects = bot.entity.effects;
        clientlog(`Health: ${bot.health} / Food: ${bot.food}`)
        clientlog(`Oxygen: ${bot.oxygenLevel}`)
        clientlog(`Coordinates: ${bot.entity.position} at ${worldname}`)
        if (effects.size > 0) {
          clientlog(`Bot đang có các hiệu ứng sau:`);
          effects.forEach((effect) => {
            const name = effect.name;
            const level = effect.amplifier + 1;
            const duration = effect.duration / 20;
            clientlog(`- ${name} cấp độ ${level}, thời lượng ${duration} giây`);
          });
        } else {
          clientlog('Bot không có bất kỳ hiệu ứng nào');
        }
        break;
    
      case '.clear':
        console.clear()
        clientlog(`\x1b[38;2;45;255;25mSuccessful clear\x1b[0m`)
        break;
    
      case '.inv':
      case '.inventory':
        const invitems = bot.inventory.items();
        clientlog(`                     BOT INVENTORY                             `);
        clientlog(`| Slot | Name                      | Count  | id_item                   |`);
        clientlog(`|=======================================================================|`)
        for (let i = 0; i < invitems.length; i++) {
          const item = invitems[i];
          clientlog(`| ${item.slot.toString().padEnd(4)} | ${item.displayName.padEnd(25)} | ${item.count.toString().padEnd(6)} | ${item.name.padEnd(25)} |`);
        }
        break;

      case '.item':
      case '.items':
        for (const item of bot.inventory.items()) {
          clientlog(`[Item] Slot ${item.slot.toString().padEnd(2)} : ${item.name} x ${item.count} ${JSON.stringify(item.enchants)}`);
        }
        break;

      case '.nbtslot':
        const nbtslot = arg[1];
          if (nbtslot >= 0 && nbtslot < 45) {
            if (bot.inventory.slots[nbtslot]) {
              console.log(bot.inventory.slots[nbtslot]);
            } else {
              console.log(`This slot is empty`);
            }
          } else {
            clientlog(`Invalid slot number. Use .nbtslot (0-44)`);
          }
        break;

      case '.nbtitems':
        for (let nbt = 0; nbt < bot.inventory.slots.length; nbt++) {
          if (bot.inventory.slots[nbt])
            console.log(bot.inventory.slots[nbt])
          }
        break;
      
      case '.hand':
      case '.hands':
      case '.handslot':
        if (!arg[1]) { clientlog('Change quickbar slot must be need a slot\nExample: .hand 3'); return }
        if (arg[1] < 1 || arg[1] > 9) { clientlog('Slot available (1-9)'); return }
          clientlog('Change hands to slot ' + arg[1])
          let bquickbarchange = (arg[1] - 1)
          bot.setQuickBarSlot(bquickbarchange)
        break;
      //equip need to fix
      case '.equip':
        if (arg.length < 3) {
          console.log('Vui lòng cung cấp tên món đồ và vị trí muốn equip');
          return;
        }
        const itemName = arg[1];
        const destination = arg[2];

        const item = bot.inventory.items().find(item => item.name === itemName);
        if (!item) {
          console.log(`Bot không có ${itemName} để equip`);
          return;
        }

        switch (destination) {
          case 'hand': {
            const heldItem = bot.heldItem;
            if (heldItem && heldItem.name === itemName) {
              console.log(`${itemName} đã được giữ trong tay.`);
              return;
            }
            bot.equip(item, 'hand', (err) => {
              if (err) {
                console.log(`Không thể equip ${itemName} vào tay: ${err.message}`);
              } else {
                console.log(`Đã equip ${itemName} vào tay.`);
              }
            });
            break;
          }
          case 'head':
          case 'torso':
          case 'legs':
          case 'feet': {
            const armorSlot = bot.inventory.slots[bot.armorSlots[destination]];
            if (armorSlot && armorSlot.name === itemName) {
              console.log(`${itemName} đã được mặc trên ${destination}.`);
              return;
            }
            bot.unequip(destination, (err) => {
              if (err) {
                console.log(`Không thể tháo ${destination} từ slot: ${err.message}`);
                return;
              }
              bot.equip(item, destination, (err) => {
                if (err) {
                  console.log(`Không thể equip ${itemName} vào ${destination}: ${err.message}`);
                } else {
                  console.log(`Đã equip ${itemName} vào ${destination}.`);
                }
              });
            });
            break;
          }
          default:
            console.log(`Vị trí muốn equip không hợp lệ.`);
        }
        break;


      case '.unequip':
        if (!(arg[1] == 'head' || arg[1] == 'torso' || arg[1] == 'legs' || arg[1] == 'feet' || arg[1] == 'off-hand')) {
          clientlog(`Unequip available ( head | torso | legs | feet | off-hand )`)
        } else {
          clientlog(`Unequip ${arg[1]}`)
          bot.unequip(arg[1])
        }
        break;

      case '.webinv':
      case '.showinv':
      case '.invsee':
        const invslot = path.join(__dirname, 'invslot.png');
        clientlog("Open web inventory in http://localhost:"+ invoptions.port)
        clientlog(`Open invslot`)
        opn("http://localhost:"+ invoptions.port)
        opn(invslot)
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
        const items = bot.inventory.items()
        bot.tossStack(items)
        break;

      case '.idslot':
        const idslot = path.join(__dirname, 'invslot.png');
        opn (idslot)
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
      
      case '.goto':
        goto();
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
      
      case ".eat":
        const eatitem = arg[0]
        if (!eatitem) {
          clientlog("Please specify an item to eat.");
          break;
        }
        const inventory = getInventory(arg[1].id);
        if (!inventory.includes(eatitem)) {
          clientlog(`You don't have ${eatitem} in your inventory.`);
          break;
        }
        removeeatitemFromInventory(arg[1].id, eatitem);
        increaseHealth(arg[1].id, 10);
        clientlog(`You ate ${eatitem} and gained 10 health.`);
        break;

      case '.guard':
        if (!arg[1]) return 
        const username = arg[1]
        if (!username) {
          clientlog(`I don't see a player`)
        }
        const position = bot.players[username].position
        guardArea(position)
        break;

      case '.stopguard':
        clientlog('Stop guarding...')
        stopGuarding
        break;
      
      case '.meslog':
        const logs = arg[1]
        if (logs === 'mes') {
          logmes('mes')
        } else if (logs === 'chat') {
          logmes('chat')
        } else if (logs === 'off') {
          logmes('off')
        } else {
          clientlog(`Unknown logs: ${logs}`)
        }
        break;

      case '.mine':
        mineblock()
        break;

      case '.disconnect':
        bot.quit()
        clientlog(`${options.username} left ${options.host}:${options.port}`)
        break;

      case '.reconnect':
        mineflayer.createBot(options)
        break;

      case '.exit':
      case '.leave':
      case '.quit':
        clientlog(`${options.username} left ${options.host}:${options.port}`);
        process.exit();
        break;

      default:
        clientlog(`Unknown command: "${cmd}". Type ".help" for a list of commands.`);
    }
  } else {
    bot.chat(command);
  }

  function mineblock() {
    clientlog('Chx xong')
  }

  function goto () {
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

  function logmes (mode) {
    const logmode = mode
    if (logmode === 'mes') {
      clientlog('Show message')
      bot.removeAllListeners('message')
      bot.removeAllListeners('chat')
      bot.on('message', (message) =>{
        console.log(message.toAnsi())
      })
    } else if (logmode === 'chat') {
      clientlog('Show chat')
      bot.removeAllListeners('message')
      bot.removeAllListeners('chat')
      bot.on('chat', (username, message) => {
        console.log(`<${username}> ${message}`)
      })
    } else if (logmode === 'off') {
      clientlog('Message logged off')
      bot.removeAllListeners('message')
      bot.removeAllListeners('chat')
    }
  }

  function guardArea (pos) {
    guardPos = pos
  
    // We we are not currently in combat, move to the guard pos
    if (!bot.pvp.target) {
      moveToGuardPos()
    }
  }
  
  // Cancel all pathfinder and combat
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

function clientlog(log) {
  console.log(`\x1b[38;2;72;250;235m[Q]\x1b[0m ${log}`)
}

bot.on('autoeat_started', (item, offhand) => {
  console.log(`Eating ${item.name} in ${offhand ? 'offhand' : 'hand'}`)
})

bot.on('autoeat_finished', (item, offhand) => {
  console.log(`Finished eating ${item.name} in ${offhand ? 'offhand' : 'hand'}`)
})

bot.on('autoeat_error', console.error)

bot.on('kicked', console.log)
bot.on('error', console.log)