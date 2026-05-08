const express = require("express");
const router = express.Router();

const controller = require("../controllers/quotationController");
const auth = require("../middleware/authMiddleware");

router.post("/", auth, controller.create);
router.get("/", auth, controller.getAll);
router.get("/:id", auth, controller.getOne);
router.put("/:id", auth, controller.update);
router.patch("/:id/status", auth, controller.updateStatus);
router.delete("/:id", auth, controller.delete);

module.exports = router;