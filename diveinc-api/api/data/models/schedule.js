'use strict';
module.exports = (sequelize, DataTypes) => {
  var Model = sequelize.define('schedule', {
    parent_id: DataTypes.UUID,
    schedule_status_id: DataTypes.UUID,
    schedule_date: DataTypes.STRING,
    active: DataTypes.BOOLEAN,
    created_by: DataTypes.JSONB,
    updated_by: DataTypes.JSONB,
    deleted_by: DataTypes.JSONB,
    created_at: DataTypes.DATE,
    updated_at: DataTypes.DATE,
    deleted_at: DataTypes.DATE
  }, {
    tableName : 'schedules',
    underscored: true,
  });
  Model.associate = function(models) {
    Model.belongsTo(models.schedule_status, { foreignKey: 'schedule_status_id'});
    Model.belongsTo(models.package, { foreignKey: 'parent_id'});
  };
  return Model;
};
