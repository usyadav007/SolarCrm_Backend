module.exports = (sequelize, DataTypes) => {
    const Salary = sequelize.define("Salary", {
      id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
      staff_id: DataTypes.INTEGER,
      month: DataTypes.INTEGER,
      year: DataTypes.INTEGER,
      total_days: DataTypes.INTEGER,
      present_days: DataTypes.FLOAT,
      salary_per_day: DataTypes.FLOAT,
      total_salary: DataTypes.FLOAT,
      created_at: DataTypes.DATE
    }, {
      tableName: "salaries",
      timestamps: false
    });
  
    return Salary;
  };