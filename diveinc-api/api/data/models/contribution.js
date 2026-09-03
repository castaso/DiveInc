'use strict';
module.exports = (sequelize, DataTypes) => {
  var Model = sequelize.define('contribution', {
    user_id: DataTypes.UUID,
    profile: DataTypes.JSONB,
    highlight: DataTypes.JSONB,
    photos: DataTypes.JSONB,
    news: DataTypes.JSONB,
    documents: DataTypes.JSONB,
    publish: DataTypes.BOOLEAN,
    active: DataTypes.BOOLEAN,
    created_by: DataTypes.JSONB,
    updated_by: DataTypes.JSONB,
    deleted_by: DataTypes.JSONB,
    created_at: DataTypes.DATE,
    updated_at: DataTypes.DATE,
    deleted_at: DataTypes.DATE
  }, {
    tableName : 'contributions',
    underscored: true,
  });
  Model.associate = function(models) {
    Model.belongsTo(models.user, { foreignKey: 'user_id'});
    // Model.hasMany(models.transaction_liveaboard, { foreignKey: 'liveaboard_id'});
  };
  return Model;
};
