const { Installation, Lead } = require("../models");
const { Quotation, Staff } = require("../models");
const { addLeadHistory } = require("../utils/helpers");
const { successResponse, errorResponse } = require("../utils/responseHandler");

exports.create = async (req, res) => {
  try {
    const data = {
      ...req.body,
      created_at: new Date()
    };

    const installation = await Installation.create(data);

    // Lead status update
    await Lead.update(
      { status: "installation_scheduled" },
      { where: { id: req.body.lead_id } }
    );

    // History
    await addLeadHistory({
      lead_id: req.body.lead_id,
      action: "installation_created",
      new_value: "Installation Scheduled",
      done_by: req.user.id
    });
    return successResponse(res, {installation}, "Create successful");


  } catch (err) {
    return errorResponse(res, "Create  failed", err.message);
  }
};

// Update Installation 

exports.update = async (req, res) => {
    try {
      await Installation.update(req.body, {
        where: { id: req.params.id }
      });
      return successResponse(res, "Update successful");
  
    } catch (err) {
      return errorResponse(res, "Update failed", err.message);
    }
  };


  // Installation STATUS UPDATE

  exports.updateStatus = async (req, res) => {
    try {
      const { status, lead_id } = req.body;
  
      await Installation.update(
        {
          status,
          completion_date: status === "completed" ? new Date() : null
        },
        { where: { id: req.params.id } }
      );
  
      // Lead status update
      if (status === "completed") {
        await Lead.update(
          { status: "installed" },
          { where: { id: lead_id } }
        );
      }
  
      return successResponse(res, "Update successful");
  
    } catch (err) {
      return errorResponse(res, "Update failed", err.message);
    }
  };

  // GET ALL (FILTERS )

  const { Op } = require("sequelize");

exports.getAll = async (req, res) => {
    try {
        const {
          technician_id,
          status,
          lead_id,
          quotation_id,
          from_date,
          to_date
        } = req.query;
    
        let where = {};
    
        // ✅ Filters
        if (technician_id) where.technician_id = technician_id;
        if (status) where.status = status;
        if (lead_id) where.lead_id = lead_id;
        if (quotation_id) where.quotation_id = quotation_id;
    
        // ✅ Date filter
        if (from_date && to_date) {
          where.install_date = {
            [Op.between]: [new Date(from_date), new Date(to_date)]
          };
        }

    const allInstallation = await Installation.findAll({
      where,
      include: [
        { model: Lead, attributes: ["id", "customer_name", "phone"] },
        { model: Quotation, attributes: ["id", "final_amount", "status"] },
        { model: Staff, attributes: ["id", "name"] }
      ],
      order: [["id", "DESC"]]
    });

    
    return successResponse(res, {allInstallation }, "Fetch Data successful");

  } catch (err) {
    return errorResponse(res, "Fetch data failed", err.message);
  }
};

// GET ONE

exports.getOne = async (req, res) => {
    const oneInstallation = await Installation.findByPk(req.params.id);
    return successResponse(res, {oneInstallation}, "Fetch Data successful");
  };

  // Delete Detail

  exports.delete = async (req, res) => {
    await Installation.destroy({
      where: { id: req.params.id }
    });
    return successResponse(res, "Delete Data successful");
    
  };