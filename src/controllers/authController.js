const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { Staff } = require("../models");
const { successResponse, errorResponse } = require("../utils/responseHandler");


exports.register = async (req, res) => {

  try {

    const {
      name,
      email,
      password,
      role_id
    } = req.body;

    // CHECK EMAIL EXISTS

    const existingUser = await Staff.findOne({
      where: { email }
    });

    if (existingUser) {

      return errorResponse(
        res,
        "Email already exists"
      );

    }

    // HASH PASSWORD

    const hash = await bcrypt.hash(password, 10);

    // CREATE USER

    await Staff.create({

      name,
      email,
      password: hash,
      role_id

    });

    // FETCH USER WITH ROLE

    const user = await Staff.findOne({

      where: { email },

      attributes: {
        exclude: ["password"]
      },

      include: [
        {
          association: "roleData",
          attributes: ["id", "name"]
        }
      ]

    });

    return successResponse(
      res,
      { user },
      "Registration is successful"
    );

  } catch (err) {

    return errorResponse(
      res,
      "Registration failed",
      err.message
    );

  }

};

exports.login = async (req, res) => {

  try {

    const {
      email,
      password
    } = req.body;

    const user = await Staff.findOne({

      where: { email },

      include: [
        {
          association: "roleData",
          attributes: ["id", "name"]
        }
      ]

    });

    if (!user) {

      return errorResponse(
        res,
        "User not found",
        null,
        404
      );

    }

    const match = await bcrypt.compare(
      password,
      user.password
    );

    if (!match) {

      return errorResponse(
        res,
        "Wrong password",
        null,
        401
      );

    }

    // TOKEN

    const token = jwt.sign(

      {
        id: user.id,
    
        role_id:
          user.role_id,
    
        role_name:
          user.roleData?.name
      },
    
      process.env.JWT_SECRET,
    
      {
        expiresIn: "7d"
      }
    
    );


    // REMOVE PASSWORD

    const userData = user.toJSON();

    delete userData.password;

    return successResponse(
      res,
      {
        token,
        user: userData
      },
      "Login successful"
    );

  } catch (err) {

    return errorResponse(
      res,
      "Login failed",
      err.message
    );

  }

};


exports.getUsers = async (req, res) => {

  try {

    const users = await Staff.findAll({

      attributes: {
        exclude: ["password"]
      },

      include: [
        {
          association: "roleData",
          attributes: ["id", "name"]
        }
      ],

      order: [["id", "DESC"]]

    });

    return successResponse(
      res,
      { users },
      "Users fetched successfully"
    );

  } catch (err) {

    return errorResponse(
      res,
      "Fetch failed",
      err.message
    );

  }

};



exports.getUserById = async (req, res) => {

  try {

    const user = await Staff.findByPk(

      req.params.id,

      {

        attributes: {
          exclude: ["password"]
        },

        include: [
          {
            association: "roleData",
            attributes: ["id", "name"]
          }
        ]

      }

    );

    if (!user) {

      return errorResponse(
        res,
        "User not found"
      );

    }

    return successResponse(
      res,
      { user },
      "User fetched successfully"
    );

  } catch (err) {

    return errorResponse(
      res,
      "Fetch failed",
      err.message
    );

  }

};



exports.updateUser = async (req, res) => {

  try {

    const {
      name,
      email,
      password,
      role_id
    } = req.body;

    // UPDATE OBJECT

    const updateData = {

      name,
      email,
      role_id

    };

    // HASH PASSWORD IF PROVIDED

    if (password) {

      updateData.password =
        await bcrypt.hash(
          password,
          10
        );
    }

    // UPDATE USER

    await Staff.update(

      updateData,

      {
        where: {
          id: req.params.id
        }
      }

    );

    return successResponse(
      res,
      null,
      "User updated successfully"
    );

  } catch (err) {

    return errorResponse(
      res,
      "Update failed",
      err.message
    );

  }

};


exports.deleteUser = async (req, res) => {

  try {

    await Staff.destroy({

      where: {
        id: req.params.id
      }

    });

    return successResponse(
      res,
      null,
      "User deleted successfully"
    );

  } catch (err) {

    return errorResponse(
      res,
      "Delete failed",
      err.message
    );

  }

};