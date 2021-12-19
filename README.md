# GL_HELPER
Проект для It-Tech 2021
Разработчик - t.me/wolfjs

# Документация для запуска бота 
## OC - Linux (Ubuntu 18.04 например)
### Загрузка node.js и зависимостей
><code>sudo apt-get update</code>

><code>sudo apt-get install curl</code>

><code>curl -sL https://deb.nodesource.com/setup_15.x -o nodesource_setup.sh</code>

><code>sudo bash nodesource_setup.sh</code>

><code>sudo apt install nodejs</code>

><code>npm i pm2 -g</code>

### Загрузка Apache2 
><code>sudo apt install apache2</code>

><code>sudo ufw allow 'Apache'</code>

### Загрузка PostgreSQL
><code>sudo apt install postgresql postgresql-contrib</code>

### Загрузка phppgadmin для работы с БД и установка пароля
><code>sudo apt install phppgadmin</code>

><code>su - postgres</code>

><code>psql</code>

><code>\password postgres</code>

>>*пишем свой пароль*

><code>\q</code>

---

### На следующем этапе мы должны загрузить папку с ботом в директорию на сервере.
### После того, как загрузили, нужно установить все библиотеки:
><code>npm i</code>

### Запуск бота после настроек сервера
><code>cd *директория*</code>

><code>pm2 start index.js</code>

### Проверка логов и остановка бота
><code>pm2 log</code> - посмотреть логи бота

><code>pm2 status</code> - посмотреть запущенные процессы pm2
