module.exports = (sequelize, DataTypes) => {
  const Service = sequelize.define("Service", {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    lead_id: DataTypes.INTEGER,
    installation_id: DataTypes.INTEGER,
    issue: DataTypes.STRING,
    service_date: DataTypes.DATE,
    technician_id: DataTypes.INTEGER,
    priority: {
      type: DataTypes.STRING,
      defaultValue: "medium"
    },
    status: {
      type: DataTypes.STRING,
      defaultValue: "pending" // pending, in_progress, completed
    },
    notes: DataTypes.TEXT,
    created_at: DataTypes.DATE
  }, {
    tableName: "services",
    timestamps: false
  });

  return Service;
};