`use strict`

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.sequelize.query(`CREATE EXTENSION IF NOT EXISTS "uuid-ossp";`)
    .then(() => {
      return queryInterface.createTable(`destinations`, {
        id: {
          type: Sequelize.UUID,
          defaultValue: Sequelize.literal('uuid_generate_v4()'),
          allowNull: false,
          primaryKey: true
        },
        country_id: {
            type: Sequelize.UUID,
            allowNull: false
        },
        name: {
          type: Sequelize.STRING,
          allowNull: false,
        },
        tag_line: {
            type: Sequelize.STRING,
            allowNull: false,
        },
        description: {
          type: Sequelize.TEXT,
          allowNull: false,
        },
        introduction: {
            type: Sequelize.TEXT,
            allowNull: false,
        },
        highlight: {
            type: Sequelize.JSONB,
            defaultValue : []
        },
        image_background: {
            type: Sequelize.JSONB,
            defaultValue : []
        },
        image_showing: {
            type: Sequelize.JSONB,
            defaultValue : []
        },
        image_galery: {
            type: Sequelize.JSONB,
            defaultValue : []
        },
        about: {
          type: Sequelize.TEXT,
          allowNull : true
        },
        more_about: {
            type: Sequelize.JSONB,
            defaultValue : []
        },
        more_info: {
            type: Sequelize.JSONB,
            defaultValue : []
        },
        article: {
            type: Sequelize.TEXT,
            allowNull : true
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
    return queryInterface.dropTable(`destinations`)
  }
}
