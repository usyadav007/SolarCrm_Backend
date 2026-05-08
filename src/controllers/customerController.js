const { Lead, Installation, Invoice, Service, Customer, Otp, Document } = require("../models");
const { successResponse, errorResponse } = require("../utils/responseHandler");
const { sendSMS } = require("../utils/smsService");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await Customer.findOne({ where: { email } });

    if (!user) {
      return res.status(404).json({ message: "Customer not found" });
    }

    const match = await bcrypt.compare(password, user.password);

    if (!match) {
      return res.status(401).json({ message: "Invalid password" });
    }

    const token = jwt.sign(
      { id: user.id, role: "customer" },
      process.env.JWT_SECRET
    );

    return successResponse(res, { token, user }, "Login successful");

  } catch (err) {
    return errorResponse(res, "Login failed", err.message);
  }
};

// Customer Dashboard 


exports.dashboard = async (req, res) => {
  const lead_id = req.user.id;

  const lead = await Lead.findByPk(lead_id);

  const installation = await Installation.findOne({
    where: { lead_id }
  });

  const invoices = await Invoice.findAll({
    where: { lead_id }
  });

  const services = await Service.findAll({
    where: { lead_id }
  });

  
  return successResponse(res, {lead,
    installation,
    invoices,
    services }, "Fetch Data successful");
};

// Customer Documents API

exports.getDocuments = async (req, res) => {
  const data = await Document.findAll({
    where: { lead_id: req.user.id }
  });

  
  return successResponse(res, {data}, "Fetch Data successful");
};

// Generate OTP

exports.sendOtp = async (req, res) => {
    try {
      //console.log("BODY:", req.body); // 🔥
  
      const { phone, email } = req.body;
  
      if (!phone || !email) {
        return res.status(400).json({
          message: "phone and email required"
        });
      }
  
      const otp = Math.floor(1000 + Math.random() * 9000);
  
      await Otp.create({
        phone,
        email,
        otp,
        expires_at: new Date(Date.now() + 5 * 60 * 1000)
      });
  
    // 🔥 SMS send
    await sendSMS(phone, otp);

    console.log("OTP:", otp); // testing
  
      res.json({
        success: true,
        message: "Login OTP sent Successfuly",
        otp // 🔥 testing ke liye (remove later)
      });
  
    } catch (err) {
      console.error("OTP ERROR:", err); // 🔥 IMPORTANT
      res.status(500).json({
        message: "OTP failed",
        error: err.message
      });
    }
  };

// OTP VERIFY LOGIN

exports.verifyOtp = async (req, res) => {
    try {
      const { phone, email, otp } = req.body;
  
      const record = await Otp.findOne({
        where: { phone, email, otp: parseInt(otp) }
      });
  
      if (!record) {
        return res.status(400).json({ message: "Invalid OTP" });
      }
  
      if (new Date() > new Date(record.expires_at)) {
        return res.status(400).json({ message: "OTP expired" });
      }
  
      // 🔥 FIND OR CREATE CUSTOMER
      let customer = await Customer.findOne({ where: { phone } });
  
      if (!customer) {
        customer = await Customer.create({
          phone,
          email,
          name: "Customer",
          created_at: new Date()
        });
      }
  
      // 🔥 TOKEN
      const token = jwt.sign(
        { id: customer.id, role: "customer" },
        process.env.JWT_SECRET,
        { expiresIn: "7d" }
      );
  
      return successResponse(res, {token,
        customer}, "Fetch Data successful");
  
    } catch (err) {
      return errorResponse(res, "Fetch data failed", err.message);
    }
  };

// CUSTOMER LEADS API

exports.getMyLeads = async (req, res) => {
    try {
      const customer_id = req.user.id;
  
      const leads = await Lead.findAll({
        where: { customer_id },
        order: [["id", "DESC"]]
      });
  
      
      return successResponse(res, {leads }, "Fetch Data successful");
  
    } catch (err) {
      return errorResponse(res, "Fetch data failed", err.message);
    }
  };