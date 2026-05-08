module.exports = (sequelize, DataTypes) => {
    const Customer = sequelize.define("Customer", {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
  
      name: {
        type: DataTypes.STRING,
        allowNull: true
      },
  
      email: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          isEmail: true
        }
      },
  
      phone: {
        type: DataTypes.STRING,
        allowNull: false
      },
  
      status: {
        type: DataTypes.STRING,
        defaultValue: "active"
      },
  
      created_at: {
        type: DataTypes.DATE
      }
  
    }, {
      tableName: "customers",
      timestamps: false
    });
  
    return Customer;
  };