const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const { authLimiter } = require('../middleware/rateLimiter'); // Ключевое исправление: импортируем authLimiter

router.post('/register', authLimiter, authController.register);
router.post('/verify', authLimiter, authController.verifyEmail);
router.post('/login', authLimiter, authController.login);
// router.post('/logout', authController.logout); // Пока закомментируем эту строку

module.exports = router;