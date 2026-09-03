`use strict`

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.sequelize.query(`CREATE EXTENSION IF NOT EXISTS "uuid-ossp";`)
    .then(() => {
      return queryInterface.createTable(`transaction_creators`, {
        id: {
          type: Sequelize.UUID,
          defaultValue: Sequelize.literal('uuid_generate_v4()'),
          allowNull: false,
          primaryKey: true
        },
        creator_status_id: {
            type: Sequelize.UUID,
            allowNull: false,
        },
        creator_type_id: {
          type: Sequelize.UUID,
          allowNull: false,
        },
        user_id: {
            type: Sequelize.UUID,
            allowNull: false,
        },
        file: {
          type: Sequelize.JSONB,
        },
        data: {
          type: Sequelize.JSONB,
          defaultValue : {}
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
          allowNull: true,
        },
        deleted_by: {
            type: Sequelize.JSONB,
            allowNull: true,
          },
        created_at: {
          allowNull: false,
          type: Sequelize.DATE
        },
        updated_at: {
          allowNull: false,
          type: Sequelize.DATE,
          allowNull: true,
        },
        deleted_at: {
            allowNull: false,
            type: Sequelize.DATE,
            allowNull: true,
          }
      })
    })
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable(`transaction_creators`)
  }
}
