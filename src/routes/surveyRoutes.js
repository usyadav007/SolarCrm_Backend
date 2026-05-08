const express = require("express");
const router = express.Router();

const surveyController = require("../controllers/surveyController");
const auth = require("../middleware/authMiddleware");

router.post("/", auth, surveyController.create);
//router.put("/:id", auth, surveyController.updateStatus);


// UPDATE
router.put("/:id", auth, surveyController.update);
// GET ALL (filters)
router.get("/", auth, surveyController.getAll);

// GET ONE
router.get("/:id", auth, surveyController.getOne);
// DELETE
router.delete("/:id", auth, surveyController.delete);


module.exports = router;