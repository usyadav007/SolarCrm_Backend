module.exports = (
  sequelize,
  DataTypes
) => {

  return sequelize.define(

    "InventoryTransaction",

    {

      id: {

        type: DataTypes.INTEGER,

        primaryKey: true,

        autoIncrement: true,

      },

      product_id: {

        type: DataTypes.INTEGER,

        allowNull: false,

      },

      installation_id: {

        type: DataTypes.INTEGER,

        allowNull: true,

      },

      transaction_type: {

        type: DataTypes.ENUM(

          "purchase",

          "issue",

          "return",

          "adjustment",

          "opening_stock"

        ),

        allowNull: false,

      },

      reference_id: {

        type: DataTypes.INTEGER,

        allowNull: true,

      },

      quantity: {

        type: DataTypes.DECIMAL(10,2),

        allowNull: false,

      },

      remarks: {

        type: DataTypes.TEXT,

        allowNull: true,

      },

      created_by: {

        type: DataTypes.INTEGER,

        allowNull: true,

      }

    },

    {

      tableName:
        "inventory_transactions",

      timestamps: true,

      createdAt:
        "created_at",

      updatedAt:
        "updated_at",

    }

  );

};