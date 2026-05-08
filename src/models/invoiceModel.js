module.exports = (sequelize, DataTypes) => {
    const Invoice = sequelize.define("Invoice", {
      id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
      lead_id: DataTypes.INTEGER,
      installation_id: DataTypes.INTEGER,
      total_amount: DataTypes.FLOAT,
      paid_amount: {
        type: DataTypes.FLOAT,
        defaultValue: 0
      },
      due_amount: DataTypes.FLOAT,
      status: {
        type: DataTypes.STRING,
        defaultValue: "pending" // pending, partial, paid
      },
      created_at: DataTypes.DATE
    }, {
      tableName: "invoices",
      timestamps: false
    });
  
    return Invoice;
  };