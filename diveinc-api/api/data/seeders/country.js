'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert('countries', [{
      id: "55509e4d-2f74-2222-8a5a-2264fe2d31fc",
      name: 'Indonesia',
      description: 'Negara kesatuan republik Indonesia',
      active: true,
      created_by: JSON.stringify({
        type : "seeder",
        id : "",
        description : "Seeder create first country"
      }),
      created_at: new Date()
    }], {});
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('countries', null, {});
  }
};
