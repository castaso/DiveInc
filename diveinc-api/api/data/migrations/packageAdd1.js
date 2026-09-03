'use strict';

module.exports = {
  up: function (queryInterface, Sequelize) {
    return queryInterface.addColumn(
      'packages',
      'room_liveaboard',
      {
        type: Sequelize.JSONB,
        allowNull: true
      }
    )
  },

  down: function (queryInterface, Sequelize) {
    return queryInterface.removeColumn('packages', 'room_liveaboard')
  }
};