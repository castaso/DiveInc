'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert('schedule_statuses', [
      {
        id : 'c7999dce-19b7-4bfd-84cc-d2f0845a3d86',
        name: 'Open',
        description: 'Open',
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
        name: 'On Going',
        description: 'On Going',
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
        name: 'Close',
        description: 'Close',
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
    return queryInterface.bulkDelete('schedule_statuses', null, {});
  }
};
