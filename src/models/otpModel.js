module.exports = (sequelize, DataTypes) => {
    return sequelize.define("Otp", {
      id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
      phone: DataTypes.STRING,
      email: DataTypes.STRING,
      otp: DataTypes.INTEGER,
      expires_at: DataTypes.DATE,
      created_at: DataTypes.DATE
    }, {
      tableName: "otps",
      timestamps: false
    });
  };