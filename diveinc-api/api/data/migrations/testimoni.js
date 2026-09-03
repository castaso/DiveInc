`use strict`

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.sequelize.query(`CREATE EXTENSION IF NOT EXISTS "uuid-ossp";`)
    .then(() => {
      return queryInterface.createTable(`testimonies`, {
        id: {
          type: Sequelize.UUID,
          defaultValue: Sequelize.literal('uuid_generate_v4()'),
          allowNull: false,
          primaryKey: true
        },
        user_name: {
          type: Sequelize.STRING,
          allowNull: false,
        },
        user_images: {
          type: Sequelize.JSONB,
          allowNull: false,
        },
        rate: {
          type: Sequelize.INTEGER,
          allowNull: false,
        },
        comment: {
          type: Sequelize.TEXT,
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
    return queryInterface.dropTable(`testimonies`)
  }
}
