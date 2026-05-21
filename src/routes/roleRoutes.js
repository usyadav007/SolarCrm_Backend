const express = require("express");

const router = express.Router();

const controller = require("../controllers/roleController");

const auth = require("../middleware/authMiddleware");

router.post("/", auth, controller.createRole);

router.get("/", auth, controller.getRoles);

router.put("/:id", auth, controller.updateRole);

router.delete("/:id", auth, controller.deleteRole);

module.exports = router;