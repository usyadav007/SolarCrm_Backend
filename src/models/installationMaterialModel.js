module.exports = (
    sequelize,
    DataTypes
  ) => {
  
    return sequelize.define(
  
      "InstallationMaterial",
  
      {
  
        id: {
  
          type: DataTypes.INTEGER,
  
          primaryKey: true,
  
          autoIncrement: true,
  
        },
  
        installation_id: {
  
          type: DataTypes.INTEGER,
  
          allowNull: false,
  
        },
  
        product_id: {
  
          type: DataTypes.INTEGER,
  
          allowNull: false,
  
        },
  
        quantity: {
  
          type: DataTypes.DECIMAL(10,2),
  
          allowNull: false,
  
        },
  
        remarks: {
  
          type: DataTypes.TEXT,
  
        },
  
        issued_by: {
  
          type: DataTypes.INTEGER,
  
        },
  
        issued_date: {
  
          type: DataTypes.DATEONLY,
  
        },
  
      },
  
      {
  
        tableName:
          "installation_materials",
  
        timestamps: true,
  
        createdAt:
          "created_at",
  
        updatedAt:
          "updated_at",
  
      }
  
    );
  
  };