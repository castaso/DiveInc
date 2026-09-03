'use strict';

module.exports = {
  up: function (queryInterface, Sequelize) {
    return queryInterface.addColumn(
      'contributions',
      'news',
      {
        type: Sequelize.JSONB,
        defaultValue : []
      }
    )
  },

  down: function (queryInterface, Sequelize) {
    return queryInterface.removeColumn('contributions', 'news')
  }
};