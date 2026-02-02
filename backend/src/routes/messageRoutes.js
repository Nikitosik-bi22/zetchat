const express = require('express');
const router = express.Router();
// const authMiddleware = require('../middleware/authMiddleware');

router.get('/', (req, res) => {
  res.json({ message: 'Маршрут для сообщений работает' });
});

module.exports = router;