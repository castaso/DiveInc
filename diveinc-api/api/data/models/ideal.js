'use strict';
module.exports = (sequelize, DataTypes) => {
  var Model = sequelize.define('ideal', {
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
    tableName : 'ideals',
    underscored: true,
  });
  Model.associate = function(models) {
    //Model.hasMany(models.transaction_wallet, { foreignKey: 'transaction_wallet_status_id'});
  };
  return Model;
};
