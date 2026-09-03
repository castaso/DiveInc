`use strict`

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.sequelize.query(`CREATE EXTENSION IF NOT EXISTS "uuid-ossp";`)
    .then(() => {
      return queryInterface.createTable(`liveaboards`, {
        id: {
          type: Sequelize.UUID,
          defaultValue: Sequelize.literal('uuid_generate_v4()'),
          allowNull: false,
          primaryKey: true
        },
        user_id: {
          type: Sequelize.UUID,
          allowNull: false,
        },
        profile: {
          type: Sequelize.JSONB,
          allowNull: false,
        },
        highlight: {
            type: Sequelize.JSONB,
            allowNull: false,
        },
        photos: {
            type: Sequelize.JSONB,
            allowNull: false,
        },
        amenities: {
            type: Sequelize.JSONB,
            allowNull: false,
        },
        publish: {
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
          allowNull: false,
          type: Sequelize.DATE
        },
        updated_at: {
          allowNull: false,
          type: Sequelize.DATE,
          allowNull: true
        },
        deleted_at: {
            allowNull: false,
            type: Sequelize.DATE,
            allowNull: true
          }
      })
    })
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable(`liveaboards`)
  }
}
