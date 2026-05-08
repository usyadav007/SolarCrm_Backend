const { LeadHistory, Staff } = require("../models");
const { successResponse, errorResponse } = require("../utils/responseHandler");

exports.getLeadHistory = async (req, res) => {
  try {
    const leadId = req.params.id;

    const history = await LeadHistory.findAll({
      where: { lead_id: leadId },
      include: [
        {
          model: Staff,
          attributes: ["id", "name", "email"]
        }
      ],
      order: [["createdAt", "DESC"]]
    });

 
    return successResponse(res, {history}, "Fetch Leads History Successful");

  } catch (err) {
     return errorResponse(res, "Fetch Lead History failed", err.message);
  }
};