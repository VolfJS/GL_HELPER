const { db, Users } = require("./db/connect_db")
const botinfo = require("./botinfo.json")

async function callback(ctx) {
    // команды
    switch (ctx.update.callback_query.data) {
      case "fundraising":
        await ctx.editMessageText(`У вас пока нет ни одного сбора средств.`, {
          parse_mode: "HTML",
          reply_markup: {
              inline_keyboard: [
                  [
                      {
                          text: '🔙 Назад',
                          callback_data: 'menu'
                      }
                    ]
                  ]
          }
      })
      break;

      case "menu":
         await ctx.editMessageText(`🗒 Главное меню:`, {
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
                        },
                        {
                          text: "➖ Вывод средств",
                          callback_data: 'withdraw_balance'
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
      break;

      case "profile":
        let user = await Users.get_sel_one(`where "tgId" = ${ctx.from.id}`)
        await ctx.editMessageText(`🆔 ID: <code>${user.id}</code>\n🏷 Имя: <i>${user.name}</i>\n👥 Группа: <b>${user.group_name == '2pi' ? `2 ПИ` : user.group_name == '3pi' ? `3 ПИ` : user.group_name == '4pi' ? `4 ПИ` : user.group_name == '1fk' ? `1 ФК` : user.group_name == '2fk' ? `2 ФК` : user.group_name == '3fk' ? `3 ФК` : user.group_name == '4fk' ? `4 ФК` : `1 ИсИП`}</b>\n🚹 Роль: ${user.role == 1 ? `студент` : user.role == 2 ? `староста группы` : `администрация`}\n💰 Баланс: ${user.balance} RUB\n\n📆 Дата регистрации: <code>${user.date}</code>`, {
          parse_mode: "HTML",
          reply_markup: {
              inline_keyboard: [
                  [
                      {
                          text: '🔙 Назад',
                          callback_data: 'menu'
                      }
                    ]
                  ]
          }
      })
      break;

      case "help":
        await ctx.editMessageText(`❗️ Все возможные вопросы временно можно задать разработчику - t.me/wolfjs`, {
          parse_mode: "HTML",
          reply_markup: {
              inline_keyboard: [
                  [
                      {
                          text: '🔙 Назад',
                          callback_data: 'menu'
                      }
                    ]
                  ]
          }
      })
      break;

      case "mailing":
         await ctx.scene.enter('mailing')
      break;

      case "withdraw_balance":
         await ctx.scene.enter("withdraw_balance")
      break;

      case "up_balance": 
        await ctx.scene.enter("up_balance")
      break;

      case "project_stats":
        await ctx.editMessageText(`Статистика проекта:\n\n👥 Зарегистрировано: ${await db.get_count(`users`)} пользователей\n💸 Сумма пополнений: ${botinfo.total_replenish} RUB\n⚒ Разработчик: ${botinfo.developer}\n\n📆 Старт проекта: 19.12.2021`)
      break;

      case "edit_api_key":
       await ctx.scene.enter("edit_api_key")
      break;

      case "edit_id_project":
      await ctx.scene.enter("edit_id_project")
      break;
    }
}

module.exports = callback;