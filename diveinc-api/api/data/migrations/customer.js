`use strict`;

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.sequelize
      .query(`CREATE EXTENSION IF NOT EXISTS "uuid-ossp";`)
      .then(() => {
        return queryInterface.createTable(`customers`, {
          id: {
            type: Sequelize.UUID,
            defaultValue: Sequelize.literal("uuid_generate_v4()"),
            allowNull: false,
            primaryKey: true
          },
          user_id: {
            type: Sequelize.UUID,
            allowNull: true,
          },
          profile: {
            type: Sequelize.JSONB
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
    return queryInterface.dropTable(`customers`);
  }
};
