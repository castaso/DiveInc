'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert('creator_statuses', [
      {
        id : 'c7199dce-19b7-4bfd-84cc-d2f0845a3d86',
        name: 'No Access',
        description: 'No Access',
        active: true,
        created_by: JSON.stringify({
          type : "seeder",
          id : "",
          description : "Seeder create master logType"
        }),
        created_at: new Date()
      },
      {
        id : 'd2f95bbe-159b-4d47-9e07-33925e04c5e9',
        name: 'Request',
        description: 'Request',
        active: true,
        created_by: JSON.stringify({
          type : "seeder",
          id : "",
          description : "Seeder create master logType"
        }),
        created_at: new Date()
      },
      {
        id : '59cfbb65-e7cf-4d25-aae1-b439efa62188',
        name: 'Accessed',
        description: 'Accessed',
        active: true,
        created_by: JSON.stringify({
          type : "seeder",
          id : "",
          description : "Seeder create master logType"
        }),
        created_at: new Date()
      },
      {
        id: 'b648ff73-468f-45cb-b7dc-fd3659e4b8ac',
        name: 'Rejected',
        description: 'Rejected',
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
    return queryInterface.bulkDelete('creator_statuses', null, {});
  }
};
