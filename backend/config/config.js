require('dotenv').config();

const isProd = process.env.NODE_ENV === 'production';

const base = {
  username: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  host: process.env.DB_HOST || 'localhost',
  port: Number(process.env.DB_PORT || 5432),
  dialect: 'postgres',
  logging: false,
  dialectOptions: isProd ? { ssl: { require: true, rejectUnauthorized: false } } : {},
};

module.exports = {
  development: { ...base },
  test: { ...base, database: `${base.database}_test` },
  production: { ...base },
};
