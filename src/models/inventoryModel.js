module.exports = (sequelize, DataTypes) => {
    return sequelize.define("Inventory", {
      id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
      product_id: DataTypes.INTEGER,
      quantity: DataTypes.FLOAT,
      type: DataTypes.STRING, // in / out
      reference_id: DataTypes.INTEGER,
      created_at: DataTypes.DATE
    }, {
      tableName: "inventory",
      timestamps: false
    });
  };