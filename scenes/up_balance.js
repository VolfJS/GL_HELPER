const { Scenes } = require("telegraf")
const { Keyboard, Key } = require("telegram-keyboard")
const generate_link = require('../pay_link')

const up_balance = new Scenes.WizardScene(
    'up_balance',
    async (ctx) => {
        let back_keyb = Keyboard.make([
            Key.callback('❌ Отмена', 'menu')
          ]).inline()
      await ctx.editMessageText(`💸 Введите сумму пополнения (RUB):`, back_keyb);
      return ctx.wizard.next();
    },
    async (ctx) => {
        if(!ctx.callbackQuery) {
            ctx.message.text = Number(ctx.message.text)
            if(!Number(ctx.message.text) || ctx.message.text < 1) return ctx.replyWithHTML(`<b>❌ Сумма не может быть меньше 30 рублей и должна быть числом!</b>`) 
            let link = generate_link({
                amount: Number(ctx.message.text),
                desc: ctx.from.id,
                method: "none"
            })
            await ctx.reply(`<i>💳 Вы можете пополнить ваш баланс по ссылке ниже или кнопке.</i>\n🔗 Ссылка: ${link}`, {
              parse_mode: "HTML",
              reply_markup: {
                  inline_keyboard: [
                      [
                          {
                              text: '📲 Оплатить',
                              url: link
                          },
                      ]
                      ]
              }
          })
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
)

module.exports = up_balance