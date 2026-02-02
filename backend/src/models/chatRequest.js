const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const ChatRequest = sequelize.define('ChatRequest', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  status: {
    type: DataTypes.ENUM('pending', 'accepted', 'rejected', 'canceled'),
    defaultValue: 'pending'
  },
  message: {
    type: DataTypes.STRING(500),
    allowNull: true
  }
}, {
  tableName: 'chat_requests',
  timestamps: true
});

module.exports = ChatRequest;
