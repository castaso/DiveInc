'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert('log_types', [
      {
        id : 'c7198dce-19b7-4bfd-84cc-d2f0845a3d86',
        name: 'Public',
        description: 'Dapat dilihat oleh siapapun',
        active: true,
        created_by: JSON.stringify({
          type : "seeder",
          id : "",
          description : "Seeder create master logType"
        }),
        created_at: new Date()
      },
      {
        id : 'd2f95b1e-159b-4d47-9e07-33925e04c5e9',
        name: 'Private',
        description: 'Hanya dapat dilihat oleh pribadi',
        active: true,
        created_by: JSON.stringify({
          type : "seeder",
          id : "",
          description : "Seeder create master logType"
        }),
        created_at: new Date()
      },
      {
        id : '59cfab65-e7cf-4d25-aae1-b439efa62188',
        name: 'System',
        description: 'Hanya tercatat oleh system',
        active: true,
        created_by: JSON.stringify({
          type : "seeder",
          id : "",
          description : "Seeder create master logType"
        }),
        created_at: new Date()
      },
      {
        id: 'b6480f73-468f-45cb-b7dc-fd3659e4b8ac',
        name: 'Division',
        description: 'Dilihat oleh sekelompok tertentu yang satu divisi',
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
    return queryInterface.bulkDelete('log_types', null, {});
  }
};
