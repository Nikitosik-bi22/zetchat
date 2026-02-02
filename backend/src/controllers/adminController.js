const { Op } = require('sequelize');
const { User, Post, Message } = require('../models');

exports.getStats = async (req, res) => {
  try {
    const totalUsers = await User.count();
    const onlineUsers = await User.count({ where: { status: 'online' } });
    const totalPosts = await Post.count();
    const totalMessages = await Message.count();

    const pendingVerifications = await User.count({
      where: { isVerified: false }
    });

    const newUsersToday = await User.count({
      where: {
        createdAt: {
          [Op.gte]: new Date(Date.now() - 24 * 60 * 60 * 1000)
        }
      }
    });

    res.json({
      totalUsers,
      onlineUsers,
      totalPosts,
      totalMessages,
      pendingVerifications,
      newUsersToday,
      updatedAt: new Date()
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getPendingVerifications = async (req, res) => {
  try {
    const users = await User.findAll({
      where: { isVerified: false },
      attributes: ['id', 'username', 'email', 'createdAt', 'avatar'],
      order: [['createdAt', 'DESC']]
    });

    res.json(users);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.verifyUser = async (req, res) => {
  try {
    const { userId } = req.params;

    const user = await User.findByPk(userId);

    if (!user) {
      return res.status(404).json({ error: 'Пользователь не найден' });
    }

    user.isVerified = true;
    await user.save();

    res.json({
      message: 'Пользователь верифицирован',
      user: {
        id: user.id,
        username: user.username,
        email: user.email
      }
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
