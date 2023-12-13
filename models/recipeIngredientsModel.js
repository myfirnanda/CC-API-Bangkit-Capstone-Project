const {Sequelize, DataTypes} = require('sequelize');
const sequelize = require('../utils/database');

const RecipeIngredient = sequelize.define('RecipeIngredient', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    allowNull: false,
    autoIncrement: true,
    unique: true,
  },
  dose: {
    type: DataTypes.FLOAT,
    allowNull: false,
    validate: {
      notEmpty: true,
      min: 0,
    },
  },
  unit: {
    type: DataTypes.ENUM(
        'gram',
        'kg',
        'ounce',
        'pound',
        'ml',
        'liter',
        'tsp',
        'tbsp',
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
    type: DataTypes.BOOLEAN,
    allowNull: false,
    validate: {
      notEmpty: true,
    },
    defaultValue: true,
  },
  recipe_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  ingredient_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  createdAt: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: Sequelize.fn('NOW'),
  },
  updatedAt: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: Sequelize.fn('NOW'),
  },
}, {
  tableName: 'recipe_ingredients',
});

module.exports = RecipeIngredient;
