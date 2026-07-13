const {
    sequelize,
    Purchase,
    PurchaseItem,
    Supplier,
    InventoryProduct,
    InventoryTransaction,
  } = require("../models");
  
  const {Op} = require("sequelize");
  
  
  // ==========================================
  // CREATE PURCHASE
  // ==========================================
  
  exports.createPurchase = async (req, res) => {
  
    const transaction =
      await sequelize.transaction();
  
    try {
  
      const {
        supplier_id,
        invoice_no,
        purchase_date,
        total_amount,
        notes,
        items,
      } = req.body;
  
      // ============================
      // VALIDATION
      // ============================
  
      if (
        !supplier_id ||
        !purchase_date ||
        !items ||
        items.length === 0
      ) {
  
        await transaction.rollback();
  
        return res.status(400).json({
  
          success: false,
          message:
            "Supplier, Purchase Date and Items are required.",
  
        });
  
      }
  
      // ============================
      // CHECK SUPPLIER
      // ============================
  
      const supplier =
        await Supplier.findByPk(
          supplier_id
        );
  
      if (!supplier) {
  
        await transaction.rollback();
  
        return res.status(404).json({
  
          success: false,
          message:
            "Supplier not found",
  
        });
  
      }
  
      // ============================
      // CREATE PURCHASE
      // ============================
  
      const purchase =
        await Purchase.create({
  
          supplier_id,
          invoice_no,
          purchase_date,
          total_amount,
          notes,
  
        }, {
          transaction
        });
  
      // ============================
      // SAVE ITEMS
      // ============================
  
      for (const item of items) {
  
        const product =
          await InventoryProduct.findByPk(
            item.product_id,
            { transaction }
          );
  
        if (!product) {
  
          throw new Error(
            `Product ID ${item.product_id} not found`
          );
  
        }
  
        const totalPrice =
          Number(item.quantity) *
          Number(item.purchase_price);
  
        // Purchase Item
  
        await PurchaseItem.create({

          purchase_id: purchase.id,
      
          product_id: item.product_id,
      
          quantity: item.quantity,
      
          purchase_price: item.purchase_price,
      
          total_price: totalPrice
      
      }, { transaction });
  
        // Update Stock
  
        await product.update({
  
          current_stock:
            Number(product.stock) +
            Number(item.quantity),
  
        }, {
          transaction
        });
  
        // Inventory Transaction
  
        await InventoryTransaction.create({
  
          product_id:
            item.product_id,
  
          transaction_type:
            "purchase",
  
          quantity:
            item.quantity,
  
          reference_id:
            purchase.id,
  
          remarks:
            `Purchase Invoice ${invoice_no}`,
  
        }, {
          transaction
        });
  
      }
  
      await transaction.commit();
  
      return res.status(201).json({
  
        success: true,
  
        message:
          "Purchase created successfully",
  
        data: purchase,
  
      });
  
    }
  
    catch (error) {
  
      await transaction.rollback();
  
      console.log(error);
  
      return res.status(500).json({
  
        success: false,
  
        message:
          error.message,
  
      });
  
    }
  
  };
  
  
  
  // ==========================================
  // GET ALL PURCHASES
  // ==========================================
  
  exports.getPurchases = async (req, res) => {
    try {
  
      const purchases = await Purchase.findAll({
        include: [
          {
            model: Supplier,
            as: "Supplier",
            attributes: ["id", "supplier_name", "phone"]
          },
          {
            model: PurchaseItem,
            as: "Items",
            include: [
              {
                model: InventoryProduct,
                as: "Product",
                attributes: [
                  "id",
                  "product_name",
                  "sku",
                  "unit",
                  "selling_price"
                ]
              }
            ]
          }
        ],
        order: [["id", "DESC"]]
      });
  
      return res.status(200).json({
        success: true,
        data: purchases
      });
  
    } catch (error) {
      console.log(error);
  
      return res.status(500).json({
        success: false,
        message: error.message
      });
    }
  };
 
 

  // ==========================================
