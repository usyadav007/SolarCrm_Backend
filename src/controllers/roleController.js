const { Role } = require("../models");

const {
  successResponse,
  errorResponse
} = require("../utils/responseHandler");

// CREATE ROLE

exports.createRole = async (req, res) => {

  try {

    const data = await Role.create(req.body);

    return successResponse(
      res,
      { data },
      "Role created successfully"
    );

  } catch (err) {

    return errorResponse(
      res,
      "Role creation failed",
      err.message
    );

  }

};

// GET ROLES

exports.getRoles = async (req, res) => {

  try {

    const data = await Role.findAll({
      order: [["id", "DESC"]]
    });

    return successResponse(
      res,
      { data },
      "Roles fetched successfully"
    );

  } catch (err) {

    return errorResponse(
      res,
      "Fetch failed",
      err.message
    );

  }

};

// UPDATE ROLE

exports.updateRole = async (req, res) => {

  try {

    const { id } = req.params;

    await Role.update(
      req.body,
      {
        where: { id }
      }
    );

    return successResponse(
      res,
      null,
      "Role updated successfully"
    );

  } catch (err) {

    return errorResponse(
      res,
      "Update failed",
      err.message
    );

  }

};

// DELETE ROLE

exports.deleteRole = async (req, res) => {

  try {

    const { id } = req.params;

    await Role.destroy({
      where: { id }
    });

    return successResponse(
      res,
      null,
      "Role deleted successfully"
    );

  } catch (err) {

    return errorResponse(
      res,
      "Delete failed",
      err.message
    );

  }

};