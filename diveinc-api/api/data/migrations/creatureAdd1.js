'use strict';

module.exports = {
  up: function (queryInterface, Sequelize) {
    return queryInterface.addColumn(
      'creatures',
      'article_id',
      {
        type: Sequelize.UUID,
        allowNull: true,
        defaultValue: null
      }
    )
  },

  down: function (queryInterface, Sequelize) {
    return queryInterface.removeColumn('creatures', 'article_id')
  }
};