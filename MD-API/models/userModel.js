const {Sequelize, DataTypes} = require('sequelize');
const sequelize = require('../utils/database');

const User = sequelize.define('User', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    allowNull: false,
    autoIncrement: true,
    unique: true,
  },
  profile_image: {
    type: DataTypes.TEXT,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      notEmpty: true,
    },
    unique: true,
  },
  slug: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      notEmpty: true,
    },
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
    validate: {
      notEmpty: true,
    },
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      notEmpty: true,
    },
  },
  gender: {
    type: DataTypes.ENUM(
        'male',
        'female',
    ),
    allowNull: false,
    validate: {
      notEmpty: true,
    },
  },
  weight: {
    type: DataTypes.FLOAT,
    allowNull: false,
    validate: {
      notEmpty: true,
      min: 0,
    },
  },
  height: {
    type: DataTypes.FLOAT,
    allowNull: false,
    validate: {
      notEmpty: true,
      min: 0,
    },
  },
  activity_level: {
    type: DataTypes.ENUM(
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
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: false,
    validate: {
      notEmpty: true,
    },
  },
  isAdmin: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: false,
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
  tableName: 'users',
});

module.exports = User;

