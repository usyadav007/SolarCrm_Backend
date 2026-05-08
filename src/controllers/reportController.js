const { Lead, FollowUp, Staff, Invoice, Installation, Service, Salary, Inventory } = require("../models");
const { Attendance } = require("../models");
const { Op, Sequelize } = require("sequelize");
const { generateExcel } = require("../utils/excelGenerator");
const { successResponse, errorResponse } = require("../utils/responseHandler");

exports.dashboardReport = async (req, res) => {
  try {
    const today = new Date();

    // Leads
    const totalLeads = await Lead.count();
    const convertedLeads = await Lead.count({ where: { status: "converted" } });

    // Followups
    const todayFollowups = await FollowUp.count({
      where: {
        next_followup: {
          [Op.lt]: new Date(today.setHours(23, 59, 59))
        }
      }
    });

    // Revenue
    const totalRevenue = await Invoice.sum("total_amount") || 0;
    const paidRevenue = await Invoice.sum("paid_amount") || 0;

    // Installations
    const completedInstallations = await Installation.count({
      where: { status: "completed" }
    });

    // Services
    const pendingServices = await Service.count({
      where: { status: "pending" }
    });

    // Salary
    const totalSalary = await Salary.sum("total_salary") || 0;

    return successResponse(res, {totalLeads,
      convertedLeads,
      todayFollowups,
      totalRevenue,
      paidRevenue,
      completedInstallations,
      pendingServices,
      totalSalary }, "Fetch Data successful");

  } catch (err) {
    return errorResponse(res, "Fetch data failed", err.message);
  }
};

// STAFF PERFORMANCE REPORT

exports.staffPerformance = async (req, res) => {
    try {
      const data = await FollowUp.findAll({
        attributes: [
          "user_id",
          [Sequelize.fn("COUNT", "*"), "total_followups"]
        ],
        group: ["user_id"]
      });
      return successResponse(res, {data }, "Fetch Data successful");
  
    } catch (err) {
      return errorResponse(res, "Fetch data failed", err.message);
    }
  };

  // INVENTORY REPORT
  exports.inventoryReport = async (req, res) => {
    try {
      const data = await Inventory.findAll({
        attributes: [
          "product_id",
          [Sequelize.fn("SUM", Sequelize.literal(`
            CASE 
              WHEN type='in' THEN quantity 
              ELSE -quantity 
            END
          `)), "stock"]
        ],
        group: ["product_id"]
      });
  
      return successResponse(res, {data }, "Fetch Data successful");
  
    } catch (err) {
      return errorResponse(res, "Fetch data failed", err.message);
    }
  };

  // MONTHLY REVENUE

  exports.monthlyRevenue = async (req, res) => {
    try {
      const data = await Invoice.findAll({
        attributes: [
          [Sequelize.fn("MONTH", Sequelize.col("created_at")), "month"],
          [Sequelize.fn("SUM", Sequelize.col("total_amount")), "revenue"]
        ],
        group: ["month"]
      });
  
      return successResponse(res, {data }, "Fetch Data successful");
  
    } catch (err) {
      return errorResponse(res, "Fetch data failed", err.message);
    }
  };

  // Staff Performance

  exports.staffPerformance = async (req, res) => {
    try {
      const today = new Date();
  
      const staffList = await Staff.findAll({
        attributes: ["id", "name", "role"]
      });
  
      const result = [];
  
      for (let staff of staffList) {
        const staff_id = staff.id;
  
        // 📌 Total Leads Assigned
        const totalLeads = await Lead.count({
          where: { assigned_to: staff_id }
        });
  
        // 📌 Converted Leads
        const convertedLeads = await Lead.count({
          where: {
            assigned_to: staff_id,
            status: "converted"
          }
        });
  
        // 📌 Total Followups
        const totalFollowups = await FollowUp.count({
          where: { user_id: staff_id }
        });
  
        // 📌 Pending Followups (future)
        const pendingFollowups = await FollowUp.count({
          where: {
            user_id: staff_id,
            next_followup: {
              [Op.gte]: today
            }
          }
        });
  
        // 📌 Overdue Followups
        const overdueFollowups = await FollowUp.count({
          where: {
            user_id: staff_id,
            next_followup: {
              [Op.lt]: today
            }
          }
        });

        // Conversion Rate
        const conversionRate =
         totalLeads > 0 ? ((convertedLeads / totalLeads) * 100).toFixed(2) : 0;
  
        result.push({
          staff_id,
          name: staff.name,
          role: staff.role,
          totalLeads,
          convertedLeads,
          totalFollowups,
          pendingFollowups,
          overdueFollowups,
          conversionRate
        });
      }
  
      return successResponse(res, {result }, "Fetch Data successful");
  
    } catch (err) {
      return errorResponse(res, "Fetch data failed", err.message);
    }
  };

  // Lead report


  exports.leadReport = async (req, res) => {
    try {
      const { status, city, from_date, to_date } = req.query;
  
      let where = {};
  
      // ✅ Status filter
      if (status) {
        where.status = status;
      }
  
      // ✅ City filter
      if (city) {
        where.city = {
          [Op.like]: `%${city}%`
        };
      }
  
      // ✅ Date filter
      if (from_date && to_date) {
        where.createdAt = {
          [Op.between]: [new Date(from_date), new Date(to_date)]
        };
      }
  
      const data = await Lead.findAll({
        where,
        order: [["id", "DESC"]]
      });
  
      const rows = data.map((l) => ({
        id: l.id,
        name: l.customer_name,
        phone: l.phone,
        city: l.city,
        status: l.status
      }));
  
      const columns = [
        { header: "ID", key: "id" },
        { header: "Name", key: "name" },
        { header: "Phone", key: "phone" },
        { header: "City", key: "city" },
        { header: "Status", key: "status" }
      ];
  
      await generateExcel(columns, rows, res, "Lead_Report");
  
    } catch (err) {
      console.error("Lead Report Error:", err);
      res.status(500).json(err);
    }
  };

