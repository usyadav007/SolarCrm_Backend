const express = require("express");
const router = express.Router();

const followupController = require("../controllers/followupController");
const authMiddleware = require("../middleware/authMiddleware");

// ✅ APPLY MIDDLEWARE
router.post("/", authMiddleware, followupController.create);
router.get("/", authMiddleware, followupController.getAll);
router.get("/today", authMiddleware, followupController.todayFollowups);
router.get("/overdue", authMiddleware, followupController.overdueFollowups);
router.get("/:lead_id", authMiddleware, followupController.getByLead);

module.exports = router;