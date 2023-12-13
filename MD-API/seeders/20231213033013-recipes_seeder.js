'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert('recipes', [
      // Recipe 1
      {
        image_name: 'banana-oatmeal.png',
        name: 'Banana Oatmeal',
        slug: 'banana-oatmeal',
        description: 'lorem',
        preparation: 'lorem',
        isDairy: true,
        user_id: 1,
        // type_id: 1,
        category_id: 1,
        calorie_dose: 250,
        carbo_dose: 160,
        protein_dose: 23,
        fat_dose: 3,
        ingredients: [
          {
            dose: 250,
            unit: 'gram',
            ingredient_id: 16,
          },
          {
            dose: 250,
            unit: 'ml',
            ingredient_id: 1,
          },
          {
            dose: 120,
            unit: 'ml',
            ingredient_id: 3,
          },
        ],
      },
      // Recipe 2
      {
        image_name: 'garlic-butter-toast.png',
        name: 'Garlic Butter Toast',
        slug: 'garlic-butter-toast',
        description: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Maxime mollitia, molestiae quas vel sint commodi repudiandae consequuntur voluptatum laborum eveniet aliquid culpa officia aut! Impedit sit sunt quaerat',
        preparation: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Maxime mollitia, molestiae quas vel sint commodi repudiandae consequuntur voluptatum laborum eveniet aliquid culpa officia aut! Impedit sit sunt quaerat',
        isDairy: true,
        user_id: 1,
        // type_id: 2,
        category_id: 3,
        calorie_dose: 300,
        carbo_dose: 152,
        protein_dose: 10,
        fat_dose: 23,
        ingredients: [
          {
            dose: 12,
            unit: 'ml',
            ingredient_id: 18,
          },
          {
            dose: 24,
            unit: 'gram',
            ingredient_id: 21,
          },
          {
            dose: 32,
            unit: 'gram',
            ingredient_id: 2,
          },
          {
            dose: 32,
            unit: 'gram',
            ingredient_id: 1,
          },
        ],
      },
      // Recipe 3
      {
        image_name: 'tofu-stir-fry.png',
        name: 'Tofu Stir Fry',
        slug: 'tofu-stir-fry',
        description: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Maxime mollitia, molestiae quas vel sint commodi repudiandae consequuntur voluptatum laborum eveniet aliquid culpa officia aut! Impedit sit sunt quaerat',
        preparation: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Maxime mollitia, molestiae quas vel sint commodi repudiandae consequuntur voluptatum laborum eveniet aliquid culpa officia aut! Impedit sit sunt quaerat',
        isDairy: false,
        user_id: 1,
        // type_id: 1,
        category_id: 3,
        calorie_dose: 88,
        carbo_dose: 23,
        protein_dose: 40,
        fat_dose: 10,
        ingredients: [
          {
            dose: 93,
            unit: 'gram',
            ingredient_id: 22,
          },
          {
            dose: 38,
            unit: 'ml',
            ingredient_id: 21,
          },
          {
            dose: 83,
            unit: 'pinch',
            ingredient_id: 19,
          },
        ],
      },
      // Recipe 4
      {
        image_name: 'hazelnut-caramel.png',
        name: 'Hazelnut Caramel',
        slug: 'hazelnut-caramel',
        description: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Maxime mollitia, molestiae quas vel sint commodi repudiandae consequuntur voluptatum laborum eveniet aliquid culpa officia aut! Impedit sit sunt quaerat',
        preparation: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Maxime mollitia, molestiae quas vel sint commodi repudiandae consequuntur voluptatum laborum eveniet aliquid culpa officia aut! Impedit sit sunt quaerat',
        isDairy: false,
        user_id: 1,
        // type_id: 2,
        category_id: 1,
        calorie_dose: 392,
        carbo_dose: 230,
        protein_dose: 32,
        fat_dose: 29,
        ingredients: [
          {
            dose: 29,
            unit: 'gram',
            ingredient_id: 23,
          },
          {
            dose: 19,
            unit: 'gram',
            ingredient_id: 24,
          },
          {
            dose: 28,
            unit: 'ml',
            ingredient_id: 1,
          },
        ],
      },
      // Recipe 5
      {
        image_name: 'eggy-bread.png',
        name: 'Eggy Bread',
        slug: 'eggy-bread',
        description: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Maxime mollitia, molestiae quas vel sint commodi repudiandae consequuntur voluptatum laborum eveniet aliquid culpa officia aut! Impedit sit sunt quaerat',
        preparation: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Maxime mollitia, molestiae quas vel sint commodi repudiandae consequuntur voluptatum laborum eveniet aliquid culpa officia aut! Impedit sit sunt quaerat',
        isDairy: true,
        user_id: 1,
        // type_id: 3,
        category_id: 1,
        calorie_dose: 120,
        carbo_dose: 83,
        protein_dose: 29,
        fat_dose: 8,
        ingredients: [
          {
            dose: 93,
            unit: 'gram',
            ingredient_id: 8,
          },
          {
            dose: 27,
            unit: 'gram',
            ingredient_id: 18,
          },
          {
            dose: 73,
            unit: 'ml',
            ingredient_id: 19,
          },
        ],
      },
      // Recip 6
      {
        image_name: '',
        name: '',
        slug: '',
        description: '',
        preparation: '',
        isDairy: '',
        user_id: 1,
        // type_id,
        category_id,
        calorie_dose,
        carbo_dose,
        protein_dose,
        fat_dose,
        ingredients: [
          {
            dose,
            unit,
            ingredient_id,
          },
          {
            dose,
            unit,
            ingredient_id,
          },
          {
            dose,
            unit,
            ingredient_id,
          },
        ],
      },
    ], {});
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('recipes', null, {});
  },
};
