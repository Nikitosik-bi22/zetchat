const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const { User } = require('../models');
const sendEmail = require('../utils/emailSender');

const isDevAutoVerifyEnabled = () => {
  // В проде лучше не подтверждать автоматически, но для разработки — ок
  if (process.env.AUTO_VERIFY_ON_EMAIL_FAIL === 'true') return true;
  return process.env.NODE_ENV !== 'production';
};

exports.register = async (req, res) => {
  try {
    const { username, email, password } = req.body;

    if (!username || !email || !password) {
      return res.status(400).json({ error: 'Заполните username, email и password' });
    }

    // Проверка существования пользователя
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ error: 'Email уже используется' });
    }

    const existingUsername = await User.findOne({ where: { username } });
    if (existingUsername) {
      return res.status(400).json({ error: 'Имя пользователя уже занято' });
    }

    // Хеширование пароля
    const hashedPassword = await bcrypt.hash(password, 12);

    // Генерация кода подтверждения
    const verificationCode = crypto.randomInt(100000, 999999).toString();
    const verificationExpires = new Date(Date.now() + 24 * 60 * 60 * 1000);

    // Создание пользователя
    const user = await User.create({
      username,
      email,
      password: hashedPassword,
      verificationCode,
      verificationExpires,
      isVerified: false
    });

    // Отправка email с кодом подтверждения
    try {
      await sendEmail({
        to: email,
        subject: 'Подтверждение регистрации Cunninghares',
        html: `<h2>Ваш код подтверждения: ${verificationCode}</h2>`
      });

      return res.status(201).json({
        message: 'Регистрация успешна. Проверьте email для подтверждения.'
      });
    } catch (mailError) {
      // ВАЖНО: не ломаем регистрацию из-за почты
      console.error('Ошибка отправки email:', mailError?.message || mailError);

      if (isDevAutoVerifyEnabled()) {
        user.isVerified = true;
        user.verificationCode = null;
        user.verificationExpires = null;
        await user.save();

        return res.status(201).json({
          message:
            'Регистрация успешна. Почта сейчас не настроена — аккаунт подтверждён автоматически (dev).'
        });
      }

      // В проде лучше не подтверждать автоматически
      return res.status(201).json({
        message:
          'Регистрация успешна, но письмо подтверждения не отправлено. Попробуйте позже или обратитесь в поддержку.'
      });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.verifyEmail = async (req, res) => {
  try {
    const { email, code } = req.body;

    const user = await User.findOne({ where: { email } });

    if (!user) {
      return res.status(404).json({ error: 'Пользователь не найден' });
    }

    if (user.isVerified) {
      return res.json({ message: 'Email уже подтверждён' });
    }

    if (user.verificationCode !== code) {
      return res.status(400).json({ error: 'Неверный код подтверждения' });
    }

    if (user.verificationExpires < new Date()) {
      return res.status(400).json({ error: 'Срок действия кода истёк' });
    }

    user.isVerified = true;
    user.verificationCode = null;
    user.verificationExpires = null;
    await user.save();

    // Генерация JWT токена
    const token = jwt.sign(
      { userId: user.id, isAdmin: user.isAdmin },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.json({
      token,
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        isVerified: user.isVerified,
        isAdmin: user.isAdmin
      }
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ where: { email } });

    if (!user) {
      return res.status(404).json({ error: 'Пользователь не найден' });
    }

    const isValidPassword = await bcrypt.compare(password, user.password);

    if (!isValidPassword) {
      return res.status(400).json({ error: 'Неверный пароль' });
    }

    if (!user.isVerified) {
      return res.status(400).json({ error: 'Подтвердите email' });
    }

    // Обновление статуса
    user.status = 'online';
    user.lastSeen = new Date();
    await user.save();

    const token = jwt.sign(
      { userId: user.id, isAdmin: user.isAdmin },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.json({
      token,
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        isVerified: user.isVerified,
        isAdmin: user.isAdmin,
        avatar: user.avatar,
        status: user.status
      }
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
