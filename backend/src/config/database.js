const { Sequelize } = require('sequelize');
require('dotenv').config(); // Эта строка ОБЯЗАТЕЛЬНА для загрузки .env

const sequelize = new Sequelize(
  process.env.DB_NAME,       // 'cunninghares'
  process.env.DB_USER,       // 'cunninghares_user'
  process.env.DB_PASSWORD,   // 'xswedc71' - будет взято из .env
  {
    host: process.env.DB_HOST, // 'localhost'
    port: process.env.DB_PORT, // '5432'
    dialect: 'postgres',
    logging: false, // Можно включить для отладки SQL-запросов
  }
);

module.exports = sequelize;