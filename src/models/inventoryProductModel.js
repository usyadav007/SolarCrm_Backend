module.exports = (
    sequelize,
    DataTypes
  ) => {
  
    const InventoryProduct =
      sequelize.define(
        "InventoryProduct",
        {
  
          id: {
            type:
              DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true
          },
  
          category_id: {
            type:
              DataTypes.INTEGER,
            allowNull: false
          },
  
          product_name: {
            type:
              DataTypes.STRING,
            allowNull: false
          },
  
          sku: {
            type:
              DataTypes.STRING,
            unique: true
          },
  
          unit: {
            type:
              DataTypes.STRING,
            defaultValue: "Nos"
          },
  
          current_stock: {
            type:
              DataTypes.INTEGER,
            defaultValue: 0
          },
  
          min_stock: {
            type:
              DataTypes.INTEGER,
            defaultValue: 0
          },
  
          purchase_price: {
            type:
              DataTypes.DECIMAL(12,2),
            defaultValue: 0
          },
  
          selling_price: {
            type:
              DataTypes.DECIMAL(12,2),
            defaultValue: 0
          },
  
          status: {
            type:
              DataTypes.ENUM(
                "active",
                "inactive"
              ),
            defaultValue:
              "active"
          }
  
        },
  
        {
          tableName:
            "inventory_products",
          timestamps: true
        }
      );
  
    return InventoryProduct;
  
  };