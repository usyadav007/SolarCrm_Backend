const { DataTypes } = require("sequelize");

module.exports = (sequelize) => {
  return sequelize.define("Lead", {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    customer_name: DataTypes.STRING,
    phone: DataTypes.STRING,
    city: DataTypes.STRING,
    source: DataTypes.STRING,
    status: {
      type: DataTypes.STRING,
      defaultValue: "new",
    },
    assigned_to: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    customer_id: DataTypes.INTEGER,
   
  });
};