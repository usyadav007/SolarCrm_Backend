const db = require("../models");

const InventoryTransaction = db.InventoryTransaction;
const InventoryProduct = db.InventoryProduct;
const Installation = db.Installation;


// ==========================================
// CREATE TRANSACTION
// ==========================================

exports.createTransaction = async (
  req,
  res
) => {

  try {

    const {
      product_id,
      installation_id,
      type,
      quantity,
      remarks
    } = req.body;

    const product =
      await InventoryProduct.findByPk(
        product_id
      );

    if (!product) {

      return res.status(404).json({

        success: false,

        message: "Product not found"

      });

    }

    // Material Issue
    if (
      type === "OUT"
    ) {

      if (
        product.current_stock <
        quantity
      ) {

        return res.status(400).json({

          success: false,

          message:
            "Insufficient Stock"

        });

      }

      product.current_stock =
        Number(
          product.current_stock
        ) -
        Number(quantity);

    }

    // Purchase / Stock In
    else {

      product.current_stock =
        Number(
          product.current_stock
        ) +
        Number(quantity);

    }

    await product.save();

    const transaction =
      await InventoryTransaction.create({

        product_id,

        installation_id,

        type,

        quantity,

        remarks

      });

    return res.json({

      success: true,

      message:
        "Transaction created successfully",

      data: transaction

    });

  }

  catch (error) {

    console.log(error);

    return res.status(500).json({

      success: false,

      message:
        error.message

    });

  }

};


// ==========================================
// GET ALL TRANSACTIONS
// ==========================================

exports.getAllTransactions =
async (
  req,
  res
) => {

  try {

    const transactions =
      await InventoryTransaction.findAll({

        include: [

          {

            model:
              InventoryProduct,

            as: "Product"

          },

          {

            model:
              Installation,

            as: "Installation"

          }

        ],

        order: [

          [
            "created_at",
            "DESC"
          ]

        ]

      });

    return res.json({

      success: true,

      message:
        "Fetch successful",

      data: {

        data:
          transactions

      }

    });

  }

  catch (error) {

    console.log(error);

    return res.status(500).json({

      success: false,

      message:
        error.message

    });

  }

};


// ==========================================
// GET SINGLE TRANSACTION
// ==========================================

exports.getTransactionById =
async (
  req,
  res
) => {

  try {

    const transaction =
      await InventoryTransaction.findByPk(

        req.params.id,

        {

          include: [

            {

              model:
                InventoryProduct,

              as: "Product"

            },

            {

              model:
                Installation,

              as:
                "Installation"

            }

          ]

        }

      );

    if (
      !transaction
    ) {

      return res.status(404).json({

        success: false,

        message:
          "Transaction not found"

      });

    }

    return res.json({

      success: true,

      message:
        "Fetch successful",

      data:
        transaction

    });

  }

  catch (error) {

    console.log(error);

    return res.status(500).json({

      success: false,

      message:
        error.message

    });

  }

};


// ==========================================
// GET PRODUCT TRANSACTIONS
// ==========================================

exports.getProductTransactions =
async (
  req,
  res
) => {

  try {

    const transactions =
      await InventoryTransaction.findAll({

        where: {

          product_id:
            req.params.productId

        },

        include: [

          {

            model:
              Installation,

            as:
              "Installation"

          }

        ],

        order: [

          [
            "created_at",
            "DESC"
          ]

        ]

      });

    return res.json({

      success: true,

      message:
        "Fetch successful",

      data: {

        data:
          transactions

      }

    });

  }

  catch (error) {

    console.log(error);

    return res.status(500).json({

      success: false,

      message:
        error.message

    });

  }

};


// ==========================================
// DELETE TRANSACTION
// ==========================================

exports.deleteTransaction =
async (
  req,
  res
) => {

  try {

    const transaction =
      await InventoryTransaction.findByPk(

        req.params.id

      );

    if (
      !transaction
    ) {

      return res.status(404).json({

        success: false,

        message:
          "Transaction not found"

      });

    }

    await transaction.destroy();

    return res.json({

      success: true,

      message:
        "Transaction deleted successfully"

    });

  }

  catch (error) {

    console.log(error);

    return res.status(500).json({

      success: false,

      message:
        error.message

    });

  }

};