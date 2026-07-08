const express = require("express");

const router = express.Router();

const purchaseController =
require("../controllers/purchaseController");

const auth =
require("../middleware/authMiddleware");



// ==========================================
// PURCHASE CRUD
// ==========================================

// Create Purchase
router.post(
  "/",
  auth,
  purchaseController.createPurchase
);

// Get All Purchases
router.get(
  "/",
  auth,
  purchaseController.getPurchases
);

// Get Purchase Details
router.get(
  "/:id",
  auth,
  purchaseController.getPurchaseById
);

// Update Purchase
router.put(
  "/:id",
  auth,
  purchaseController.updatePurchase
);

// Delete Purchase
router.delete(
  "/:id",
  auth,
  purchaseController.deletePurchase
);

module.exports = router;