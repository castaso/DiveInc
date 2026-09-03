'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert('roles', [{
      id: "0c509e4d-2f74-4822-8a5a-2264fe2d31fc",
      name: 'God-Dev',
      description: 'Role yang hanya dimiliki oleh satu orang yaitu developer',
      approver: true,
      active: true,
      created_by: JSON.stringify({
        type : "seeder",
        id : "",
        description : "Seeder create first role"
      }),
      created_at: new Date()
    },{
      id: "0c509ed4-2f47-4822-8aa5-2264fe2d31cf",
      parent_id : "0c509e4d-2f74-4822-8a5a-2264fe2d31fc",
      name: 'Super-Admin',
      description: 'Role yang bisa mengakses semua file',
      approver: true,
      active: true,
      created_by: JSON.stringify({
        type : "seeder",
        id : "",
        description : "Seeder create second role"
      }),
      created_at: new Date()
    },{
        id: "0c509ed4-f274-2284-85aa-2264fe2d31cf",
        parent_id : "0c509ed4-2f47-4822-8aa5-2264fe2d31cf",
        name: 'Admin',
        description: 'Role admin namun perlu approver',
        approver: false,
        active: true,
        created_by: JSON.stringify({
          type : "seeder",
          id : "",
          description : "Seeder create second role"
        }),
        created_at: new Date()
      },{
        id: "c5009ed4-2f47-4822-8aa5-2264fe2dcf13",
        name: 'User-Website',
        description: 'Role yang bisa login kedalam website diveinc',
        approver: false,
        active: true,
        created_by: JSON.stringify({
          type : "seeder",
          id : "",
          description : "Seeder create second role"
        }),
        created_at: new Date()
      }], {});
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('roles', null, {});
  }
};
