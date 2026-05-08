const { FollowUp, Lead } = require("../models");
const { addLeadHistory } = require("../utils/helpers");
const { successResponse, errorResponse } = require("../utils/responseHandler");
const { Op } = require("sequelize");

exports.create = async (req, res) => {
  
  try {
    const data = {
      lead_id: req.body.lead_id,
      user_id: req.user?.id || null,
      followup_date: new Date(),
      next_followup: new Date(req.body.next_followup),
      notes: req.body.notes,
      status: req.body.status,
      created_at: new Date()
    };

    const followup = await FollowUp.create(data);

    // Lead update
    if (req.body.status) {
      await Lead.update(
        { status: req.body.status },
        { where: { id: req.body.lead_id } }
      );
    }

    // History
    await addLeadHistory({
      lead_id: req.body.lead_id,
      action: "followup",
      new_value: req.body.notes,
      done_by: req.user?.id || null
    });

    return successResponse(res, {followup}, "Cteate Followup Successful");

  } catch (err) {
    console.error("Followup Error:", err);

    return errorResponse(res, "Cteate Followup failed", err.message);
  }
};


exports.getByLead = async (req, res) => {
    try {
      const followups = await FollowUp.findAll({
        where: { lead_id: req.params.lead_id },
        order: [["id", "DESC"]]
      });
  
      return successResponse(res, {followups}, "Get Lead Successful");
  
    } catch (err) {
      console.error("Get Followup Error:", err);
  
     
      return errorResponse(res, "Fetch failed", err.message);

    }
  };

  // TODAY FOLLOWUPS 

  exports.todayFollowups = async (req, res) => {
    try {
      const today = new Date().toISOString().split("T")[0];
  
      const followups = await FollowUp.findAll({
        where: {
          next_followup: {
            [Op.between]: [
              new Date(today + " 00:00:00"),
              new Date(today + " 23:59:59")
            ]
          }
        }
      });
  
      return successResponse(res, {followups}, "Fetch Followup Successful");
  
    } catch (err) {
      return errorResponse(res, "Fetch failed", err.message);
    }
  };


// OVERDUE FOLLOWUPS 

exports.overdueFollowups = async (req, res) => {
  try {
    const today = new Date();

    const followups = await FollowUp.findAll({
      where: {
        next_followup: {
          [Op.lt]: today
        }
      }
    });

    return successResponse(res, {followups}, "Fetch Followup Successful");

  } catch (err) {
    return errorResponse(res, "Fetch failed", err.message);
  }
};

// ALL FOLLOWUPS + FILTER 

exports.getAll = async (req, res) => {
  try {
    const { user_id, status, start_date, end_date } = req.query;

    let where = {};

    // Filter by staff
    if (user_id) {
      where.user_id = user_id;
    }

    // Filter by status
    if (status) {
      where.status = status;
    }

    // Filter by date range
    if (start_date && end_date) {
      where.next_followup = {
        [Op.between]: [
          new Date(start_date + " 00:00:00"),
          new Date(end_date + " 23:59:59")
        ]
      };
    }

    const followups = await FollowUp.findAll({
      where,
      order: [["id", "DESC"]]
    });

    return successResponse(res, {followups}, "Fetch Followup Successful");

  } catch (err) {
    return errorResponse(res, "Fetch failed", err.message);
  }
};