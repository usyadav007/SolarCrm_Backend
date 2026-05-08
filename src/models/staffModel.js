const { DataTypes } = require("sequelize");

module.exports = (sequelize) => {
  return sequelize.define("Staffs", {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    name: DataTypes.STRING,
    email: DataTypes.STRING,
    password: DataTypes.STRING,
    role: DataTypes.STRING,
  });
};