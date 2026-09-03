`use strict`;

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.sequelize
      .query(`CREATE EXTENSION IF NOT EXISTS "uuid-ossp";`)
      .then(() => {
        return queryInterface.createTable(`users`, {
          id: {
            type: Sequelize.UUID,
            defaultValue: Sequelize.literal("uuid_generate_v4()"),
            allowNull: false,
            primaryKey: true
          },
          user_id: {
            type: Sequelize.STRING,
            allowNull: false,
            unique: true
          },
          parent_id: {
            type: Sequelize.UUID,
            allowNull: true
          },
          role_id: {
            type: Sequelize.UUID,
            allowNull: false
          },
          data_register: {
            type: Sequelize.JSONB,
            allowNull: false
          },
          data_login: {
            type: Sequelize.JSONB,
            defaultValue: []
          },
          profile: {
            type: Sequelize.JSONB
          },
          verify: {
            type: Sequelize.BOOLEAN,
            defaultValue: false
          },
          subscribe: {
            type: Sequelize.BOOLEAN,
            defaultValue: false
          },
          active: {
            type: Sequelize.BOOLEAN,
            defaultValue: true
          },
          created_by: {
            type: Sequelize.JSONB
          },
          updated_by: {
            type: Sequelize.JSONB,
            allowNull: true
          },
          deleted_by: {
            type: Sequelize.JSONB,
            allowNull: true
          },
          created_at: {
            type: Sequelize.DATE
          },
          updated_at: {
            type: Sequelize.DATE,
            allowNull: true
          },
          deleted_at: {
            type: Sequelize.DATE,
            allowNull: true
          }
        });
      });
  },
  down: queryInterface => {
    return queryInterface.dropTable(`users`);
  }
};
