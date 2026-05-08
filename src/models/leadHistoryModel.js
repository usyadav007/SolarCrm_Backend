const { DataTypes } = require("sequelize");

module.exports = (sequelize) => {
  return sequelize.define("LeadHistory", {
    lead_id: DataTypes.INTEGER,
    action: DataTypes.STRING, // created, assigned, status_changed
    old_value: DataTypes.STRING,
    new_value: DataTypes.STRING,
    done_by: DataTypes.INTEGER
  });
};