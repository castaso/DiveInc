'use strict';
module.exports = (sequelize, DataTypes) => {
  var Model = sequelize.define('general', {
    version: DataTypes.STRING,
    divecenter_fee: DataTypes.INTEGER,
    liveaboard_fee: DataTypes.INTEGER,
    resort_fee: DataTypes.INTEGER,
    active: DataTypes.BOOLEAN,
    created_by: DataTypes.JSONB,
    updated_by: DataTypes.JSONB,
    deleted_by: DataTypes.JSONB,
    created_at: DataTypes.DATE,
    updated_at: DataTypes.DATE,
    deleted_at: DataTypes.DATE
  }, {
    tableName : 'generals',
    underscored: true,
  });
  Model.associate = function(models) {
  };
  return Model;
};
