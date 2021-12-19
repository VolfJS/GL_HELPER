const config = require('../config')
const { Keyboard, Key } = require("telegram-keyboard")

async function admin(ctx) {
    if(config.admins.find(x=> x == ctx.from.id)) {
        let admin_keyb = Keyboard.make([
        [
            Key.callback('📢 Рассылка', 'mailing')
        ],
        [
            Key.callback('👥 Статистика проекта', 'project_stats'),
        ],
        [
            Key.callback('🔗 Изменить ключ для оплаты', 'edit_api_key'),
        ],
        [
            Key.callback('🆔 Изменить ID проекта для оплаты', 'edit_id_project'),
        ]
          ]).inline()
        return ctx.reply(`🔧 Меню админки:`, admin_keyb)
    }
}

module.exports = admin;