'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('recipe_ingredients', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        allowNull: false,
        autoIncrement: true,
        unique: true,
      },
      dose: {
        type: Sequelize.FLOAT,
        allowNull: false,
        validate: {
          notEmpty: true,
          min: 0,
        },
      },
      unit: {
        type: Sequelize.ENUM(
            'gram',
            'kilogram',
            'ounce',
            'pound',
            'milliliter',
            'liter',
            'teaspoon',
            'tablespoon',
            'cup',
            'piece',
            'pinch',
            'dash',
        ),
        allowNull: false,
        validate: {
          notEmpty: true,
          min: 0,
        },
      },
      isMandatory: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        validate: {
          notEmpty: true,
        },
        defaultValue: true,
      },
      recipe_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      ingredient_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
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
    await queryInterface.dropTable('recipe_ingredients');
  },
};
