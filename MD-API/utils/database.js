const {Sequelize} = require('sequelize');

const sequelize = new Sequelize(
    process.env.DB_NAME || 'my_database',
    process.env.DB_USERNAME || 'root',
    process.env.DB_PASSWORD || '', {
      host: process.env.DB_HOST || '127.0.0.1',
      dialect: process.env.DIALECT || 'mysql',
    },
);

module.exports = sequelize;
