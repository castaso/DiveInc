'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert('transaction_divecenter_statuses', [
      {
        id : 'c7999dce-19b7-4bfd-84cc-d2f0845a3d86',
        name: 'Created',
        description: 'Created',
        active: true,
        created_by: JSON.stringify({
          type : "seeder",
          id : "",
          description : "Seeder create master logType"
        }),
        created_at: new Date()
      },
      {
        id: 'bbb8ff73-468f-45cb-babc-fd3444e4b8ac',
        name: 'Approved',
        description: 'Approved',
        active: true,
        created_by: JSON.stringify({
          type : "seeder",
          id : "",
          description : "Seeder create master logType"
        }),
        created_at: new Date()
      },
      {
        id: 'bcc8ff73-468f-45cb-babc-fd34cce4b8ac',
        name: 'Rejected',
        description: 'Rejected',
        active: true,
        created_by: JSON.stringify({
          type : "seeder",
          id : "",
          description : "Seeder create master logType"
        }),
        created_at: new Date()
      },
      {
        id: 'bcc8ff37-468f-45cb-bccc-fd34cce4b8ac',
        name: 'Transfered',
        description: 'Transfered',
        active: true,
        created_by: JSON.stringify({
          type : "seeder",
          id : "",
          description : "Seeder create master logType"
        }),
        created_at: new Date()
      },
      {
        id: 'bccf8f37-486f-45cb-ccbc-fd34cce4b8ac',
        name: 'Admin Approval',
        description: 'Admin Approval',
        active: true,
        created_by: JSON.stringify({
          type : "seeder",
          id : "",
          description : "Seeder create master logType"
        }),
        created_at: new Date()
      },
      {
        id: 'baa8ff37-468f-45cb-bccc-fd34aae4b8ac',
        name: 'Done',
        description: 'Done',
        active: true,
        created_by: JSON.stringify({
          type : "seeder",
          id : "",
          description : "Seeder create master logType"
        }),
        created_at: new Date()
      },
      {
        id: 'baa8ff37-468f-455b-b5c5-fc34aae4b8ac',
        name: 'Canceled',
        description: 'Canceled',
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
    return queryInterface.bulkDelete('transaction_divecenter_statuses', null, {});
  }
};
