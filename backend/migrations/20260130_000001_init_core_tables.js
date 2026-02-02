'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // 1) follows
    await queryInterface.createTable('follows', {
      id: { type: Sequelize.UUID, allowNull: false, primaryKey: true },
      followerId: {
        type: Sequelize.UUID,
        allowNull: false,
        references: { model: 'users', key: 'id' },
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE'
      },
      followingId: {
        type: Sequelize.UUID,
        allowNull: false,
        references: { model: 'users', key: 'id' },
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE'
      },
      createdAt: { type: Sequelize.DATE, allowNull: false },
      updatedAt: { type: Sequelize.DATE, allowNull: false }
    });

    await queryInterface.addConstraint('follows', {
      fields: ['followerId', 'followingId'],
      type: 'unique',
      name: 'uniq_follows_follower_following'
    });

    await queryInterface.addIndex('follows', ['followerId']);
    await queryInterface.addIndex('follows', ['followingId']);

    // 2) chats
    await queryInterface.createTable('chats', {
      id: { type: Sequelize.UUID, allowNull: false, primaryKey: true },
      type: {
        type: Sequelize.ENUM('direct', 'group'),
        allowNull: false,
        defaultValue: 'direct'
      },
      createdAt: { type: Sequelize.DATE, allowNull: false },
      updatedAt: { type: Sequelize.DATE, allowNull: false }
    });

    // 3) chat_participants
    await queryInterface.createTable('chat_participants', {
      id: { type: Sequelize.UUID, allowNull: false, primaryKey: true },
      chatId: {
        type: Sequelize.UUID,
        allowNull: false,
        references: { model: 'chats', key: 'id' },
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE'
      },
      userId: {
        type: Sequelize.UUID,
        allowNull: false,
        references: { model: 'users', key: 'id' },
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE'
      },
      role: {
        type: Sequelize.ENUM('member', 'admin', 'owner'),
        allowNull: false,
        defaultValue: 'member'
      },
      createdAt: { type: Sequelize.DATE, allowNull: false },
      updatedAt: { type: Sequelize.DATE, allowNull: false }
    });

    await queryInterface.addConstraint('chat_participants', {
      fields: ['chatId', 'userId'],
      type: 'unique',
      name: 'uniq_chat_participants_chat_user'
    });

    await queryInterface.addIndex('chat_participants', ['chatId']);
    await queryInterface.addIndex('chat_participants', ['userId']);

    // 4) chat_requests
    await queryInterface.createTable('chat_requests', {
      id: { type: Sequelize.UUID, allowNull: false, primaryKey: true },

      fromUserId: {
        type: Sequelize.UUID,
        allowNull: false,
        references: { model: 'users', key: 'id' },
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE'
      },
      toUserId: {
        type: Sequelize.UUID,
        allowNull: false,
        references: { model: 'users', key: 'id' },
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE'
      },

      status: {
        type: Sequelize.ENUM('pending', 'accepted', 'rejected', 'canceled'),
        allowNull: false,
        defaultValue: 'pending'
      },

      message: { type: Sequelize.STRING(500), allowNull: true },

      createdAt: { type: Sequelize.DATE, allowNull: false },
      updatedAt: { type: Sequelize.DATE, allowNull: false }
    });

    await queryInterface.addIndex('chat_requests', ['toUserId', 'status']);
    await queryInterface.addIndex('chat_requests', ['fromUserId', 'status']);

    // 5) messages: add chatId + senderId + meta + readAt
    // (после docker down -v таблица пустая, но делаем безопасно: сначала nullable, потом NOT NULL)

    await queryInterface.addColumn('messages', 'chatId', {
      type: Sequelize.UUID,
      allowNull: true,
      references: { model: 'chats', key: 'id' },
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE'
    });

    await queryInterface.addColumn('messages', 'senderId', {
      type: Sequelize.UUID,
      allowNull: true,
      references: { model: 'users', key: 'id' },
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE'
    });

    await queryInterface.addColumn('messages', 'meta', {
      type: Sequelize.JSONB,
      allowNull: true
    });

    await queryInterface.addColumn('messages', 'readAt', {
      type: Sequelize.DATE,
      allowNull: true
    });

    await queryInterface.changeColumn('messages', 'chatId', {
      type: Sequelize.UUID,
      allowNull: false
    });

    await queryInterface.changeColumn('messages', 'senderId', {
      type: Sequelize.UUID,
      allowNull: false
    });

    await queryInterface.addIndex('messages', ['chatId', 'createdAt']);
    await queryInterface.addIndex('messages', ['senderId']);
  },

  down: async (queryInterface) => {
    // messages columns
    await queryInterface.removeIndex('messages', ['senderId']).catch(() => {});
    await queryInterface.removeIndex('messages', ['chatId', 'createdAt']).catch(() => {});
    await queryInterface.removeColumn('messages', 'readAt').catch(() => {});
    await queryInterface.removeColumn('messages', 'meta').catch(() => {});
    await queryInterface.removeColumn('messages', 'senderId').catch(() => {});
    await queryInterface.removeColumn('messages', 'chatId').catch(() => {});

    // drop tables
    await queryInterface.dropTable('chat_requests').catch(() => {});
    await queryInterface.dropTable('chat_participants').catch(() => {});
    await queryInterface.dropTable('chats').catch(() => {});
    await queryInterface.dropTable('follows').catch(() => {});

    // drop enums
    await queryInterface.sequelize.query('DROP TYPE IF EXISTS "enum_chats_type";');
    await queryInterface.sequelize.query('DROP TYPE IF EXISTS "enum_chat_participants_role";');
    await queryInterface.sequelize.query('DROP TYPE IF EXISTS "enum_chat_requests_status";');
  }
};
