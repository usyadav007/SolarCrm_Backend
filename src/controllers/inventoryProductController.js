const {
    InventoryProduct,
    InventoryCategory
  } = require("../models");
  
  const {
    successResponse,
    errorResponse
  } = require("../utils/responseHandler");
  
  
  // CREATE
  
  exports.create =
  async (req,res)=>{
  
    try {
  
      const product =
        await InventoryProduct.create(
          req.body
        );
  
      return successResponse(
        res,
        { product },
        "Product created successfully"
      );
  
    } catch(err){
  
      return errorResponse(
        res,
        "Create failed",
        err.message
      );
  
    }
  
  };
  
  
  // GET ALL
  
  exports.getAll =
  async (req,res)=>{
  
    try {
  
      const data =
        await InventoryProduct.findAll({
  
          include:[
            {
              model:
                InventoryCategory,
              as:"Category"
            }
          ],
  
          order:[
            ["id","DESC"]
          ]
  
        });
  
      return successResponse(
        res,
        { data },
        "Fetch Data successful"
      );
  
    } catch(err){
  
      return errorResponse(
        res,
        "Fetch failed",
        err.message
      );
  
    }
  
  };
  
  
  // GET ONE
  
  exports.getOne =
  async (req,res)=>{
  
    try {
  
      const product =
        await InventoryProduct.findByPk(
          req.params.id,
          {
            include:[
              {
                model:
                  InventoryCategory,
                as:"Category"
              }
            ]
          }
        );
  
      if(!product){
  
        return errorResponse(
          res,
          "Product not found",
          null,
          404
        );
  
      }
  
      return successResponse(
        res,
        { product },
        "Fetch Data successful"
      );
  
    } catch(err){
  
      return errorResponse(
        res,
        "Fetch failed",
        err.message
      );
  
    }
  
  };
  
  
  // UPDATE
  
  exports.update =
  async (req,res)=>{
  
    try {
  
      const product =
        await InventoryProduct.findByPk(
          req.params.id
        );
  
      if(!product){
  
        return errorResponse(
          res,
          "Product not found",
          null,
          404
        );
  
      }
  
      await product.update(
        req.body
      );
  
      return successResponse(
        res,
        { product },
        "Product updated successfully"
      );
  
    } catch(err){
  
      return errorResponse(
        res,
        "Update failed",
        err.message
      );
  
    }
  
  };
  
  
  // DELETE
  
  exports.delete =
  async (req,res)=>{
  
    try {
  
      const product =
        await InventoryProduct.findByPk(
          req.params.id
        );
  
      if(!product){
  
        return errorResponse(
          res,
          "Product not found",
          null,
          404
        );
  
      }
  
      await product.destroy();
  
      return successResponse(
        res,
        null,
        "Product deleted successfully"
      );
  
    } catch(err){
  
      return errorResponse(
        res,
        "Delete failed",
        err.message
      );
  
    }
  
  };