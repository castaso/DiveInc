'use strict';

module.exports = {
  up: function (queryInterface, Sequelize) {
    return queryInterface.addColumn(
      'transaction_resorts',
      'begin_time',
      {
        type: Sequelize.DATE,
        allowNull: true
      }
    )
  },

  down: function (queryInterface, Sequelize) {
    return queryInterface.removeColumn('transaction_resorts', 'begin_time')
  }
};