const mineflayer = require('mineflayer')
const inventoryViewer = require('mineflayer-web-inventory')
const { pathfinder, Movements, goals: { GoalNear, GoalFollow, GoalBlock } } = require('mineflayer-pathfinder')
const pvp = require('mineflayer-pvp').plugin
var tpsPlugin = require('mineflayer-tps')(mineflayer)
const armorManager = require('mineflayer-armor-manager')

const rlsync = require('readline-sync')
let bname = 'Bot'
let bip = 'bottestdb.aternos.me:55571'
let bver = '1.18.2'
let ip = bip.split(':');

const opn = require('opn');

const readline = require('readline')
const { win32 } = require('path')
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

bot.on('login', () => {
  console.log(`\x1b[38;2;252;246;50m${options.username} have joined ${options.host}:${options.port}\x1b[0m`)
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

bot.armorManager.equipAll()

let invoptions = {
  port: 4000,
}
inventoryViewer(bot, invoptions)

console.log(options)

function bcmd(username, message) {  
  if (!(username == 'console')) return
  if (username === bot.username) return
  
  let arg = message.split(' ')
  let cmd = arg[0]

  if (cmd.startsWith('.')) {
    switch(cmd) {
      case '.help':
        console.log('\x1b[93mDanh sách các lệnh của Bot:\x1b[0m');
        console.log('\x1b[36m.chat | .send | .say <message>\x1b[0m: Gửi tin nhắn đến máy chủ.');
        console.log('\x1b[36m.cmd | .command <command>\x1b[0m: Gửi lệnh đến máy chủ mà không cần /.');
        console.log('\x1b[36m.coord | .coordinates\x1b[0m: Hiển thị tọa độ hiện tại của bot.');
        console.log('\x1b[36m.clear\x1b[0m: Xóa màn hình console.');
        console.log('\x1b[36m.inv | .inventory | .item | .items\x1b[0m: Hiển thị danh sách đồ trong túi đồ của bot.');
        console.log('\x1b[36m.webinv | .showinv\x1b[0m: Hiển thị kho đồ trong túi đồ của bot trên web.')
        console.log('\x1b[36m.server\x1b[0m: Hiển thị thông tin về máy chủ.');
        console.log('\x1b[36m.player | .players\x1b[0m: Liệt kê tất cả người chơi đang online.');
        console.log('\x1b[36m.playerinfo <player>\x1b[0m: Hiển thị thông tin chi tiết về một người chơi cụ thể.');
        console.log('\x1b[36m.exit\x1b[0m: Dừng bot và thoát khỏi chương trình.');
        console.log('\x1b[36m.goto <x> <y> <z> or <player>\x1b[0m: Di chuyển đến vị trí hoặc người chơi được chỉ định.');
        console.log('\x1b[36m.follow <player>\x1b[0m: Theo dõi một người chơi khác trên máy chủ.');
        console.log('\x1b[36m.unfollow\x1b[0m: Thoát khỏi chế độ theo dõi người chơi.');
        console.log('\x1b[36m.sneak\x1b[0m: Bật chế độ lén bước.');
        console.log('\x1b[36m.unsneak\x1b[0m: Tắt chế độ lén bước.');
        console.log('\x1b[36m.jump\x1b[0m: Nhảy lên.');
        break;
      
      case '.chat':
      case '.send':
      case '.say':
        if (!arg[1]) {
          console.log('[CHAT] Chat must be need arguments')
        }
        bot.chat(message.substring(5))
        break;
      
      case '.cmd':
      case '.command':
        if (!arg[1]) {
          console.log('[CMD] Chat must be need arguments')
        }
        bot.chat('/'+message.substring(5))
        break;
    
      case '.coord':
      case '.coordinates':
        console.log(`[Coordinates] ${bot.entity.position}`);
        break;
    
      case '.clear':
        console.clear()
        console.log(`\x1b[38;2;45;255;25mSuccessful clear\x1b[0m`)
        break;
    
      case '.inv':
      case '.inventory':
      case '.item':
      case '.items':
        for (const item of bot.inventory.items()) {
          console.log( `[Inventory] Slot ${item.slot} : ${item.name} x ${item.count}`)
        }
        break;
    
      case '.server':
        console.log(`[IP] ${options.host}:${options.port}`)
        console.log(`[Ver] ${options.version}`)
        console.log(`[TPS] ${bot.getTps()}`)
        break;

      case '.tps':
        console.log('Server tps: ' + bot.getTps())
        break;
    
      case '.player':
      case '.players':
        const players = Object.keys(bot.players).map((name) => `\x1b[32m${name}(${bot.players[name].ping}ms)\x1b[0m`).join(' | ');
        console.log(`[Player List] ${players}`);
        break;
      case '.playerinfo':
        if (arg.length < 2) {
          console.log('[Player Info] .playerinfo <player>\n[Player Info] Example: .playerinfo bot');
        } else {
          const target = arg[1];
          if (!bot.players[target]) {
            console.log(`[Player Info] ${target} is not on the server`);
          } else {
            const playerinfo = `\x1b[32m${target}(${bot.players[target]?.ping}ms)\x1b[0m UUID: ${bot.players[target]?.uuid}`;
            console.log(`[Player Info] ${playerinfo}`);
          }
        }
        break;
      
      case '.exit':
      case '.stop':
      case '.quit':
        console.log(`${options.username} left ${options.host}:${options.port}`);
        process.exit();
        break;
      
      case '.sneak':
        bot.setControlState('sneak', true);
        console.log(`[Bot] ${bot.username} start sneak`);
        break;
      
      case '.unsneak':
        bot.setControlState('sneak', false);
        console.log(`[Bot] ${bot.username} stop sneak`);
        break;
      
      case '.jump':
        bot.setControlState('jump', true);
        setTimeout(() => {bot.setControlState('jump', false)}, 500);
        console.log(`[Bot] ${bot.username} jump`);
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
        console.log('[AFK] Starting anti-afk');
        isAFK = true;
        startAFK();
        break;
      
      case '.stopafk':
        console.log('[AFK] Stop anti-afk');
        isAFK = false;
        clearTimeout(afkTimer);
        break;
      
      case '.webinv':
      case '.showinv':
        console.log("Open web inventory in http://localhost:"+ invoptions.port)
        opn("http://localhost:"+ invoptions.port)
        break;

      case '.guard':
        if (arg.length === 4) {
          const x = parseFloat(arg[1])
          const y = parseFloat(arg[2])
          const z = parseFloat(arg[3])
      
          console.log(`Guarding (${x}, ${y}, ${z})...`)
          guardArea(x, y, z)
        } else {
          console.log('Usage: .guard <x> <y> <z>')
          }
        break;
      case '.stopguard':
        console.log('Stop guarding...')
        stopGuarding

      default:
        console.log(`Unknown command: "${cmd}". Type ".help" for a list of commands.`);
    }
  } else {
    bot.chat(cmd);
  }

  function goto () {
    if (arg.length < 2 ) {
      console.log(`Usage: ${cmd} <x> <y> <z> or <player>`);
      return;
    }
    const args = message.split(' ');
    const x = parseFloat(args[1]);
    const y = parseFloat(args[2]);
    const z = parseFloat(args[3]);
    movements.scafoldingBlocks = ['stone', 'cobblestone', 'dirt']
    if (isNaN(x) || isNaN(y) || isNaN(z)) {
      const targetPlayer = bot.players[args[1]];
  
      if (targetPlayer) {
        const position = targetPlayer.entity.position;
  
        console.log(`Going to ${args[1]}'s position: ${position.x.toFixed(2)}, ${position.y.toFixed(2)}, ${position.z.toFixed(2)}`);
        bot.pathfinder.setGoal(new GoalNear(position.x, position.y, position.z, 0));
      } else {
        console.log(`Can't find player: ${args[1]}`);
      }
    } else {
      console.log(`Going to coordinates: ${x.toFixed(2)}, ${y.toFixed(2)}, ${z.toFixed(2)}`);
      bot.pathfinder.setGoal(new GoalNear(x, y, z, 0));
    }
  }

  function followplayer() {
    if (!arg[1]) {
      console.log('Usage: .follow <player>');
      return;
    }
    const targetPlayer = bot.players[arg[1]];
  
    if (!targetPlayer) {
      console.log(`Can't find player: ${arg[1]}`);
      return;
    }
  
    bot.pathfinder.setMovements(movements);
  
    const goal = new GoalFollow(targetPlayer.entity, 1);
  
    bot.pathfinder.setGoal(goal, true);
    console.log(`Following ${arg[1]}`);
  }
  
  function unfollowPlayer() {
    bot.pathfinder.setGoal(null);
    console.log(`Stopped following player`);
  }

  function startAFK() {
    if (!isAFK) return;
  
    const mcData = require('minecraft-data')(bot.version);
    let state = true;
    
    afkTimer = setTimeout(() => {
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
}

bot.on('message', (message) =>{
  console.log(message.toAnsi())
})

bot.on('kicked', console.log)
bot.on('error', console.log)

rl.on('line', (command) => {
  bcmd('console', command)
  rl.prompt()
})