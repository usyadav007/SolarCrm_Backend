require("dotenv").config();

const app = require("./src/app");
const sequelize = require("./src/config/db");
const { startReminderJob } = require("./src/services/reminderService");

const { startAttendanceJob } = require("./src/services/attendanceService");

const startServer = async () => {
  try {
    await sequelize.authenticate();
    console.log("DB Connected ✅");

    await sequelize.sync();
    console.log("DB Synced ✅");

    await sequelize.sync();

    startReminderJob(); // 🔥 ADD THIS

    startAttendanceJob();

    app.listen(8000, () => {
      console.log("Server running on 8000 🚀");
    });
  } catch (error) {
    console.error(error);
  }
};

startServer();