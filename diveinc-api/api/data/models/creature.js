"use strict";
module.exports = (sequelize, DataTypes) => {
  let Model = sequelize.define("creature",
    {
      article_id: DataTypes.UUID,
      name: DataTypes.STRING,
      description: DataTypes.TEXT,
      introduction: DataTypes.TEXT,
      image_background: DataTypes.JSONB,
      image_icon: DataTypes.JSONB,
      active: DataTypes.BOOLEAN,
      created_by: DataTypes.JSONB,
      updated_by: DataTypes.JSONB,
      deleted_by: DataTypes.JSONB,
      created_at: DataTypes.DATE,
      updated_at: DataTypes.DATE,
      deleted_at: DataTypes.DATE
    },
    {
      tableName: "creatures",
      underscored: true
    }
  );
  Model.associate = function(models) {
    Model.belongsTo(models.article, { foreignKey: 'article_id'});
  };
  return Model;
};
