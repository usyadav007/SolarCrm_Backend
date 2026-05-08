const express = require("express");
const router = express.Router();

const dashboardController = require("../controllers/dashboardController");
const authMiddleware = require("../middleware/authMiddleware");

router.get("/", authMiddleware, dashboardController.getDashboard);
router.get("/staff-performance", authMiddleware, dashboardController.staffPerformance);

module.exports = router;