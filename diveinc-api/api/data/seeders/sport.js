'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert('sports', [
      {
        id : 'c7999dce-19b7-4bfd-84cc-d2f0845a3d86',
        name: 'Snorkeling',
        description: 'Snorkeling',
        active: true,
        created_by: JSON.stringify({
          type : "seeder",
          id : "",
          description : "Seeder create master logType"
        }),
        created_at: new Date()
      },
      {
        id : 'd2f95bbe-159b-4447-9e07-33925e04c5e9',
        name: 'Fishing',
        description: 'Fishing',
        active: true,
        created_by: JSON.stringify({
          type : "seeder",
          id : "",
          description : "Seeder create master logType"
        }),
        created_at: new Date()
      },
      {
        id : '59cfbb65-efff-4d25-aae1-b439efa62188',
        name: 'Mini Golf',
        description: 'Mini Golf',
        active: true,
        created_by: JSON.stringify({
          type : "seeder",
          id : "",
          description : "Seeder create master logType"
        }),
        created_at: new Date()
      },
      {
        id: 'b648ff73-468f-45cb-bbbc-fd3659e4b8ac',
        name: 'Basketball Court',
        description: 'Basketball Court',
        active: true,
        created_by: JSON.stringify({
          type : "seeder",
          id : "",
          description : "Seeder create master logType"
        }),
        created_at: new Date()
      }
    ], {});
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('sports', null, {});
  }
};
