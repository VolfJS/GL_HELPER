/*
** // ------------------ DEVELOPER -> t.me/wolfjs X_x ------------------- \\
*/

const {
    Telegraf,
    session,
    Scenes,
    Context
} = require("telegraf")
const fs = require("fs")
const config = require("./config")
const { format } = require("fecha")
const express = require("express")

const generate_link = require('./pay_link')

// export all comands 
const help = require("./commands/help")
const admin = require("./commands/admin")
// const support = require("./commands/support")
// const start_menu = require("./commands/start_menu")
// ------------------------------------------------- \\

// scenes
const registration = require("./scenes/registration")
const up_balance = require("./scenes/up_balance")
// ----------------------------------------------- \\

const sender = require("telegraf-sender")
const { db, Users } = require("./db/connect_db")
const callback = require("./callback")
const { Keyboard } = require("telegram-keyboard")

const bot = new Telegraf(config.bot_token)

const stage = new Scenes.Stage([registration, up_balance]);

bot.use(session()); 
bot.use(stage.middleware());
bot.use(sender);

let now = () => format(new Date(), 'D.MM.YY H:mm:ss')

let reg = [];
setTimeout(() => {
    reg = [];
    console.log('clear success')
   }, 60000 * 2)

   // --------------- Обработка запросов на сервер ------------------ \\
   const app = express()
   app.use(bodyParser.urlencoded({ extended: false }));  

   app.post('/', async (req) => {
    try {
    console.log(req)
console.log(JSON.stringify(req.body))

let val = {
amount: Number(req.body.amount),
tgId: req.body.label
} 

if(val.amount > 1) {
    let user = await Users.get_sel_one(`where "tgId" = ${val.tgId}`)

    bot.telegram.sendMessage(val.tgId, `🎉 Произошла успешная оплата.\n💸 Ваш баланс был пополнен на ${val.amount} RUB.`)
    bot.telegram.sendMessage(config.admins[0], `📢 Поступил новый платеж от ${HTML.url('пользователя', `tg://user?id=${val.tgId}`)} на сумму ${val.amount} РУБ.`)

    await db.query(`UPDATE users SET balance = ${user.balance + Number(val.amount)} WHERE "tgId" = ${val.tgId}`)
}

console.log(val);
} catch (e) {
  console.error(e)
}
}) 

app.listen(9090);

   // ------------------------------------------------------------------- \\
   
   // ------------------- Обработка события клавиатуры ---------------- \\

bot.on('callback_query', callback);

// ========================================================================= \\

let spam_users = [];

bot.on('message', async (ctx, next) => {
    let user2 = await Users.get_sel_one(`where "tgId" = ${ctx.from.id}`)
    if(user2) {
    if(!spam_users.find(x => x.tgId == ctx.from.id)) {
        spam_users.push({
            tgId: ctx.from.id,
            spam_messages: 0
        })
        await db.query(`update users set spam_messages = ${spam_users.length - 1} where "tgId" = ${ctx.from.id}`)
    }

    let user = spam_users.find(x=> x.tgId == ctx.from.id)

    user.spam_messages += 1

    if(user.spam_messages == 1) {
        setTimeout(async () => {
         spam_users.splice(user2.spam_messages)
         console.log('antispam off')
        }, 45000)
        user.spam_messages += 1;
        return next()
    }

    if(user.spam_messages == 23) {
        console.log('antispam on')
         return ctx.replyWithHTML(`<i>❌ Включен режим антиспама.</i>\n<b>📌 Повторите попытку через <code>30</code> сек.</b>`);
    } else if(user.spam_messages > 23) {
        return;
    } else {
    await next()
    }
} else {
    await next()
}
})

// -------------------------- регистрация ------------------ \\
bot.command("start", async (ctx) => {
let user = await Users.get_sel_one(`where "tgId" = ${ctx.from.id}`)
    let find = reg.find(x=> x.id == ctx.from.id)
    if(!user && !find) { // делаем дополнительные проверки для того, чтобы не зарегистрировать пользователя 2+ раз после выключения бота
                reg.push({
                    id: ctx.from.id
                })
        Users.create_record({
              tgId: ctx.from.id,
              name: ctx.from.first_name,
              group_name: "not_found",
              spam_messages: 0,
              balance: 0,
              ban: false,
              admin: false,
              role: 1,
              req: false,
              date: now()
        })
        await ctx.replyWithHTML(`🧑‍🏫 Приветствую тебя, <code>${ctx.from.first_name}</code>!
<i>📢 Для начала вы должны отправить заявку на рассмотрение!</i>
➖➖➖➖➖➖➖➖➖➖➖➖
<b>❓ Приступим.</b>`)
        setTimeout(() => {
            return ctx.scene.enter('registration')
        }, 500)
    } else if(user) {
        if(user.group_name == 'not_found' && user.role == 1 && !user.req) return ctx.scene.enter('registration')
        await ctx.reply(`<b>📂 Главное меню:</b>`, {
            parse_mode: "HTML",
            reply_markup: {
                inline_keyboard: [
                    [
                        {
                            text: '💰 Сборы средств',
                            callback_data: 'fundraising'
                        },
                        {
                          text: '👤 Профиль',
                          callback_data: 'profile'
                        }
                      ],
                      [
                          {
                              text: "➕ Пополнить баланс",
                              callback_data: 'up_balance'
                          }
                      ],
                      [
                        {
                            text: "🆘 Помощь",
                            callback_data: 'help'
                        },
                    ]
                    ]
            }
        })
    }
})

// ================================================== \\

// ------------------- команды -------------------- \\

// Здесь будут обычные команды без слеша //

// ------------------------ команды через / --------------------- //
bot.hears(/\/help|start/, help);
bot.hears(/\/admin/, admin);
// bot.hears(/\/support/, support);

// ================================================= \\

bot.catch((err, ctx) => {
    console.log(`Error: ${ctx.updateType}`, err)
   })

   function startBot() {
     Promise.all([
    bot.launch().then(() => {
        console.log('bot_started!')
        // bot.telegram.sendMessage(config.admins[0], `bot_started in ${now()}`)
        })
    ])
   };

   module.exports = { startBot };

process.once('SIGINT', () => bot.stop('SIGINT'))
process.once('SIGTERM', () => bot.stop('SIGTERM'))