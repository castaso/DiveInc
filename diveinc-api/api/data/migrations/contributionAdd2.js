'use strict';

module.exports = {
  up: function (queryInterface, Sequelize) {
    return queryInterface.addColumn(
      'contributions',
      'documents',
      {
        type: Sequelize.JSONB
      }
    )
  },

  down: function (queryInterface, Sequelize) {
    return queryInterface.removeColumn('contributions', 'documents')
  }
};