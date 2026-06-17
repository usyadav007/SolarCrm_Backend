const {
    InventoryCategory
  } = require("../models");
  
  const {
    successResponse,
    errorResponse
  } = require("../utils/responseHandler");
  
  
  // ==========================================
  // CREATE CATEGORY
  // ==========================================
  
  exports.create = async (
    req,
    res
  ) => {
  
    try {
  
      const category =
        await InventoryCategory.create(
          req.body
        );
  
      return successResponse(
        res,
        { category },
        "Category created successfully"
      );
  
    } catch (err) {
  
      return errorResponse(
        res,
        "Create failed",
        err.message
      );
  
    }
  
  };
  
  
  // ==========================================
  // GET ALL CATEGORIES
  // ==========================================
  
  exports.getAll = async (
    req,
    res
  ) => {
  
    try {
  
      const data =
        await InventoryCategory.findAll({
  
          order: [
            ["id", "DESC"]
          ]
  
        });
  
      return successResponse(
        res,
        { data },
        "Fetch Data successful"
      );
  
    } catch (err) {
  
      return errorResponse(
        res,
        "Fetch failed",
        err.message
      );
  
    }
  
  };
  
  
  // ==========================================
  // GET ONE CATEGORY
  // ==========================================
  
  exports.getOne = async (
    req,
    res
  ) => {
  
    try {
  
      const category =
        await InventoryCategory.findByPk(
          req.params.id
        );
  
      if (!category) {
  
        return errorResponse(
          res,
          "Category not found",
          null,
          404
        );
  
      }
  
      return successResponse(
        res,
        { category },
        "Fetch Data successful"
      );
  
    } catch (err) {
  
      return errorResponse(
        res,
        "Fetch failed",
        err.message
      );
  
    }
  
  };
  
  
  // ==========================================
  // UPDATE CATEGORY
  // ==========================================
  
  exports.update = async (
    req,
    res
  ) => {
  
    try {
  
      const category =
        await InventoryCategory.findByPk(
          req.params.id
        );
  
      if (!category) {
  
        return errorResponse(
          res,
          "Category not found",
          null,
          404
        );
  
      }
  
      await category.update(
        req.body
      );
  
      return successResponse(
        res,
        { category },
        "Category updated successfully"
      );
  
    } catch (err) {
  
      return errorResponse(
        res,
        "Update failed",
        err.message
      );
  
    }
  
  };
  
  
  // ==========================================
  // DELETE CATEGORY
  // ==========================================
  
  exports.delete = async (
    req,
    res
  ) => {
  
    try {
  
      const category =
        await InventoryCategory.findByPk(
          req.params.id
        );
  
      if (!category) {
  
        return errorResponse(
          res,
          "Category not found",
          null,
          404
        );
  
      }
  
      await category.destroy();
  
      return successResponse(
        res,
        null,
        "Category deleted successfully"
      );
  
    } catch (err) {
  
      return errorResponse(
        res,
        "Delete failed",
        err.message
      );
  
    }
  
  };