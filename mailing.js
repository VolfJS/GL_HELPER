const { Telegraf } = require('telegraf')
const { execSync } = require('child_process')
const { db } = require('./db/connect_db')
const config = require('./config')
const upload_mail = require('./scenes/admin/upload_mail.json')
const create_log = require('./logs')
const { format } = require('fecha')

const bot = new Telegraf(config.bot_token)

function msleep(n) { 

    Atomics.wait(new Int32Array(new SharedArrayBuffer(4)), 0, 0, n); 
    
    }

(async () => {
    let users = await db.sel_list(`"tgId" FROM users`)
    console.log(users)
    let now = () => format(new Date(), 'D.MM.YY H:mm:ss')
    create_log(`[${now()}] Начало рассылки`)

    await bot.telegram.sendMessage(config.admins[0], `Рассылка началась`)

    let start = Date.now()

    if(upload_mail.photo) {
let access = 0;
let error = 0;
        for(let i in users) {
            await bot.telegram.sendPhoto(users[i].tgId, upload_mail.photo, { caption: upload_mail.text }).then(x => {
            access += 1;
            console.log(`Сообщение ${users[i].tgId} было отправлено`)
    }).catch(err => {
                error += 1;
                return;
    })
                msleep(5)
    }
            let end = Date.now() - start;
await bot.telegram.sendMessage(config.admins[0], `Рассылка была завершена.\nУспешно отправлено: ${access} сообщений.\nНе отправлено: ${error}\nВремя на рассылку: ${end} мс`)
execSync('pm2 stop 3')
    } else {
        
let access = 0;
let error = 0;
        for(let i in users) {
    await bot.telegram.sendMessage(users[i].tgId, `${upload_mail.text}`, {
        parse_mode: "HTML"
    }).then(x => {
        access += 1;
        console.log(`Сообщение ${users[i].tgId} было отправлено`)
    }).catch(err => {
        error += 1;
        return;
    })
        msleep(5)
        }
            let end = Date.now() - start;
            create_log(`[${now()}] Конец рассылки`)
await bot.telegram.sendMessage(config.admins[0], `Рассылка была завершена.\nУспешно отправлено: ${access} сообщений.\nНе отправлено: ${error}\nВремя на рассылку: ${end} мс`)
execSync('pm2 stop 3')
    }
}) ()