'use strict';

module.exports = {
  up: function (queryInterface, Sequelize) {
    return queryInterface.addColumn(
      'liveaboards',
      'unavailable_dates',
      {
        type: Sequelize.JSONB,
        defaultValue : []
      }
    )
  },

  down: function (queryInterface, Sequelize) {
    return queryInterface.removeColumn('liveaboards', 'unavailable_dates')
  }
};