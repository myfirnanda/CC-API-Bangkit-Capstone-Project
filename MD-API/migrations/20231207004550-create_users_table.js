'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('users', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        allowNull: false,
        autoIncrement: true,
        unique: true,
      },
      profile_image: {
        type: Sequelize.TEXT,
      },
      name: {
        type: Sequelize.STRING,
        allowNull: false,
        validate: {
          notEmpty: true,
        },
        unique: true,
      },
      slug: {
        type: Sequelize.STRING,
        allowNull: false,
        validate: {
          notEmpty: true,
        },
      },
      email: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true,
        validate: {
          notEmpty: true,
        },
      },
      password: {
        type: Sequelize.STRING,
        allowNull: false,
        validate: {
          notEmpty: true,
        },
      },
      gender: {
        type: Sequelize.ENUM(
            'male',
            'female',
        ),
        allowNull: false,
        validate: {
          notEmpty: true,
        },
      },
      weight: {
        type: Sequelize.FLOAT,
        allowNull: false,
        validate: {
          notEmpty: true,
          min: 0,
        },
      },
      height: {
        type: Sequelize.FLOAT,
        allowNull: false,
        validate: {
          notEmpty: true,
          min: 0,
        },
      },
      age: {
        type: Sequelize.INTEGER,
        allowNull: false,
        validate: {
          notEmpty: true,
        },
        defaultValue: 10,
      },
      activity_level: {
        type: Sequelize.ENUM(
            'sedentary',
            'lightly active',
            'moderately active',
            'active',
            'highly active',
        ),
        allowNull: false,
        validate: {
          notEmpty: true,
        },
      },
      isDairy: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: false,
        validate: {
          notEmpty: true,
        },
      },
      isAdmin: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },
      createdAt: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.fn('NOW'),
      },
      updatedAt: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.fn('NOW'),
      },
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('users');
  },
};
