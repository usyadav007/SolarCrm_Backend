const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { Staff } = require("../models");
const { successResponse, errorResponse } = require("../utils/responseHandler");


exports.register = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    const hash = await bcrypt.hash(password, 10);

    const user = await Staff.create({
      name,
      email,
      password: hash,
      role,
    });
    
    return successResponse(res, {user }, "Registration is successful");

  } catch (err) {
    return errorResponse(res, "Registration failed", err.message);
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await Staff.findOne({ where: { email } });

    if (!user) return errorResponse(res, "User not found", null, 404);

    const match = await bcrypt.compare(password, user.password);

    if (!match) return errorResponse(res, "Wrong password", null, 401);

    const token = jwt.sign(
      { id: user.id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    return successResponse(res, { token, user }, "Login successful");
  } catch (err) {
    return errorResponse(res, "Login failed", err.message);
  }
};