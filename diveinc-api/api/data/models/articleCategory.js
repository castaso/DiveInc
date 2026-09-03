'use strict';
module.exports = (sequelize, DataTypes) => {
  var Model = sequelize.define('article_category', {
    name: DataTypes.STRING,
    images: DataTypes.JSONB,
    description: DataTypes.TEXT,
    active: DataTypes.BOOLEAN,
    created_by: DataTypes.JSONB,
    updated_by: DataTypes.JSONB,
    deleted_by: DataTypes.JSONB,
    created_at: DataTypes.DATE,
    updated_at: DataTypes.DATE,
    deleted_at: DataTypes.DATE
  }, {
    tableName : 'article_categories',
    underscored: true,
  });
  Model.associate = function(models) {
    Model.hasMany(models.article, { foreignKey: 'article_category_id'});
  };
  return Model;
};
