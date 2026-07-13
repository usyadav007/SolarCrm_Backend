const express = require("express");

const router = express.Router();

const purchaseController = require("../controllers/purchaseController");

// Summary
router.get("/summary", purchaseController.getPurchaseSummary);

// Invoice
router.get("/:id/invoice", purchaseController.printPurchaseInvoice);

// List
router.get("/", purchaseController.getPurchases);

// Detail
router.get("/:id", purchaseController.getPurchaseById);

// Create
router.post("/", purchaseController.createPurchase);

// Update
router.put("/:id", purchaseController.updatePurchase);

// Delete
router.delete("/:id", purchaseController.deletePurchase);

module.exports = router;