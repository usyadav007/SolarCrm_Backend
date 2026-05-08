const express = require("express");
const router = express.Router();

const controller = require("../controllers/documentController");
const auth = require("../middleware/authMiddleware");
const upload = require("../utils/upload");

// Upload
router.post("/upload", auth, upload.single("file"), controller.upload);

// Get
router.get("/", auth, controller.getAll);

// Delete
router.delete("/:id", auth, controller.delete);

module.exports = router;