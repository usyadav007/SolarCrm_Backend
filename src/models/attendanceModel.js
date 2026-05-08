module.exports = (sequelize, DataTypes) => {
    const Attendance = sequelize.define("Attendance", {
      id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
      staff_id: DataTypes.INTEGER,
      date: DataTypes.DATEONLY,
      check_in: DataTypes.DATE,
      check_out: DataTypes.DATE,
      status: {
        type: DataTypes.STRING,
        defaultValue: "present" // present, absent, half-day
      },

      working_hours: {
        type: DataTypes.FLOAT,
        defaultValue: 0
      },
      created_at: DataTypes.DATE
    }, {
      tableName: "attendance",
      timestamps: false
    });
  
    return Attendance;
  };