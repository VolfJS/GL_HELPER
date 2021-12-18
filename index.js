const { Telegraf } = require("telegraf")
const config = require("./config")
const { startBot } = require("./bot")

const bot = new Telegraf(config.bot_token)

startBot().
then(console.log("BOT_START")).
catch(err => { console.log(`ERR STARTED:\n${err}`) })

process.once('SIGINT', () => bot.stop('SIGINT'))
process.once('SIGTERM', () => bot.stop('SIGTERM'))