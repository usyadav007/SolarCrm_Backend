const { Document } = require("../models");
const { successResponse, errorResponse } = require("../utils/responseHandler");

exports.upload = async (req, res) => {
  try {
    const file = req.file;

    const data = await Document.create({
      lead_id: req.body.lead_id,
      installation_id: req.body.installation_id,
      file_name: file.originalname,
      file_path: file.path,
      file_type: req.body.file_type,
      uploaded_by: req.user.id,
      created_at: new Date()
    });

    
    return successResponse(res, {data}, "Create Data successful");

  } catch (err) {
    return errorResponse(res, "Create data failed", err.message);
  }
};

// Get Documents

exports.getAll = async (req, res) => {
    const { lead_id, installation_id } = req.query;
  
    let where = {};
  
    if (lead_id) where.lead_id = lead_id;
    if (installation_id) where.installation_id = installation_id;
  
    const data = await Document.findAll({
      where,
      order: [["id", "DESC"]]
    });
  
    return successResponse(res, {data}, "Fetch Data successful");
  };

  // Delete Document

  exports.delete = async (req, res) => {
    await Document.destroy({
      where: { id: req.params.id }
    });
    return successResponse(res,"Deleted Data successful");
    
  };

  