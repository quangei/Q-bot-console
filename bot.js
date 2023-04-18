const mineflayer = require('mineflayer')
const inventoryViewer = require('mineflayer-web-inventory')
const { pathfinder, Movements, goals: { GoalNear, GoalFollow, GoalBlock } } = require('mineflayer-pathfinder')
const pvp = require('mineflayer-pvp').plugin
const tpsPlugin = require('mineflayer-tps')(mineflayer)
const armorManager = require('mineflayer-armor-manager')
const collectBlock = require('mineflayer-collectblock').plugin

const rlsync = require('readline-sync')
let bname = 'Bot'
let bip = 'bottestdb.aternos.me:55571'
let bver = '1.18.2'
let ip = bip.split(':');

const opn = require('opn');
const path = require('path');

const readline = require('readline')
const { once } = require('events')
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
  console.log(`\x1b[38;2;252;246;50m${options.username} have joined ${options.host}:${options.port}\x1b[0m`)
  console.log(`Use \x1b[38;2;71;242;48m.help\x1b[0m to see all command`)
  console.log(`Use \x1b[38;2;71;242;48m.meslog\x1b[0m \x1b[38;2;122;135;120mmes /chat / off\x1b[0m to change message log`)
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
        clientlog('\x1b[33mDanh sách lệnh của bot:\x1b[0m')
        clientlog('\x1b[36m.chat | .send | .say\x1b[0m <message> - Gửi tin nhắn đến máy chủ.')
        clientlog('\x1b[36m.cmd | .command\x1b[0m <command> - Gửi lệnh đến máy chủ mà không cần /.')
        clientlog('\x1b[36m.coord | .coordinates\x1b[0m - Hiển thị tọa độ hiện tại của bot.')
        clientlog('\x1b[36m.clear\x1b[0m - Xóa màn hình console.')
        clientlog('\x1b[36m.inv | .inventory | .item | .items\x1b[0m - Hiển thị danh sách đồ trong túi đồ của bot.')
        clientlog('\x1b[36m.webinv | .showinv\x1b[0m - Hiển thị kho đồ trong túi đồ của bot trên web.')
        clientlog('\x1b[36m.server\x1b[0m - Hiển thị thông tin về máy chủ.')
        clientlog('\x1b[36m.player | .players\x1b[0m - Liệt kê tất cả người chơi đang online.')
        clientlog('\x1b[36m.playerinfo\x1b[0m <player> - Hiển thị thông tin chi tiết về một người chơi cụ thể.')
        clientlog('\x1b[36m.goto\x1b[0m <x> <y> <z> or <player> - Di chuyển đến vị trí hoặc người chơi được chỉ định.')
        clientlog('\x1b[36m.follow\x1b[0m <player> - Đi theo một người chơi khác trên máy chủ.')
        clientlog('\x1b[36m.unfollow\x1b[0m - Thoát khỏi chế độ đi theo người chơi.')
        clientlog('\x1b[36m.fight\x1b[0m <player> - PVP với một người chơi khác trên máy chủ.')
        clientlog('\x1b[36m.sneak\x1b[0m - Bật chế độ lén bước.')
        clientlog('\x1b[36m.unsneak\x1b[0m - Tắt chế độ lén bước.')
        clientlog('\x1b[36m.jump\x1b[0m - Nhảy lên.')
        clientlog('\x1b[36m.hand | .hands | .handslot\x1b[0m - Chuyển tay sử dụng.')
        clientlog('\x1b[36m.equip\x1b[0m - Equip item trong túi đồ vào các vị trí như tay, đầu, thân thể,...')
        clientlog('\x1b[36m.unequip\x1b[0m - Tháo item khỏi các vị trí: đầu, thân thể,...')
        clientlog('\x1b[36m.afk\x1b[0m - Tự động di chuyển để tránh bị kick ra khi không hoạt động.') 
        clientlog('\x1b[36m.stopafk\x1b[0m - Dừng chế độ tự động đi lại.')
        clientlog('\x1b[36m.eat\x1b[0m - Ăn thức ăn.')
        clientlog('\x1b[36m.guard\x1b[0m - Bảo vệ một khu vực (di chuyển và tấn công).')
        clientlog('\x1b[36m.stopguard\x1b[0m - Dừng chế độ bảo vệ khu vực.')
        clientlog('\x1b[36m.mine\x1b[0m - Đào block.') 
        clientlog('\x1b[36m.meslog\x1b[0m - Lọc tin nhắn và chat.')
        clientlog('\x1b[36m.dropslot\x1b[0m - Vứt toàn bộ đồ của 1 ô nào đó.')
        clientlog('\x1b[36m.idslot\x1b[0m - Hiển thị slot id.')
        clientlog('\x1b[36m.exit | .quit | .stop | .leave\x1b[0m - Dừng bot và thoát khỏi chương trình.')
        break;
      
      case '.chat':
      case '.send':
      case '.say':
        if (!arg[1]) {
          clientlog('[CHAT] Chat must be need arguments')
        }
        bot.chat(message.substring(5))
        break;
      
      case '.cmd':
      case '.command':
        if (!arg[1]) {
          clientlog('[CMD] Chat must be need arguments')
        }
        bot.chat('/'+message.substring(5))
        break;
    
      case '.coord':
      case '.coordinates':
        clientlog(`[Coordinates] ${bot.entity.position}`);
        clientlog(`[World] ${bot.game.dimension}`);
        break;

      case '.info':
        clientlog(`Health: ${bot.health} / Food: ${bot.food}`)
        clientlog(`Oxygen: ${bot.oxygenLevel}`)
        clientlog(`Coordinates: ${bot.entity.position} at world ${bot.game.dimension}`)
        clientlog(``)
        break;
    
      case '.clear':
        console.clear()
        clientlog(`\x1b[38;2;45;255;25mSuccessful clear\x1b[0m`)
        break;
    
      case '.inv':
      case '.inventory':
      case '.item':
      case '.items':
        for (const item of bot.inventory.items()) {
          clientlog( `[Inventory] Slot ${item.slot} : ${item.name} x ${item.count}`)
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
          console.log('Vui lòng cho biết tên món đồ cần equip và vị trí muốn đi vào');
          return;
       }
       const itemName = arg[1];
       const destination = arg[2];
      
       const item = bot.inventory.findItemRange(item => item.id === itemName);
       if (!item) {
          console.log(`Bot không có ${itemName} để equip`);
          return;
       }
      
       switch (destination) {
          case 'hand':
             bot.equip(item, destination, (err) => {
                if (err) {
                   console.log(`Không thể equip ${itemName} vào tay: ${err.message}`);
                } else {
                   console.log(`Đã equip ${itemName} vào tay`);
                }
             });
             break;
          case 'head':
          case 'torso':
          case 'legs':
          case 'feet':
             bot.unequip(destination, (err) => {
                if (err) {
                   console.log(`Không thể tháo ${destination} ra khỏi slot: ${err.message}`)
                } else {
                   bot.equip(item, destination, (err) => {
                      if (err) {
                         console.log(`Không thể equip ${itemName} vào ${destination}: ${err.message}`);
                      } else {
                         console.log(`Đã equip ${itemName} vào ${destination}`);
                      }
                   });
                }
             });
             break;
          default:
             console.log(`Vị trí muốn đi vào không hợp lệ`);
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
      case 'invsee':
        const invslot = path.join(__dirname, 'invslot.png');
        clientlog("Open web inventory in http://localhost:"+ invoptions.port)
        clientlog(`Open invslot`)
        opn("http://localhost:"+ invoptions.port)
        opn(invslot)
        break;

      case '.dropslot':
        let slot = arg[1]
        if (slot < 1 || slot > 44) { clientlog('Slot available (1-44)\n Use ".idslot" to see slot id'); return } 
        bot.tossStack(bot.inventory.slots[slot])
        clientlog(`Drop slot ${slot}`)
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
        clientlog(`[IP] ${options.host}:${options.port}`)
        clientlog(`[Ver] ${options.version}`)
        clientlog(`[TPS] ${bot.getTps()}`)
        clientlog(`[Difficulty] ${bot.game.difficulty}`)
        break;

      case '.tps':
        clientlog('Server tps: ' + bot.getTps())
        break;

      case '.test':
        clientlog('/' + bot.game.maxPlayers)
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
      
      case '.exit':
      case '.leave':
      case '.stop':
      case '.quit':
        clientlog(`${options.username} left ${options.host}:${options.port}`);
        process.exit();
        break;
      
      case '.sneak':
        bot.setControlState('sneak', true);
        clientlog(`[Bot] ${bot.username} start sneak`);
        break;
      
      case '.unsneak':
        bot.setControlState('sneak', false);
        clientlog(`[Bot] ${bot.username} stop sneak`);
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
      
      case '.eat':
        eatfood()
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

  function eatfood() {  
    const mcData = require('minecraft-data')(bot.version);
    const food = mcData.itemsByName['cooked_beef'];
    if (food) {
      const items = bot.inventory.items().filter(item => item.type === food.id);
      if (items.length > 0) {
        bot.equip(food, 'hand', (err) => {
          if (err) {
            clientlog(err);
          }
          bot.activateItem((err) => {
            if (err) {
              clientlog(err);
            }
          });
        });
      } else {
        clientlog("No food in inventory.");
      }
    } else {
      clientlog("This version of Minecraft doesn't have cooked beef.");
    }
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

bot.on('kicked', console.log)
bot.on('error', console.log)
