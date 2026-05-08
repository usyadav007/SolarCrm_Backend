const { Product, Inventory } = require("../models");
const { Sequelize } = require("sequelize");
const { successResponse, errorResponse } = require("../utils/responseHandler");


// ✅ Common response helper (optional but good practice)
// const success = (res, data, message = "Success") => {
//   res.json({ success: true, message, data });
// };

// const error = (res, err, message = "Something went wrong") => {
//   console.error(message, err);
//   res.status(500).json({ success: false, message, error: err.message });
// };


// ======================
// ✅ ADD PRODUCT
// ======================
exports.addProduct = async (req, res) => {
  try {
    const { name, category, unit } = req.body;

    if (!name) {
      return errorResponse(res, "Product name required", null, 400);
      
    }

    const data = await Product.create({
      name,
      category,
      unit,
      created_at: new Date()
    });

    return successResponse(res, {data}, "Product added successfully");

  } catch (err) {
    return errorResponse(res, "Add product failed", err.message);
  }
};


// ======================
// ✅ STOCK IN
// ======================
exports.addStock = async (req, res) => {
  try {
    const { product_id, quantity } = req.body;

    if (!product_id || !quantity) {
      return errorResponse(res, "product_id and quantity required", null, 400);
    }

    // Check product exists
    const product = await Product.findByPk(product_id);
    if (!product) {
      return errorResponse(res, "Product not found", null, 404);
    }

    const data = await Inventory.create({
      product_id,
      quantity,
      type: "in",
      created_at: new Date()
    });

    return successResponse(res, {data }, "Stock added successfully");

  } catch (err) {
    return errorResponse(res, "Stock-in failed", err.message);
  }
};


// ======================
// ✅ STOCK OUT
// ======================
exports.useStock = async (req, res) => {
  try {
    const { product_id, quantity, installation_id } = req.body;

    if (!product_id || !quantity) {
     
      return errorResponse(res, "product_id and quantity required", null, 400);
    }

    // Optional: check available stock
    const stock = await Inventory.findAll({
      where: { product_id }
    });

    const available = stock.reduce((sum, s) => {
      return s.type === "in" ? sum + s.quantity : sum - s.quantity;
    }, 0);

    if (available < quantity) {
      
      return errorResponse(res, "Insufficient stock. Available:", `${available}`, 400);
    }

    const data = await Inventory.create({
      product_id,
      quantity,
      type: "out",
      reference_id: installation_id || null,
      created_at: new Date()
    });
    return successResponse(res, {data }, "Stock used successfully");
  } catch (err) {
    
    return errorResponse(res, "Stock-out failed", err.message);
  }
};


// ======================
// ✅ GET STOCK SUMMARY
// ======================
exports.getStock = async (req, res) => {
  try {
    const data = await Inventory.findAll({
      attributes: [
        "product_id",
        [
          Sequelize.fn(
            "SUM",
            Sequelize.literal(`
              CASE 
                WHEN type = 'in' THEN quantity 
                ELSE -quantity 
              END
            `)
          ),
          "available_stock"
        ]
      ],
      group: ["product_id"],
      include: [
        {
          model: Product,
          attributes: ["id", "name", "category", "unit"]
        }
      ]
    });

    return successResponse(res, {data }, "Stock fetched successfully");

  } catch (err) {
    return errorResponse(res, "Fetch stock failed", err.message);
  }
};

// Inventory History 

exports.getHistory = async (req, res) => {
    try {
      const { product_id } = req.query;
  
      let where = {};
      if (product_id) where.product_id = product_id;
  
      const data = await Inventory.findAll({
        where,
        include: [
          {
            model: Product,
            attributes: ["id", "name"]
          }
        ],
        order: [["id", "DESC"]]
      });
  
      res.json({
        success: true,
        data
      });

      return successResponse(res, {data }, "Fetch Data successful");
  
    } catch (err) {
      return errorResponse(res, "Fetch data failed", err.message);
    }
  };

  // PRODUCT EDIT API

  exports.updateProduct = async (req, res) => {
    try {
      const product = await Product.findByPk(req.params.id);
  
      if (!product) {
        return errorResponse(res, "Product not found", null, 404);
      }
  
      await Product.update(req.body, {
        where: { id: req.params.id }
      });
  
      return successResponse(res,  "Product updated successfully");
  
    } catch (err) {
      return errorResponse(res, "Update data failed", err.message);
    }
  };

  // PRODUCT DELETE API

  exports.deleteProduct = async (req, res) => {
    try {
      const productId = req.params.id;
  
      // 🔍 Check product exists
      const product = await Product.findByPk(productId);
  
      if (!product) {
        
        return errorResponse(res, "Product not found", null, 404);
      }
  
      // 🔥 Check inventory records exist
    //   const stock = await Inventory.findOne({
    //     where: { product_id: productId }
    //   });
    // if (stock) {
    //     return res.status(400).json({
    //       success: false,
    //       message: "Cannot delete product. Stock history exists"
    //     });
    //   }

    const stockData = await Inventory.findAll({
        where: { product_id: productId }
      });
      
      const totalStock = stockData.reduce((sum, s) => {
        return s.type === "in" ? sum + s.quantity : sum - s.quantity;
      }, 0);
      
      if (totalStock > 0) {
        
        return errorResponse(res, "Cannot delete product. Available stock:", `${totalStock}`, 400);
      }
  
      
  
      // ✅ Safe delete
      await Product.destroy({
        where: { id: productId }
      });
  
      return successResponse(res, "Product deleted successfully");
  
    } catch (err) {
      console.error("Delete Product Error:", err);
      
      return errorResponse(res, "Delete data failed", err.message);
    }
  };

  // DELETE STOCK

  exports.deleteStock = async (req, res) => {
    try {
      const stock = await Inventory.findByPk(req.params.id);
  
      if (!stock) {
        return errorResponse(res, "Stock record not found", null, 404);
      }
  
      await Inventory.destroy({
        where: { id: req.params.id }
      });
  
      return successResponse(res, "Stock deleted successfully");
  
    } catch (err) {
      return errorResponse(res, "deleted data failed", err.message);
    }
  };

  //