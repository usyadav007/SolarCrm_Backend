module.exports = (sequelize, DataTypes) => {
    const Quotation = sequelize.define("Quotation", {
      id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
      lead_id: DataTypes.INTEGER,
      survey_id: DataTypes.INTEGER,
      system_size: DataTypes.STRING,
      price_per_kw: DataTypes.FLOAT,
      total_amount: DataTypes.FLOAT,
      subsidy: DataTypes.FLOAT,
      final_amount: DataTypes.FLOAT,
      status: {
        type: DataTypes.STRING,
        defaultValue: "draft"
      },
      valid_till: DataTypes.DATE,
      notes: DataTypes.TEXT,
      created_at: DataTypes.DATE
    }, {
      tableName: "quotations",
      timestamps: false
    });
  
    return Quotation;
  };