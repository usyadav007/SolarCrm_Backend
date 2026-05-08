module.exports = (sequelize, DataTypes) => {
    const Survey = sequelize.define("Survey", {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      lead_id: DataTypes.INTEGER,
      survey_date: DataTypes.DATE,
      engineer_id: DataTypes.INTEGER,
      location: DataTypes.STRING,
      roof_type: DataTypes.STRING,
      load_required: DataTypes.STRING,
      status: {
        type: DataTypes.STRING,
        defaultValue: "pending"
      },
      notes: DataTypes.TEXT,
      created_at: DataTypes.DATE
    }, {
      tableName: "site_surveys",
      timestamps: false
    });
  
    return Survey;
  };