'use strict';
const moment = require('moment');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert('goals', [
      {
        name: 'Sehat & Bugar',
        slug: 'sehat-&-bugar',
        duration_month: moment().add(6, 'months').toDate(),
        target_calorie: 5000,
        user_id: 1,
      },
      {
        name: 'Sehat & Bugar',
        slug: 'sehat-&-bugar',
        duration_month: moment().add(6, 'months').toDate(),
        target_calorie: 5000,
        user_id: 2,
      },
    ], {});
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('goals', null, {});
  },
};
