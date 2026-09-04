'use strict';
module.exports = (sequelize, DataTypes) => {
  var Model = sequelize.define('transaction_wallet_admin', {
    type: DataTypes.STRING,
    transaction_wallet_admin_status_id: DataTypes.UUID,
    creator_type_id: DataTypes.UUID,
    user_id: DataTypes.UUID,
    parent_id: DataTypes.UUID,
    is_full_payment: DataTypes.BOOLEAN,
    reason: DataTypes.STRING,
    total: DataTypes.FLOAT,
    total_send: DataTypes.FLOAT,
    xendit_fee: DataTypes.JSONB,
    total_withdrawl: DataTypes.FLOAT,
    active: DataTypes.BOOLEAN,
    created_by: DataTypes.JSONB,
    updated_by: DataTypes.JSONB,
    deleted_by: DataTypes.JSONB,
    created_at: DataTypes.DATE,
    updated_at: DataTypes.DATE,
    deleted_at: DataTypes.DATE
  }, {
    tableName : 'transaction_wallet_admins',
    underscored: true,
  });
  Model.associate = function(models) {
    Model.belongsTo(models.transaction_wallet_admin_status, { foreignKey: 'transaction_wallet_admin_status_id'});
    Model.belongsTo(models.creator_type, { foreignKey: 'creator_type_id'});
    Model.belongsTo(models.user, { foreignKey: 'user_id'});
  };
  return Model;
};
