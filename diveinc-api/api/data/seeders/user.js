"use strict";

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert(
      "users",
      [
        {
          id: "56d2d603-4db9-4569-8f33-031a0713bc68",
          user_id: "SA-001",
          role_id: "0c509ed4-2f47-4822-8aa5-2264fe2d31cf",
          data_register: JSON.stringify({
            data: {
              email: "superadmin1@gmail.com",
              password: "ef797c8118f02dfb649607dd5d3f8c7623048c9c063d532cc95c5ed7a898a64f"
            },
            type: "email"
          }),
          profile: JSON.stringify({
            name: {
              last_name: "Super",
              first_name: "Admin 1"
            },
            picture: {
              url: "https://mediaproxy.salon.com/width/1200/height/1200/https://media.salon.com/2019/04/suprised-man.jpg",
              path: "width/1200/height/1200/https://media.salon.com/2019/04/suprised-man.jpg",
              baseUrl: "https://mediaproxy.salon.com/"
            },
            contact: {
              email : "superadmin1@gmail.com",
              recovery_email : "recovery@gmail.com",
              phone : "085315240990"
            },
            address: {
              street: "Jl Guntursari No 4",
              village : "Turangga",
              subdistrict: "Lengkong",
              postal_code: "40264",
              city: "Bandung",
              province: "Jawa barat",
              region : "Indonesia",
              latitude : 0.000000,
              longitude : 0.00000
            },
            wallet: {
              balance : 5000000,
              bank_id : "0c509ed4-2222-4444-5555-2264fe2d31cf",
              bank_name : "Bank Central Asia (BCA)",
              account_number : "7771319703",
              account_name : "Bagus Setiadi"
            },
            utility : {
              currency : "IDR",
              language : "English"
            },
            permission : [
              {
                type : "resort",
                creator_type_id : "c7199dce-19b7-4bfd-84cc-d2f0845a3d86",
                creator_status_id : "c7199dce-19b7-4bfd-84cc-d2f0845a3d86",
                data : []
              },
              {
                type : "liveaboards",
                creator_type_id : "d2f95bbe-159b-4d47-9e07-33925e04c5e9",
                creator_status_id : "c7199dce-19b7-4bfd-84cc-d2f0845a3d86",
                data : []
              },
              {
                type : "divecenter",
                creator_type_id : "59cfbb65-e7cf-4d25-aae1-b439efa62188",
                creator_status_id : "c7199dce-19b7-4bfd-84cc-d2f0845a3d86",
                data : []
              },
              {
                type : "contribution",
                creator_type_id : "b648ff73-468f-45cb-b7dc-fd3659e4b8ac",
                creator_status_id : "c7199dce-19b7-4bfd-84cc-d2f0845a3d86",
                data : []
              }
            ],
            is_complete : true
          }),
          verify: true,
          subscribe: true,
          active: true,
          created_at: new Date(),
          created_by: JSON.stringify({
            id: "",
            type: "seeder",
            description: "Create user by seeder"
          })
        },
        {
          id: "56d2d603-bbbb-6666-3333-031a0713bc68",
          user_id: "A-001",
          parent_id: "56d2d603-4db9-4569-8f33-031a0713bc68",
          role_id: "0c509ed4-f274-2284-85aa-2264fe2d31cf",
          data_register: JSON.stringify({
            data: {
              email: "admin1@gmail.com",
              password: "ef797c8118f02dfb649607dd5d3f8c7623048c9c063d532cc95c5ed7a898a64f"
            },
            type: "email"
          }),
          profile: JSON.stringify({
            name: {
              last_name: "Super",
              first_name: "Admin 1"
            },
            picture: {
              url: "https://mediaproxy.salon.com/width/1200/height/1200/https://media.salon.com/2019/04/suprised-man.jpg",
              path: "width/1200/height/1200/https://media.salon.com/2019/04/suprised-man.jpg",
              baseUrl: "https://mediaproxy.salon.com/"
            },
            contact: {
              email : "superadmin1@gmail.com",
              recovery_email : "recovery@gmail.com",
              phone : "085315240990"
            },
            address: {
              street: "Jl Guntursari No 4",
              village : "Turangga",
              subdistrict: "Lengkong",
              postal_code: "40264",
              city: "Bandung",
              province: "Jawa barat",
              region : "Indonesia",
              latitude : 0.000000,
              longitude : 0.00000
            },
            wallet: {
              balance : 5000000,
              bank_id : "0c509ed4-2222-4444-5555-2264fe2d31cf",
              bank_name : "Bank Central Asia (BCA)",
              account_number : "7771319703",
              account_name : "Bagus Setiadi"
            },
            utility : {
              currency : "IDR",
              language : "English"
            },
            permission : [
              {
                type : "resort",
                creator_type_id : "c7199dce-19b7-4bfd-84cc-d2f0845a3d86",
                creator_status_id : "c7199dce-19b7-4bfd-84cc-d2f0845a3d86",
                data : []
              },
              {
                type : "liveaboards",
                creator_type_id : "d2f95bbe-159b-4d47-9e07-33925e04c5e9",
                creator_status_id : "c7199dce-19b7-4bfd-84cc-d2f0845a3d86",
                data : []
              },
              {
                type : "divecenter",
                creator_type_id : "59cfbb65-e7cf-4d25-aae1-b439efa62188",
                creator_status_id : "c7199dce-19b7-4bfd-84cc-d2f0845a3d86",
                data : []
              },
              {
                type : "contribution",
                creator_type_id : "b648ff73-468f-45cb-b7dc-fd3659e4b8ac",
                creator_status_id : "c7199dce-19b7-4bfd-84cc-d2f0845a3d86",
                data : []
              }
            ],
            is_complete : true
          }),
          verify: true,
          subscribe: true,
          active: true,
          created_at: new Date(),
          created_by: JSON.stringify({
            id: "",
            type: "seeder",
            description: "Create user by seeder"
          })
        },
        {
          id: "56d2d603-9999-3333-4444-031a0713bc68",
          user_id: "UW-001",
          role_id: "c5009ed4-2f47-4822-8aa5-2264fe2dcf13",
          data_register: JSON.stringify({
            data: {
              email: "userweb1@gmail.com",
              password: "ef797c8118f02dfb649607dd5d3f8c7623048c9c063d532cc95c5ed7a898a64f"
            },
            type: "email"
          }),
          profile: JSON.stringify({
            name: {
              last_name: "Super",
              first_name: "Admin 1"
            },
            picture: {
              url: "https://mediaproxy.salon.com/width/1200/height/1200/https://media.salon.com/2019/04/suprised-man.jpg",
              path: "width/1200/height/1200/https://media.salon.com/2019/04/suprised-man.jpg",
              baseUrl: "https://mediaproxy.salon.com/"
            },
            contact: {
              email : "superadmin1@gmail.com",
              recovery_email : "recovery@gmail.com",
              phone : "085315240990"
            },
            address: {
              street: "Jl Guntursari No 4",
              village : "Turangga",
              subdistrict: "Lengkong",
              postal_code: "40264",
              city: "Bandung",
              province: "Jawa barat",
              region : "Indonesia",
              latitude : 0.000000,
              longitude : 0.00000
            },
            wallet: {
              balance : 5000000,
              bank_id : "0c509ed4-2222-4444-5555-2264fe2d31cf",
              bank_name : "Bank Central Asia (BCA)",
              account_number : "7771319703",
              account_name : "Bagus Setiadi"
            },
            utility : {
              currency : "IDR",
              language : "English"
            },
            permission : [
              {
                type : "resort",
                creator_type_id : "c7199dce-19b7-4bfd-84cc-d2f0845a3d86",
                creator_status_id : "c7199dce-19b7-4bfd-84cc-d2f0845a3d86",
                data : []
              },
              {
                type : "liveaboards",
                creator_type_id : "d2f95bbe-159b-4d47-9e07-33925e04c5e9",
                creator_status_id : "c7199dce-19b7-4bfd-84cc-d2f0845a3d86",
                data : []
              },
              {
                type : "divecenter",
                creator_type_id : "59cfbb65-e7cf-4d25-aae1-b439efa62188",
                creator_status_id : "c7199dce-19b7-4bfd-84cc-d2f0845a3d86",
                data : []
              },
              {
                type : "contribution",
                creator_type_id : "b648ff73-468f-45cb-b7dc-fd3659e4b8ac",
                creator_status_id : "c7199dce-19b7-4bfd-84cc-d2f0845a3d86",
                data : []
              }
            ],
            is_complete : true
          }),
          verify: true,
          subscribe: true,
          active: true,
          created_at: new Date(),
          created_by: JSON.stringify({
            id: "",
            type: "seeder",
            description: "Create user by seeder"
          })
        }
      ],
      {}
    );
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete("users", null, {});
  }
};
