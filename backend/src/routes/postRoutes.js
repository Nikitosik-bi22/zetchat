const express = require('express');
const router = express.Router();
// const authMiddleware = require('../middleware/authMiddleware');

// Заглушки для будущих эндпоинтов
router.get('/', (req, res) => {
  res.json({ message: 'Маршрут для постов работает' });
});

module.exports = router;