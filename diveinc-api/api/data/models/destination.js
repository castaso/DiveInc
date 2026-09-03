"use strict";
module.exports = (sequelize, DataTypes) => {
  let Model = sequelize.define("destination",
    {
      country_id: DataTypes.UUID,
      name: DataTypes.STRING,
      tag_line: DataTypes.STRING,
      description: DataTypes.TEXT,
      introduction: DataTypes.TEXT,
      highlight: DataTypes.JSONB,
      image_background: DataTypes.JSONB,
      image_showing: DataTypes.JSONB,
      image_galery: DataTypes.JSONB,
      about: DataTypes.TEXT,
      more_about: DataTypes.JSONB,
      more_info: DataTypes.JSONB,
      article: DataTypes.TEXT,
      active: DataTypes.BOOLEAN,
      created_by: DataTypes.JSONB,
      updated_by: DataTypes.JSONB,
      deleted_by: DataTypes.JSONB,
      created_at: DataTypes.DATE,
      updated_at: DataTypes.DATE,
      deleted_at: DataTypes.DATE
    },
    {
      tableName: "destinations",
      underscored: true
    }
  );
  Model.associate = function(models) {
    Model.belongsTo(models.country, { foreignKey: "country_id" });
    Model.hasMany(models.sub_destination, { foreignKey: 'destination_id'});
  };
  return Model;
};