// GET PURCHASE DETAILS
// ==========================================

exports.getPurchaseById = async (req, res) => {

  try {

    const purchase = await Purchase.findByPk(req.params.id, {
      include: [
        {
          model: Supplier,
          as: "Supplier"
        },
        {
          model: PurchaseItem,
          as: "Items",
          include: [
            {
              model: InventoryProduct,
              as: "Product",
              attributes: [
                "id",
                "product_name",
                "sku",
                "unit",
                "purchase_price",
                "selling_price"
              ]
            }
          ]
        }
      ]
    });

    if (!purchase) {
      return res.status(404).json({
        success: false,
        message: "Purchase not found"
      });
    }

    return res.json({
      success: true,
      data: purchase
    });

  } catch (error) {

    return res.status(500).json({
      success: false,
      message: error.message
    });

  }

};

  
  // ==========================================
  // UPDATE PURCHASE
  // ==========================================
  
  exports.updatePurchase = async (req, res) => {

    const transaction = await sequelize.transaction();

    try {

        const purchase = await Purchase.findByPk(req.params.id, {
            include: [
                {
                    model: PurchaseItem,
                    as: "Items"
                }
            ],
            transaction
        });

        if (!purchase) {

            await transaction.rollback();

            return res.status(404).json({
                success: false,
                message: "Purchase not found"
            });

        }

        const {
            supplier_id,
            invoice_no,
            purchase_date,
            total_amount,
            notes,
            items
        } = req.body;

        if (!items || items.length === 0) {

            await transaction.rollback();

            return res.status(400).json({
                success: false,
                message: "Items are required"
            });

        }

        // ==============================
        // REVERSE OLD STOCK
        // ==============================

        for (const item of purchase.Items) {

            const product = await InventoryProduct.findByPk(
                item.product_id,
                { transaction }
            );

            if (product) {

                await product.update({
                    current_stock:
                        Number(product.current_stock) -
                        Number(item.quantity)
                }, { transaction });

            }

        }

        // ==============================
        // DELETE OLD PURCHASE ITEMS
        // ==============================

        await PurchaseItem.destroy({

            where: {
                purchase_id: purchase.id
            },

            transaction

        });

        // ==============================
        // DELETE OLD INVENTORY TRANSACTIONS
        // ==============================

        await InventoryTransaction.destroy({

            where: {
                reference_id: purchase.id,
                transaction_type: "purchase"
            },

            transaction

        });

        // ==============================
        // UPDATE PURCHASE
        // ==============================

        await purchase.update({

            supplier_id,
            invoice_no,
            purchase_date,
            total_amount,
            notes

        }, { transaction });

        // ==============================
        // SAVE NEW ITEMS
        // ==============================

        for (const item of items) {

            const product = await InventoryProduct.findByPk(
                item.product_id,
                { transaction }
            );

            if (!product) {

                throw new Error(
                    `Product ID ${item.product_id} not found`
                );

            }

            const totalPrice =
                Number(item.quantity) *
                Number(item.purchase_price);

            // Purchase Item

            await PurchaseItem.create({

                purchase_id: purchase.id,

                product_id: item.product_id,

                quantity: item.quantity,

                purchase_price: item.purchase_price,

                total_price: totalPrice

            }, { transaction });

            // ==============================
            // UPDATE STOCK
            // ==============================

            await product.update({

                current_stock:
                    Number(product.current_stock) +
                    Number(item.quantity),

                purchase_price:
                    item.purchase_price

            }, { transaction });

            // ==============================
            // INVENTORY TRANSACTION
            // ==============================

            await InventoryTransaction.create({

                product_id: item.product_id,

                transaction_type: "purchase",

                quantity: item.quantity,

                reference_id: purchase.id,

                remarks:
                    `Purchase Updated (${invoice_no})`

            }, { transaction });

        }

        await transaction.commit();

        return res.status(200).json({

            success: true,

            message: "Purchase updated successfully",

            data: purchase

        });

    }
    catch (error) {

        await transaction.rollback();

        console.log(error);

        return res.status(500).json({

            success: false,

            message: error.message

        });

    }

};

  // ==========================================
