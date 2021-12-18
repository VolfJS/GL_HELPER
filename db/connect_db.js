const { DB, table_db } = require("./module")
const config = require("../config")

const db = new DB({
    connect_string: `postgres://${config.login_db}:${config.password_db}@localhost:5432/bot`
})

const Users = new table_db({
    table_name: "users"
})

const Donates = new table_db({
    table_name: "donates"
})

module.exports = { 
    db,
    Users,
    Donates 
}