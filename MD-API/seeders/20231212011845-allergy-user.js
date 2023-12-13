'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert('allergies', [
      {
        name: 'Egg',
        slug: 'egg',
        description: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Maxime mollitia, molestiae quas vel sint commodi repudiandae consequuntur voluptatum laborum eveniet aliquid culpa officia aut! Impedit sit sunt quaerat',
      },
      {
        name: 'Milk',
        slug: 'milk',
        description: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Maxime mollitia, molestiae quas vel sint commodi repudiandae consequuntur voluptatum laborum eveniet aliquid culpa officia aut! Impedit sit sunt quaerat',
      },
      {
        name: 'Nut',
        slug: 'nut',
        description: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Maxime mollitia, molestiae quas vel sint commodi repudiandae consequuntur voluptatum laborum eveniet aliquid culpa officia aut! Impedit sit sunt quaerat',
      },
      {
        name: 'Fish',
        slug: 'fish',
        description: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Maxime mollitia, molestiae quas vel sint commodi repudiandae consequuntur voluptatum laborum eveniet aliquid culpa officia aut! Impedit sit sunt quaerat',
      },
    ], {});
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('allergies', null, {});
  },
};
