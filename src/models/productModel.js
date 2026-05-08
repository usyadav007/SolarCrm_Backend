module.exports = (sequelize, DataTypes) => {
    return sequelize.define("Product", {
      id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
      name: DataTypes.STRING,
      category: DataTypes.STRING,
      unit: DataTypes.STRING,
      created_at: DataTypes.DATE
    }, {
      tableName: "products",
      timestamps: false
    });
  };