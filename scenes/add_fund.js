const { Scenes } = require("telegraf")
const { Users, Donates } = require("../db/connect_db")
const { format } = require("fecha")

let now = () => format(new Date(), 'D.MM.YY H:mm:ss')

const add_fund = new Scenes.WizardScene(
    'add_fund',
    async (ctx) => {
        await ctx.reply(`Введите сумму сбора:`)
        return ctx.wizard.next()
    },
    async (ctx) => {
        ctx.message.text = Number(ctx.message.text)
        if(ctx.message.text < 0 || ctx.message.text > 50000) return ctx.reply(`Сумма сбора слишком большая или вы допустили ошибку.`)
        ctx.scene.state.sum = ctx.message.text
        await ctx.reply(`Введите название сбора:`)
        return ctx.wizard.next()
    },
    async (ctx) => {
        ctx.scene.state.name = ctx.message.text
        await ctx.reply(`Введите описание сбора:`)
        return ctx.wizard.next()
    },
    async (ctx) => {
        ctx.scene.state.desc = ctx.message.text
        await ctx.reply(`Введите сумму, которую должен скинуть один человек:`)
        return ctx.wizard.next()
    },
    async (ctx) => {
        ctx.scene.state.one_user = ctx.message.text
        await ctx.reply(`Введите количество дней через которое закончится сбор:`)
        return ctx.wizard.next()
    },
    async (ctx) => {
        let user = await Users.get_sel_one(`where "tgId" = ${ctx.from.id}`)
        Donates.create_record({
            name_donates: ctx.scene.state.name,
            all_sum: Number(ctx.scene.state.sum),
            sum_one_user: Number(ctx.scene.state.one_user), 
            sum_collected: 0,
            date_start: 0,
            date_end: 0,
            users: {},
            group: user.group_name,
            date_created: now()
      })
        await ctx.reply(`✅ Сбор средств был успешно создан.`)
        return ctx.scene.leave()
    },
)

module.exports = add_fund