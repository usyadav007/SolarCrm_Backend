const { Lead, FollowUp, Staff } = require("../models");
const { successResponse, errorResponse } = require("../utils/responseHandler");
const { Op } = require("sequelize");

exports.getDashboard = async (req, res) => {
  try {
    const today = new Date().toISOString().split("T")[0];

    // Total Leads
    const totalLeads = await Lead.count();

    // Status wise
    const newLeads = await Lead.count({ where: { status: "new" } });
    const interested = await Lead.count({ where: { status: "interested" } });
    const converted = await Lead.count({ where: { status: "converted" } });

    // Today Followups
    const todayFollowups = await FollowUp.count({
      where: {
        next_followup: {
          [Op.between]: [
            new Date(today + " 00:00:00"),
            new Date(today + " 23:59:59")
          ]
        }
      }
    });

    // Overdue
    const overdueFollowups = await FollowUp.count({
      where: {
        next_followup: {
          [Op.lt]: new Date()
        }
      }
    });

    return successResponse(res, {totalLeads,
      newLeads,
      interested,
      converted,
      todayFollowups,
      overdueFollowups}, "Fetch Data Successful");

  } catch (err) {
    return errorResponse(res, "Fetch Data failed", err.message);
  }
};

// Staff Performance

exports.staffPerformance = async (req, res) => {
    try {
      const staffPerformance = await FollowUp.findAll({
        attributes: [
          "user_id",
          [require("sequelize").fn("COUNT", "*"), "total_followups"]
        ],
        group: ["user_id"]
      });
  
      return successResponse(res, {staffPerformance}, "Fetch Leads History Successful");
  
    } catch (err) {
      return errorResponse(res, "Fetch Lead History failed", err.message);
    }
  };