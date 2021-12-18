async function admin(ctx) {
    if(config.admins.find(x=> x == ctx.from.id)) {
        return ctx.reply(`Админка в разработке`)
    }
}

module.exports = admin;