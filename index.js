const { Telegraf } = require("telegraf")
const config = require("./config")
const { startBot } = require("./bot")

const bot = new Telegraf(config.bot_token)

startBot()

process.once('SIGINT', () => bot.stop('SIGINT'))
process.once('SIGTERM', () => bot.stop('SIGTERM'))