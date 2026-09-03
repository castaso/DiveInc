'use strict';
module.exports = (sequelize, DataTypes) => {
  var Model = sequelize.define('log_activity', {
    log_type_id: DataTypes.UUID,
    name: DataTypes.STRING,
    description: DataTypes.TEXT,
    data_log: DataTypes.JSONB,
    active: DataTypes.BOOLEAN,
    created_by: DataTypes.JSONB,
    updated_by: DataTypes.JSONB,
    deleted_by: DataTypes.JSONB,
    created_at: DataTypes.DATE,
    updated_at: DataTypes.DATE,
    deleted_at: DataTypes.DATE
  }, {
    tableName : 'log_activities',
    underscored: true,
  });
  Model.associate = function(models) {
    Model.belongsTo(models.log_type, { foreignKey: 'log_type_id' });
  };
  return Model;
};
