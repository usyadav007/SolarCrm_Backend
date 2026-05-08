const router = require("express").Router();
const leadController = require("../controllers/leadController");
const auth = require("../middleware/authMiddleware");
const leadHistoryController = require("../controllers/leadHistoryController");
const customerAuth = require("../middleware/customerAuthMiddleware");

router.post("/", auth, leadController.create);
router.get("/", auth, leadController.getAll);
router.get("/:id", auth, leadController.getOne);
router.put("/:id", auth, leadController.update);
router.put("/:id/assign", auth, leadController.assignLead);
router.delete("/:id", auth, leadController.delete);

// GET Lead History by Lead ID
router.get("/:id/history", leadHistoryController.getLeadHistory);
router.post("/customer-create", customerAuth, leadController.createCustomerLead);

module.exports = router;