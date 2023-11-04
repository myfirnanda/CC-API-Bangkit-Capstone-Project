const {Sequelize, DataTypes} = require('sequelize');
const sequelize = require('../utils/database');

const Recipe = sequelize.define('Recipes', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    allowNull: false,
    autoIncrement: true,
    unique: true,
  },
  image_url: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  name: {
    type: DataTypes.STRING,
    defaultValue: false,
  },
  slug: {
    type: DataTypes.STRING,
    defaultValue: false,
  },
  preparation: {
    type: DataTypes.TEXT,
    defaultValue: false,
  },
  createdAt: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
  },
  updatedAt: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
  },
});

module.exports = Recipe;
