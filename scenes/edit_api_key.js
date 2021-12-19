const { Scenes } = require("telegraf")
const { Keyboard, Key } = require("telegram-keyboard")
const fs = require('fs')
const botinfo = require("../../GL_HELPER/botinfo.json")

const edit_api_key = new Scenes.WizardScene(
    'edit_api_key',
    async (ctx) => {
        let back_keyb = Keyboard.make([
            Key.callback('❌ Отмена', 'menu')
          ]).inline()
      await ctx.editMessageText(`🔧 Введите новый API ключ проекта:`, back_keyb);
      return ctx.wizard.next();
    },
    async (ctx) => {
        if(!ctx.callbackQuery) {
            if(ctx.message.text.length < 5) return ctx.replyWithHTML(`<b>❌ Токен не может быть меньше 5 символов.</b>`) 
            botinfo.api_key = ctx.message.text
            fs.writeFileSync("./botinfo.json", JSON.stringify(botinfo, null, "\t")); // обновление JSON файлика
          await ctx.reply(`✅ API KEY проекта для оплаты был успешно изменён`)
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

module.exports = edit_api_key