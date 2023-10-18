'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    return queryInterface.bulkInsert('Recipes', [
      {
        image_url: 'https://shorturl.at/bfoVY',
        name: 'Ayam Goreng',
        slug: 'ayam-goreng',
        // eslint-disable-next-line max-len
        preparation: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Rem facilis sint tempore maxime at. Blanditiis voluptatibus temporibus dolor harum mollitia eveniet suscipit id non quae quibusdam atque voluptas iste vero sit nemo labore ea distinctio a, eligendi optio adipisci aspernatur ab ut perspiciatis. Eligendi repudiandae incidunt debitis dolores dignissimos sit.',
      },
      {
        image_url: 'https://shorturl.at/bfoVY',
        name: 'Mie Goreng',
        slug: 'mie-goreng',
        // eslint-disable-next-line max-len
        preparation: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Rem facilis sint tempore maxime at. Blanditiis voluptatibus temporibus dolor harum mollitia eveniet suscipit id non quae quibusdam atque voluptas iste vero sit nemo labore ea distinctio a, eligendi optio adipisci aspernatur ab ut perspiciatis. Eligendi repudiandae incidunt debitis dolores dignissimos sit.',
      },
      {
        image_url: 'https://shorturl.at/bfoVY',
        name: 'Pecel Lele',
        slug: 'pecel-lele',
        // eslint-disable-next-line max-len
        preparation: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Rem facilis sint tempore maxime at. Blanditiis voluptatibus temporibus dolor harum mollitia eveniet suscipit id non quae quibusdam atque voluptas iste vero sit nemo labore ea distinctio a, eligendi optio adipisci aspernatur ab ut perspiciatis. Eligendi repudiandae incidunt debitis dolores dignissimos sit.',
      },
      {
        image_url: 'https://shorturl.at/bfoVY',
        name: 'Soto Ayam',
        slug: 'soto-ayam',
        // eslint-disable-next-line max-len
        preparation: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Rem facilis sint tempore maxime at. Blanditiis voluptatibus temporibus dolor harum mollitia eveniet suscipit id non quae quibusdam atque voluptas iste vero sit nemo labore ea distinctio a, eligendi optio adipisci aspernatur ab ut perspiciatis. Eligendi repudiandae incidunt debitis dolores dignissimos sit.',
      },
    ]);
  },

  async down(queryInterface, Sequelize) {
    return queryInterface.bulkDelete('Users', null, {});
  },
};
