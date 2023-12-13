'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn('goals', 'target_calorie', {
      type: Sequelize.FLOAT,
      allowNull: false,
      validate: {
        notEmpty: true,
        min: 0,
      },
      after: 'total_fat',
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn('goals', 'target_calorie');
  },
};
