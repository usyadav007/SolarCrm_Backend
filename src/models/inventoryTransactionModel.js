module.exports = (sequelize, DataTypes) => {

    const InventoryTransaction = sequelize.define(
      "InventoryTransaction",
      {
        id: {
          type: DataTypes.INTEGER,
          autoIncrement: true,
          primaryKey: true
        },
  
        product_id: {
          type: DataTypes.INTEGER,
          allowNull: false
        },
  
        transaction_type: {
          type: DataTypes.ENUM(
            "inward",
            "outward"
          ),
          allowNull: false
        },
  
        quantity: {
          type: DataTypes.INTEGER,
          allowNull: false
        },
  
        installation_id: {
          type: DataTypes.INTEGER,
          allowNull: true
        },
  
        remarks: {
          type: DataTypes.TEXT,
          allowNull: true
        }
      },
      {
        tableName: "inventory_transactions",
        timestamps: true,
        createdAt: "created_at",
        updatedAt: false
      }
    );
  
    return InventoryTransaction;
  };