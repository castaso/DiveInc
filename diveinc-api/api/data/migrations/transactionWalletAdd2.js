'use strict';

module.exports = {
  up: function (queryInterface, Sequelize) {
    return queryInterface.addColumn(
      'transaction_wallets',
      'user_data',
      {
        type: Sequelize.JSONB,
        allowNull: false
      }
    )
  },

  down: function (queryInterface, Sequelize) {
    return queryInterface.removeColumn('transaction_wallets', 'user_data')
  }
};