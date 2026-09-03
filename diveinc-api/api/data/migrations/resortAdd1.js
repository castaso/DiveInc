'use strict';

module.exports = {
  up: function (queryInterface, Sequelize) {
    return queryInterface.addColumn(
      'resorts',
      'unavailable_dates',
      {
        type: Sequelize.JSONB,
        defaultValue : []
      }
    )
  },

  down: function (queryInterface, Sequelize) {
    return queryInterface.removeColumn('resorts', 'unavailable_dates')
  }
};