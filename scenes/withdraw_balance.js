const { Scenes } = require("telegraf")
const { Keyboard, Key } = require("telegram-keyboard")
const { HTML } = require("puregram")
const { Users } = require("../db/connect_db")
const config = require("../config")

const withdraw_balance = new Scenes.WizardScene(
    'withdraw_balance',
    async (ctx) => {
        let back_keyb = Keyboard.make([
            Key.callback('❌ Отмена', 'menu')
          ]).inline()
      await ctx.editMessageText(`💸 Введите сумму вывода (RUB):`, back_keyb);
      return ctx.wizard.next();
    },
    async (ctx) => {
        if(!ctx.callbackQuery) {
            let user = await Users.get_sel_one(`where "tgId" = ${ctx.from.id}`)
            ctx.message.text = Number(ctx.message.text)
            if(!Number(ctx.message.text) || ctx.message.text < 1) return ctx.replyWithHTML(`<b>❌ Сумма не может быть меньше <code>500</code> рублей и должна быть числом!</b>`) 
            if(user.balance < ctx.message.text) return ctx.replyWithHTML(`<b>❌ На вашем балансе недостаточно средств!</b>`)
            ctx.scene.state.num = ctx.message.text
            await ctx.replyWithHTML(`<i>💳 Введите номер вашей карты для вывода средств:</i>`)
            return ctx.wizard.next();
        }
        if(ctx.callbackQuery.data == 'menu') {
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
        }
            return ctx.scene.leave()
    },
    async (ctx) => {
        let back_keyb = Keyboard.make([
            Key.callback('❌ Отмена', 'menu')
          ]).inline()
          ctx.message.text = Number(ctx.message.text)
          if(!Number(ctx.message.text)) return ctx.replyWithHTML(`<b>❌ Номер карты должен быть указан числом!</b>`) 
      await ctx.replyWithHTML(`<b>✔️ Вы успешно оставили заявку на вывод средств.</b>\n<i>⏰ Ожидайте поступления средств на вашу карту.</i>`, back_keyb);
      await ctx.telegram.sendMessage(config.admin_chat, `[Заявка на вывод]\n👤 Пользователь - ${HTML.url('ссылка', `tg://user?id=${ctx.from.id}`)}\n💵 Сумма: ${ctx.scene.state.num}\n💳 Номер карты: ${ctx.message.text}`, { parse_mode: "HTML" })
      await ctx.reply(`🗒 Главное меню:`, {
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
      return ctx.scene.leave();
    },
)

module.exports = withdraw_balance