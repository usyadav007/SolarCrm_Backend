const { Attendance, Salary } = require("../models");
const { Op } = require("sequelize");
const { Staff } = require("../models");
const { successResponse, errorResponse } = require("../utils/responseHandler");

exports.generateSalary = async (req, res) => {
    try {
      const { staff_id, month, year, salary_per_day } = req.body;
  
      // 🔥 DUPLICATE CHECK
      const existing = await Salary.findOne({
        where: { staff_id, month, year }
      });
  
      if (existing) {
        return errorResponse(res, {existing}, "Salary already generated for this month", null, 400);
      }
  
      const startDate = new Date(year, month - 1, 1);
      const endDate = new Date(year, month, 0);
  
      const records = await Attendance.findAll({
        where: {
          staff_id,
          date: {
            [Op.between]: [startDate, endDate]
          }
        }
      });
  
      let presentDays = 0;
  
      records.forEach((r) => {
        const hours = r.working_hours || 0;
  
        if (hours >= 8) {
          presentDays += 1;
        } else if (hours >= 4) {
          presentDays += 0.5;
        } else if (hours > 0) {
          presentDays += 0.5;
        }
      });
  
      const totalDays = endDate.getDate();
      const totalSalary = presentDays * salary_per_day;
  
      const data = await Salary.create({
        staff_id,
        month,
        year,
        total_days: totalDays,
        present_days: presentDays,
        salary_per_day,
        total_salary: totalSalary,
        created_at: new Date()
      });
  
      return successResponse(res, { present_days: presentDays,
        total_salary: totalSalary,
        data}, "Create successful");
     
  
    } catch (err) {
      return errorResponse(res, "Create failed", err.message);
    }
  };

// GET SALARY



exports.getAll = async (req, res) => {
    try {
      const {
        staff_id,
        month,
        year,
        min_salary,
        max_salary,
        page = 1,
        limit = 10
      } = req.query;
  
      let where = {};
  
      if (staff_id) where.staff_id = staff_id;
      if (month) where.month = month;
      if (year) where.year = year;
  
      if (min_salary || max_salary) {
        where.total_salary = {};
        if (min_salary) where.total_salary[Op.gte] = min_salary;
        if (max_salary) where.total_salary[Op.lte] = max_salary;
      }
  
      const offset = (page - 1) * limit;
  
      const { count, rows } = await Salary.findAndCountAll({
        where,
        include: [
          {
            model: Staff,
            attributes: ["id", "name", "email"]
          }
        ],
        limit: parseInt(limit),
        offset: parseInt(offset),
        order: [["id", "DESC"]]
      });
      return successResponse(res, {total: count,
        page: parseInt(page),
        total_pages: Math.ceil(count / limit),
        data: rows}, "Fetch Data successful");
     
  
    } catch (err) {
      return errorResponse(res, "Fetch data failed", err.message);
    }
  };

  // Regenerate Salary

  exports.regenerateSalary = async (req, res) => {
    try {
      const { staff_id, month, year, salary_per_day } = req.body;
  
      // 🔥 Delete old salary
      await Salary.destroy({
        where: { staff_id, month, year }
      });
  
      // 🔥 Generate new salary (same logic reuse)
      const startDate = new Date(year, month - 1, 1);
      const endDate = new Date(year, month, 0);
  
      const records = await Attendance.findAll({
        where: {
          staff_id,
          date: {
            [Op.between]: [startDate, endDate]
          }
        }
      });
  
      let presentDays = 0;
  
      records.forEach((r) => {
        const hours = r.working_hours || 0;
  
        if (hours >= 8) presentDays += 1;
        else if (hours >= 4) presentDays += 0.5;
        else if (hours > 0) presentDays += 0.5;
      });
  
      const totalDays = endDate.getDate();
      const totalSalary = presentDays * salary_per_day;
  
      const data = await Salary.create({
        staff_id,
        month,
        year,
        total_days: totalDays,
        present_days: presentDays,
        salary_per_day,
        total_salary: totalSalary,
        created_at: new Date()
      });
      return successResponse(res, {present_days: presentDays,
        total_salary: totalSalary,
        data }, "Generate Salary successful");
     
  
    } catch (err) {
      return errorResponse(res, "Create failed", err.message);
    }
  };

  
