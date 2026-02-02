const { Sequelize } = require('sequelize');
const sequelize = require('../config/database');

// базовые
const User = require('./user');
const Post = require('./post');
const Like = require('./like');
const Message = require('./message');

// мессенджер-ядро
const Follow = require('./follow');
const Chat = require('./chat');
const ChatParticipant = require('./chatParticipant');
const ChatRequest = require('./chatRequest');

// --------------------
// Associations
// --------------------

// Follows (подписки): follower -> following
User.belongsToMany(User, {
  through: Follow,
  as: 'Following',
  foreignKey: 'followerId',
  otherKey: 'followingId'
});
User.belongsToMany(User, {
  through: Follow,
  as: 'Followers',
  foreignKey: 'followingId',
  otherKey: 'followerId'
});

// ChatRequest: fromUser -> toUser
User.hasMany(ChatRequest, { as: 'SentChatRequests', foreignKey: 'fromUserId' });
User.hasMany(ChatRequest, { as: 'ReceivedChatRequests', foreignKey: 'toUserId' });
ChatRequest.belongsTo(User, { as: 'FromUser', foreignKey: 'fromUserId' });
ChatRequest.belongsTo(User, { as: 'ToUser', foreignKey: 'toUserId' });

// Chats / Participants
Chat.hasMany(ChatParticipant, { foreignKey: 'chatId' });
ChatParticipant.belongsTo(Chat, { foreignKey: 'chatId' });

User.hasMany(ChatParticipant, { foreignKey: 'userId' });
ChatParticipant.belongsTo(User, { foreignKey: 'userId' });

// Messages
Chat.hasMany(Message, { foreignKey: 'chatId' });
Message.belongsTo(Chat, { foreignKey: 'chatId' });

User.hasMany(Message, { foreignKey: 'senderId' });
Message.belongsTo(User, { as: 'Sender', foreignKey: 'senderId' });

// (посты/лайки оставляем как задел на потом — сейчас не трогаем)

module.exports = {
  sequelize,
  Sequelize,

  // models
  User,
  Post,
  Like,
  Message,

  Follow,
  Chat,
  ChatParticipant,
  ChatRequest
};
