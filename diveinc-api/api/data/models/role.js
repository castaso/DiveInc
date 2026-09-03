'use strict';
module.exports = (sequelize, DataTypes) => {
  var Model = sequelize.define('role', {
    parent_id: DataTypes.UUID,
    name: DataTypes.STRING,
    description: DataTypes.TEXT,
    approver: DataTypes.BOOLEAN,
    active: DataTypes.BOOLEAN,
    created_by: DataTypes.JSONB,
    updated_by: DataTypes.JSONB,
    deleted_by: DataTypes.JSONB,
    created_at: DataTypes.DATE,
    updated_at: DataTypes.DATE,
    deleted_at: DataTypes.DATE
  }, {
    tableName : 'roles',
    underscored: true,
  });
  Model.associate = function(models) {
    Model.hasMany(models.user, { foreignKey: 'role_id'});
  };
  return Model;
};
