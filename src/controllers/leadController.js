const { Lead } = require("../models");
const { successResponse, errorResponse } = require("../utils/responseHandler");

const { addLeadHistory } = require("../utils/helpers");
const { autoAssignLead } = require("../services/leadService");

// CREATE
exports.create = async (req, res) => {
  try {
    // STEP 1: Create Lead
    const lead = await Lead.create({
      ...req.body,
      customer_id: req.user.id
    });
    

    let assignedUser = null;

    // STEP 2: Try Auto Assign (safe)
    try {
      assignedUser = await autoAssignLead(lead.id);
    } catch (error) {
      console.error("Auto Assign Error:", error.message);
    }

    // STEP 3: History
    await addLeadHistory({
      lead_id: lead.id,
      action: "created",
      new_value: "Lead Created",
      done_by: req.user?.id || null
    });

    
    return successResponse(res, {lead}, "Create Lead Successful");

  } catch (err) {
    console.error("Create Lead Error:", err);
    return errorResponse(res, "Lead creation failed", err.message);
    
  }
};

// GET ALL (with filter)
exports.getAll = async (req, res) => {
  try {
    const { status, assigned_to } = req.query;

    let where = {};

    if (status) where.status = status;
    if (assigned_to) where.assigned_to = assigned_to;

    const leads = await Lead.findAll({ where });

    
    return successResponse(res, {leads}, "Fetch Leads Successful");
  } catch (err) {
    return errorResponse(res, "Fetch Lead failed", err.message);
  }
};

// ASSIGN LEAD
exports.assignLead = async (req, res) => {
  try {
    const { assigned_to } = req.body;

    // 🔥 STEP 1: Find lead
    const lead = await Lead.findByPk(req.params.id);

    if (!lead) {
      return errorResponse(res, "Lead not found", null, 404);
    }

    // 🔥 STEP 2: Store old value
    const oldAssigned = lead.assigned_to;

    // 🔥 STEP 3: Update lead
    await Lead.update(
      { assigned_to },
      { where: { id: req.params.id } }
    );

    // 🔥 STEP 4: Add history
    await addLeadHistory({
      lead_id: lead.id,
      action: "assigned",
      old_value: oldAssigned,
      new_value: assigned_to,
      done_by: req.user?.id || null
    });

    // 🔥 STEP 5: Get updated lead (optional)
    const updatedLead = await Lead.findByPk(req.params.id);

    return successResponse(res, updatedLead, "Lead assigned successfully");

  } catch (err) {
    return errorResponse(res, "Assign failed", err.message);
  }
};

// GET ONE
exports.getOne = async (req, res) => {
  const lead = await Lead.findByPk(req.params.id);
  
  return successResponse(res, {lead}, "Fetch Leads Successful");
};

// UPDATE
exports.update = async (req, res) => {
  try {
    // 🔥 STEP 1: Get existing lead
    const lead = await Lead.findByPk(req.params.id);

    if (!lead) {
      return errorResponse(res, "Lead not found", null, 404);
    }

    // 🔥 STEP 2: Store old values
    const oldStatus = lead.status;

    // 🔥 STEP 3: Update lead
    await Lead.update(req.body, {
      where: { id: req.params.id }
    });

    // 🔥 STEP 4: Add history
    await addLeadHistory({
      lead_id: lead.id,
      action: "status_changed",
      old_value: oldStatus,
      new_value: req.body.status,
      done_by: req.user?.id || null
    });

    return successResponse(res, null, "Lead updated successfully");

  } catch (err) {
    return errorResponse(res, "Update failed", err.message);
  }
};

// DELETE
exports.delete = async (req, res) => {
  await Lead.destroy({ where: { id: req.params.id } });
  return successResponse(res, "Delete Successful");
};


exports.createCustomerLead = async (req, res) => {
  try {
    const customer_id = req.user.id;

    const lead = await Lead.create({
      ...req.body,
      customer_id,
      status: "new"
    });

    return successResponse(res, {lead}, "Create Lead Successful");

  } catch (err) {
    return errorResponse(res, "Create Lead failed", err.message);
  }
};