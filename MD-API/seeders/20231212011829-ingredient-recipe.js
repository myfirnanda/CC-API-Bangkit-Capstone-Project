'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert('ingredients', [
      // 1
      {
        image_name: 'milk.png',
        name: 'Milk',
        slug: 'milk',
      },
      // 2
      {
        image_name: 'cheese.png',
        name: 'Cheese',
        slug: 'cheese',
      },
      // 3
      {
        image_name: 'yogurt.png',
        name: 'Yogurt',
        slug: 'yogurt',
      },
      // 4
      {
        image_name: 'butter.png',
        name: 'Butter',
        slug: 'butter',
      },
      // 5
      {
        image_name: 'cream.png',
        name: 'Cream',
        slug: 'cream',
      },
      // 6
      {
        image_name: 'butter-milk.png',
        name: 'Buttermilk',
        slug: 'buttermilk',
      },
      // 7
      {
        image_name: 'milk-powder.png',
        name: 'Milk Powder',
        slug: 'milk-powder',
      },
      // 8
      {
        image_name: 'egg.png',
        name: 'Egg',
        slug: 'egg',
      },
      // 9
      {
        image_name: 'flour.png',
        name: 'Flour',
        slug: 'flour',
      },
      // 10
      {
        image_name: 'tomato.png',
        name: 'Tomato',
        slug: 'tomato',
      },
      // 11
      {
        image_name: 'oil.png',
        name: 'Oil',
        slug: 'oil',
      },
      // 12
      {
        image_name: 'water.png',
        name: 'Water',
        slug: 'water',
      },
      // 13
      {
        image_name: 'salt.png',
        name: 'Salt',
        slug: 'salt',
      },
      // 14
      {
        image_name: 'coconut-oil.png',
        name: 'Coconut Oil',
        slug: 'coconut-oil',
      },
      // 15
      {
        image_name: 'olive-oil.png',
        name: 'Olive Oil',
        slug: 'olive-oil',
      },
      // 16
      {
        image_name: 'banana.png',
        name: 'Banana',
        slug: 'banana',
      },
      // 17
      {
        image_name: 'chocolate.png',
        name: 'Chocolate',
        slug: 'chocolate',
      },
      // 18
      {
        image_name: 'bread.png',
        name: 'Bread',
        slug: 'bread',
      },
      // 19
      {
        image_name: 'pepper.png',
        name: 'Pepper',
        slug: 'pepper',
      },
      // 20
      {
        image_name: 'celery.png',
        name: 'Celery',
        slug: 'celery',
      },
      // 21
      {
        image_name: 'garlic.png',
        name: 'Garlic',
        slug: 'garlic',
      },
      // 22
      {
        image_name: 'tofu.png',
        name: 'Tofu',
        slug: 'tofu',
      },
      // 23
      {
        image_name: 'hazelnut.png',
        name: 'Hazelnut',
        slug: 'hazelnut',
      },
      // 24
      {
        image_name: 'sugar.png',
        name: 'Sugar',
        slug: 'sugar',
      },
    ], {});
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('ingredients', null, {});
  },
};
