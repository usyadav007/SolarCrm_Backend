const express = require("express");

const router = express.Router();

const inventoryTransactionController =
require("../controllers/inventoryTransactionController");

router.get(
  "/",
  inventoryTransactionController.getAllTransactions
);

router.get(
  "/:id",
  inventoryTransactionController.getTransactionById
);

router.get(
  "/product/:productId",
  inventoryTransactionController.getProductTransactions
);

router.post(
  "/",
  inventoryTransactionController.createTransaction
);

router.delete(
  "/:id",
  inventoryTransactionController.deleteTransaction
);

module.exports = router;