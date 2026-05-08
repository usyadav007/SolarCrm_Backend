module.exports = (sequelize, DataTypes) => {
    const Payment = sequelize.define("Payment", {
      id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
      invoice_id: DataTypes.INTEGER,
      amount: DataTypes.FLOAT,
      payment_mode: DataTypes.STRING,
      payment_date: DataTypes.DATE,
      notes: DataTypes.TEXT
    }, {
      tableName: "payments",
      timestamps: false
    });
  
    return Payment;
  };