'use strict';
module.exports = (sequelize, DataTypes) => {
  var Model = sequelize.define('liveaboard', {
    user_id: DataTypes.UUID,
    profile: DataTypes.JSONB,
    highlight: DataTypes.JSONB,
    photos: DataTypes.JSONB,
    amenities: DataTypes.JSONB,
    unavailable_dates: DataTypes.JSONB,
    publish: DataTypes.BOOLEAN,
    active: DataTypes.BOOLEAN,
    created_by: DataTypes.JSONB,
    updated_by: DataTypes.JSONB,
    deleted_by: DataTypes.JSONB,
    created_at: DataTypes.DATE,
    updated_at: DataTypes.DATE,
    deleted_at: DataTypes.DATE
  }, {
    tableName : 'liveaboards',
    underscored: true,
  });
  Model.associate = function(models) {
    Model.hasMany(models.room, { foreignKey: 'parent_id'});
    Model.hasMany(models.package, { foreignKey: 'parent_id'});
    Model.belongsTo(models.user, { foreignKey: 'user_id'});
    Model.hasMany(models.transaction_liveaboard, { foreignKey: 'liveaboard_id'});
  };
  return Model;
};
