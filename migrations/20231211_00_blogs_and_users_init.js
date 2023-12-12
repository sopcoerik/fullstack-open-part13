const { DataTypes } = require('sequelize')

module.exports = {
  up: async ({ context: queryInterface }) => {
    await queryInterface.createTable('users', {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      name: {
        type: DataTypes.TEXT,
        allowNull: false,
        validate: {
          isEmail: true
        }
      },
      username: {
        type: DataTypes.TEXT,
        allowNull: false,
        unique: true
      },
      created_at: {
        type: DataTypes.DATE
      },
      updated_at: {
        type: DataTypes.DATE
      }
    })
    await queryInterface.createTable('blogs', {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      author: {
        type: DataTypes.TEXT,
      },
      url: {
        type: DataTypes.TEXT,
        allowNull: false
      },
      title: {
        type: DataTypes.TEXT,
        allowNull: false
      },
      likes: {
        type: DataTypes.INTEGER,
        defaultValue: 0
      },
      userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: 'users',
          key: 'id'
        }
      },
      createdAt: {
        type: DataTypes.DATE
      },
      updatedAt: {
        type: DataTypes.DATE
      }
    })
  },
  down: async ({ context: queryInterface }) => {
    await queryInterface.dropTable('blogs')
    await queryInterface.dropTable('users')
  }
}