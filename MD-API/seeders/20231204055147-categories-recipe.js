'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert('categories', [
      {
        name: 'Breakfast',
        slug: 'breakfast',
        user_id: 1,
      },
      {
        name: 'Lunch',
        slug: 'lunch',
        user_id: 1,
      },
      {
        name: 'Dinner',
        slug: 'dinner',
        user_id: 1,
      },
    ], {});
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('categories', null, {});
  },
};
