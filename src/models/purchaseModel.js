module.exports = (sequelize, DataTypes) => {

  const Purchase = sequelize.define(
      "Purchase",
      {

          id: {
              type: DataTypes.INTEGER,
              primaryKey: true,
              autoIncrement: true
          },

          supplier_id: {
              type: DataTypes.INTEGER,
              allowNull: false
          },

          invoice_no: {
              type: DataTypes.STRING(100),
              allowNull: true
          },

          purchase_date: {
              type: DataTypes.DATEONLY,
              allowNull: false
          },

          total_amount: {
              type: DataTypes.DECIMAL(12,2),
              allowNull: false,
              defaultValue: 0
          },

          notes: {
              type: DataTypes.TEXT,
              allowNull: true
          }

      },
      {
          tableName: "purchases",
          timestamps: true,
          createdAt: "created_at",
          updatedAt: "updated_at"
      }
  );

  return Purchase;

};