"use strict";
module.exports = (sequelize, DataTypes) => {
  let Model = sequelize.define("customer",
    {
      user_id: DataTypes.UUID,
      profile: DataTypes.JSONB,
      subscribe: DataTypes.BOOLEAN,
      active: DataTypes.BOOLEAN,
      created_by: DataTypes.JSONB,
      updated_by: DataTypes.JSONB,
      deleted_by: DataTypes.JSONB,
      created_at: DataTypes.DATE,
      updated_at: DataTypes.DATE,
      deleted_at: DataTypes.DATE
    },
    {
      tableName: "customers",
      underscored: true
    }
  );
  Model.associate = function(models) {
    Model.belongsTo(models.user, { foreignKey: "user_id" });
  };
  return Model;
};
