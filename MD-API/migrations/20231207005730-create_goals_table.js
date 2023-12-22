'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('goals', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        allowNull: false,
        autoIncrement: true,
        unique: true,
      },
      name: {
        type: Sequelize.STRING,
        allowNull: false,
        validate: {
          notEmpty: true,
        },
      },
      slug: {
        type: Sequelize.STRING,
        allowNull: false,
        validate: {
          notEmpty: true,
        },
      },
      duration_month: {
        type: Sequelize.DATE,
        allowNull: false,
        validate: {
          notEmpty: true,
          min: 0,
        },
      },
      total_calorie: {
        type: Sequelize.FLOAT,
        allowNull: false,
        validate: {
          notEmpty: true,
          min: 0,
        },
        defaultValue: 0,
      },
      total_carbo: {
        type: Sequelize.FLOAT,
        allowNull: false,
        validate: {
          notEmpty: true,
          min: 0,
        },
        defaultValue: 0,
      },
      total_protein: {
        type: Sequelize.FLOAT,
        allowNull: false,
        validate: {
          notEmpty: true,
          min: 0,
        },
        defaultValue: 0,
      },
      total_fat: {
        type: Sequelize.FLOAT,
        allowNull: false,
        validate: {
          notEmpty: true,
          min: 0,
        },
        defaultValue: 0,
      },
      status: {
        type: Sequelize.BOOLEAN,
        validate: {
          notEmpty: true,
        },
      },
      user_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'users',
          key: 'id',
        },
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
    await queryInterface.dropTable('goals');
  },
};
