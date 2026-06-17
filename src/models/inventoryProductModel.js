module.exports = (sequelize, DataTypes) => {

    const InventoryProduct = sequelize.define(
      "InventoryProduct",
      {
        id: {
          type: DataTypes.INTEGER,
          autoIncrement: true,
          primaryKey: true
        },
  
        category_id: {
          type: DataTypes.INTEGER,
          allowNull: false
        },
  
        product_name: {
          type: DataTypes.STRING,
          allowNull: false
        },
  
        sku: {
          type: DataTypes.STRING,
          allowNull: true,
          unique: true
        },
  
        unit: {
          type: DataTypes.STRING,
          allowNull: false
        },
  
        min_stock: {
          type: DataTypes.INTEGER,
          defaultValue: 0
        },
  
        current_stock: {
          type: DataTypes.INTEGER,
          defaultValue: 0
        },
  
        status: {
          type: DataTypes.ENUM(
            "active",
            "inactive"
          ),
          defaultValue: "active"
        }
      },
      {
        tableName: "inventory_products",
        timestamps: true,
        createdAt: "created_at",
        updatedAt: "updated_at"
      }
    );
  
    return InventoryProduct;
  };