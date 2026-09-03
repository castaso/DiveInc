'use strict';
module.exports = (sequelize, DataTypes) => {
  var Model = sequelize.define('transaction_creator', {
    creator_status_id: DataTypes.UUID,
    creator_type_id: DataTypes.UUID,
    user_id: DataTypes.UUID,
    file: DataTypes.JSONB,
    data: DataTypes.JSONB,
    active: DataTypes.BOOLEAN,
    created_by: DataTypes.JSONB,
    updated_by: DataTypes.JSONB,
    deleted_by: DataTypes.JSONB,
    created_at: DataTypes.DATE,
    updated_at: DataTypes.DATE,
    deleted_at: DataTypes.DATE
  }, {
    tableName : 'transaction_creators',
    underscored: true,
  });
  Model.associate = function(models) {
    Model.belongsTo(models.creator_status, { foreignKey: 'creator_status_id'});
    Model.belongsTo(models.creator_type, { foreignKey: 'creator_type_id'});
    Model.belongsTo(models.user, { foreignKey: 'user_id'});
  };
  return Model;
};
