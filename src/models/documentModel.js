module.exports = (sequelize, DataTypes) => {
    const Document = sequelize.define("Document", {
      id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
      lead_id: DataTypes.INTEGER,
      installation_id: DataTypes.INTEGER,
      file_name: DataTypes.STRING,
      file_path: DataTypes.STRING,
      file_type: DataTypes.STRING,
      uploaded_by: DataTypes.INTEGER,
      created_at: DataTypes.DATE
    }, {
      tableName: "documents",
      timestamps: false
    });
  
    return Document;
  };