const express = require("express");
const router = express.Router();

const controller = require("../controllers/customerController");
const auth = require("../middleware/customerAuthMiddleware");

router.post("/login", controller.login);

router.get("/dashboard", auth, controller.dashboard);
router.get("/documents", auth, controller.getDocuments);

router.post("/send-otp", controller.sendOtp);
router.post("/verify-otp", controller.verifyOtp);

router.get("/leads", auth, controller.getMyLeads);

module.exports = router;