const config = {
    bot_name: "Group Leader Helper", // название бота
    bot_token: "", // токен бота телеграм
    admins: [ 1173871498 ], // id админов бота
    spam_number: 40, // количество сообщений для включения антиспама
    login_db: 'postgres', // логин от базы данных postgres
    password_db: '', // пароль от базы данных postgres
    admin_chat: 123, // id чата администрации бота
    dir_log: './logs' // директория для логов
}

module.exports = config;