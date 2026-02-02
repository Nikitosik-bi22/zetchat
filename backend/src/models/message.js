const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Message = sequelize.define('Message', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },

  // ВАЖНО: сообщение принадлежит чату
  chatId: {
    type: DataTypes.UUID,
    allowNull: false
  },

  // ВАЖНО: кто отправил
  senderId: {
    type: DataTypes.UUID,
    allowNull: false
  },

  content: {
    type: DataTypes.TEXT,
    allowNull: false
  },

  type: {
    type: DataTypes.ENUM('text', 'image', 'file'),
    defaultValue: 'text'
  },

  // На будущее под вложения/ссылки/метаданные
  meta: {
    type: DataTypes.JSONB,
    allowNull: true
  },

  read: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },

  readAt: {
    type: DataTypes.DATE,
    allowNull: true
  }
}, {
  tableName: 'messages',
  timestamps: true
});

module.exports = Message;
