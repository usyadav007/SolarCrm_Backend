module.exports = (sequelize, DataTypes) => {

    const Role = sequelize.define("Role", {
  
      name: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
      },
  
      description: {
        type: DataTypes.TEXT
      }
  
    }, {
      tableName: "roles",
      timestamps: true,
      createdAt: "created_at",
      updatedAt: false
    });
  
    return Role;
  };