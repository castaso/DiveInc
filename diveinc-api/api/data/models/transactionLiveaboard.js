'use strict';
module.exports = (sequelize, DataTypes) => {
  var Model = sequelize.define('transaction_liveaboard', {
    transaction_liveaboard_status_id: DataTypes.UUID,
    transaction_code: DataTypes.TEXT,
    customer_id: DataTypes.UUID,
    liveaboard_id: DataTypes.UUID,
    package_data: DataTypes.JSONB,
    payment_method: DataTypes.JSONB,
    total_price: DataTypes.FLOAT,
    diveinc_fee: DataTypes.JSONB,
    referal_fee: DataTypes.JSONB,
    xendit_fee: DataTypes.JSONB,
    total_money_income: DataTypes.FLOAT,
    active: DataTypes.BOOLEAN,
    created_by: DataTypes.JSONB,
    updated_by: DataTypes.JSONB,
    deleted_by: DataTypes.JSONB,
    created_at: DataTypes.DATE,
    updated_at: DataTypes.DATE,
    deleted_at: DataTypes.DATE,
    begin_time: DataTypes.DATE
  }, {
    tableName : 'transaction_liveaboards',
    underscored: true,
  });
  Model.associate = function(models) {
    Model.belongsTo(models.transaction_liveaboard_status, { foreignKey: 'transaction_liveaboard_status_id'});
    Model.belongsTo(models.liveaboard, { foreignKey: 'liveaboard_id'});
  };
  return Model;
};
