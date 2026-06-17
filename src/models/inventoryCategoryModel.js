module.exports = (sequelize, DataTypes) => {

    const InventoryCategory = sequelize.define(
      "InventoryCategory",
      {
        id: {
          type: DataTypes.INTEGER,
          autoIncrement: true,
          primaryKey: true
        },
  
        name: {
          type: DataTypes.STRING,
          allowNull: false
        },
  
        description: {
          type: DataTypes.TEXT,
          allowNull: true
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
        tableName: "inventory_categories",
        timestamps: true,
        createdAt: "created_at",
        updatedAt: "updated_at"
      }
    );
  
    return InventoryCategory;
  };