// ATTENDANCE REPORT

exports.attendanceReport = async (req, res) => {
  const { from_date, to_date } = req.query;

  let where = {};

  if (from_date && to_date) {
    where.date = {
      [Op.between]: [from_date, to_date]
    };
  }

  const data = await Attendance.findAll({ where });

  const rows = data.map((a) => ({
    staff_id: a.staff_id,
    date: a.date,
    check_in: a.check_in,
    check_out: a.check_out,
    hours: a.working_hours,
    status: a.status
  }));

  const columns = [
    { header: "Staff", key: "staff_id" },
    { header: "Date", key: "date" },
    { header: "Check In", key: "check_in" },
    { header: "Check Out", key: "check_out" },
    { header: "Hours", key: "hours" },
    { header: "Status", key: "status" }
  ];

  await generateExcel(columns, rows, res, "Attendance_Report");
};

// SALARY REPORT

exports.salaryReport = async (req, res) => {
  const { from_date, to_date } = req.query;

  let where = {};

  if (from_date && to_date) {
    where.created_at = {
      [Op.between]: [new Date(from_date), new Date(to_date)]
    };
  }

  const data = await Salary.findAll({ where });

  const rows = data.map((s) => ({
    staff_id: s.staff_id,
    month: s.month,
    year: s.year,
    present_days: s.present_days,
    salary: s.total_salary
  }));

  const columns = [
    { header: "Staff", key: "staff_id" },
    { header: "Month", key: "month" },
    { header: "Year", key: "year" },
    { header: "Present Days", key: "present_days" },
    { header: "Salary", key: "salary" }
  ];

  await generateExcel(columns, rows, res, "Salary_Report");
};

// INSTALLATION REPORT

exports.installationReport = async (req, res) => {
  const { from_date, to_date } = req.query;

  let where = {};

  if (from_date && to_date) {
    where.install_date = {
      [Op.between]: [new Date(from_date), new Date(to_date)]
    };
  }

  const data = await Installation.findAll({ where });

  const rows = data.map((i) => ({
    lead_id: i.lead_id,
    date: i.install_date,
    technician: i.technician_id,
    status: i.status
  }));

  const columns = [
    { header: "Lead", key: "lead_id" },
    { header: "Install Date", key: "date" },
    { header: "Technician", key: "technician" },
    { header: "Status", key: "status" }
  ];

  await generateExcel(columns, rows, res, "Installation_Report");
};

//  SERVICE REPORT

exports.serviceReport = async (req, res) => {
  const { from_date, to_date } = req.query;

  let where = {};

  if (from_date && to_date) {
    where.service_date = {
      [Op.between]: [new Date(from_date), new Date(to_date)]
    };
  }

  const data = await Service.findAll({ where });

  const rows = data.map((s) => ({
    lead_id: s.lead_id,
    issue: s.issue,
    date: s.service_date,
    status: s.status
  }));

  const columns = [
    { header: "Lead", key: "lead_id" },
    { header: "Issue", key: "issue" },
    { header: "Date", key: "date" },
    { header: "Status", key: "status" }
  ];

  await generateExcel(columns, rows, res, "Service_Report");
};