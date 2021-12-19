const { Scenes } = require("telegraf")
const fs = require('fs')
const { Keyboard, Key } = require("telegram-keyboard")
const { execSync } = require('child_process')

const upload_mail = require('./upload_mail.json')

const mailing = new Scenes.WizardScene(
    'mailing',
    async (ctx) => {
        let keyb = Keyboard.make([
            [Key.callback('📄 Только текст', 'text')],
            [Key.callback('📄 Текст + 📷 Фото', 'text_and_photo')],
            [Key.callback('❌ Отмена', 'back')]
          ]).inline()
      await ctx.editMessageText(`📌 Для начала выберите тип рассылки:`, keyb);
      return ctx.wizard.next();
    },
    async (ctx) => {
        let back_keyb = Keyboard.make([
            [Key.callback('❌ Отмена', 'text')]
          ]).inline()

          if(!ctx.callbackQuery) {
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
            return ctx.scene.leave()
          }

          if(ctx.callbackQuery.data == 'back') {
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
            return ctx.scene.leave()
          }
        
          ctx.callbackQuery.data == 'text' ? ctx.scene.state.type = 'text' : ctx.scene.state.type = 'text_and_photo'

        await ctx.editMessageText(`📄 Введите текст рассылки:`, back_keyb)
        return ctx.wizard.next();
    },
    async (ctx) => {
        let back_keyb = Keyboard.make([
            [Key.callback('❌ Отмена', 'back')]
          ]).inline()

        if(!ctx.callbackQuery) {
            if(ctx.scene.state.type == 'text_and_photo') {
                upload_mail.text = ctx.message.text
                fs.writeFileSync("./scenes/admin/upload_mail.json", JSON.stringify(upload_mail, null, "\t"));
                await ctx.replyWithHTML(`<b>📷 Пришлите фото для рассылки:</b>`, back_keyb)
        }
           if(ctx.scene.state.type == 'text') {

            let start_mail = Keyboard.make([
                [Key.callback('☑️ Запустить', 'start_mail')],
                [Key.callback('❌ Отмена', 'back')]
              ]).inline()

               await ctx.reply(`👁‍🗨 Предпросмотр:`)
               await ctx.replyWithHTML(ctx.message.text)
               upload_mail.text = ctx.message.text
               upload_mail.photo = ''
               fs.writeFileSync("./scenes/admin/upload_mail.json", JSON.stringify(upload_mail, null, "\t")); // обновление JSON файлика
               await ctx.replyWithHTML(`❓ Запустить рассылку?`, start_mail)
           }
        } else if(ctx.callbackQuery) {
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
            return ctx.scene.leave()
        
        }
        return ctx.wizard.next();
    },
    async (ctx) => {
        if(!ctx.callbackQuery) {
            if(ctx.message.photo) {
                let start_mail = Keyboard.make([
                    [Key.callback('☑️ Запустить', 'start_mail')],
                    [Key.callback('❌ Отмена', 'back')]
                  ]).inline()
                upload_mail.photo = ctx.message.photo[0].file_id
                fs.writeFileSync("./scenes/admin/upload_mail.json", JSON.stringify(upload_mail, null, "\t")); // обновление JSON файлика
                await ctx.reply(`👁‍🗨 Предпросмотр:`)
               await ctx.telegram.sendPhoto(ctx.from.id, upload_mail.photo, { caption: upload_mail.text })
               await ctx.replyWithHTML(`❓ Запустить рассылку?`, start_mail)
            } else {
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
                return ctx.scene.leave()
            }
        } else {
            if(ctx.callbackQuery.data == 'start_mail') {
                try {
                await ctx.reply(`Рассылка была запущена!`)
                execSync('cd /home/GL_HELPER && pm2 start mailing.js')
                } catch (e) {
                    await ctx.reply(`Прозиошла ошибка во время рассылки.\n🗒 Главное меню:`, {
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
                    return ctx.scene.leave()
                }
            }
        }
      return ctx.wizard.next();
    },

    async (ctx) => {
        if(!ctx.callbackQuery) {
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
            return ctx.scene.leave()
        }
        if(ctx.callbackQuery.data == 'back') {
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
            return ctx.scene.leave()
        }
        if(ctx.callbackQuery.data == 'start_mail') {
            try {
            await ctx.reply(`Рассылка была запущена!`)
            execSync('cd /home/GL_HELPER && pm2 start mailing.js')
            } catch (e) {
                await ctx.reply(`Прозиошла ошибка во время рассылки.\n🗒 Главное меню:`, {
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
                return ctx.scene.leave()
            }
        }
    }
)

module.exports = mailing