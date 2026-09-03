'use strict';
module.exports = (sequelize, DataTypes) => {
  var Model = sequelize.define('article', {
    article_category_id: DataTypes.UUID,
    name: DataTypes.STRING,
    images: DataTypes.JSONB,
    author: DataTypes.STRING,
    description: DataTypes.TEXT,
    active: DataTypes.BOOLEAN,
    created_by: DataTypes.JSONB,
    updated_by: DataTypes.JSONB,
    deleted_by: DataTypes.JSONB,
    created_at: DataTypes.DATE,
    updated_at: DataTypes.DATE,
    deleted_at: DataTypes.DATE
  }, {
    tableName : 'articles',
    underscored: true,
  });
  Model.associate = function(models) {
    Model.belongsTo(models.article_category, { foreignKey: 'article_category_id'});
    Model.hasMany(models.creature, { foreignKey: 'article_id'});
  };
  return Model;
};
