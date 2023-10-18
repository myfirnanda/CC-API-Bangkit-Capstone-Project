const {Sequelize} = require('sequelize');

const sequelize = new Sequelize('cc_api', 'root', '', {
  dialect: 'mysql',
  host: 'localhost',
});

module.exports = sequelize;
