const {Sequelize, DataTypes} = require('sequelize');
const sequelize = require('../utils/database');

const IngredientAllergy = sequelize.define('IngredientAllergy', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    allowNull: false,
    autoIncrement: true,
    unique: true,
  },
  ingredient_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  allergy_id: {
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
  tableName: 'ingredient_allergies',
});

module.exports = IngredientAllergy;
