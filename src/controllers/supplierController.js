const { Supplier } = require("../models");
const { Op } = require("sequelize");

const {
  successResponse,
  errorResponse,
} = require("../utils/responseHandler");


// ==========================================
// CREATE SUPPLIER
// ==========================================

exports.create = async (req, res) => {

  try {

    const supplier =
      await Supplier.create(req.body);

    return successResponse(
      res,
      { supplier },
      "Create Data successful"
    );

  } catch (err) {

    return errorResponse(
      res,
      "Create data failed",
      err.message
    );

  }

};


// ==========================================
// GET ALL SUPPLIERS
// ==========================================

exports.getAll = async (req, res) => {

  try {

    const { search, status } =
      req.query;

    let where = {};

    if (status) {

      where.status = status;

    }

    if (search) {

      where[Op.or] = [

        {
          supplier_name: {
            [Op.like]: `%${search}%`
          }
        },

        {
          company_name: {
            [Op.like]: `%${search}%`
          }
        },

        {
          phone: {
            [Op.like]: `%${search}%`
          }
        },

        {
          email: {
            [Op.like]: `%${search}%`
          }
        }

      ];

    }

    const data =
      await Supplier.findAll({

        where,

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
      "Fetch data failed",
      err.message
    );

  }

};


// ==========================================
// GET SUPPLIER BY ID
// ==========================================

exports.getOne = async (req, res) => {

  try {

    const supplier =
      await Supplier.findByPk(
        req.params.id
      );

    if (!supplier) {

      return errorResponse(
        res,
        "Supplier not found",
        null,
        404
      );

    }

    return successResponse(
      res,
      { supplier },
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
// UPDATE SUPPLIER
// ==========================================

exports.update = async (req, res) => {

  try {

    const supplier =
      await Supplier.findByPk(
        req.params.id
      );

    if (!supplier) {

      return errorResponse(
        res,
        "Supplier not found",
        null,
        404
      );

    }

    await supplier.update(
      req.body
    );

    return successResponse(
      res,
      { supplier },
      "Supplier updated successfully"
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
// DELETE SUPPLIER
// ==========================================

exports.delete = async (req, res) => {

  try {

    const supplier =
      await Supplier.findByPk(
        req.params.id
      );

    if (!supplier) {

      return errorResponse(
        res,
        "Supplier not found",
        null,
        404
      );

    }

    await supplier.destroy();

    return successResponse(
      res,
      null,
      "Supplier deleted successfully"
    );

  } catch (err) {

    return errorResponse(
      res,
      "Delete failed",
      err.message
    );

  }

};