const express = require("express");
const router = express.Router();

const controller = require("../controllers/salaryController");
const auth = require("../middleware/authMiddleware");
router.post("/regenerate", auth, controller.regenerateSalary);
router.post("/generate", auth, controller.generateSalary);
router.get("/", auth, controller.getAll);

module.exports = router;