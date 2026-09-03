'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert('room_options', [
      {
        id : 'c7999dce-19b7-4bfd-84cc-d2f0845a3d86',
        name: 'Bed Type',
        data: JSON.stringify([
            {
                id : "dasn-123684023123",
                name : "Single Bed"
            },
            {
                id : "lksjd-09247238445",
                name : "Twin Bed"
            }
        ]),
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
        name: 'Air Conditioning',
        data: JSON.stringify([
            {
                id : "dasn-949234732",
                name : "Yes"
            },
            {
                id : "lksjd-98234792384",
                name : "No"
            }
        ]),
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
        name: 'Private Bathroom',
        data: JSON.stringify([
            {
                id : "dasn-123684023123",
                name : "Yes"
            },
            {
                id : "lksjd-26283423999",
                name : "No"
            }
        ]),
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
        name: 'WiFi in Room',
        data: JSON.stringify([
            {
                id : "dasn-3274628347293",
                name : "Yes"
            },
            {
                id : "lksjd-4358734958",
                name : "No"
            }
        ]),
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
    return queryInterface.bulkDelete('room_options', null, {});
  }
};
