'use strict';
module.exports = (sequelize, DataTypes) => {
  var Model = sequelize.define('room', {
    parent_id: DataTypes.UUID,
    info: DataTypes.JSONB,
    photos: DataTypes.JSONB,
    rules: DataTypes.JSONB,
    price: DataTypes.JSONB,
    service: DataTypes.JSONB,
    publish: DataTypes.BOOLEAN,
    active: DataTypes.BOOLEAN,
    created_by: DataTypes.JSONB,
    updated_by: DataTypes.JSONB,
    deleted_by: DataTypes.JSONB,
    created_at: DataTypes.DATE,
    updated_at: DataTypes.DATE,
    deleted_at: DataTypes.DATE
  }, {
    tableName : 'rooms',
    underscored: true,
  });
  Model.associate = function(models) {
    Model.belongsTo(models.resort, { foreignKey: 'parent_id'});
    Model.belongsTo(models.liveaboard, { foreignKey: 'parent_id'});
  };
  return Model;
};
