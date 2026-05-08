module.exports = (sequelize, DataTypes) => {
    const Installation = sequelize.define("Installation", {
      id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
      lead_id: DataTypes.INTEGER,
      quotation_id: DataTypes.INTEGER,
      install_date: DataTypes.DATE,
      technician_id: DataTypes.INTEGER,
      system_size: DataTypes.STRING,
      address: DataTypes.STRING,
      status: {
        type: DataTypes.STRING,
        defaultValue: "scheduled" // scheduled, in_progress, completed
      },
      completion_date: DataTypes.DATE,
      notes: DataTypes.TEXT,
      created_at: DataTypes.DATE
    }, {
      tableName: "installations",
      timestamps: false
    });
  
    return Installation;
  };