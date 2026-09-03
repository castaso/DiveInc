'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert('ideals', [
      {
        id : 'c7999dce-19b7-4bfd-84cc-d2f0845a3d86',
        name: 'Single',
        description: 'Single',
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
        name: 'Couple',
        description: 'Couple',
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
        name: 'Family',
        description: 'Family',
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
        name: 'Group',
        description: 'Group',
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
    return queryInterface.bulkDelete('ideals', null, {});
  }
};
