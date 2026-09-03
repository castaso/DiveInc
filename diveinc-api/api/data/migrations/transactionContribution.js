`use strict`

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.sequelize.query(`CREATE EXTENSION IF NOT EXISTS "uuid-ossp";`)
    .then(() => {
      return queryInterface.createTable(`transaction_contributions`, {
        id: {
          type: Sequelize.UUID,
          defaultValue: Sequelize.literal('uuid_generate_v4()'),
          allowNull: false,
          primaryKey: true
        },
        transaction_contribution_status_id: {
            type: Sequelize.UUID,
            allowNull: false,
        },
        transaction_code: {
          type: Sequelize.TEXT
        },
        contribution_id: {
          type: Sequelize.UUID
        },
        customer_id: {
            type: Sequelize.UUID
        },
        package_data: {
            type: Sequelize.JSONB
        },
        payment_method: {
            type: Sequelize.JSONB
        },
        total_price: {
            type: Sequelize.FLOAT
        },
        xendit_fee: {
            type: Sequelize.JSONB
        },
        total_money_income: {
            type: Sequelize.FLOAT
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
    return queryInterface.dropTable(`transaction_contributions`)
  }
}
