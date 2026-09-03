'use strict';
module.exports = (sequelize, DataTypes) => {
  var Model = sequelize.define('testimoni', {
    user_name: DataTypes.STRING,
    user_images: DataTypes.JSONB,
    rate: DataTypes.INTEGER,
    comment: DataTypes.TEXT,
    active: DataTypes.BOOLEAN,
    created_by: DataTypes.JSONB,
    updated_by: DataTypes.JSONB,
    deleted_by: DataTypes.JSONB,
    created_at: DataTypes.DATE,
    updated_at: DataTypes.DATE,
    deleted_at: DataTypes.DATE
  }, {
    tableName : 'testimonies',
    underscored: true,
  });
  Model.associate = function(models) {
  };
  return Model;
};
