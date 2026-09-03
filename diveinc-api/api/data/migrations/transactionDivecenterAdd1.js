'use strict';

module.exports = {
  up: function (queryInterface, Sequelize) {
    return queryInterface.addColumn(
      'transaction_divecenters',
      'begin_time',
      {
        type: Sequelize.DATE,
        allowNull: true
      }
    )
  },

  down: function (queryInterface, Sequelize) {
    return queryInterface.removeColumn('transaction_divecenters', 'begin_time')
  }
};