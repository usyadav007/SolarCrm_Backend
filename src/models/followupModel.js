module.exports = (sequelize, DataTypes) => {
    const FollowUp = sequelize.define("FollowUp", {
      id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
      lead_id: DataTypes.INTEGER,
      user_id: DataTypes.INTEGER,
      followup_date: DataTypes.DATE,
      next_followup: DataTypes.DATE,
      notes: DataTypes.TEXT,
      status: DataTypes.STRING,
      created_at: DataTypes.DATE
    }, {
      tableName: "lead_followups",
      timestamps: false   // 🔥 MUST
    });
  
    return FollowUp;
  };