'use strict';
const bcryptjs = require('bcryptjs');
const slugify = require('slugify');
const {customAlphabet} = require('nanoid');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    const saltRounds = 10;
    const hashedPassword1 = await bcryptjs.hash('12345', saltRounds);
    const hashedPassword2 = await bcryptjs.hash('54321', saltRounds);

    const name1 = 'Firnanda';
    const name2 = 'Fathur';

    const nanoid = customAlphabet('1234567890', 5);

    return queryInterface.bulkInsert('users', [
      {
        name: name1,
        slug: slugify(name1, {lower: true}) + '-' + nanoid(),
        email: 'admin1@gmail.com',
        password: hashedPassword1,
        age: 25,
        weight: 67,
        height: 180,
        activity_level: 'active',
        isDairy: false,
        isAdmin: true,
      },
      {
        name: name2,
        slug: slugify(name2, {lower: true}) + '-' + nanoid(),
        email: 'admin2@gmail.com',
        password: hashedPassword2,
        age: 30,
        weight: 67,
        height: 180,
        activity_level: 'active',
        isDairy: false,
        isAdmin: true,
      },
    ]);
  },

  async down(queryInterface, Sequelize) {
    return queryInterface.bulkDelete('users', null, {});
  },
};
