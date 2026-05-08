const cron = require("node-cron");
const { Attendance, Staff } = require("../models");

exports.startAttendanceJob = () => {
  console.log("🕒 Attendance Job Started...");

  // Daily at 11:59 PM
  cron.schedule("59 23 * * *", async () => {
    console.log("📊 Running Attendance Auto Mark...");

    const today = new Date().toISOString().split("T")[0];

    try {
      const staffList = await Staff.findAll();

      for (let staff of staffList) {
        const record = await Attendance.findOne({
          where: { staff_id: staff.id, date: today }
        });

        // ❌ No check-in → absent
        if (!record) {
          await Attendance.create({
            staff_id: staff.id,
            date: today,
            status: "absent",
            created_at: new Date()
          });
        }
      }

      console.log("✅ Attendance auto-mark complete");

    } catch (err) {
      console.error("Attendance Error:", err);
    }
  });
};