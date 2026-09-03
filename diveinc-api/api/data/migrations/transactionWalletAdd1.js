'use strict';

module.exports = {
  up: function (queryInterface, Sequelize) {
    return queryInterface.addColumn(
      'transaction_wallets',
      'creator_type_id',
      {
        type: Sequelize.UUID,
        allowNull: false
      }
    )
  },

  down: function (queryInterface, Sequelize) {
    return queryInterface.removeColumn('transaction_wallets', 'creator_type_id')
  }
};