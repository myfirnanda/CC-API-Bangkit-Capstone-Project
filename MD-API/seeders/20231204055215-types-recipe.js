'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert('types', [
      {
        name: 'Main Food',
        slug: 'main-food',
        user_id: 1,
      },
      {
        name: 'Snack',
        slug: 'snack',
        user_id: 1,
      },
      {
        name: 'Dessert',
        slug: 'dessert',
        user_id: 1,
      },
      {
        name: 'Beverage',
        slug: 'beverage',
        user_id: 1,
      },
      {
        name: 'Appetizer',
        slug: 'appetizer',
        user_id: 1,
      },
      {
        name: 'Salad',
        slug: 'salad',
        user_id: 1,
      },
      {
        name: 'Soup',
        slug: 'soup',
        user_id: 1,
      },
      {
        name: 'Seafood',
        slug: 'seafood',
        user_id: 1,
      },
      {
        name: 'Grilled',
        slug: 'grilled',
        user_id: 1,
      },
      {
        name: 'Holiday',
        slug: 'holiday',
        user_id: 1,
      },
    ], {});
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('types', null, {});
  },
};
