'use strict';
module.exports = (sequelize, DataTypes) => {
  var Model = sequelize.define('country', {
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
    tableName : 'countries',
    underscored: true,
  });
  Model.associate = function(models) {
    Model.hasMany(models.city, { foreignKey: 'country_id'});
    Model.hasMany(models.destination, { foreignKey: 'country_id'});
  };
  return Model;
};
