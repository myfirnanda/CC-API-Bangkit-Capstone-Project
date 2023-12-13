'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('nutrition_facts', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        allowNull: false,
        autoIncrement: true,
        unique: true,
      },
      calorie_dose: {
        type: Sequelize.FLOAT,
        allowNull: false,
        validate: {
          notEmpty: true,
          min: 0,
        },
      },
      carbo_dose: {
        type: Sequelize.FLOAT,
        allowNull: false,
        validate: {
          notEmpty: true,
          min: 0,
        },
      },
      protein_dose: {
        type: Sequelize.FLOAT,
        allowNull: false,
        validate: {
          notEmpty: true,
          min: 0,
        },
      },
      fat_dose: {
        type: Sequelize.FLOAT,
        allowNull: false,
        validate: {
          notEmpty: true,
          min: 0,
        },
      },
      recipe_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'Recipes',
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
    await queryInterface.dropTable('nutrition_facts');
  },
};
