const { Service } = require("../models");
const { Lead, Installation, Staff } = require("../models");
const { successResponse, errorResponse } = require("../utils/responseHandler");

exports.create = async (req, res) => {
  try {
    const data = {
      ...req.body,
      created_at: new Date()
    };

    const service = await Service.create(data);

    return successResponse(res, {service }, "Create successful");

  } catch (err) {
     return errorResponse(res, "Create failed", err.message);
  }
};

// UPDATE SERVICE

exports.update = async (req, res) => {
    await Service.update(req.body, {
      where: { id: req.params.id }
    });
  
    return successResponse(res,  "Update successful");
  };

  // STATUS UPDATE

  exports.updateStatus = async (req, res) => {
    const { status } = req.body;
  
    await Service.update(
      { status },
      { where: { id: req.params.id } }
    );
  
    return successResponse(res,  "Update successful");
  };

  // GET ALL (FILTERS 🔥)

  const { Op } = require("sequelize");

exports.getAll = async (req, res) => {
  try {
    const {
      technician_id,
      status,
      priority,
      lead_id,
      installation_id,
      from_date,
      to_date
    } = req.query;

    let where = {};

    if (technician_id) where.technician_id = technician_id;
    if (status) where.status = status;
    if (priority) where.priority = priority;
    if (lead_id) where.lead_id = lead_id;
    if (installation_id) where.installation_id = installation_id;

    if (from_date && to_date) {
      where.service_date = {
        [Op.between]: [new Date(from_date), new Date(to_date)]
      };
    }

    const allService = await Service.findAll({
        where,
        include: [
          { model: Lead, attributes: ["id", "customer_name"] },
          { model: Installation, attributes: ["id", "system_size"] },
          { model: Staff, attributes: ["id", "name"] }
        ],
        order: [["id", "DESC"]]
      });

   
    return successResponse(res, {allService }, "Fetch Data successful");


  } catch (err) {
    return errorResponse(res, "Fetch data failed", err.message);
  }
};

// GET ONE

exports.getOne = async (req, res) => {
    const getOneService = await Service.findByPk(req.params.id);
    return successResponse(res, {getOneService }, "Fetch Data successful");
  };

  // DELETE

  exports.delete = async (req, res) => {
    await Service.destroy({
      where: { id: req.params.id }
    });
  
    return successResponse(res, "Delete Data successful");
  };