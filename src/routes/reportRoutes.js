const express = require("express");
const router = express.Router();

const controller = require("../controllers/reportController");
const auth = require("../middleware/authMiddleware");

router.get("/dashboard", auth, controller.dashboardReport);
router.get("/staff", auth, controller.staffPerformance);
router.get("/inventory", auth, controller.inventoryReport);
router.get("/revenue", auth, controller.monthlyRevenue);
router.get("/staff-performance", auth, controller.staffPerformance);

router.get("/lead-excel", auth, controller.leadReport);
router.get("/attendance-excel", auth, controller.attendanceReport);
router.get("/salary-excel", auth, controller.salaryReport);
router.get("/installation-excel", auth, controller.installationReport);
router.get("/service-excel", auth, controller.serviceReport);

module.exports = router;