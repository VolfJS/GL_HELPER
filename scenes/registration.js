const { Scenes } = require("telegraf")
const { Keyboard, Key } = require("telegram-keyboard")
const { HTML } = require("puregram")
const { db, Users } = require("../db/connect_db")
const config = require("../config")

const registration = new Scenes.WizardScene(
    'registration',
    async (ctx) => {
        let agree_keyb = Keyboard.make([
            Key.callback('☑️ Принимаю', 'accept'),
            Key.callback('❌ Не принимаю', 'no_accept')
          ]).inline()
      await ctx.replyWithHTML(`<b>🧾 В первую очередь попросим вас принять пользовательское соглашение:</b>\n1.1 Бла-бла`, agree_keyb);
      return ctx.wizard.next();
    },
    async (ctx) => {
        if (!ctx.callbackQuery) return ctx.wizard.back();
      ctx.callbackQuery.data == 'accept' 
      ? ctx.editMessageText(`<b>✔️ Вы приняли соглашение.</b>\n<i>📝 Просим в следующем сообщении ввести ваше реальное имя:</i>`, { parse_mode: "HTML" }) 
      : await ctx.editMessageText(`
      <b>😕 Вы отклонили соглашение. К сожалению, вы не можете продолжить пользоваться ботом.</b>
      <i>📌 Возвращайтесь к нам снова, когда будете готовы принять соглашение.</i>`, { 
          parse_mode: "HTML",
          reply_markup: {
              inline_keyboard: [
              [
                  {
                      text: '☑️ Принимаю',
                      callback_data: 'accept'
                  }
              ],
              [
                  {
                    text: '❌ Не принимаю',
                    callback_data: 'no_accept'
                  }
                ],
              ]
            }
      })
      return ctx.wizard.next();
    },
    async (ctx) => {
        ctx.scene.state.name = ctx.message.text
            await ctx.reply(`<u>👨‍🎓 Выберите теперь кем вы являетесь в колледже:</u>`, { 
                parse_mode: "HTML" ,
                reply_markup: {
                    inline_keyboard: [
                    [
                        {
                            text: '👨‍🎓 Студент',
                            callback_data: 'student'
                        },
                        {
                          text: '👩‍🔧 Староста группы',
                          callback_data: 'leader'
                        }
                      ],
                      [
                          {
                              text: "👩‍💼 Администрация колледжа",
                              callback_data: 'admin_college'
                          }
                      ]
                    ]
                  }
            })
            return ctx.wizard.next();
    },
    async (ctx) => {
        if (!ctx.callbackQuery) return ctx.wizard.back();
        switch (ctx.callbackQuery.data) {
            case "student":
                await ctx.editMessageText(`✅  Вы выбрали вашу роль: «👨‍🎓  Студент»
👥  Выберите теперь к какой группе и специальности вы принадлежите:`, {
    parse_mode: "HTML",
    reply_markup: {
        inline_keyboard: [
            [
                {
                    text: '2 ПИ',
                    callback_data: '2_pi'
                },
                {
                  text: '3 ПИ',
                  callback_data: '3_pi'
                },
                {
                    text: '4 ПИ',
                    callback_data: '4_pi'
                  }
              ],
              [
                  {
                      text: "1 ИСИП",
                      callback_data: '1_isip'
                  }
              ],
              [
                {
                    text: "1 ФК",
                    callback_data: '1_fk'
                },
                {
                    text: "2 ФК",
                    callback_data: '2_fk'
                },
                {
                    text: "3 ФК",
                    callback_data: '3_fk'
                },
                {
                    text: "4 ФК",
                    callback_data: '4_fk'
                }
            ]
            ]
    }
})
                ctx.scene.state.role = 1
            break;

            case "leader":
                await ctx.editMessageText(`✅  Вы выбрали вашу роль: «👩‍🔧 Староста группы»
👥  Выберите теперь к какой группе и специальности вы принадлежите:`, {
    parse_mode: "HTML",
    reply_markup: {
        inline_keyboard: [
            [
                {
                    text: '2 ПИ',
                    callback_data: '2_pi'
                },
                {
                  text: '3 ПИ',
                  callback_data: '3_pi'
                },
                {
                    text: '4 ПИ',
                    callback_data: '4_pi'
                  }
              ],
              [
                  {
                      text: "1 ИСИП",
                      callback_data: '1_isip'
                  }
              ],
              [
                {
                    text: "1 ФК",
                    callback_data: '1_fk'
                },
                {
                    text: "2 ФК",
                    callback_data: '2_fk'
                },
                {
                    text: "3 ФК",
                    callback_data: '3_fk'
                },
                {
                    text: "4 ФК",
                    callback_data: '4_fk'
                }
            ]
            ]
    }
})
                ctx.scene.state.role = 2
            break;

            case "admin_college":
                let keyb = Keyboard.make([
                    Key.callback('☑️ Да, все верно', 'req_admin'),
                    Key.callback('❌ Нет', 'no_req_admin')
                  ]).inline()
               await ctx.editMessageText(`❗️ Вы выбрали роль администрации.\n📛 Для того, чтобы получить эту роль, нужно будет пройти проверку разработчиком.\n❓ Вы действительно являетесь администрацией колледжа?`, keyb)
            break;
        }
      return ctx.wizard.next();
    },

    async (ctx) => {
        if (!ctx.callbackQuery) return ctx.wizard.back();
        if(ctx.callbackQuery.data = 'req_admin') {
            await ctx.telegram.sendMessage(config.admin_chat, `[ЗАЯВКА] Возможный администратор!
👤 Пользователь: ${HTML.url('ссылка', `tg://user?id=${ctx.from.id}`)}
ℹ️ Имя: ${ctx.scene.state.name}
            `, {
                parse_mode: "HTML",
                reply_markup: {
                    inline_keyboard: [
                        [
                            {
                                text: '☑️ Принять',
                                callback_data: 'accept_admin'
                            }
                          ],
                          [
                              {
                                  text: "❌ Отклонить",
                                  callback_data: 'not_accept_admin'
                              }
                          ],
                        ]
                }
            })
            await ctx.editMessageText(`<b>📩 Ваша заявка на регистрацию была отправлена в специальный чат.</b>\n<i>📢 Когда разработчик приймет решение мы вас уведомим.</i>`, { parse_mode: "HTML" })
            return ctx.scene.leave()
        } else if(ctx.callbackQuery.data = 'no_req_admin') {
            await ctx.editMessageText(`❗️ Теперь для того, чтобы завершить регистрацию, вы должны будете пройти её заново.\nКак будете готовы, просто напишите /start в данный чат.`)
            return ctx.scene.leave()
        }
        if(ctx.scene.state.role == 1) {
      await ctx.editMessageText(`<b>✨ Вы успешно прошли регистрацию</b>\n🗒 Главное меню:`, {
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
    await db.query(`UPDATE users SET group_name = ${ctx.callbackQuery.data}, name = ${ctx.scene.state.name} WHERE "tgId" = ${ctx.from.id}`)
} else if(ctx.scene.state.role == 2) {
    await ctx.editMessageText(`<b>✨ Вы успешно прошли регистрацию</b>\n🗒 Главное меню:`, {
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
    await db.query(`UPDATE users SET group_name = ${ctx.callbackQuery.data}, name = ${ctx.scene.state.name}, role = 2 WHERE "tgId" = ${ctx.from.id}`)
}
      return ctx.scene.leave();
    },
  );

  module.exports = registration