const express = require("express");

const router = express.Router();

const purchaseController =
require("../controllers/purchaseController");

const auth =
require("../middleware/authMiddleware");



// ==========================================
// PURCHASE CRUD
// ==========================================

router.get("/summary", purchaseController.getPurchaseSummary);

router.get("/:id/invoice", purchaseController.printPurchaseInvoice);

router.get("/:id", purchaseController.getPurchaseById);

router.post("/", purchaseController.createPurchase);

router.put("/:id", purchaseController.updatePurchase);

router.delete("/:id", purchaseController.deletePurchase);

module.exports = router;