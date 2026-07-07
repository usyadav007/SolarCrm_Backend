module.exports = (sequelize, DataTypes) => {

    const PurchaseItem = sequelize.define(
        "PurchaseItem",
        {

            id: {
                type: DataTypes.INTEGER,
                primaryKey: true,
                autoIncrement: true
            },

            purchase_id: {
                type: DataTypes.INTEGER,
                allowNull: false
            },

            product_id: {
                type: DataTypes.INTEGER,
                allowNull: false
            },

            quantity: {
                type: DataTypes.INTEGER,
                allowNull: false
            },

            purchase_price: {
                type: DataTypes.DECIMAL(10,2),
                allowNull: false
            },

            total_price: {
                type: DataTypes.DECIMAL(10,2),
                allowNull: false
            }

        },
        {
            tableName: "purchase_items",
            timestamps: false
        }
    );

    return PurchaseItem;

};