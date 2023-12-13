const {Sequelize, DataTypes} = require('sequelize');
const sequelize = require('../utils/database');

const Type = sequelize.define('Type', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    allowNull: false,
    autoIncrement: true,
    unique: true,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      notEmpty: true,
    },
  },
  slug: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  user_id: {
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
  tableName: 'types',
});

Type.associate = (models) => {
  Type.hasMany(models.Recipe, {
    foreignKey: 'type_id',
  });

  Type.belongsTo(models.User, {
    foreignKey: 'type_id',
  });
};

module.exports = Type;
