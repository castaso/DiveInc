"use strict";
module.exports = (sequelize, DataTypes) => {
  let Model = sequelize.define("user",
    {
      user_id: { type: DataTypes.STRING, unique: true },
      role_id: DataTypes.UUID,
      parent_id: DataTypes.UUID,
      data_register: DataTypes.JSONB,
      data_login: DataTypes.JSONB,
      profile: DataTypes.JSONB,
      verify: DataTypes.BOOLEAN,
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
      tableName: "users",
      underscored: true
    }
  );
  Model.associate = function(models) {
    Model.belongsTo(models.role, { foreignKey: "role_id" });
    Model.hasMany(models.transaction_wallet, { foreignKey: "user_id"});
    Model.hasMany(models.resort, {foreignKey: "user_id"});
    Model.hasMany(models.liveaboard, {foreignKey: "user_id"});
    Model.hasMany(models.divecenter, {foreignKey: "user_id"});
  };
  return Model;
};
