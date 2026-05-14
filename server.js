require("dotenv").config();

const cors = require("cors");

const app = require("./src/app");
const sequelize = require("./src/config/db");

const {
  startReminderJob,
} = require("./src/services/reminderService");

const {
  startAttendanceJob,
} = require("./src/services/attendanceService");


// ✅ CORS Setup
app.use(
  cors({
    origin: [
      "http://localhost:5173",
    ],
    credentials: true,
  })
);

const startServer = async () => {
  try {

    await sequelize.authenticate();
    console.log("DB Connected ✅");

    await sequelize.sync();
    console.log("DB Synced ✅");

    startReminderJob();

    startAttendanceJob();

    app.listen(8000, () => {
      console.log(
        "Server running on 8000 🚀"
      );
    });

  } catch (error) {

    console.error(error);
  }
};

startServer();