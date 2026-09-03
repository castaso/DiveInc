'use strict';

module.exports = {
  up: function (queryInterface, Sequelize) {
    return queryInterface.addColumn(
      'divecenters',
      'unavailable_dates',
      {
        type: Sequelize.JSONB,
        defaultValue : []
      }
    )
  },

  down: function (queryInterface, Sequelize) {
    return queryInterface.removeColumn('divecenters', 'unavailable_dates')
  }
};