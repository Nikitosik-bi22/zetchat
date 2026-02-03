const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const sequelize = require('./config/database');
require('dotenv').config();

const app = express();

// Middleware
app.use(helmet());

// ВАЖНО: CORS под прод-домен (можно расширить позже)
app.use(cors({
  origin: [
    'http://localhost:5173',
    'http://localhost:3000',
    'https://zetchat.ru',
    'https://www.zetchat.ru',
    'https://zetchat.pages.dev',
  ],
  credentials: true,
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Маршруты
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/admin', require('./routes/adminRoutes'));
app.use('/api/posts', require('./routes/postRoutes'));
app.use('/api/messages', require('./routes/messageRoutes'));
app.use('/api/users', require('./routes/userRoutes'));

// Простой маршрут для корня
app.get('/', (req, res) => {
  res.json({
    message: 'Cunninghares Backend API is running! 🐰',
    version: '1.0',
    docs: 'Available endpoints: /api/auth, /api/posts, /api/messages, /api/users, /api/admin'
  });
});

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'OK' });
});

// Обработка ошибок
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Внутренняя ошибка сервера' });
});

const PORT = process.env.PORT || 5000;

// Стартуем сервер СРАЗУ, а БД подключаем отдельно
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Сервер запущен на порту ${PORT}`);
});

// Подключение к БД — не блокирует запуск сервера
sequelize.authenticate()
  .then(() => console.log('Подключение к PostgreSQL установлено'))
  .catch((err) => console.error('Ошибка подключения к БД:', err));