// DELETE PURCHASE
// ==========================================

exports.deletePurchase =
async (req, res) => {

  const transaction =
    await sequelize.transaction();

  try {

    const purchase =
      await Purchase.findByPk(
        req.params.id,
        {

          include: [
            {
              model: PurchaseItem,
              as: "Items",
            },
          ],

          transaction,

        }
      );

    if (!purchase) {

      await transaction.rollback();

      return res.status(404).json({

        success: false,

        message:
          "Purchase not found",

      });

    }

    // ==========================================
    // REVERSE STOCK
    // ==========================================

    for (const item of purchase.Items) {

      const product =
        await InventoryProduct.findByPk(
          item.product_id,
          { transaction }
        );

      if (product) {

        await product.update({

          stock:
            Number(product.stock) -
            Number(item.quantity),

        }, {
          transaction
        });

      }

    }

    // ==========================================
    // DELETE INVENTORY TRANSACTIONS
    // ==========================================

    await InventoryTransaction.destroy({

      where: {
    
        reference_id: purchase.id,
    
        transaction_type: {
          [Op.in]: [
            "purchase",
            "purchase_update"
          ]
        }
    
      },
    
      transaction,
    
    });

    // ==========================================
    // DELETE PURCHASE ITEMS
    // ==========================================

    await PurchaseItem.destroy({

      where: {

        purchase_id:
          purchase.id,

      },

      transaction,

    });




    exports.printPurchaseInvoice = async (req, res) => {

      try {
  
          const purchase = await Purchase.findByPk(req.params.id, {
  
              include: [
  
                  {
                      model: Supplier,
                      as: "Supplier"
                  },
  
                  {
                      model: PurchaseItem,
                      as: "Items",
  
                      include: [
  
                          {
                              model: InventoryProduct,
                              as: "Product",
                              attributes: [
                                  "id",
                                  "product_name",
                                  "product_code",
                                  "unit"
                              ]
                          }
  
                      ]
  
                  }
  
              ]
  
          });
  
          if (!purchase) {
  
              return res.status(404).json({
  
                  success: false,
  
                  message: "Purchase not found"
  
              });
  
          }
  
          return res.status(200).json({
  
              success: true,
  
              data: purchase
  
          });
  
      }
  
      catch (error) {
  
          console.log(error);
  
          return res.status(500).json({
  
              success: false,
  
              message: error.message
  
          });
  
      }
  
  };




  exports.getPurchaseSummary = async (req, res) => {

    try {

        const totalPurchases = await Purchase.count();

        const totalAmount = await Purchase.sum("total_amount");

        const today = new Date();

        today.setHours(0, 0, 0, 0);

        const todayPurchase = await Purchase.sum("total_amount", {
            where: {
                purchase_date: today
            }
        });

        const recentPurchases = await Purchase.findAll({

            limit: 5,

            order: [["id", "DESC"]],

            include: [
                {
                    model: Supplier,
                    as: "Supplier",
                    attributes: ["id", "name"]
                }
            ]

        });

        return res.status(200).json({

            success: true,

            data: {

                total_purchases: totalPurchases,

                total_amount: totalAmount || 0,

                today_purchase: todayPurchase || 0,

                recent_purchases: recentPurchases

            }

        });

    }

    catch (error) {

        console.log(error);

        return res.status(500).json({

            success: false,

            message: error.message

        });

    }

};






    // ==========================================
    // DELETE PURCHASE
    // ==========================================

    await purchase.destroy({

      transaction,

    });

    await transaction.commit();

    return res.json({

      success: true,

      message:
        "Purchase deleted successfully",

    });

  }

  catch (error) {

    await transaction.rollback();

    console.log(error);

    return res.status(500).json({

      success: false,

      message:
        error.message,

    });

  }

};