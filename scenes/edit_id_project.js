const { Scenes } = require("telegraf")
const { Keyboard, Key } = require("telegram-keyboard")
const fs = require('fs')
const botinfo = require("../../GL_HELPER/botinfo.json")

const edit_id_project = new Scenes.WizardScene(
    'edit_id_project',
    async (ctx) => {
        let back_keyb = Keyboard.make([
            Key.callback('❌ Отмена', 'menu')
          ]).inline()
      await ctx.editMessageText(`🆔 Введите новый id проекта:`, back_keyb);
      return ctx.wizard.next();
    },
    async (ctx) => {
        if(!ctx.callbackQuery) {
            ctx.message.text = Number(ctx.message.text)
            if(!Number(ctx.message.text) || ctx.message.text < 30) return ctx.replyWithHTML(`<b>❌ ID не может быть меньше 1 и должен быть числом!</b>`) 
            botinfo.api_project_id = ctx.message.text
            fs.writeFileSync("./botinfo.json", JSON.stringify(botinfo, null, "\t")); // обновление JSON файлика
          await ctx.reply(`✅ ID проекта был успешно изменён`)
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

module.exports = edit_id_project