const { Quotation, Lead, Survey } = require("../models");
const { Op } = require("sequelize");

const { addLeadHistory } = require("../utils/helpers");

const {
  successResponse,
  errorResponse,
} = require("../utils/responseHandler");


// ==========================================
// CREATE QUOTATION
// ==========================================

exports.create = async (req, res) => {

  try {

    const {
      lead_id,
      survey_id,
      system_size,
      price_per_kw,
      subsidy,
      valid_till,
      notes,
    } = req.body;

    const total_amount =
      Number(system_size) *
      Number(price_per_kw);

    const final_amount =
      total_amount -
      Number(subsidy || 0);

    const quotation =
      await Quotation.create({

        lead_id,
        survey_id,

        system_size,
        price_per_kw,

        total_amount,
        subsidy,

        final_amount,

        valid_till,
        notes,

      });

    // Update Lead Status

    await Lead.update(
      {
        status: "quotation_created",
      },
      {
        where: {
          id: lead_id,
        },
      }
    );

    // Add History

    if (req.user) {

      await addLeadHistory({

        lead_id,

        action: "quotation_created",

        new_value: `Quotation ₹${final_amount}`,

        done_by: req.user.id,

      });

    }

    return successResponse(
      res,
      { quotation },
      "Quotation created successfully"
    );

  } catch (err) {

    return errorResponse(
      res,
      "Create quotation failed",
      err.message
    );

  }

};


// ==========================================
// GET ALL QUOTATIONS
// ==========================================

exports.getAll = async (req, res) => {

  try {

    const {
      lead_id,
      status,
      min_amount,
      max_amount,
      from_date,
      to_date,
    } = req.query;

    let where = {};

    if (lead_id) {
      where.lead_id = lead_id;
    }

    if (status) {
      where.status = status;
    }

    // Amount Filter

    if (min_amount || max_amount) {

      where.final_amount = {};

      if (min_amount) {
        where.final_amount[Op.gte] = min_amount;
      }

      if (max_amount) {
        where.final_amount[Op.lte] = max_amount;
      }

    }

    // Date Filter

    if (from_date && to_date) {

      where.created_at = {
        [Op.between]: [
          new Date(from_date),
          new Date(to_date),
        ],
      };

    }

    const allQuotation =
      await Quotation.findAll({

        where,

        include: [

          {
            association: "Lead",

            attributes: [
              "id",
              "customer_name",
              "phone",
            ],

          },

          {
            association: "Survey",
          },

        ],

        order: [
          ["id", "DESC"]
        ],

      });

    return successResponse(
      res,
      { allQuotation },
      "Fetch Data successful"
    );

  } catch (err) {

    return errorResponse(
      res,
      "Fetch Data failed",
      err.message
    );

  }

};


// ==========================================
// GET QUOTATION BY ID
// ==========================================

exports.getOne = async (req, res) => {

  try {

    const quotation =
      await Quotation.findByPk(

        req.params.id,

        {

          include: [

            {
              association: "Lead",

              attributes: [
                "id",
                "customer_name",
                "phone",
              ],

            },

            {
              association: "Survey",
            },

          ],

        }

      );

    if (!quotation) {

      return errorResponse(
        res,
        "Quotation not found",
        null,
        404
      );

    }

    return successResponse(
      res,
      { quotation },
      "Fetch Data successful"
    );

  } catch (err) {

    return errorResponse(
      res,
      "Fetch Data failed",
      err.message
    );

  }

};


// ==========================================
// UPDATE QUOTATION
// ==========================================

exports.update = async (req, res) => {

  try {

    const {
      system_size,
      price_per_kw,
      subsidy,
    } = req.body;

    const total_amount =
      Number(system_size) *
      Number(price_per_kw);

    const final_amount =
      total_amount -
      Number(subsidy || 0);

    await Quotation.update(

      {
        ...req.body,
        total_amount,
        final_amount,
      },

      {
        where: {
          id: req.params.id,
        },
      }

    );

    return successResponse(
      res,
      null,
      "Quotation updated successfully"
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
// UPDATE STATUS
// ==========================================

exports.updateStatus = async (req, res) => {

  try {

    const { status } = req.body;

    const quotation =
      await Quotation.findByPk(
        req.params.id
      );

    if (!quotation) {

      return errorResponse(
        res,
        "Quotation not found",
        null,
        404
      );

    }

    await quotation.update({
      status,
    });

    if (status === "approved") {

      await Lead.update(

        {
          status: "quotation_approved",
        },

        {
          where: {
            id: quotation.lead_id,
          },
        }

      );

    }

    return successResponse(
      res,
      null,
      "Status updated successfully"
    );

  } catch (err) {

    return errorResponse(
      res,
      "Status update failed",
      err.message
    );

  }

};


// ==========================================
// DELETE QUOTATION
// ==========================================

exports.delete = async (req, res) => {

  try {

    const quotation =
      await Quotation.findByPk(
        req.params.id
      );

    if (!quotation) {

      return errorResponse(
        res,
        "Quotation not found",
        null,
        404
      );

    }

    await quotation.destroy();

    return successResponse(
      res,
      null,
      "Quotation deleted successfully"
    );

  } catch (err) {

    return errorResponse(
      res,
      "Delete failed",
      err.message
    );

  }

};