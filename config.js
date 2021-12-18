const config = {
    bot_name: "Group Leader Helper", // название бота
    bot_token: "5057447957:AAGVwwZzfzyyaNH9Cxoew6GBriwi8Q4oL28", // токен бота телеграм
    admins: [ 1173871498 ], // id админов бота
    spam_number: 40, // количество сообщений для включения антиспама
    login_db: 'postgres', // логин от базы данных postgres
    password_db: 'Sergeydev2019', // пароль от базы данных postgres
    dir_log: './logs' // директория для логов
}

module.exports = config;