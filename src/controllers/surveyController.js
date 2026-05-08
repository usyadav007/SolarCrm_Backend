const { Survey, Lead } = require("../models");
const { successResponse, errorResponse } = require("../utils/responseHandler");
const { addLeadHistory } = require("../utils/helpers");

// CREATE SURVEY
exports.create = async (req, res) => {
  try {
    const data = {
      ...req.body,
      created_at: new Date()
    };

    const survey = await Survey.create(data);

    // Lead status update
    await Lead.update(
      { status: "survey_scheduled" },
      { where: { id: req.body.lead_id } }
    );

    // History
    await addLeadHistory({
      lead_id: req.body.lead_id,
      action: "survey_created",
      new_value: "Survey Scheduled",
      done_by: req.user.id
    });
    return successResponse(res, {survey }, "Create Survey is successful");

  } catch (err) {
    return errorResponse(res, "Create survey failed", err.message);
  }
};



// UPDATE FULL SURVEY
exports.update = async (req, res) => {
    try {
      const survey = await Survey.findByPk(req.params.id);
  
      if (!survey) {
        return errorResponse(res, "Survey not found", null, 404);
      }
  
      await Survey.update(req.body, {
        where: { id: req.params.id }
      });
      return successResponse(res, "Survey updated successfully");
  
    } catch (err) {
      return errorResponse(res, "Update is failed", err.message);
    }
  };

  // Get Survey by Filter 

  exports.getAll = async (req, res) => {
    try {
      const { lead_id, engineer_id, location, status } = req.query;
  
      let where = {};
  
      if (lead_id) where.lead_id = lead_id;
      if (engineer_id) where.engineer_id = engineer_id;
      if (status) where.status = status;
  
      if (location) {
        where.location = {
          [require("sequelize").Op.like]: `%${location}%`
        };
      }
  
      const allSurvey = await Survey.findAll({
        where,
        include: [
          {
            model: Lead,
            attributes: ["id", "customer_name", "phone"]
          }
        ],
        order: [["id", "DESC"]]
      });
  
      return successResponse(res, {allSurvey}, "Fetch Survey Successful");
  
    } catch (err) {
      return errorResponse(res, "Fetch Data failed", err.message);
    }
  };

  // GET SINGLE SURVEY

  exports.getOne = async (req, res) => {
    try {
      const singleSurvey = await Survey.findByPk(req.params.id);
  
      if (!singleSurvey) {
        return errorResponse(res, "Data not found", null, 404);
      }
      return successResponse(res, {singleSurvey}, "Fetch Data successful");
  
    } catch (err) {
      return errorResponse(res, "Fetch Data failed", err.message);
    }
  };

  // DELETE Survey 

  exports.delete = async (req, res) => {
    try {
      await Survey.destroy({
        where: { id: req.params.id }
      });
      return successResponse(res, "Deleted Data successful");
  
    } catch (err) {
      return errorResponse(res, "Deleted failed", err.message);
    }
  };