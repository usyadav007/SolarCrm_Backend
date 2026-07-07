const { DataTypes } = require("sequelize");

module.exports = (sequelize) => {

  const PurchaseItem = sequelize.define(
    "PurchaseItem",
    {

      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },

      purchase_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },

      product_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },

      quantity: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },

      unit_price: {
        type: DataTypes.DECIMAL(12,2),
        allowNull: false,
      },

      total_price: {
        type: DataTypes.DECIMAL(12,2),
        allowNull: false,
      }

    },
    {
      tableName: "purchase_items",
      timestamps: false,
    }
  );

  return PurchaseItem;
};