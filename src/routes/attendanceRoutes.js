const express = require("express");
const router = express.Router();

const controller = require("../controllers/attendanceController");
const auth = require("../middleware/authMiddleware");

// Check-in / Check-out
router.post("/check-in", auth, controller.checkIn);
router.post("/check-out", auth, controller.checkOut);

// Get
router.get("/", auth, controller.getAttendance);

// Admin update
router.patch("/:id", auth, controller.updateStatus);

module.exports = router;