const express = require("express");

const router = express.Router();

const controller =
  require("../controllers/billingController");

router.post(
  "/invoice",
  controller.createInvoice
);

router.get(
  "/invoice",
  controller.getInvoices
);

router.get(
  "/invoice/:id",
  controller.getOne
);

router.put(
  "/invoice/:id",
  controller.update
);

router.delete(
  "/invoice/:id",
  controller.delete
);

// Payment Routes

router.post(
  "/payment",
  controller.addPayment
);

router.get(
  "/payment/:invoice_id",
  controller.getPayments
);

router.delete(
  "/payment/:id",
  controller.deletePayment
);

module.exports = router;