const {
  sequelize,
  Purchase,
  PurchaseItem,
  Supplier,
  InventoryProduct,
  InventoryTransaction
} = require("../models");

const { Op } = require("sequelize");
  
  
  // ==========================================
  // CREATE PURCHASE
  // ==========================================
  
  exports.createPurchase = async (req, res) => {

    const transaction = await sequelize.transaction();

    try {

        const {
            supplier_id,
            invoice_no,
            purchase_date,
            total_amount,
            notes,
            items
        } = req.body;

        if (!supplier_id || !purchase_date || !items || items.length === 0) {

            await transaction.rollback();

            return res.status(400).json({
                success: false,
                message: "Supplier, Purchase Date and Items are required."
            });

        }

        const supplier = await Supplier.findByPk(supplier_id);

        if (!supplier) {

            await transaction.rollback();

            return res.status(404).json({
                success: false,
                message: "Supplier not found"
            });

        }

        const purchase = await Purchase.create({

            supplier_id,
            invoice_no,
            purchase_date,
            total_amount,
            notes

        }, { transaction });


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

            await PurchaseItem.create({

                purchase_id: purchase.id,
                product_id: item.product_id,
                quantity: item.quantity,
                purchase_price: item.purchase_price,
                total_price: totalPrice

            }, { transaction });


            await product.update({

                current_stock:
                    Number(product.current_stock) +
                    Number(item.quantity),

                purchase_price:
                    item.purchase_price

            }, { transaction });


            await InventoryTransaction.create({

                product_id: item.product_id,
                transaction_type: "purchase",
                quantity: item.quantity,
                reference_id: purchase.id,
                remarks: `Purchase Invoice ${invoice_no}`

            }, { transaction });

        }

        await transaction.commit();

        return res.status(201).json({

            success: true,
            message: "Purchase created successfully",
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
  // GET ALL PURCHASES
  // ==========================================
  
  exports.getPurchases = async (req, res) => {

    try {

        const purchases = await Purchase.findAll({

            include: [

                {

                    model: Supplier,

                    as: "Supplier",

                    attributes: [
                        "id",
                        "supplier_name",
                        "phone"
                    ]

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

            ],

            order: [["id", "DESC"]]

        });

        return res.status(200).json({

            success: true,
            data: purchases

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
                              "selling_price",
                              "current_stock"

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

      // ==========================================
      // Reverse Old Stock
      // ==========================================

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

              }, {

                  transaction

              });

          }

      }

      // ==========================================
      // Delete Old Purchase Items
      // ==========================================

      await PurchaseItem.destroy({

          where: {

              purchase_id: purchase.id

          },

          transaction

      });

      // ==========================================
      // Delete Old Inventory Transaction
      // ==========================================

      await InventoryTransaction.destroy({

          where: {

              reference_id: purchase.id,

              transaction_type: "purchase"

          },

          transaction

      });

      // ==========================================
      // Update Purchase
      // ==========================================

      await purchase.update({

          supplier_id,
          invoice_no,
          purchase_date,
          total_amount,
          notes

      }, {

          transaction

      });

      // ==========================================
      // Save New Purchase Items
      // ==========================================

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

          await PurchaseItem.create({

              purchase_id: purchase.id,

              product_id: item.product_id,

              quantity: item.quantity,

              purchase_price: item.purchase_price,

              total_price: totalPrice

          }, {

              transaction

          });

          await product.update({

              current_stock:

                  Number(product.current_stock) +

                  Number(item.quantity),

              purchase_price:

                  item.purchase_price

          }, {

              transaction

          });

          await InventoryTransaction.create({

              product_id: item.product_id,

              transaction_type: "purchase",

              quantity: item.quantity,

              reference_id: purchase.id,

              remarks: `Purchase Updated (${invoice_no})`

          }, {

              transaction

          });

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

exports.deletePurchase = async (req, res) => {

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

      // ==========================================
      // REVERSE STOCK
      // ==========================================

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

          transaction

      });

      // ==========================================
      // DELETE PURCHASE ITEMS
      // ==========================================

      await PurchaseItem.destroy({

          where: {

              purchase_id: purchase.id

          },

          transaction

      });

      // ==========================================
      // DELETE PURCHASE
      // ==========================================

      await purchase.destroy({

          transaction

      });

      await transaction.commit();

      return res.status(200).json({

          success: true,

          message: "Purchase deleted successfully"

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
// PURCHASE SUMMARY
// ==========================================

exports.getPurchaseSummary = async (req, res) => {

  try {

      const totalPurchases = await Purchase.count();

      const totalAmount = await Purchase.sum("total_amount");

      const todayPurchases = await Purchase.count({

          where: {

              purchase_date: new Date().toISOString().slice(0,10)

          }

      });

      const recentPurchases = await Purchase.findAll({

          limit: 5,

          order: [["id","DESC"]],

          include: [

              {

                  model: Supplier,

                  as: "Supplier",

                  attributes: [

                      "id",
                      "supplier_name",
                      "phone"

                  ]

              }

          ]

      });

      return res.status(200).json({

          success: true,

          data: {

              total_purchases: totalPurchases,

              total_amount: totalAmount || 0,

              today_purchases: todayPurchases,

              recent_purchases: recentPurchases

          }

      });

  }

  catch(error){

      console.log(error);

      return res.status(500).json({

          success:false,

          message:error.message

      });

  }

};

// ==========================================
// PURCHASE INVOICE
// ==========================================

exports.printPurchaseInvoice = async (req,res)=>{

  try{

      const purchase=await Purchase.findByPk(req.params.id,{

          include:[

              {

                  model:Supplier,

                  as:"Supplier"

              },

              {

                  model:PurchaseItem,

                  as:"Items",

                  include:[

                      {

                          model:InventoryProduct,

                          as:"Product",

                          attributes:[

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

      if(!purchase){

          return res.status(404).json({

              success:false,

              message:"Purchase not found"

          });

      }

      return res.status(200).json({

          success:true,

          data:purchase

      });

  }

  catch(error){

      console.log(error);

      return res.status(500).json({

          success:false,

          message:error.message

      });

  }

};