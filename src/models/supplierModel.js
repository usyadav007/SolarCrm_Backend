module.exports = (sequelize, DataTypes) => {

    const Supplier = sequelize.define(
      "Supplier",
      {
        id: {
          type: DataTypes.INTEGER,
          primaryKey: true,
          autoIncrement: true,
        },
  
        supplier_name: {
          type: DataTypes.STRING(150),
          allowNull: false,
        },
  
        company_name: {
          type: DataTypes.STRING(150),
          allowNull: true,
        },
  
        gst_number: {
          type: DataTypes.STRING(30),
          allowNull: true,
        },
  
        contact_person: {
          type: DataTypes.STRING(100),
          allowNull: true,
        },
  
        phone: {
          type: DataTypes.STRING(20),
          allowNull: false,
        },
  
        email: {
          type: DataTypes.STRING(150),
          allowNull: true,
          validate: {
            isEmail: true,
          },
        },
  
        address: {
          type: DataTypes.TEXT,
          allowNull: true,
        },
  
        city: {
          type: DataTypes.STRING(100),
          allowNull: true,
        },
  
        state: {
          type: DataTypes.STRING(100),
          allowNull: true,
        },
  
        pincode: {
          type: DataTypes.STRING(10),
          allowNull: true,
        },
  
        status: {
          type: DataTypes.ENUM(
            "active",
            "inactive"
          ),
          defaultValue: "active",
        },
  
        created_at: {
          type: DataTypes.DATE,
          defaultValue: DataTypes.NOW,
        },
      },
      {
        tableName: "suppliers",
        timestamps: false,
      }
    );
  
    return Supplier;
  
  };