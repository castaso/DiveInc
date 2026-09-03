'use strict';
module.exports = (sequelize, DataTypes) => {
  var Model = sequelize.define('log_type', {
    name: DataTypes.STRING,
    description: DataTypes.TEXT,
    active: DataTypes.BOOLEAN,
    created_by: DataTypes.JSONB,
    updated_by: DataTypes.JSONB,
    deleted_by: DataTypes.JSONB,
    created_at: DataTypes.DATE,
    updated_at: DataTypes.DATE,
    deleted_at: DataTypes.DATE
  }, {
    tableName : 'log_types',
    underscored: true,
  });
  Model.associate = function(models) {
    Model.hasMany(models.log_activity, { foreignKey: 'log_type_id'});
  };
  return Model;
};
