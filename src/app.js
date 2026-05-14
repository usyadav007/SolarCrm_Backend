const express = require("express");
const cors = require("cors");

const authRoutes = require("./routes/authRoutes");
const leadRoutes = require("./routes/leadRoutes");
const followupRoutes = require("./routes/followupRoutes");

const app = express();


// ✅ CORS Configuration
app.use(
  cors({
    origin: [
      "http://localhost:5173",
    ],
    methods: [
      "GET",
      "POST",
      "PUT",
      "DELETE",
      "PATCH",
      "OPTIONS",
    ],
    allowedHeaders: [
      "Content-Type",
      "Authorization",
    ],
    credentials: true,
  })
);

// ✅ Handle Preflight Requests
app.options("*", cors());


// ✅ Body Parser
app.use(express.json());


// ✅ Routes
app.use("/api/auth", authRoutes);

app.use("/api/leads", leadRoutes);

app.use("/api/followups", followupRoutes);

app.use(
  "/api/dashboard",
  require("./routes/dashboardRoutes")
);

app.use(
  "/api/surveys",
  require("./routes/surveyRoutes")
);

app.use(
  "/api/quotations",
  require("./routes/quotationRoutes")
);

app.use(
  "/api/installations",
  require("./routes/installationRoutes")
);

app.use(
  "/api/services",
  require("./routes/serviceRoutes")
);

app.use(
  "/api/billing",
  require("./routes/billingRoutes")
);

app.use(
  "/api/attendance",
  require("./routes/attendanceRoutes")
);

app.use(
  "/api/salary",
  require("./routes/salaryRoutes")
);

app.use(
  "/api/documents",
  require("./routes/documentRoutes")
);

app.use(
  "/uploads",
  express.static("uploads")
);

app.use(
  "/api/inventory",
  require("./routes/inventoryRoutes")
);

app.use(
  "/api/reports",
  require("./routes/reportRoutes")
);

app.use(
  "/api/customer",
  require("./routes/customerRoutes")
);

module.exports = app;