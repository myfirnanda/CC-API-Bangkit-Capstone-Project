'use strict';
const bcryptjs = require('bcryptjs');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    const saltRounds = 10;
    const hashedPassword1 = await bcryptjs.hash('12345', saltRounds);
    const hashedPassword2 = await bcryptjs.hash('54321', saltRounds);

    return queryInterface.bulkInsert('Users', [
      {
        name: 'firnanda',
        email: 'admin1@gmail.com',
        password: hashedPassword1,
        isAdmin: true,
      },
      {
        name: 'fathur',
        email: 'admin2@gmail.com',
        password: hashedPassword2,
        isAdmin: true,
      },
    ]);
  },

  async down(queryInterface, Sequelize) {
    return queryInterface.bulkDelete('Users', null, {});
  },
};
