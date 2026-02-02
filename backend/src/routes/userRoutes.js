const express = require('express');
const router = express.Router();
// const authMiddleware = require('../middleware/authMiddleware');

router.get('/profile', (req, res) => {
  res.json({ message: 'Маршрут для профиля пользователя работает' });
});

module.exports = router;