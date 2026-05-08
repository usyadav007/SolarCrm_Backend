const { Quotation, Lead } = require("../models");
const { addLeadHistory } = require("../utils/helpers");
const { successResponse, errorResponse } = require("../utils/responseHandler");

// CREATE QUOTATION
exports.create = async (req, res) => {
  try {
    const data = {
      ...req.body,
      total_amount: req.body.system_size * req.body.price_per_kw,
      final_amount:
        (req.body.system_size * req.body.price_per_kw) - (req.body.subsidy || 0),
      created_at: new Date()
    };

    const quotation = await Quotation.create(data);

    // Lead status update
    await Lead.update(
      { status: "quotation_created" },
      { where: { id: req.body.lead_id } }
    );

    // History
    await addLeadHistory({
      lead_id: req.body.lead_id,
      action: "quotation_created",
      new_value: `Quotation ₹${data.final_amount}`,
      done_by: req.user.id
    });

    return successResponse(res, {quotation}, "Create Data successful");

  } catch (err) {
    return errorResponse(res, "Create Data failed", err.message);
  }
};

// GET ALL
exports.getAll = async (req, res) => {
    try {
      const { lead_id, status } = req.query;
  
      let where = {};
      if (lead_id) where.lead_id = lead_id;
      if (status) where.status = status;
  
      const allQuotation = await Quotation.findAll({
        where,
        order: [["id", "DESC"]]
      });
      return successResponse(res, {allQuotation}, "Fetch Data successful");
  
    } catch (err) {
      
      return errorResponse(res, "Fetch Data failed", err.message);
    }
  };
  
  // GET ONE
  exports.getOne = async (req, res) => {
    const getOneQuotation = await Quotation.findByPk(req.params.id);
    return successResponse(res, {getOneQuotation}, "Fetch Data successful");
  };


  // UPDATE
exports.update = async (req, res) => {
    await Quotation.update(req.body, {
      where: { id: req.params.id }
    });
  
    return successResponse(res, "Updated Data successful");
  };
  
  // STATUS UPDATE
  exports.updateStatus = async (req, res) => {
    const { status } = req.body;
  
    await Quotation.update(
      { status },
      { where: { id: req.params.id } }
    );
  
    // Lead status change (important 🔥)
    if (status === "approved") {
      await Lead.update(
        { status: "quotation_approved" },
        { where: { id: req.body.lead_id } }
      );
    }
    return successResponse(res, "Updated Data successful");
    
  };


  //Delete Quotation

  exports.delete = async (req, res) => {
    try {
      const quotation = await Quotation.findByPk(req.params.id);
  
      if (!quotation) {
        return errorResponse(res, "Quotation not found", null, 404);
      }
  
      await Quotation.destroy({
        where: { id: req.params.id }
      });
      return successResponse(res, "Delete Data successful");
  
    } catch (err) {
      return errorResponse(res, "Delete failed", err.message);
    }
  };

  // Get Quotation by filters

  const { Op } = require("sequelize");

exports.getAll = async (req, res) => {
  try {
    const {
      lead_id,
      status,
      min_amount,
      max_amount,
      from_date,
      to_date
    } = req.query;

    let where = {};

    if (lead_id) where.lead_id = lead_id;
    if (status) where.status = status;

    // Amount filter
    if (min_amount || max_amount) {
      where.final_amount = {};

      if (min_amount) where.final_amount[Op.gte] = min_amount;
      if (max_amount) where.final_amount[Op.lte] = max_amount;
    }

    // Date filter
    if (from_date && to_date) {
      where.created_at = {
        [Op.between]: [new Date(from_date), new Date(to_date)]
      };
    }

    // const data = await Quotation.findAll({
    //   where,
    //   order: [["id", "DESC"]]
    // });

    const allQuotation = await Quotation.findAll({
        where,
        include: [
          {
            model: Lead,
            attributes: ["id", "customer_name", "phone"]
          }
        ],
        order: [["id", "DESC"]]
      });

    return successResponse(res, {allQuotation}, "Fetch Data successful");

  } catch (err) {
    return errorResponse(res, "Fetch Data failed", err.message);
  }
};