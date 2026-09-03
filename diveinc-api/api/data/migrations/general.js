`use strict`

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.sequelize.query(`CREATE EXTENSION IF NOT EXISTS "uuid-ossp";`)
    .then(() => {
      return queryInterface.createTable(`generals`, {
        id: {
          type: Sequelize.UUID,
          defaultValue: Sequelize.literal('uuid_generate_v4()'),
          allowNull: false,
          primaryKey: true
        },
        version: {
          type: Sequelize.STRING,
          allowNull: false,
        },
        divecenter_fee: {
          type: Sequelize.INTEGER,
          allowNull: false,
        },
        liveaboard_fee: {
          type: Sequelize.INTEGER,
          allowNull: false,
        },
        resort_fee: {
          type: Sequelize.INTEGER,
          allowNull: false,
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
    return queryInterface.dropTable(`generals`)
  }
}
