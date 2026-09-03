'use strict';
module.exports = (sequelize, DataTypes) => {
  var Model = sequelize.define('package', {
    parent_id: DataTypes.UUID,
    info: DataTypes.JSONB,
    photos: DataTypes.JSONB,
    highlight: DataTypes.JSONB,
    itenary: DataTypes.JSONB,
    price: DataTypes.JSONB,
    room_liveaboard: DataTypes.JSONB,
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
    tableName : 'packages',
    underscored: true,
  });
  Model.associate = function(models) {
    Model.belongsTo(models.resort, { foreignKey: 'parent_id'});
    Model.belongsTo(models.divecenter, { foreignKey: 'parent_id'});
    Model.belongsTo(models.liveaboard, { foreignKey: 'parent_id'});
    Model.hasMany(models.schedule, { foreignKey: 'parent_id'});
  };
  return Model;
};
