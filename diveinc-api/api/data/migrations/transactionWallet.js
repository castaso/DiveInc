`use strict`

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.sequelize.query(`CREATE EXTENSION IF NOT EXISTS "uuid-ossp";`)
    .then(() => {
      return queryInterface.createTable(`transaction_wallets`, {
        id: {
          type: Sequelize.UUID,
          defaultValue: Sequelize.literal('uuid_generate_v4()'),
          allowNull: false,
          primaryKey: true
        },
        transaction_wallet_status_id: {
            type: Sequelize.UUID,
            allowNull: false,
        },
        user_id: {
            type: Sequelize.UUID,
            allowNull: false,
        },
        type: {
          type: Sequelize.STRING,
          allowNull: false,
        },
        total: {
            type: Sequelize.FLOAT,
            allowNull: false,
        },
        xendit_fee: {
            type: Sequelize.JSONB
        },
        total_withdrawl: {
            type: Sequelize.FLOAT,
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
    return queryInterface.dropTable(`transaction_wallets`)
  }
}
