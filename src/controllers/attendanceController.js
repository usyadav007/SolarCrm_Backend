const { Attendance } = require("../models");
const { Staff } = require("../models");
const { successResponse, errorResponse } = require("../utils/responseHandler");

exports.checkIn = async (req, res) => {
  try {
    const staff_id = req.user.id;
    const today = new Date().toISOString().split("T")[0];

    // Check already exists
    const existing = await Attendance.findOne({
      where: { staff_id, date: today }
    });

    if (existing) {
      return res.json({ message: "Already checked in" });
    }

    const data = await Attendance.create({
      staff_id,
      date: today,
      check_in: new Date(),
      status: "present",
      created_at: new Date()
    });
    return successResponse(res, {data }, "Check-in successful");
    

  } catch (err) {
    return errorResponse(res, "Check-in   failed", err.message);
  }
};


// Check-Out 

exports.checkOut = async (req, res) => {
    try {
      const staff_id = req.user.id;
      const today = new Date().toISOString().split("T")[0];
  
      const record = await Attendance.findOne({
        where: { staff_id, date: today }
      });
  
      if (!record) {
       
        return errorResponse(res, "Check-in not found", null, 404);

      }
  
      const checkOutTime = new Date();
      const checkInTime = new Date(record.check_in);
  
      // ⏱ Calculate hours
      const diffMs = checkOutTime - checkInTime;
      const hours = diffMs / (1000 * 60 * 60);
  
      const workingHours = parseFloat(hours.toFixed(2));
  
      let status = "present";
  
      if (workingHours < 4) {
        status = "half-day";
      }
  
      await Attendance.update(
        {
          check_out: checkOutTime,
          status,
          working_hours: workingHours
        },
        { where: { id: record.id } }
      );
      return successResponse(res, {working_hours: workingHours,
        status }, "Check-out successful");
  
    } catch (err) {
      return errorResponse(res, "Check-out failed", err.message);
    }
  };



  // GET ATTENDANCE (FILTER)

  const { Op } = require("sequelize");

exports.getAttendance = async (req, res) => {
  try {
    const { staff_id, from_date, to_date } = req.query;

    let where = {};

    if (staff_id) where.staff_id = staff_id;

    if (from_date && to_date) {
      where.date = {
        [Op.between]: [from_date, to_date]
      };
    }

    const data = await Attendance.findAll({
      where,
      include: [
        
        { model: Staff, attributes: ["id", "email","name"] }
      ],
      order: [["date", "DESC"]]
    });
    return successResponse(res, {data }, "Fetch Data successful");

  } catch (err) {
    return errorResponse(res, "Fetch data failed", err.message);
  }
};

// UPDATE STATUS (Admin use)

exports.updateStatus = async (req, res) => {
    await Attendance.update(
      { status: req.body.status },
      { where: { id: req.params.id } }
    );
    return successResponse(res,  "Status update successful");
    
  };

  