'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert('generals', [{
      id: "55509e4d-2f74-2222-8a5a-2264fe2d31fc",
      version: '1.0.0',
      divecenter_fee: 20,
      liveaboard_fee: 20,
      resort_fee: 20,
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
    return queryInterface.bulkDelete('generals', null, {});
  }
};
