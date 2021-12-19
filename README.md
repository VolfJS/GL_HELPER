# GL_HELPER
Проект для It-Tech 2021
Разработчик - t.me/wolfjs

# Документация для запуска бота 
## OC - Linux (Ubuntu 18.04 например)
### Загрузка node.js и зависимостей
>sudo apt-get update

>sudo apt-get install curl

>curl -sL https://deb.nodesource.com/setup_15.x -o nodesource_setup.sh

>sudo bash nodesource_setup.sh

>sudo apt install nodejs

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

### Загрузка PostgreSQL
